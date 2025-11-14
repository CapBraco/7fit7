from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import (
    Exercise, 
    WorkoutRoutine, 
    WorkoutSession, 
    ExerciseSet,
    WorkoutLike
)
from .serializers import (
    ExerciseSerializer,
    WorkoutRoutineListSerializer,
    WorkoutRoutineDetailSerializer,
    WorkoutRoutineCreateSerializer,
    WorkoutSessionListSerializer,
    WorkoutSessionDetailSerializer,
    WorkoutSessionCreateSerializer,
    ExerciseSetSerializer,
    ExerciseSetCreateSerializer,
    WorkoutLikeSerializer
)


# ============= EXERCISES =============

class ExerciseListView(generics.ListCreateAPIView):
    """
    GET/POST /api/workouts/exercises/
    List all exercises or create custom exercise
    """
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Exercise.objects.all()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by muscle group
        muscle_group = self.request.query_params.get('muscle_group')
        if muscle_group:
            queryset = queryset.filter(muscle_group=muscle_group)
        
        # Filter by equipment
        equipment = self.request.query_params.get('equipment')
        if equipment:
            queryset = queryset.filter(equipment=equipment)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, is_custom=True)


class ExerciseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET/PUT/DELETE /api/workouts/exercises/<id>/
    Retrieve, update, or delete a specific exercise
    """
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]


# ============= WORKOUT ROUTINES =============

class WorkoutRoutineListView(generics.ListCreateAPIView):
    """
    GET/POST /api/workouts/routines/
    List all routines or create new routine
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return WorkoutRoutineCreateSerializer
        return WorkoutRoutineListSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        # Show user's own routines + public routines
        queryset = WorkoutRoutine.objects.filter(
            Q(user=user) | Q(is_public=True)
        ).distinct()
        
        # Filter by user's routines only
        if self.request.query_params.get('my_routines') == 'true':
            queryset = WorkoutRoutine.objects.filter(user=user)
        
        # Filter by public routines only
        if self.request.query_params.get('public') == 'true':
            queryset = WorkoutRoutine.objects.filter(is_public=True)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WorkoutRoutineDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET/PUT/DELETE /api/workouts/routines/<id>/
    Retrieve, update, or delete a specific routine
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return WorkoutRoutineCreateSerializer
        return WorkoutRoutineDetailSerializer
    
    def get_queryset(self):
        user = self.request.user
        return WorkoutRoutine.objects.filter(
            Q(user=user) | Q(is_public=True)
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_routine(request, pk):
    """
    POST /api/workouts/routines/<id>/like/
    Like or unlike a routine
    """
    routine = get_object_or_404(WorkoutRoutine, pk=pk)
    user = request.user
    
    like, created = WorkoutLike.objects.get_or_create(user=user, routine=routine)
    
    if not created:
        # Unlike if already liked
        like.delete()
        return Response({'message': 'Routine unliked'}, status=status.HTTP_200_OK)
    
    return Response({'message': 'Routine liked'}, status=status.HTTP_201_CREATED)


# ============= WORKOUT SESSIONS =============

class WorkoutSessionListView(generics.ListCreateAPIView):
    """
    GET/POST /api/workouts/sessions/
    List all sessions or start new session
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return WorkoutSessionCreateSerializer
        return WorkoutSessionListSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = WorkoutSession.objects.filter(user=user)
        
        # Filter by completed status
        is_completed = self.request.query_params.get('is_completed')
        if is_completed is not None:
            queryset = queryset.filter(is_completed=is_completed.lower() == 'true')
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(start_time__gte=start_date)
        if end_date:
            queryset = queryset.filter(start_time__lte=end_date)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WorkoutSessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET/PUT/DELETE /api/workouts/sessions/<id>/
    Retrieve, update, or delete a specific session
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return WorkoutSessionCreateSerializer
        return WorkoutSessionDetailSerializer
    
    def get_queryset(self):
        return WorkoutSession.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.end_time:
            instance.calculate_duration()
        instance.calculate_total_volume()


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def complete_session(request, pk):
    """
    POST /api/workouts/sessions/<id>/complete/
    Mark session as completed
    """
    session = get_object_or_404(WorkoutSession, pk=pk, user=request.user)
    
    from django.utils import timezone
    session.end_time = timezone.now()
    session.is_completed = True
    session.calculate_duration()
    session.calculate_total_volume()
    
    # Update user stats
    user_stats = request.user.stats
    user_stats.total_workouts += 1
    user_stats.total_volume += float(session.total_volume)
    user_stats.last_workout_date = session.start_time.date()
    user_stats.save()
    
    # Update routine stats
    if session.routine:
        session.routine.total_uses += 1
        session.routine.save()
    
    serializer = WorkoutSessionDetailSerializer(session)
    return Response(serializer.data)


# ============= EXERCISE SETS =============

class ExerciseSetListCreateView(generics.ListCreateAPIView):
    """
    GET/POST /api/workouts/sessions/<session_id>/sets/
    List or add sets to a session
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ExerciseSetCreateSerializer
        return ExerciseSetSerializer
    
    def get_queryset(self):
        session_id = self.kwargs.get('session_id')
        return ExerciseSet.objects.filter(
            session_id=session_id,
            session__user=self.request.user
        )
    
    def perform_create(self, serializer):
        session_id = self.kwargs.get('session_id')
        session = get_object_or_404(
            WorkoutSession, 
            pk=session_id, 
            user=self.request.user
        )
        serializer.save(session=session)


class ExerciseSetDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET/PUT/DELETE /api/workouts/sets/<id>/
    Retrieve, update, or delete a specific set
    """
    serializer_class = ExerciseSetSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ExerciseSet.objects.filter(session__user=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def workout_stats(request):
    """
    GET /api/workouts/stats/
    Get user's workout statistics
    """
    user = request.user
    
    # Get recent sessions
    recent_sessions = WorkoutSession.objects.filter(
        user=user, 
        is_completed=True
    )[:10]
    
    # Calculate stats
    total_sessions = recent_sessions.count()
    total_volume = sum(s.total_volume for s in recent_sessions)
    avg_duration = sum(s.duration_minutes or 0 for s in recent_sessions) / total_sessions if total_sessions > 0 else 0
    
    return Response({
        'total_sessions': total_sessions,
        'total_volume': total_volume,
        'average_duration': round(avg_duration, 1),
        'recent_sessions': WorkoutSessionListSerializer(recent_sessions, many=True).data
    })