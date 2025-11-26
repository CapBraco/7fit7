from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    UserProfileView,
    UserUpdateView,
    ChangePasswordView,
    UserGoalListCreateView,
    UserGoalDetailView,
    check_auth,
    body_weight_log,
)

urlpatterns = [
    # Authentication
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/check/', check_auth, name='check_auth'),
    
    # User Profile
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('profile/update/', UserUpdateView.as_view(), name='user_update'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('body-weight/', body_weight_log, name='body_weight_log'),
    
    # User Goals
    path('goals/', UserGoalListCreateView.as_view(), name='user_goals'),
    path('goals/<int:pk>/', UserGoalDetailView.as_view(), name='user_goal_detail'),
]