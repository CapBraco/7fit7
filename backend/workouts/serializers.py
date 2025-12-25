from rest_framework import serializers
from .models import (
    Exercise, 
    WorkoutRoutine, 
    RoutineExercise, 
    WorkoutSession, 
    ExerciseSet,
    WorkoutLike
)


class ExerciseSerializer(serializers.ModelSerializer):
    """Serializer for Exercise model"""

    secondary_muscles = serializers.ListField(
        child=serializers.ChoiceField(choices=Exercise.SECONDARY_MUSCLE_CHOICES),
        required=False
    )

    class Meta:
        model = Exercise
        fields = [
            'id', 'name', 'description', 'category', 'muscle_group',
            'equipment', 'secondary_muscles', 'instructions', 'video_url', 'image',
            'is_custom', 'created_by', 'created_at'
        ]
        read_only_fields = ['created_by', 'created_at']



class ExerciseSetSerializer(serializers.ModelSerializer):
    """Serializer for ExerciseSet model"""
    
    exercise_name = serializers.CharField(source='exercise.name', read_only=True)
    exercise_muscle_group = serializers.CharField(source='exercise.muscle_group', read_only=True)
    exercise_secondary_muscles = serializers.ListField(
    source='exercise.secondary_muscles',
    child=serializers.CharField(),
    read_only=True,
    required=False,
    allow_empty=True
    )
    volume = serializers.ReadOnlyField()
    
    class Meta:
        model = ExerciseSet
        fields = [
            'id', 'exercise', 'exercise_name', 'exercise_muscle_group', 'exercise_secondary_muscles',
            'set_number', 'set_type', 'reps', 'weight', 'rest_seconds', 'duration_seconds',
            'distance_meters', 'difficulty', 'notes', 'is_personal_record',
            'volume', 'created_at'
        ]
        read_only_fields = ['created_at']


class RoutineExerciseSerializer(serializers.ModelSerializer):
    """Serializer for exercises within a routine"""
    
    exercise_details = ExerciseSerializer(source='exercise', read_only=True)
    
    class Meta:
        model = RoutineExercise
        fields = [
            'id', 'exercise', 'exercise_details', 'order',
            'default_sets', 'default_reps', 'default_weight',
            'default_rest_seconds', 'notes',
            'use_custom_sets',
            'custom_sets',
        ]


class WorkoutRoutineListSerializer(serializers.ModelSerializer):
    """Serializer for listing workout routines"""
    
    exercise_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = WorkoutRoutine
        fields = [
            'id', 'name', 'description', 'is_public',
            'exercise_count', 'total_uses', 'average_duration',
            'is_liked', 'likes_count', 'username',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['total_uses', 'average_duration', 'created_at', 'updated_at']
    
    def get_exercise_count(self, obj):
        return obj.exercises.count()
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return WorkoutLike.objects.filter(user=request.user, routine=obj).exists()
        return False
    
    def get_likes_count(self, obj):
        return obj.likes.count()


class WorkoutRoutineDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed workout routine view"""
    
    exercises = RoutineExerciseSerializer(many=True, read_only=True)
    exercise_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = WorkoutRoutine
        fields = [
            'id', 'name', 'description', 'is_public',
            'exercises', 'exercise_count', 'total_uses',
            'average_duration', 'is_liked', 'likes_count',
            'username', 'created_at', 'updated_at'
        ]
        read_only_fields = ['total_uses', 'average_duration', 'created_at', 'updated_at']
    
    def get_exercise_count(self, obj):
        return obj.exercises.count()
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return WorkoutLike.objects.filter(user=request.user, routine=obj).exists()
        return False
    
    def get_likes_count(self, obj):
        return obj.likes.count()


class WorkoutRoutineCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating workout routines"""
    
    exercises = RoutineExerciseSerializer(many=True, required=False)
    
    class Meta:
        model = WorkoutRoutine
        fields = ['id', 'name', 'description', 'is_public', 'exercises']
    
    def create(self, validated_data):
        exercises_data = validated_data.pop('exercises', [])
        routine = WorkoutRoutine.objects.create(**validated_data)
        
        for exercise_data in exercises_data:
            RoutineExercise.objects.create(routine=routine, **exercise_data)
        
        return routine
    
    def update(self, instance, validated_data):
        exercises_data = validated_data.pop('exercises', None)
        
        # Update routine fields
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.is_public = validated_data.get('is_public', instance.is_public)
        instance.save()
        
        # Update exercises if provided
        if exercises_data is not None:
            instance.exercises.all().delete()
            for exercise_data in exercises_data:
                RoutineExercise.objects.create(routine=instance, **exercise_data)
        
        return instance


class WorkoutSessionListSerializer(serializers.ModelSerializer):
    """Serializer for listing workout sessions"""
    
    routine_name = serializers.CharField(source='routine.name', read_only=True)
    exercise_count = serializers.SerializerMethodField()
    exercise_sets = ExerciseSetSerializer(many=True, read_only=True)  # Add this!
    
    class Meta:
        model = WorkoutSession
        fields = [
            'id', 'routine', 'routine_name', 'name', 'notes',
            'start_time', 'end_time', 'duration_minutes',
            'total_volume', 'total_sets', 'exercise_count',
            'is_completed', 'exercise_sets', 'created_at'  # Add exercise_sets here!
        ]
        read_only_fields = ['duration_minutes', 'total_volume', 'total_sets', 'created_at']
    
    def get_exercise_count(self, obj):
        return obj.exercise_sets.values('exercise').distinct().count()


class WorkoutSessionDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed workout session view"""
    
    routine_name = serializers.CharField(source='routine.name', read_only=True)
    exercise_sets = ExerciseSetSerializer(many=True, read_only=True)
    
    class Meta:
        model = WorkoutSession
        fields = [
            'id', 'routine', 'routine_name', 'name', 'notes',
            'start_time', 'end_time', 'duration_minutes',
            'total_volume', 'total_sets', 'is_completed',
            'exercise_sets', 'created_at'
        ]
        read_only_fields = ['duration_minutes', 'total_volume', 'total_sets', 'created_at']


class WorkoutSessionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating workout sessions"""
    
    class Meta:
        model = WorkoutSession
        fields = [
            'id', 'routine', 'name', 'notes', 'start_time',
            'end_time', 'is_completed'
        ]
    
    def create(self, validated_data):
        session = WorkoutSession.objects.create(**validated_data)
        if session.end_time:
            session.calculate_duration()
        return session


class ExerciseSetCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating exercise sets"""
    
    class Meta:
        model = ExerciseSet
        fields = [
            'id', 'session', 'exercise', 'set_number', 'set_type',
            'reps', 'weight', 'rest_seconds', 'duration_seconds',
            'distance_meters', 'difficulty', 'notes', 'is_personal_record'
        ]


class WorkoutLikeSerializer(serializers.ModelSerializer):
    """Serializer for workout likes"""
    
    class Meta:
        model = WorkoutLike
        fields = ['id', 'routine', 'created_at']
        read_only_fields = ['created_at']