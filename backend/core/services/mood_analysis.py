from datetime import timedelta
from django.utils import timezone
from core.models import Notification, MoodLog
from django.conf import settings
from django.contrib.auth import get_user_model
User = get_user_model()

class MoodAnalysisService:
    """Service for analyzing mood data and generating notifications"""
    
    @staticmethod
    def analyze_user_moods(user):
        """Analyze a user's mood data and generate appropriate notifications"""
        notifications = []
        
        # Get recent mood logs
        recent_logs = MoodLog.objects.filter(
            user=user
        ).order_by('-date')[:10]
        
        # Check for drastic mood changes
        if len(recent_logs) >= 2:
            latest_log = recent_logs[0]
            previous_log = recent_logs[1]
            
            # Map moods to numerical values
            mood_scores = {
                # Positive emotions
                'joy': 0.9,
                'excitement': 0.8,
                'love': 0.8,
                'optimism': 0.7,
                'pride': 0.6,
                'gratitude': 0.6,
                'relief': 0.5,
                'admiration': 0.7,
                'amusement': 0.6,
                'approval': 0.5,
                'caring': 0.5,
                
                # Neutral emotions
                'neutral': 0.0,
                'surprise': 0.1,
                'curiosity': 0.2,
                'realization': 0.2,
                'desire': 0.3,
                'confusion': -0.1,
                'nervousness': -0.2,
                
                # Negative emotions
                'anger': -0.8,
                'annoyance': -0.5,
                'disappointment': -0.6,
                'disapproval': -0.5,
                'disgust': -0.7,
                'embarrassment': -0.4,
                'fear': -0.7,
                'grief': -0.9,
                'remorse': -0.6,
                'sadness': -0.8
            }
            
            # Calculate mood shift magnitude
            latest_score = mood_scores.get(latest_log.mood, 0) * (latest_log.intensity / 10)
            previous_score = mood_scores.get(previous_log.mood, 0) * (previous_log.intensity / 10)
            mood_shift = abs(latest_score - previous_score)
            
            # If significant shift (0.5 is a threshold that can be tuned)
            if mood_shift > 0.5:
                # Check if we already have a recent notification for the same shift
                recent_notification = Notification.objects.filter(
                    user=user,
                    type='mood_shift',
                    created_at__gte=timezone.now() - timedelta(hours=24)
                ).first()
                
                if not recent_notification:
                    # Create a notification about the mood shift
                    notification = Notification.objects.create(
                        user=user,
                        type='mood_shift',
                        message=f"We noticed a significant change in your mood from {previous_log.mood} to {latest_log.mood}.",
                        severity='high' if mood_shift > 0.8 else 'medium'
                    )
                    notifications.append(notification)
        
        # Check for extended sadness
        one_week_ago = timezone.now() - timedelta(days=7)
        sad_moods = ['sadness', 'grief', 'disappointment', 'remorse']
        
        sad_count = MoodLog.objects.filter(
            user=user,
            mood__in=sad_moods,
            date__gte=one_week_ago
        ).count()
        
        total_count = MoodLog.objects.filter(
            user=user,
            date__gte=one_week_ago
        ).count()
        
        # If more than 60% of recent moods are sad and at least 3 entries
        if sad_count >= 3 and (total_count > 0 and sad_count / total_count >= 0.6):
            # Check if we already have a recent notification for extended sadness
            recent_notification = Notification.objects.filter(
                user=user,
                type='extended_sadness',
                created_at__gte=timezone.now() - timedelta(days=3)
            ).first()
            
            if not recent_notification:
                # Create a notification about extended sadness
                notification = Notification.objects.create(
                    user=user,
                    type='extended_sadness',
                    message="You've been experiencing sadness for several days. Would you like to explore some coping strategies?",
                    severity='medium'
                )
                notifications.append(notification)
        
        return notifications 