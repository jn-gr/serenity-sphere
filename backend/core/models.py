from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.db.models import UniqueConstraint
from django.db.models.functions import TruncDate
from datetime import datetime
from django.conf import settings

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, password, **extra_fields)

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    pass

class JournalEntry(models.Model):
    user = models.ForeignKey(CustomUser, related_name='journal_entries', on_delete=models.CASCADE)
    date = models.DateTimeField(default=timezone.now)
    content = models.TextField()
    emotions = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date']
        indexes = [
            models.Index(fields=['user', 'date']),
        ]

    def __str__(self):
        return f"Journal Entry by {self.user.email} on {self.date}"

class MoodLog(models.Model):
    MOOD_CHOICES = [
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('anxious', 'Anxious'),
        ('calm', 'Calm'),
        ('angry', 'Angry'),
        ('excited', 'Excited'),
        ('neutral', 'Neutral'),
        ('amused', 'Amused'),
        ('loving', 'Loving'),
        ('optimistic', 'Optimistic'),
        ('caring', 'Caring'),
        ('proud', 'Proud'),
        ('grateful', 'Grateful'),
        ('relieved', 'Relieved'),
        ('surprised', 'Surprised'),
        ('curious', 'Curious'),
        ('confused', 'Confused'),
        ('nervous', 'Nervous'),
        ('remorseful', 'Remorseful'),
        ('embarrassed', 'Embarrassed'),
        ('disappointed', 'Disappointed'),
        ('grieving', 'Grieving'),
        ('disgusted', 'Disgusted'),
        ('annoyed', 'Annoyed'),
        ('disapproving', 'Disapproving'),
    ]
    
    user = models.ForeignKey(CustomUser, related_name='mood_logs', on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES, default='neutral')
    intensity = models.IntegerField(default=5, validators=[
        MinValueValidator(1),
        MaxValueValidator(10)
    ])
    notes = models.TextField(blank=True, null=True)
    journal_entry = models.ForeignKey(JournalEntry, related_name='mood_logs', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-date']
        unique_together = ['user', 'date', 'mood']
        
    def __str__(self):
        return f"{self.user.username}'s mood: {self.mood} ({self.date})"

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('mood_shift', 'Mood Shift'),
        ('extended_sadness', 'Extended Sadness'),
        ('inactivity', 'Inactivity'),
    ]
    
    SEVERITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS, default='medium')
    is_read = models.BooleanField(default=False)
    is_dismissed = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.type} - {self.created_at.strftime('%Y-%m-%d')}"


class MoodCause(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mood_causes')
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE, related_name='causes', null=True, blank=True)
    cause_type = models.CharField(max_length=50)  # e.g., 'loss', 'stress', 'conflict'
    notes = models.TextField(blank=True, null=True)  # Optional user notes
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.user.username} - {self.cause_type} - {self.created_at.strftime('%Y-%m-%d')}"


class RecommendationCategory(models.Model):
    name = models.CharField(max_length=100)  # e.g., 'grief', 'stress', 'anger'
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name


class Recommendation(models.Model):
    RECOMMENDATION_TYPES = [
        ('exercise', 'Exercise'),
        ('journaling', 'Journaling'),
        ('meditation', 'Meditation'),
        ('resource', 'Resource'),
        ('strategy', 'Coping Strategy'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    recommendation_type = models.CharField(max_length=50, choices=RECOMMENDATION_TYPES)
    category = models.ForeignKey(RecommendationCategory, on_delete=models.CASCADE, related_name='recommendations')
    link = models.CharField(max_length=255, blank=True, null=True)  # Link to more information
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.title} ({self.category.name})"


class UserRecommendation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recommendations')
    recommendation = models.ForeignKey(Recommendation, on_delete=models.CASCADE)
    mood_cause = models.ForeignKey(MoodCause, on_delete=models.CASCADE, related_name='recommendations', null=True, blank=True)
    is_helpful = models.BooleanField(null=True, blank=True)  # User feedback
    feedback = models.TextField(blank=True, null=True)  # Additional feedback
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.user.username} - {self.recommendation.title}"

class JournalReminder(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='journal_reminders')
    sent_at = models.DateTimeField(auto_now_add=True)
    reminder_type = models.CharField(max_length=20, choices=[
        ('streak', 'Streak Reminder'),
        ('regular', 'Regular Reminder')
    ])
    
    class Meta:
        unique_together = ['user', 'sent_at']
        indexes = [
            models.Index(fields=['user', 'sent_at']),
        ]