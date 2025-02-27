from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.db.models import UniqueConstraint
from django.db.models.functions import TruncDate
from datetime import datetime

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

    def save(self, *args, **kwargs):
        if not self.pk:
            # Get the date part of the current entry's datetime
            entry_date = self.date.date()
            
            # Look for any existing entries from the same user on the same date
            existing_entry = JournalEntry.objects.filter(
                user=self.user,
                date__date=entry_date
            ).first()
            
            if existing_entry:
                # Instead of creating a new entry, update the existing one
                self.pk = existing_entry.pk
                self.id = existing_entry.id
                self.created_at = existing_entry.created_at
                # Keep the original date's time part
                self.date = timezone.make_aware(datetime.combine(self.date.date(), existing_entry.date.time()))
        
        super().save(*args, **kwargs)
    
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