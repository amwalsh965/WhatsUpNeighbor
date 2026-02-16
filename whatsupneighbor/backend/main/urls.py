from django.urls import path
from . import views

app_name = "main"

# When a view is created, a url path must also be created. If you want a specific endpoint, specify it in the ""

urlpatterns = [
    path("", views.example_view, name="home"),
    path("api/example/", views.example_view, name="api-example"),
    path("test/", views.test, name="test"),
    path("user/", views.user_views),
    path("user/<int:user_id>/", views.user_views),
    path("trust_factor/", views.trust_factor_views),
    path("trust_factor/<int:trust_factor_id>/", views.trust_factor_views),
    path("listing/", views.listing_views),
    path("listing/<int:listing_id>/", views.listing_views),
]
