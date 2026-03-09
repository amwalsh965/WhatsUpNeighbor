from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static


app_name = "main"

# When a view is created, a url path must also be created. If you want a specific endpoint, specify it in the ""

urlpatterns = [
    path("test/", views.test),
    path("user/", views.profile_views),
    path("user/<int:user_id>/", views.profile_views),
    path("user/<int:user_id>/profile/", views.user_profile, name="user-profile"),
    path("trust_feedback/", views.trust_feedback_collection),
    path("trust_feedback/<int:trust_feedback_id>/", views.trust_feedback_details),
    path("events/", views.events_views),
    path("lend/", views.lend_views),
    path("lend/<int:id>/", views.lend_item_detail),
    path("search/", views.search_view),
    path("items/", views.get_items),
    path("saved/", views.saved_items_view, name="saved-items"),
    path("auth/login/", views.login_view, name="login"),
    path("auth/logout/", views.logout_view, name="logout"),
    path("auth/signup/", views.signup_view, name="signup"),
    path("current_user/", views.current_user_view, name="current-user"),
    path("profiles/<str:profile_id>/", views.profile_views, name="profile_me"),
    path("chats/my_chats/", views.my_chats, name="my_chats"),
    path("chats/<int:chat_id>/send_message/", views.send_message, name="send_message"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/get_nearest_neighborhood/", views.find_nearest_neighborhood),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
