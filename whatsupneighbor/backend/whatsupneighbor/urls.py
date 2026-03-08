from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings


# These are global template patterns. Don't need to use them for now
urlpatterns = [
    path("admin/", admin.site.urls),
    path("main/", include("main.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
