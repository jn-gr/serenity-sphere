from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, JournalEntry, MoodLog, Notification, MoodCause, Recommendation, UserRecommendation, RecommendationCategory
from django.utils import timezone

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'date_joined']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'confirm_password')

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = CustomUser.objects.create_user(**validated_data)
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
        user = self.context['request'].user
        date = validated_data.get('date', timezone.now())
        
        try:
            existing_entry = JournalEntry.objects.get(
                user=user,
                date__date=date.date()
            )
            for attr, value in validated_data.items():
                setattr(existing_entry, attr, value)
            existing_entry.save()
            return existing_entry
        except JournalEntry.DoesNotExist:
            return super().create(validated_data)

#for updating the user's profile
class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    def validate_username(self, value):
        user = self.context['request'].user
        if CustomUser.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        user = self.context['request'].user
        if CustomUser.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super().update(instance, validated_data)

class MoodLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodLog
        fields = ['id', 'date', 'mood', 'intensity', 'notes', 'journal_entry', 'created_at']
        read_only_fields = ['user']
        
    def create(self, validated_data):
        #ensure the user is set to the logged-in user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def validate_journal_entry(self, value):
        #ensure users can only link to their own journal entries
        if value and value.user != self.context['request'].user:
            raise serializers.ValidationError("You can only link to your own journal entries.")
        return value

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'type', 'message', 'severity', 'is_read', 'created_at']


class MoodCauseSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodCause
        fields = ['id', 'cause_type', 'notes', 'created_at']


class RecommendationSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Recommendation
        fields = ['id', 'title', 'description', 'recommendation_type', 'category_name', 'link']


class UserRecommendationSerializer(serializers.ModelSerializer):
    recommendation = RecommendationSerializer(read_only=True)
    
    class Meta:
        model = UserRecommendation
        fields = ['id', 'recommendation', 'is_helpful', 'feedback', 'created_at'] 