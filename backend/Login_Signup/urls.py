from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.Signup, name="signup"),
    path("login/", views.Login, name="login"),
    path("logout/", views.Logout, name="logout"),

    path("Create_Profile/", views.Profile_creation, name="Create_Profile")
    path("Show_Profile/", views.Show_Profile, name="Show_Profile")
]
