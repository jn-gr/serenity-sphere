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
        
        # Get mood logs from last 7 days
        one_week_ago = timezone.now() - timedelta(days=7)
        recent_logs = MoodLog.objects.filter(
            user=user,
            date__gte=one_week_ago
        ).order_by('date')
        
        if len(recent_logs) < 3:
            return notifications
        
        # Calculate mood scores with weights
        mood_weights = {
            # Positive emotions
            'happy': 1.0, 'excited': 0.9, 'loving': 0.9, 'optimistic': 0.85,
            'proud': 0.8, 'grateful': 0.8, 'relieved': 0.75, 'amused': 0.7,
            'calm': 0.6, 'caring': 0.6, 'surprised': 0.5, 'curious': 0.5,
            # Neutral
            'neutral': 0.0, 'confused': -0.1,
            # Negative emotions
            'anxious': -0.8, 'nervous': -0.7, 'embarrassed': -0.6,
            'disappointed': -0.7, 'annoyed': -0.6, 'disapproving': -0.65,
            'sad': -0.8, 'angry': -0.9, 'grieving': -0.95, 'disgusted': -0.85,
            'remorseful': -0.75
        }
        
        # Calculate trend metrics
        trend_window = min(5, len(recent_logs))
        recent_scores = [mood_weights[log.mood] * (log.intensity/10) for log in recent_logs[-trend_window:]]
        previous_scores = [mood_weights[log.mood] * (log.intensity/10) for log in recent_logs[-trend_window*2:-trend_window]]
        
        avg_current = sum(recent_scores) / len(recent_scores)
        avg_previous = sum(previous_scores) / len(previous_scores) if previous_scores else 0
        
        # Determine trend type
        trend_type = 'stable'
        if avg_current - avg_previous >= 0.3:
            trend_type = 'positive'
        elif avg_current - avg_previous <= -0.3:
            trend_type = 'negative'
        
        # Generate appropriate notifications
        if trend_type == 'positive':
            if not Notification.objects.filter(
                user=user,
                type='positive_reinforcement',
                created_at__gte=timezone.now() - timedelta(days=1)
            ).exists():
                notifications.append(
                    Notification.objects.create(
                        user=user,
                        type='positive_reinforcement',
                        message=f"Your mood has shown consistent improvement!",
                        severity='low'
                    )
                )
        elif trend_type == 'negative':
            if not Notification.objects.filter(
                user=user,
                type='mood_shift',
                created_at__gte=timezone.now() - timedelta(hours=12)
            ).exists():
                notifications.append(
                    Notification.objects.create(
                        user=user,
                        type='mood_shift',
                        message=f"We noticed a significant mood shift",
                        severity='high'
                    )
                )
        
        return notifications 