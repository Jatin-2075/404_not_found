from django.urls import path
from .views import (
    UserCreate,
    google_login_callback,
    validate_google_token,
    UserDetailView
)

urlpatterns = [
    path('register/', UserCreate.as_view()),
    path('google/', validate_google_token),
    path('callback/', google_login_callback),
    path('user/', UserDetailView.as_view()),
]
