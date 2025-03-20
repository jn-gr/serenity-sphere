from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser, JournalEntry, MoodLog, Notification, MoodCause, RecommendationCategory, Recommendation, UserRecommendation
from django.utils import timezone
from datetime import datetime, time
from .ai_services import predict_emotions

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'date_joined', 'is_active', 'is_staff')
    search_fields = ('email', 'username')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )
    
    # Add actions to make testing easier
    actions = ['make_staff']
    
    def make_staff(self, request, queryset):
        queryset.update(is_staff=True)
    make_staff.short_description = "Mark selected users as staff"

@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'date', 'content_preview', 'emotions_preview', 'created_at')
    search_fields = ('user__email', 'content')
    list_filter = ('date', 'user')
    ordering = ('-date',)
    
    # Make it easier to add entries
    autocomplete_fields = ['user']
    
    # Add a filter to see entries by date range
    date_hierarchy = 'date'
    
    # Add date to the editable fields
    fieldsets = (
        (None, {
            'fields': ('user', 'date', 'content')
        }),
        ('Metadata', {
            'fields': ('emotions', 'created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User Email'

    def content_preview(self, obj):
        if len(obj.content) > 75:
            return obj.content[:75] + '...'
        return obj.content
    content_preview.short_description = 'Content Preview'
    
    def emotions_preview(self, obj):
        if obj.emotions:
            # Format emotions for better display
            try:
                # Assuming emotions is a list of [emotion, score] pairs
                top_emotions = sorted(obj.emotions, key=lambda x: x[1], reverse=True)[:3]
                return ", ".join([f"{e[0]}: {e[1]:.2f}" for e in top_emotions])
            except:
                return str(obj.emotions)[:75] + '...'
        return "No emotions detected"
    emotions_preview.short_description = 'Top Emotions'
    
    # Add actions for creating test data with different dates
    actions = ['set_date_yesterday', 'set_date_last_week', 'set_date_last_month']
    
    def set_date_yesterday(self, request, queryset):
        yesterday = timezone.now() - timezone.timedelta(days=1)
        # Set time to start of day to avoid timezone issues
        yesterday = datetime.combine(yesterday.date(), time.min)
        queryset.update(date=yesterday)
    set_date_yesterday.short_description = "Set date to yesterday"
    
    def set_date_last_week(self, request, queryset):
        last_week = timezone.now() - timezone.timedelta(days=7)
        # Set time to start of day to avoid timezone issues
        last_week = datetime.combine(last_week.date(), time.min)
        queryset.update(date=last_week)
    set_date_last_week.short_description = "Set date to last week"
    
    def set_date_last_month(self, request, queryset):
        last_month = timezone.now() - timezone.timedelta(days=30)
        # Set time to start of day to avoid timezone issues
        last_month = datetime.combine(last_month.date(), time.min)
        queryset.update(date=last_month)
    set_date_last_month.short_description = "Set date to last month"

    def save_model(self, request, obj, form, change):
        # Perform emotion analysis if content exists
        if obj.content:
            # Use existing emotion analysis function
            emotions = predict_emotions(obj.content)
            obj.emotions = emotions
            
            # Save the journal entry first
            super().save_model(request, obj, form, change)
            
            # Create/update a corresponding mood log based on emotions
            self._update_or_create_mood_log(obj, emotions, request.user)
        else:
            super().save_model(request, obj, form, change)
    
    def _update_or_create_mood_log(self, journal_entry, emotions, admin_user):
        """Create or update mood log based on journal entry emotions."""
        if not emotions:
            return
            
        # Sort emotions by confidence score (descending)
        sorted_emotions = sorted(emotions, key=lambda x: x[1], reverse=True)
        dominant_emotion = sorted_emotions[0][0].lower()
        
        # Map the emotion to a mood (using the same mapping from views.py)
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
        
        # Ensure intensity is at least 1
        intensity = max(intensity, 1)
        
        # First, check if a mood log with the same user, date, and mood already exists
        try:
            existing_log = MoodLog.objects.get(
                user=journal_entry.user,
                date=journal_entry.date.date(),
                mood=mood
            )
            
            # Update the existing log
            existing_log.intensity = intensity
            existing_log.journal_entry = journal_entry
            existing_log.notes = f"Updated by admin from journal entry emotions: {dominant_emotion} ({sorted_emotions[0][1]:.2f})"
            existing_log.save()
            
        except MoodLog.DoesNotExist:
            # Create new mood log only if one doesn't exist
            MoodLog.objects.create(
                user=journal_entry.user,
                date=journal_entry.date.date(),
                mood=mood,
                intensity=intensity,
                journal_entry=journal_entry,
                notes=f"Auto-generated by admin from journal entry emotions: {dominant_emotion} ({sorted_emotions[0][1]:.2f})"
            )

@admin.register(MoodLog)
class MoodLogAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'date', 'mood', 'intensity', 'has_journal_entry', 'created_at')
    list_filter = ('date', 'user', 'mood', 'intensity')
    search_fields = ('user__email', 'notes', 'mood')
    ordering = ('-date',)
    date_hierarchy = 'date'
    
    # Make it easier to add entries
    autocomplete_fields = ['user', 'journal_entry']
    
    # Add a filter by mood intensity
    list_filter = ('mood', 'intensity', 'date')
    
    # Add actions for bulk operations
    actions = ['set_intensity_high', 'set_intensity_medium', 'set_intensity_low', 
               'set_date_yesterday', 'set_date_last_week', 'set_date_last_month']
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User Email'
    
    def has_journal_entry(self, obj):
        return obj.journal_entry is not None
    has_journal_entry.boolean = True
    has_journal_entry.short_description = 'Has Journal Entry'
    
    def set_intensity_high(self, request, queryset):
        queryset.update(intensity=9)
    set_intensity_high.short_description = "Set intensity to high (9)"
    
    def set_intensity_medium(self, request, queryset):
        queryset.update(intensity=5)
    set_intensity_medium.short_description = "Set intensity to medium (5)"
    
    def set_intensity_low(self, request, queryset):
        queryset.update(intensity=2)
    set_intensity_low.short_description = "Set intensity to low (2)"
    
    def set_date_yesterday(self, request, queryset):
        yesterday = timezone.now().date() - timezone.timedelta(days=1)
        queryset.update(date=yesterday)
    set_date_yesterday.short_description = "Set date to yesterday"
    
    def set_date_last_week(self, request, queryset):
        last_week = timezone.now().date() - timezone.timedelta(days=7)
        queryset.update(date=last_week)
    set_date_last_week.short_description = "Set date to last week"
    
    def set_date_last_month(self, request, queryset):
        last_month = timezone.now().date() - timezone.timedelta(days=30)
        queryset.update(date=last_month)
    set_date_last_month.short_description = "Set date to last month"
    
    # Add a form to make it easier to create test data
    fieldsets = (
        (None, {
            'fields': ('user', 'date', 'mood', 'intensity')
        }),
        ('Additional Information', {
            'fields': ('notes', 'journal_entry', 'created_at'),
            'classes': ('collapse',),
        }),
    )
    
    readonly_fields = ('created_at',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'severity', 'is_read', 'created_at')
    list_filter = ('type', 'severity', 'is_read', 'created_at')
    search_fields = ('user__username', 'message')

@admin.register(MoodCause)
class MoodCauseAdmin(admin.ModelAdmin):
    list_display = ('user', 'cause_type', 'created_at')
    list_filter = ('cause_type', 'created_at')
    search_fields = ('user__username', 'cause_type', 'notes')

@admin.register(RecommendationCategory)
class RecommendationCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name', 'description')

@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'recommendation_type', 'is_active')
    list_filter = ('category', 'recommendation_type', 'is_active')
    search_fields = ('title', 'description')

@admin.register(UserRecommendation)
class UserRecommendationAdmin(admin.ModelAdmin):
    list_display = ('user', 'recommendation', 'is_helpful', 'created_at')
    list_filter = ('is_helpful', 'created_at')
    search_fields = ('user__username', 'recommendation__title', 'feedback')
