from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser, JournalEntry, MoodLog

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
    actions = ['set_intensity_high', 'set_intensity_medium', 'set_intensity_low']
    
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
    
    # Add a form to make it easier to create test data
    fieldsets = (
        (None, {
            'fields': ('user', 'date', 'mood', 'intensity')
        }),
        ('Additional Information', {
            'fields': ('notes', 'journal_entry'),
            'classes': ('collapse',),
        }),
    )
