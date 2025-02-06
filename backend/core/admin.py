from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser, JournalEntry

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

@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'date', 'content_preview', 'emotions', 'created_at')
    search_fields = ('user__email', 'content')
    list_filter = ('date', 'user')
    ordering = ('-date',)
    readonly_fields = ('emotions',)

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User Email'

    def content_preview(self, obj):
        if len(obj.content) > 75:
            return obj.content[:75] + '...'
        return obj.content
    content_preview.short_description = 'Content Preview'
