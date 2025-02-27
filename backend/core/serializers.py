from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, JournalEntry, MoodLog
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
            # Try to get existing entry for the same date
            existing_entry = JournalEntry.objects.get(
                user=user,
                date__date=date.date()
            )
            # Update existing entry
            for attr, value in validated_data.items():
                setattr(existing_entry, attr, value)
            existing_entry.save()
            return existing_entry
        except JournalEntry.DoesNotExist:
            # Create new entry
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
    class Meta:
        model = MoodLog
        fields = ['id', 'date', 'mood', 'intensity', 'notes', 'journal_entry', 'created_at']
        read_only_fields = ['user']
        
    def create(self, validated_data):
        # Ensure the user is set to the logged-in user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def validate_journal_entry(self, value):
        # Ensure users can only link to their own journal entries
        if value and value.user != self.context['request'].user:
            raise serializers.ValidationError("You can only link to your own journal entries.")
        return value 