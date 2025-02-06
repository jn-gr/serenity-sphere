from django.contrib.auth import login, logout, authenticate, update_session_auth_hash
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, UserUpdateSerializer, JournalEntrySerializer
from .models import JournalEntry
from django.middleware.csrf import get_token
from django.http import JsonResponse
from .ai_services import predict_emotions
import logging
from django.contrib.auth.hashers import check_password


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
        serializer.save(user=self.request.user, emotions=emotions)

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