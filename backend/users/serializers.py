from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UserGoal, UserStats

User = get_user_model()


class UserStatsSerializer(serializers.ModelSerializer):
    """Serializer for user statistics"""
    
    class Meta:
        model = UserStats
        fields = [
            'total_workouts', 'current_streak', 'longest_streak',
            'total_volume', 'followers_count', 'following_count',
            'posts_count', 'last_workout_date'
        ]


class UserGoalSerializer(serializers.ModelSerializer):
    """Serializer for user goals"""
    
    class Meta:
        model = UserGoal
        fields = [
            'id', 'title', 'description', 'target_date',
            'is_achieved', 'achieved_at', 'created_at'
        ]
        read_only_fields = ['achieved_at', 'created_at']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile (GET requests)"""
    
    stats = UserStatsSerializer(read_only=True)
    goals = UserGoalSerializer(many=True, read_only=True)
    full_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'full_name', 'bio', 'profile_picture', 'fitness_goal',
            'height', 'weight', 'age', 'is_profile_public',
            'notifications_enabled', 'stats', 'goals',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['email', 'created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'password', 'password_confirm',
            'first_name', 'last_name', 'fitness_goal'
        ]
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs
    
    def create(self, validated_data):
        # Remove password_confirm before creating user
        validated_data.pop('password_confirm')
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Create associated UserStats
        UserStats.objects.create(user=user)
        
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'bio', 'profile_picture',
            'fitness_goal', 'height', 'weight', 'age',
            'is_profile_public', 'notifications_enabled'
        ]


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change endpoint"""
    
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                "new_password": "Password fields didn't match."
            })
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value
    
    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user