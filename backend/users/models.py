from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class User(AbstractUser):
    """Custom User model with fitness-specific fields"""
    
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    
    # Profile fields
    bio = models.TextField(max_length=500, blank=True)
    profile_picture = models.ImageField(
        upload_to='profiles/', 
        null=True, 
        blank=True
    )
    
    # Fitness goals
    GOAL_CHOICES = [
        ('weight_loss', 'Weight Loss'),
        ('muscle_gain', 'Muscle Gain'),
        ('strength', 'Strength Training'),
        ('endurance', 'Endurance'),
        ('general', 'General Fitness'),
    ]
    fitness_goal = models.CharField(
        max_length=20,
        choices=GOAL_CHOICES,
        default='general'
    )
    
    # Physical stats
    height = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Height in centimeters"
    )
    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Current weight in kilograms"
    )
    age = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(13), MaxValueValidator(120)]
    )
    
    # Preferences
    is_profile_public = models.BooleanField(default=True)
    notifications_enabled = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Make email the primary login field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.email
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username


class UserGoal(models.Model):
    """Track user's fitness goals and motivations"""
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='goals'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    target_date = models.DateField(null=True, blank=True)
    is_achieved = models.BooleanField(default=False)
    achieved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"


class UserStats(models.Model):
    """Track user statistics and progress over time"""
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='stats'
    )
    
    # Workout stats
    total_workouts = models.PositiveIntegerField(default=0)
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    total_volume = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Total weight lifted in kg"
    )
    
    # Social stats
    followers_count = models.PositiveIntegerField(default=0)
    following_count = models.PositiveIntegerField(default=0)
    posts_count = models.PositiveIntegerField(default=0)
    
    # Last workout
    last_workout_date = models.DateField(null=True, blank=True)
    
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - Stats"