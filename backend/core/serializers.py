from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, JournalEntry, MoodLog
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)

class JournalEntrySerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')
    emotions = serializers.JSONField(read_only=True)

    class Meta:
        model = JournalEntry
        fields = ['id', 'user', 'date', 'content', 'emotions', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'emotions', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        user = validated_data.get('user')
        date = validated_data.get('date', timezone.now())
        
        # Check if an entry already exists for this user on this date
        entry_date = date.date()
        try:
            # If entry exists, update it
            existing_entry = JournalEntry.objects.get(user=user, date__date=entry_date)
            for attr, value in validated_data.items():
                setattr(existing_entry, attr, value)
            existing_entry.save()
            return existing_entry
        except JournalEntry.DoesNotExist:
            # If no entry exists, create a new one
            return super().create(validated_data)

# New serializer for updating the user's profile
class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super().update(instance, validated_data)

class MoodLogSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')
    category = serializers.ReadOnlyField()
    
    class Meta:
        model = MoodLog
        fields = ['id', 'user', 'date', 'mood', 'intensity', 'notes', 'journal_entry', 'category', 'created_at']
        read_only_fields = ['id', 'user', 'created_at', 'category']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class MoodAnalyticsSerializer(serializers.Serializer):
    period = serializers.CharField(required=False, default='week')
    
    def get_analytics(self, user):
        period = self.validated_data.get('period', 'week')
        
        # Define date ranges
        today = timezone.now().date()
        if period == 'week':
            start_date = today - timedelta(days=7)
        elif period == 'month':
            start_date = today - timedelta(days=30)
        elif period == 'year':
            start_date = today - timedelta(days=365)
        else:
            start_date = today - timedelta(days=7)  # Default to week
        
        # Get mood logs for the period
        mood_logs = MoodLog.objects.filter(
            user=user,
            date__gte=start_date,
            date__lte=today
        ).order_by('date')
        
        # Prepare data for different visualizations
        mood_counts = {}
        mood_intensity = {}
        mood_timeline = {}
        mood_categories = {
            'positive': 0,
            'negative': 0,
            'neutral': 0
        }
        
        for log in mood_logs:
            # Count moods
            if log.mood in mood_counts:
                mood_counts[log.mood] += 1
            else:
                mood_counts[log.mood] = 1
            
            # Track intensity
            if log.mood in mood_intensity:
                mood_intensity[log.mood].append(log.intensity)
            else:
                mood_intensity[log.mood] = [log.intensity]
            
            # Timeline data
            date_str = log.date.strftime('%Y-%m-%d')
            if date_str not in mood_timeline:
                mood_timeline[date_str] = []
            mood_timeline[date_str].append({
                'mood': log.mood,
                'intensity': log.intensity
            })
            
            # Category counts
            mood_categories[log.category] += 1
        
        # Calculate average intensity
        avg_intensity = {}
        for mood, intensities in mood_intensity.items():
            avg_intensity[mood] = sum(intensities) / len(intensities)
        
        # Get most common and least common moods
        most_common = max(mood_counts.items(), key=lambda x: x[1])[0] if mood_counts else None
        least_common = min(mood_counts.items(), key=lambda x: x[1])[0] if mood_counts else None
        
        # Calculate mood balance (positive vs negative)
        total_moods = sum(mood_categories.values())
        mood_balance = {
            'positive': mood_categories['positive'] / total_moods if total_moods > 0 else 0,
            'negative': mood_categories['negative'] / total_moods if total_moods > 0 else 0,
            'neutral': mood_categories['neutral'] / total_moods if total_moods > 0 else 0
        }
        
        return {
            'period': period,
            'mood_counts': mood_counts,
            'avg_intensity': avg_intensity,
            'mood_timeline': mood_timeline,
            'mood_categories': mood_categories,
            'most_common': most_common,
            'least_common': least_common,
            'mood_balance': mood_balance,
            'total_logs': len(mood_logs)
        } 