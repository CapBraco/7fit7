from django.contrib import admin
from .models import (
    Exercise, 
    WorkoutRoutine, 
    RoutineExercise, 
    WorkoutSession, 
    ExerciseSet,
    WorkoutLike
)


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'muscle_group', 'equipment', 'is_custom', 'created_at']
    list_filter = ['category', 'muscle_group', 'equipment', 'is_custom']
    search_fields = ['name', 'description']
    ordering = ['name']


class RoutineExerciseInline(admin.TabularInline):
    model = RoutineExercise
    extra = 1


@admin.register(WorkoutRoutine)
class WorkoutRoutineAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'is_public', 'total_uses', 'created_at']
    list_filter = ['is_public', 'created_at']
    search_fields = ['name', 'user__username']
    inlines = [RoutineExerciseInline]
    ordering = ['-created_at']


class ExerciseSetInline(admin.TabularInline):
    model = ExerciseSet
    extra = 0


@admin.register(WorkoutSession)
class WorkoutSessionAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'routine', 'start_time', 'duration_minutes', 
        'total_volume', 'is_completed'
    ]
    list_filter = ['is_completed', 'start_time']
    search_fields = ['user__username', 'routine__name']
    inlines = [ExerciseSetInline]
    ordering = ['-start_time']


@admin.register(ExerciseSet)
class ExerciseSetAdmin(admin.ModelAdmin):
    list_display = [
        'session', 'exercise', 'set_number', 'reps', 
        'weight', 'set_type', 'is_personal_record'
    ]
    list_filter = ['set_type', 'is_personal_record', 'created_at']
    search_fields = ['session__user__username', 'exercise__name']


@admin.register(WorkoutLike)
class WorkoutLikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'routine', 'created_at']
    search_fields = ['user__username', 'routine__name']