"""
URL configuration for serenitysphere project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core import views

router = DefaultRouter()
router.register(r'journal', views.JournalEntryViewSet, basename='journal')
router.register(r'mood-logs', views.MoodLogViewSet, basename='mood-log')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/csrf/', views.get_csrf_token, name='csrf'),
    path('api/auth/register/', views.register_user, name='register'),
    path('api/auth/login/', views.login_user, name='login'),
    path('api/auth/logout/', views.logout_user, name='logout'),
    path('api/auth/user/', views.get_user, name='user'),
    path('api/user-profile/', views.user_profile, name='user_profile'),
    path('api/', include(router.urls)),
    path('api/detect-emotions/', views.detect_emotions, name='detect_emotions'),
    path('api/journal-entries/', views.get_journal_entries, name='get_journal_entries'),
    path('api/mood-trends/', views.get_mood_trends, name='get_mood_trends'),
    
    # New mood analytics endpoints
    path('api/mood-analytics/', views.MoodAnalyticsView.as_view(), name='mood-analytics'),
    path('api/mood-summary/', views.mood_summary, name='mood-summary'),
]
