from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserGoal, UserStats


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'fitness_goal', 'is_staff', 'created_at']
    list_filter = ['fitness_goal', 'is_staff', 'is_active', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'bio', 'profile_picture')}),
        ('Fitness info', {'fields': ('fitness_goal', 'height', 'weight', 'age')}),
        ('Preferences', {'fields': ('is_profile_public', 'notifications_enabled')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )


@admin.register(UserGoal)
class UserGoalAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'is_achieved', 'target_date', 'created_at']
    list_filter = ['is_achieved', 'created_at']
    search_fields = ['user__username', 'user__email', 'title']
    ordering = ['-created_at']


@admin.register(UserStats)
class UserStatsAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'total_workouts', 'current_streak', 
        'followers_count', 'following_count', 'last_workout_date'
    ]
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['updated_at']