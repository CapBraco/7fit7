from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.postgres.fields import ArrayField

User = get_user_model()


class Exercise(models.Model):
    """Exercise library - predefined exercises"""
    
    CATEGORY_CHOICES = [
        ('strength', 'Strength Training'),
        ('cardio', 'Cardio'),
        ('flexibility', 'Flexibility'),
        ('sports', 'Sports'),
    ]
    
    MUSCLE_GROUP_CHOICES = [
        ('chest', 'Chest'),
        ('back', 'Back'),
        ('shoulders', 'Shoulders'),
        ('arms', 'Arms'),
        ('legs', 'Legs'),
        ('core', 'Core'),
        ('full_body', 'Full Body'),
        ('cardio', 'Cardio'),
    ]
    SECONDARY_MUSCLE_CHOICES = [
    ('shoulders', 'Shoulders'),
    ("triceps", "Triceps"),
    ('biceps', 'Biceps'),
    ("back", "Back"),
    ('forearms', 'Forearms'),
    ('calves', 'Calves'),
    ('neck', 'Neck'),
    ('chest', 'Chest'),
    ]
    
    EQUIPMENT_CHOICES = [
        ('barbell', 'Barbell'),
        ('dumbbell', 'Dumbbell'),
        ('machine', 'Machine'),
        ('cable', 'Cable'),
        ('bodyweight', 'Bodyweight'),
        ('band', 'Resistance Band'),
        ('kettlebell', 'Kettlebell'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    muscle_group = models.CharField(max_length=20, choices=MUSCLE_GROUP_CHOICES)
    equipment = models.CharField(max_length=20, choices=EQUIPMENT_CHOICES)
    secondary_muscles = ArrayField(
    models.CharField(max_length=20, choices=SECONDARY_MUSCLE_CHOICES),
    default=list,
    blank=True
)
    
    # Optional fields
    instructions = models.TextField(blank=True, help_text="How to perform the exercise")
    video_url = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='exercises/', blank=True, null=True)
    
    # Meta
    is_custom = models.BooleanField(default=False, help_text="Created by user vs. system")
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='created_exercises'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['category', 'muscle_group']),
        ]
    
    def __str__(self):
        return self.name


class WorkoutRoutine(models.Model):
    """Workout routine template created by user"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='routines')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Privacy
    is_public = models.BooleanField(default=False)
    
    # Stats (denormalized for performance)
    total_uses = models.PositiveIntegerField(default=0)
    average_duration = models.PositiveIntegerField(
        default=0, 
        help_text="Average duration in minutes"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.name}"


class RoutineExercise(models.Model):
    """Exercises within a routine with order and default values"""
    
    routine = models.ForeignKey(
        WorkoutRoutine, 
        on_delete=models.CASCADE, 
        related_name='exercises'
    )
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    
    # Order in routine
    order = models.PositiveIntegerField(default=0)
    
    # Default values for this exercise in this routine
    default_sets = models.PositiveIntegerField(default=3)
    default_reps = models.PositiveIntegerField(default=10)
    default_weight = models.DecimalField(
        max_digits=6, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Default weight in kg"
    )
    default_rest_seconds = models.PositiveIntegerField(default=60)
    
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['order']
        unique_together = ['routine', 'order']
    
    def __str__(self):
        return f"{self.routine.name} - {self.exercise.name}"


class WorkoutSession(models.Model):
    """Actual workout session - when user does a workout"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workout_sessions')
    routine = models.ForeignKey(
        WorkoutRoutine, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='sessions'
    )
    
    # Session details
    name = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    
    # Timing
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    
    # Stats
    total_volume = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        help_text="Total weight lifted in kg"
    )
    total_sets = models.PositiveIntegerField(default=0)
    
    # Status
    is_completed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-start_time']
        indexes = [
            models.Index(fields=['user', '-start_time']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.start_time.date()}"
    
    def calculate_duration(self):
        """Calculate duration in minutes"""
        if self.end_time:
            delta = self.end_time - self.start_time
            self.duration_minutes = int(delta.total_seconds() / 60)
            self.save()
    
    def calculate_total_volume(self):
        """Calculate total volume from all sets"""
        total = sum(
            exercise_set.weight * exercise_set.reps 
            for exercise_set in self.exercise_sets.all()
            if exercise_set.weight and exercise_set.reps
        )
        self.total_volume = total
        self.total_sets = self.exercise_sets.count()
        self.save()


class ExerciseSet(models.Model):
    """Individual set within a workout session"""
    
    SET_TYPE_CHOICES = [
        ('normal', 'Normal'),
        ('warmup', 'Warm-up'),
        ('dropset', 'Drop Set'),
        ('failure', 'To Failure'),
    ]
    
    session = models.ForeignKey(
        WorkoutSession, 
        on_delete=models.CASCADE, 
        related_name='exercise_sets'
    )
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    
    # Set details
    set_number = models.PositiveIntegerField()
    set_type = models.CharField(max_length=20, choices=SET_TYPE_CHOICES, default='normal')
    
    # Performance data
    reps = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    weight = models.DecimalField(
        max_digits=6, 
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Weight in kg"
    )
    rest_seconds = models.PositiveIntegerField(null=True, blank=True)
    
    # Cardio-specific fields
    duration_seconds = models.PositiveIntegerField(null=True, blank=True)
    distance_meters = models.DecimalField(
        max_digits=8, 
        decimal_places=2, 
        null=True, 
        blank=True
    )
    
    # Feedback
    difficulty = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        null=True,
        blank=True,
        help_text="Difficulty rating 1-10"
    )
    notes = models.TextField(blank=True)
    
    # Personal record
    is_personal_record = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['set_number']
        indexes = [
            models.Index(fields=['session', 'exercise', 'set_number']),
        ]
    
    def __str__(self):
        return f"{self.exercise.name} - Set {self.set_number}"
    
    @property
    def volume(self):
        """Calculate volume for this set (weight × reps)"""
        if self.weight and self.reps:
            return float(self.weight) * self.reps
        return 0


class WorkoutLike(models.Model):
    """Users can like workout routines"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='liked_routines')
    routine = models.ForeignKey(
        WorkoutRoutine, 
        on_delete=models.CASCADE, 
        related_name='likes'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'routine']
    
    def __str__(self):
        return f"{self.user.username} likes {self.routine.name}"


class BodyWeightLog(models.Model):
    """Track user's body weight over time"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='weight_logs')
    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Weight in kg"
    )
    date = models.DateField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
        unique_together = ['user', 'date']
    
    def __str__(self):
        return f"{self.user.username} - {self.weight}kg on {self.date}"