from django.forms import model_to_dict
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

from django.utils import timezone

from datetime import datetime

from .view_utils import *
from django.shortcuts import render, get_object_or_404  # added a new import

from django.contrib.auth.decorators import login_required

# from .view_utils import *
from django.shortcuts import render, get_object_or_404  # added a new import
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

# from assets.scripts.create_events import create_events
# from assets.scripts.sample_date import import_all_sample_data


# def test(request):
#     print("Creating events")
#     import_all_sample_data()
#     create_events()

#     return render({"created_events": "Created Events"})


# in frontend would be called by fetch("/users")


# Login Views


@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    username = data.get("username")
    password = data.get("password")

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse(
            {"success": False, "error": "Invalid credentials"}, status=401
        )

    # Create JWT tokens
    refresh = RefreshToken.for_user(user)

    return JsonResponse(
        {
            "success": True,
            "username": user.username,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
    )


@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({"success": True})


from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
import json


@csrf_exempt
def signup_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse(
            {"success": False, "error": "Username and password required"}, status=400
        )

    if User.objects.filter(username=username).exists():
        return JsonResponse(
            {"success": False, "error": "Username already exists"}, status=400
        )

    # Create user
    user = User.objects.create_user(username=username, password=password)

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)

    return JsonResponse(
        {
            "success": True,
            "username": user.username,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
    )


def current_user_view(request):
    if request.user.is_authenticated:
        return JsonResponse({"authenticated": True, "username": request.user.username})
    else:
        return JsonResponse({"authenticated": False})


@csrf_exempt
@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def profile_views(request, user_id=None):
    if request.method == "GET":
        if user_id == "me":
            try:
                profile = Profile.objects.get(user=request.user)
                data = model_to_dict(profile)
                data["username"] = profile.user.username
                data["email"] = profile.user.email
                return JsonResponse(data)
            except Profile.DoesNotExist:
                return JsonResponse({"error": "Profile Not Found"}, status=404)
        elif user_id:
            try:
                profile = Profile.objects.get(pk=int(user_id))
                data = model_to_dict(profile)
                # Include some basic user info
                data["username"] = profile.user.username
                data["email"] = profile.user.email
                return JsonResponse(data)
            except Profile.DoesNotExist:
                return JsonResponse({"error": "Profile Not Found"}, status=404)
        else:
            profiles = Profile.objects.all()
            data = []
            for profile in profiles:
                p = model_to_dict(profile)
                p["username"] = profile.user.username
                p["email"] = profile.user.email
                data.append(p)
            return JsonResponse(data, safe=False)

    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            # Then create the Profile
            user = User.objects.get(pk=request.user)
            profile = Profile.objects.create(
                user=user,
                address=data.get("address", ""),
                photo_url=data.get("photo_url", ""),
                bio=data.get("bio", ""),
                role=data.get("role", "neighbor"),
            )
            return JsonResponse({"id": profile.pk})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    elif request.method == "PUT":
        if not user_id:
            return JsonResponse({"error": "Need profile id"}, status=400)
        try:
            profile = Profile.objects.get(pk=user_id)
        except Profile.DoesNotExist:
            return JsonResponse({"error": "Profile Not Found"}, status=404)

        data = json.loads(request.body)

        # Update User fields
        if "username" in data:
            profile.user.username = data["username"]
        if "email" in data:
            profile.user.email = data["email"]
        if "password" in data:
            profile.user.set_password(data["password"])
        if "first_name" in data.user:
            profile.user.first_name = data["fisrt_name"]
        if "last_name" in data.user:
            profile.user.last_name = data["last_name"]
        profile.user.save()

        # Update Profile fields
        profile.address = data.get("address", profile.address)
        profile.photo_url = data.get("photo_url", profile.photo_url)
        profile.bio = data.get("bio", profile.bio)
        profile.role = data.get("role", profile.role)
        if "neighborhood" in data:
            profile.neighborhood = Neighborhood.objects.get(pk=data["neighborhood"])
        profile.save()

        return JsonResponse(model_to_dict(profile))

    elif request.method == "DELETE":
        if not user_id:
            return JsonResponse({"error": "Need profile id"}, status=400)
        try:
            profile = Profile.objects.get(pk=user_id)
            profile.user.delete()  # deletes the associated User as well
            profile.delete()
            return JsonResponse({"status": "deleted"})
        except Profile.DoesNotExist:
            return JsonResponse({"error": "Profile Not Found"}, status=404)


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def trust_feedback_collection(request):
    if request.method == "GET":
        feedback = list(TrustFeedback.objects.all().values())
        return JsonResponse(feedback, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)

        obj = TrustFeedback.objects.create(
            transaction_id=data.get("transaction"),
            borrower_id=data.get("borrower"),
            lender_id=data.get("lender"),
            item_returned=data.get("item_returned"),
            return_timeliness=data.get("return_timeliness"),
            item_condition=data.get("item_condition"),
            rating_score=data.get("rating_score"),
        )

        return JsonResponse({"id": obj.id})


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def trust_feedback_details(request, trust_feedback_id):
    try:
        obj = TrustFeedback.objects.get(pk=trust_feedback_id)
    except TrustFeedback.DoesNotExist:
        return JsonResponse({"error": "Trust Feedback Does Not Exist"}, status=404)

    if request.method == "GET":
        return JsonResponse(model_to_dict(obj))

    elif request.method == "PUT":
        data = json.loads(request.body)

        for key, value in data.items():
            if value is not None:
                setattr(obj, key, value)

        obj.save()
        return JsonResponse(model_to_dict(obj))


def _compute_listing_availability(status, start_date, end_date, today):
    """
    Business rule (simple and predictable):
    - available if status == "active" AND today is within [start_date, end_date]
    - if start/end are null, treat as open-ended
    """
    start_ok = (start_date is None) or (start_date <= today)
    end_ok = (end_date is None) or (end_date >= today)
    in_window = start_ok and end_ok
    is_active = status == "active"

    is_available_now = bool(is_active and in_window)

    if not is_active:
        return {
            "is_available_now": False,
            "signal": "red",
            "reason": f"Not active (status={status})",
        }
    if not in_window:
        return {
            "is_available_now": False,
            "signal": "red",
            "reason": "Outside date window",
        }
    return {
        "is_available_now": True,
        "signal": "green",
        "reason": "Active and within date window",
    }


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def user_profile(request, user_id):
    user = get_object_or_404(Profile.objects.select_related("neighborhood"), pk=user_id)

    items = list(
        ItemProfileAssociation.objects.filter(user_id=user_id)
        .select_related("item")
        .values(
            "item__id",
            "item__name",
            "item__category",
            "item__bio",
        )
    )

    listings = list(
        Listing.objects.filter(user_id=user_id)
        .select_related("item")
        .values(
            "id",
            "type",
            "title",
            "status",
            "start_date",
            "end_date",
            "image_url",
            "item__id",
            "item__name",
        )
    )

    now = timezone.now()
    today = now.date()

    available_offers = 0
    active_requests = 0

    for l in listings:

        start = l.get("start_date")
        end = l.get("end_date")

        if isinstance(start, datetime):
            start = start.date()
        if isinstance(end, datetime):
            end = end.date()

        l["availability"] = _compute_listing_availability(
            status=l.get("status"),
            start_date=start,
            end_date=end,
            today=today,
        )

        l["item"] = (
            None
            if l.get("item__id") is None
            else {"id": l["item__id"], "name": l.get("item__name")}
        )

        l.pop("item__id", None)
        l.pop("item__name", None)

        if l.get("type") == "offer" and l["availability"]["is_available_now"]:
            available_offers += 1
        if l.get("type") == "request" and l.get("status") == "active":
            active_requests += 1

    overall_signal = "green" if available_offers > 0 else "red"

    payload = {
        "user": {
            "id": user.pk,
            "fisrt_name": user.user.first_name,
            "last_name": user.user.last_name,
            "photo_url": user.photo_url,
            "bio": user.bio,
            "address": getattr(user, "address", None),
            "neighborhood": (
                None
                if getattr(user, "neighborhood", None) is None
                else {
                    "id": user.neighborhood.id,
                    "name": getattr(user.neighborhood, "name", str(user.neighborhood)),
                }
            ),
        },
        "trust": {
            "trust_rating": (
                float(user.trust_rating)
                if getattr(user, "trust_rating", None) is not None
                else None
            ),
            "trust_total_transactions": getattr(user, "trust_total_transactions", None),
            "trust_returns_missing": getattr(user, "trust_returns_missing", None),
            "trust_damaged_count": getattr(user, "trust_damaged_count", None),
            "trust_late_count": getattr(user, "trust_late_count", None),
        },
        "items": items,
        "listings": listings,
        "computed": {
            "overall_availability": {
                "signal": overall_signal,
                "available_offers_count": available_offers,
                "active_requests_count": active_requests,
            }
        },
    }

    return JsonResponse(payload, safe=True)


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def load_more_view(request, key_word):
    if key_word == "events":
        pass
    elif key_word == "borrowing":
        pass


@csrf_exempt
@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def events_views(request):
    print("Running 0 ")
    try:
        print("Running 1")
        search_query = request.GET.get("search", "").strip()

        events = Events.objects.all()

        if search_query:
            search_filter = (
                Q(title__icontains=search_query)
                | Q(address__icontains=search_query)
                | Q(description__icontains=search_query)
            )
            search_filter |= Q(host__user__first_name__icontains=search_query)
            search_filter |= Q(host__user__last_name__icontains=search_query)

            events = events.filter(search_filter)

        # Make sure we select the correct related object
        events = events.select_related("host").order_by("-date")
        print(events)
        print("Running2")

        data = [
            {
                "id": event.id,
                "title": event.title,
                "date": event.date,
                "address": event.address,
                "description": event.description,
                "host": (
                    f"{event.host.user.first_name} {event.host.user.last_name}"
                    if event.host
                    else None
                ),
            }
            for event in events[:6]
        ]
        print("Running 3")

        return JsonResponse({"results": data})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def lend_views(request):

    if request.method == "GET":
        items = list(Item.objects.values())
        return JsonResponse(items, safe=False)

    if request.method == "POST":
        data = json.loads(request.body)

        item = Item.objects.create(
            name=data["name"],
            category=data["category"],
            description=data.get("description", ""),
            status="Available",
        )

        return JsonResponse(
            {
                "id": item.id,
                "name": item.name,
                "category": item.category,
                "description": item.description,
                "status": item.status,
            }
        )


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def lend_item_detail(request, id):

    try:
        item = Item.objects.get(id=id)
    except Item.DoesNotExist:
        return JsonResponse({"error": "Item not found"}, status=404)

    if request.method == "GET":
        return JsonResponse(
            {
                "id": item.id,
                "name": item.name,
                "category": item.category,
                "description": item.description,
                "status": item.status,
            }
        )

    if request.method == "DELETE":
        item.delete()
        return JsonResponse({"deleted": True})


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def get_items(request):

    items = Item.objects.all()

    results = []

    for item in items:

        results.append(
            {
                "id": item.id,
                "name": item.name,
                "category": item.category,
                "status": item.status,
                "description": item.description,
                "owner": "Unknown",
                "image": item.image.url if item.image else None,
            }
        )

    return JsonResponse({"results": results})


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def my_chats(request):
    """
    Returns all chats for the current user, including messages.
    """
    try:
        profile = Profile.objects.get(user=request.user)
    except Profile.DoesNotExist:
        return JsonResponse({"error": "Profile not found"}, status=404)

    chats = Chat.objects.filter(transaction__buyer=profile) | Chat.objects.filter(
        transaction__seller=profile
    )

    response = []

    for chat in chats.distinct():
        messages = Message.objects.filter(chat=chat).order_by("timestamp")
        last_message = messages.last()

        # Determine chat name
        if chat.transaction:
            # Example: For group chat you can define it differently
            chat_name = f"Transaction {chat.transaction.id}"
        else:
            chat_name = "Chat"

        response.append(
            {
                "id": chat.id,
                "name": chat_name,
                "is_group": False,  # set True if you have real group chats
                "last_message": {
                    "content": last_message.content if last_message else "",
                    "timestamp": (
                        last_message.timestamp.isoformat()
                        if last_message
                        else timezone.now().isoformat()
                    ),
                },
                "unread_count": 0,  # You can customize unread count per user
                "messages": [
                    {
                        "sender_name": msg.sender.user.first_name
                        or msg.sender.user.username,
                        "content": msg.content,
                    }
                    for msg in messages
                ],
            }
        )

    return JsonResponse(response, safe=False)


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def send_message(request, chat_id):
    """
    Endpoint to send a message to a chat.
    Expects JSON: { "content": "..." }
    """
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        profile = Profile.objects.get(user=request.user)
    except Profile.DoesNotExist:
        return JsonResponse({"error": "Profile not found"}, status=404)

    try:
        chat = Chat.objects.get(id=chat_id)
    except Chat.DoesNotExist:
        return JsonResponse({"error": "Chat not found"}, status=404)

    try:
        data = json.loads(request.body)
        content = data.get("content", "").strip()
        if not content:
            return JsonResponse({"error": "Message cannot be empty"}, status=400)

        message = Message.objects.create(
            chat=chat, sender=profile, content=content, timestamp=timezone.now()
        )

        return JsonResponse({"success": True, "message_id": message.id})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def admin_views(request):
    pass


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def search_view(request):

    query = request.GET.get("search", "")
    models_header = request.headers.get("X-Search-Models", "")

    models_requested = [m.strip() for m in models_header.split(",") if m]

    results = []

    if "items" in models_requested:

        items = Item.objects.filter(name__icontains=query)[:25]

        for item in items:
            results.append(
                {
                    "id": item.id,
                    "type": "item",
                    "name": item.name,
                    "category": item.category,
                    "status": item.status,
                }
            )

    return JsonResponse({"results": results})


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def saved_items_view(request):
    """
    Return all saved items for the current user.
    """
    user = request.user

    # Fetch saved associations for this user
    saved_items = SavedAssociation.objects.filter(user=user).select_related("item")

    results = []
    for assoc in saved_items:
        item = assoc.item
        results.append(
            {
                "id": item.id,
                "name": item.name,
                "title": item.name,  # for frontend compatibility
                "description": item.description,
                "category": item.category,
                "status": item.status,
                "image": item.image.url if item.image else "",
                "owner": item.owner.username if hasattr(item, "owner") else "Unknown",
            }
        )

    return JsonResponse({"results": results})


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    try:
        profile = Profile.objects.get(user=request.user)
    except Profile.DoesNotExist:
        return JsonResponse(
            {"success": False, "error": "Profile not found"}, status=404
        )

    if request.method == "GET":
        return JsonResponse(
            {
                "username": profile.user.username,
                "first_name": profile.user.first_name,
                "last_name": profile.user.last_name,
                "address": profile.address,
                "neighborhood": (
                    profile.neighborhood.id if profile.neighborhood else None
                ),
                "photo_url": profile.photo_url or "",
                "bio": profile.bio or "",
                "role": profile.role,
                "trust_rating": float(profile.trust_rating),
                "trust_total_transactions": profile.trust_total_transactions,
                "trust_returns_missing": profile.trust_returns_missing,
                "trust_damaged_count": profile.trust_damaged_count,
                "trust_late_count": profile.trust_late_count,
            }
        )

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            profile.address = data.get("address", profile.address)

            neighborhood_id = data.get("neighborhood")
            if neighborhood_id:
                try:
                    profile.neighborhood = Neighborhood.objects.get(id=neighborhood_id)
                except Neighborhood.DoesNotExist:
                    return JsonResponse(
                        {"success": False, "error": "Neighborhood not found"},
                        status=400,
                    )

            profile.photo_url = data.get("photo_url", profile.photo_url)
            profile.bio = data.get("bio", profile.bio)
            profile.save()

            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)
