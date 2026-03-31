from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import RedirectView
from main.views import docs_view


# These are global template patterns. Don't need to use them for now
urlpatterns = [
    path("", RedirectView.as_view(url="/main/", permanent=False)),
    path("docs", RedirectView.as_view(url="/docs/", permanent=False)),
    path("docs/", docs_view, name="docs"),
    path("admin/", admin.site.urls),
    path("main/", include("main.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
