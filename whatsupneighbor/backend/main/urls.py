from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static


app_name = "main"

# When a view is created, a url path must also be created. If you want a specific endpoint, specify it in the ""

urlpatterns = [
    path("test/", views.test),
    path("events/", views.events_views),
    path("lend/", views.lend_views),
    path("lend/<int:id>/", views.lend_item_detail),
    path("search/", views.search_view),
    path("listings/", views.get_listings),
    path("auth/login/", views.login_view, name="login"),
    path("auth/logout/", views.logout_view, name="logout"),
    path("auth/signup/", views.signup_view, name="signup"),
    path("current-user/", views.current_user_view, name="current-user"),
    path("profiles/<str:profile_id>/", views.profile_views, name="profile_me"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/get_nearest_neighborhood/", views.find_nearest_neighborhood),
    path(
        "listings/<int:listing_id>/favorite/",
        views.toggle_saved_listing,
        name="toggle_saved_listing",
    ),
    path(
        "saved-listings/",
        views.get_saved_listings,
        name="get_saved_listings",
    ),
    path(
        "user_listings/",
        views.user_lend_views,
        name="get_saved_listings",
    ),
    path(
        "user_listings/<int:pk>/",
        views.user_lend_views,
        name="get_saved_listings",
    ),
    path("user-events/", views.user_events_view),
    path("event-signup/", views.event_signup_view),
    path("event-participants/", views.event_participants_view),
    path("members/", views.members_list_view, name="members-list"),
    path("members/<int:id>/", views.member_profile_view, name="member-profile"),
    path("chats/my_chats/", views.my_chats_view, name="my_chats"),
    path(
        "chats/<int:chat_id>/send_message/",
        views.send_message_view,
        name="send_message",
    ),
    path("chats/<int:chat_id>/", views.chat_detail_view, name="chat_detail"),
    path("messages/start/", views.start_chat_view),
    path("messages/start/", views.start_borrow_request, name="start-borrow-request"),
    path(
        "transactions/<int:transaction_id>/approve/",
        views.approve_borrow_request,
        name="approve-borrow-request",
    ),
    path(
        "transactions/<int:transaction_id>/return/",
        views.mark_item_returned,
        name="mark-item-returned",
    ),
    path(
        "transactions/<int:transaction_id>/feedback/",
        views.create_trust_feedback,
        name="create-trust-feedback",
    ),
    path("transactions/borrowed/", views.my_borrowed_items_view),
    path("transactions/start/<int:chat_id>/", views.start_transaction_view),
    path("transactions/<int:transaction_id>/return_item/", views.complete_transaction),
    path("trust_feedback/<int:transaction_id>/", views.create_trust_feedback),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
