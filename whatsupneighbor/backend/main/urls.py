from django.urls import path
from . import views

app_name = "main"

# When a view is created, a url path must also be created. If you want a specific endpoint, specify it in the ""

urlpatterns = [
    path("", views.example_view, name="home"),
    path("api/example/", views.example_view, name="api-example"),
]
