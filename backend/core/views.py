from django.contrib.auth import login, logout, authenticate, update_session_auth_hash
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, UserUpdateSerializer, JournalEntrySerializer, MoodLogSerializer
from .models import JournalEntry, MoodLog
from django.middleware.csrf import get_token
from django.http import JsonResponse
from .ai_services import predict_emotions
import logging
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from datetime import datetime, timedelta
from django.shortcuts import get_object_or_404


logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            return Response({'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f'Registration error: {e}')
        return Response({'detail': 'Registration failed. Please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    try:
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                request,
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            if user:
                login(request, user)
                return Response({'user': UserSerializer(user).data})
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f'Login error: {e}')
        return Response({'detail': 'Login failed. Please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    logout(request)
    return Response({'detail': 'Successfully logged out'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    return Response(UserSerializer(request.user).data)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    try:
        if request.method == 'GET':
            serializer = UserSerializer(user)
            return Response(serializer.data)
        elif request.method == 'PUT':
            if 'old_password' in request.data:
                if not check_password(request.data['old_password'], user.password):
                    return Response({'old_password': ['Old password is incorrect.']}, status=status.HTTP_400_BAD_REQUEST)
            serializer = UserUpdateSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                if 'password' in request.data:
                    update_session_auth_hash(request, user)
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f'Profile update error: {e}')
        return Response({'detail': 'Profile update failed. Please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        content = serializer.validated_data.get('content', '')
        emotions = predict_emotions(content)
        date = serializer.validated_data.get('date', timezone.now())
        
        try:
            # Try to get existing entry for the given date
            existing_entry = JournalEntry.objects.get(
                user=self.request.user,
                date__date=date.date()
            )
            # Update existing entry
            existing_entry.content = content
            existing_entry.emotions = emotions
            existing_entry.save()
            
            # Update associated mood log
            self._update_or_create_mood_log(existing_entry, emotions)
            return existing_entry
        except JournalEntry.DoesNotExist:
            # Create new entry if none exists
            journal_entry = serializer.save(user=self.request.user, emotions=emotions)
            # Create associated mood log
            self._update_or_create_mood_log(journal_entry, emotions)
            return journal_entry

    def _update_or_create_mood_log(self, journal_entry, emotions):
        if not emotions:
            return
            
        # Sort emotions by confidence score (descending)
        sorted_emotions = sorted(emotions, key=lambda x: x[1], reverse=True)
        dominant_emotion = sorted_emotions[0][0].lower()
        
        # Map the emotion to a mood
        emotion_to_mood = {
            # Positive emotions
            'amusement': 'amused',
            'excitement': 'excited',
            'joy': 'happy',
            'love': 'loving',
            'desire': 'loving',
            'optimism': 'optimistic',
            'caring': 'caring',
            'pride': 'proud',
            'admiration': 'proud',
            'gratitude': 'grateful',
            'relief': 'relieved',
            'approval': 'happy',
            'realization': 'surprised',
            
            # Neutral emotions
            'surprise': 'surprised',
            'curiosity': 'curious',
            'confusion': 'confused',
            'neutral': 'neutral',
            
            # Negative emotions
            'fear': 'anxious',
            'nervousness': 'nervous',
            'remorse': 'remorseful',
            'embarrassment': 'embarrassed',
            'disappointment': 'disappointed',
            'sadness': 'sad',
            'grief': 'grieving',
            'disgust': 'disgusted',
            'anger': 'angry',
            'annoyance': 'annoyed',
            'disapproval': 'disapproving',
        }
        
        # Default to neutral if emotion not in mapping
        mood = emotion_to_mood.get(dominant_emotion, 'neutral')
        
        # Calculate intensity based on confidence score (scale 1-10)
        intensity = min(int(sorted_emotions[0][1] * 10), 10)
        
        # First, delete any existing mood logs for this journal entry to avoid duplicates
        MoodLog.objects.filter(journal_entry=journal_entry).delete()
        
        # Create new mood log
        MoodLog.objects.create(
            user=self.request.user,
            date=journal_entry.date.date(),
            mood=mood,
            intensity=intensity,
            journal_entry=journal_entry,
            notes=f"Auto-generated from journal entry emotions: {dominant_emotion} ({sorted_emotions[0][1]:.2f})"
        )

    def perform_update(self, serializer):
        content = serializer.validated_data.get('content', None)
        if content is not None:
            emotions = predict_emotions(content)
            journal_entry = serializer.save(emotions=emotions)
            # Update mood log when journal entry is updated
            self._update_or_create_mood_log(journal_entry, emotions)
        else:
            serializer.save()

@api_view(["POST"])
def detect_emotions(request):
    text = request.data.get("text", "")
    predictions = predict_emotions(text)
    return Response({"emotions": predictions})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_journal_entries(request):
    entries = JournalEntry.objects.filter(user=request.user)
    serializer = JournalEntrySerializer(entries, many=True)
    return Response(serializer.data)

class MoodLogViewSet(viewsets.ModelViewSet):
    serializer_class = MoodLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return MoodLog.objects.filter(user=self.request.user)
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_mood_trends(request):
    # Get mood logs for the last 30 days for the logged-in user only
    thirty_days_ago = timezone.now().date() - timezone.timedelta(days=30)
    mood_logs = MoodLog.objects.filter(
        user=request.user,
        date__gte=thirty_days_ago
    ).order_by('date')
    
    serializer = MoodLogSerializer(mood_logs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_mood_notifications(request):
    # Your existing code for finding real notifications
    notifications = []
    
    # Always add a test notification for development
    notifications.append({
        'id': 999,
        'type': 'mood_shift',
        'message': 'We noticed a significant change in your mood recently. Would you like to tell us what might be causing this?',
        'severity': 'high',
        'timestamp': timezone.now().isoformat()
    })
    
    return Response(notifications)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def dismiss_notification(request, notification_id):
    """Mark a notification as dismissed"""
    notification = get_object_or_404(Notification, id=notification_id, user=request.user)
    notification.is_dismissed = True
    notification.save()
    
    return Response({"status": "success"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mood_cause_recommendation(request):
    """Return personalized recommendations based on mood cause"""
    cause = request.data.get('cause')
    notification_type = request.data.get('notificationType')
    
    recommendations = []
    
    # Curated recommendations based on the cause
    if cause == 'loss':
        recommendations = [
            {
                "title": "Grief Journal Prompts",
                "description": "Write about a favorite memory with your loved one, or describe how your grief has changed over time.",
                "link": "/resources/grief-journaling"
            },
            {
                "title": "Breathing Exercise: 4-7-8",
                "description": "Breathe in for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 times.",
                "link": "/exercises/breathing"
            },
            {
                "title": "Grief Support Groups",
                "description": "Connecting with others who understand can help. Consider joining a support group.",
                "link": "/resources/support-groups"
            }
        ]
    elif cause == 'stress':
        recommendations = [
            {
                "title": "5-Minute Mindfulness",
                "description": "Take 5 minutes to focus on your breath and notice physical sensations without judgment.",
                "link": "/exercises/mindfulness"
            },
            {
                "title": "Stress Trigger Tracking",
                "description": "Start noting what triggers your stress to identify patterns you can address.",
                "link": "/tools/stress-tracker"
            },
            {
                "title": "Progressive Muscle Relaxation",
                "description": "Tense and release each muscle group to release physical tension.",
                "link": "/exercises/muscle-relaxation"
            }
        ]
    # Add more cause-specific recommendations here
    
    # Add more mood causes
    elif cause == 'loneliness':
        recommendations = [
            {
                "title": "Social Connection Exercise",
                "description": "Reach out to one person today, even with a simple text message.",
                "link": "/exercises/social-connection"
            },
            # More recommendations...
        ]
    # Other causes...
    
    return Response({"recommendations": recommendations})