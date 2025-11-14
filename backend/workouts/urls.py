from django.urls import path
from .views import (
    ExerciseListView,
    ExerciseDetailView,
    WorkoutRoutineListView,
    WorkoutRoutineDetailView,
    like_routine,
    WorkoutSessionListView,
    WorkoutSessionDetailView,
    complete_session,
    ExerciseSetListCreateView,
    ExerciseSetDetailView,
    workout_stats,
)

urlpatterns = [
    # Exercises
    path('exercises/', ExerciseListView.as_view(), name='exercise_list'),
    path('exercises/<int:pk>/', ExerciseDetailView.as_view(), name='exercise_detail'),
    
    # Workout Routines
    path('routines/', WorkoutRoutineListView.as_view(), name='routine_list'),
    path('routines/<int:pk>/', WorkoutRoutineDetailView.as_view(), name='routine_detail'),
    path('routines/<int:pk>/like/', like_routine, name='like_routine'),
    
    # Workout Sessions
    path('sessions/', WorkoutSessionListView.as_view(), name='session_list'),
    path('sessions/<int:pk>/', WorkoutSessionDetailView.as_view(), name='session_detail'),
    path('sessions/<int:pk>/complete/', complete_session, name='complete_session'),
    
    # Exercise Sets
    path('sessions/<int:session_id>/sets/', ExerciseSetListCreateView.as_view(), name='session_sets'),
    path('sets/<int:pk>/', ExerciseSetDetailView.as_view(), name='set_detail'),
    
    # Stats
    path('stats/', workout_stats, name='workout_stats'),
]