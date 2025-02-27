from django.contrib.auth import login, logout, authenticate, update_session_auth_hash
from rest_framework import status, viewsets, permissions, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, UserUpdateSerializer, JournalEntrySerializer, MoodLogSerializer, MoodAnalyticsSerializer
from .models import JournalEntry, MoodLog
from django.middleware.csrf import get_token
from django.http import JsonResponse
from .ai_services import predict_emotions
import logging
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from rest_framework.views import APIView
from datetime import datetime, timedelta
from django.db.models import Count, Avg


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

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JournalEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        content = serializer.validated_data.get('content', '')
        emotions = predict_emotions(content)
        
        # Check if an entry already exists for today
        today = timezone.now().date()
        try:
            # If entry exists, update it
            existing_entry = JournalEntry.objects.get(user=self.request.user, date__date=today)
            existing_entry.content = content
            existing_entry.emotions = emotions
            existing_entry.save()
            
            # Update associated mood log if it exists
            self._update_mood_from_emotions(existing_entry, emotions)
            
            return existing_entry
        except JournalEntry.DoesNotExist:
            # If no entry exists, create a new one
            journal_entry = serializer.save(user=self.request.user, emotions=emotions)
            
            # Create associated mood log
            self._update_mood_from_emotions(journal_entry, emotions)
            
            return journal_entry
    
    def _update_mood_from_emotions(self, journal_entry, emotions):
        if not emotions or len(emotions) == 0:
            return
        
        # Map emotion to mood
        emotion_to_mood = {
            'joy': 'happy',
            'happiness': 'happy',
            'sadness': 'sad',
            'anger': 'angry',
            'fear': 'anxious',
            'anxiety': 'anxious',
            'surprise': 'surprised',
            'disgust': 'disgusted',
            'neutral': 'neutral',
            'excitement': 'excited',
            'love': 'loving',
            'optimism': 'optimistic',
            'caring': 'caring',
            'pride': 'proud',
            'gratitude': 'grateful',
            'relief': 'relieved',
            'curiosity': 'curious',
            'confusion': 'confused',
            'nervousness': 'nervous',
            'remorse': 'remorseful',
            'embarrassment': 'embarrassed',
            'disappointment': 'disappointed',
            'grief': 'grieving',
            'annoyance': 'annoyed',
            'disapproval': 'disapproving',
            'amusement': 'amused',
            'calmness': 'calm'
        }
        
        # Sort emotions by confidence score
        sorted_emotions = sorted(emotions, key=lambda x: x[1], reverse=True)
        
        # Get the top emotion and map it to a mood
        top_emotion = sorted_emotions[0][0].lower()
        mood = 'neutral'  # Default
        
        for emotion, mood_value in emotion_to_mood.items():
            if emotion in top_emotion:
                mood = mood_value
                break
        
        # Calculate intensity based on confidence score (scale 1-10)
        intensity = min(int(sorted_emotions[0][1] * 10), 10)
        
        # Try to update existing mood log or create a new one
        try:
            mood_log = MoodLog.objects.get(
                user=self.request.user,
                date=journal_entry.date.date(),
                mood=mood
            )
            mood_log.intensity = intensity
            mood_log.journal_entry = journal_entry
            mood_log.save()
        except MoodLog.DoesNotExist:
            MoodLog.objects.create(
                user=self.request.user,
                date=journal_entry.date.date(),
                mood=mood,
                intensity=intensity,
                journal_entry=journal_entry
            )

    def perform_update(self, serializer):
        content = serializer.validated_data.get('content', None)
        if content is not None:
            emotions = predict_emotions(content)
            serializer.save(emotions=emotions)
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
    # Get mood logs for the last 30 days
    thirty_days_ago = timezone.now().date() - timezone.timedelta(days=30)
    mood_logs = MoodLog.objects.filter(
        user=request.user,
        date__gte=thirty_days_ago
    ).order_by('date')
    
    serializer = MoodLogSerializer(mood_logs, many=True)
    return Response(serializer.data)

class MoodAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        period = request.query_params.get('period', 'week')
        serializer = MoodAnalyticsSerializer(data={'period': period})
        serializer.is_valid(raise_exception=True)
        
        analytics = serializer.get_analytics(request.user)
        return Response(analytics)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mood_summary(request):
    # Get mood logs for the last 30 days
    end_date = timezone.now().date()
    start_date = end_date - timedelta(days=30)
    
    mood_logs = MoodLog.objects.filter(
        user=request.user,
        date__gte=start_date,
        date__lte=end_date
    )
    
    # Get most common mood
    mood_counts = mood_logs.values('mood').annotate(count=Count('mood')).order_by('-count')
    most_common_mood = mood_counts.first()['mood'] if mood_counts.exists() else None
    
    # Get average intensity
    avg_intensity = mood_logs.aggregate(avg=Avg('intensity'))['avg']
    
    # Count positive vs negative moods
    positive_moods = ['happy', 'calm', 'excited', 'amused', 'loving', 'optimistic', 'caring', 'proud', 'grateful', 'relieved']
    negative_moods = ['sad', 'anxious', 'angry', 'nervous', 'remorseful', 'embarrassed', 'disappointed', 'grieving', 'disgusted', 'annoyed', 'disapproving']
    
    positive_count = mood_logs.filter(mood__in=positive_moods).count()
    negative_count = mood_logs.filter(mood__in=negative_moods).count()
    neutral_count = mood_logs.exclude(mood__in=positive_moods + negative_moods).count()
    
    total = positive_count + negative_count + neutral_count
    
    # Calculate percentages
    positive_percent = (positive_count / total) * 100 if total > 0 else 0
    negative_percent = (negative_count / total) * 100 if total > 0 else 0
    neutral_percent = (neutral_count / total) * 100 if total > 0 else 0
    
    return Response({
        'most_common_mood': most_common_mood,
        'avg_intensity': avg_intensity,
        'positive_percent': positive_percent,
        'negative_percent': negative_percent,
        'neutral_percent': neutral_percent,
        'total_logs': total
    })