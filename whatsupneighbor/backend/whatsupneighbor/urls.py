from django.contrib import admin
from django.urls import path, include


# These are global template patterns. Don't need to use them for now
urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("main.urls")),
]
