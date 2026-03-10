import math

from django.forms import model_to_dict
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from django.db.models import Q
from django.utils import timezone

from datetime import datetime

from .view_utils import *

from django.contrib.auth.decorators import login_required

# from .view_utils import *
from django.shortcuts import render, get_object_or_404  # added a new import
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import requests


from assets.scripts.create_events import create_events
from assets.scripts.sample_date import import_all_sample_data, create_points


def test(request):
    print("Creating events")
    # import_all_sample_data()
    # create_events()
    # create_points()

    print("done")
    return render({"created_events": "Created Events"})


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
def find_nearest_neighborhood(request):
    print("Finding Neighborhood")

    data = json.loads(request.body)

    address_object, _ = Address.objects.get_or_create(
        street=data.get("street"),
        city=data.get("city"),
    )
    address = address_object.full_address()
    print(address)
    neighborhoods = Neighborhood.objects.all()

    def geocode_address(city, state, zip_code, country):
        query = f"{city}, {state}, {zip_code}, {country}"
        print(query)
        url = "https://nominatim.openstreetmap.org/search"
        params = {"q": query, "format": "json", "limit": 1}
        headers = {"User-Agent": "my-app"}
        try:
            print(1)
            res = requests.get(url, params=params, headers=headers, timeout=10)
            res.raise_for_status()
            data = res.json()
            print(data)
            print(2)
            if not data:
                return None
            return float(data[0]["lat"]), float(data[0]["lon"])
        except (requests.RequestException, ValueError) as e:
            print(3)
            print("Geocode error:", e)
            return None

    def distance(lat1, lon1, lat2, lon2):
        R = 6371  # Earth radius in km

        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)

        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )

        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    lat1, lon1 = geocode_address(
        address_object.city,
        address_object.state,
        address_object.zip_code,
        address_object.country,
    )
    address_object.latitude = lat1
    address_object.longitude = lon1
    address_object.save()
    print("found geolocation")

    closest = None
    closest_dist = float("inf")

    for entry in neighborhoods:
        if entry.address.latitude is None or entry.address.longitude is None:
            continue
        d = distance(lat1, lon1, entry.address.latitude, entry.address.longitude)

        if d < closest_dist:
            closest_dist = d
            closest = entry

    print("found closest neighborhood", closest.pk)
    return JsonResponse(
        {
            "success": True,
            "neighborhood_pk": closest.pk,
            "neighborhood": closest.name,
            "address_id": address_object.pk,
        }
    )


@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({"success": True})


@csrf_exempt
def signup_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    try:
        print("working 1")
        print(request.POST)
        username = request.POST.get("username")
        password = request.POST.get("password")
        email = request.POST.get("email")
        bio = request.POST.get("bio")
        first_name = request.POST.get("f_name")
        last_name = request.POST.get("l_name")
        neighborhood = Neighborhood.objects.get(
            pk=int(request.POST.get("neighborhood_pk"))
        )
        address = Address.objects.get(pk=int(request.POST.get("address_id")))
        website = request.POST.get("website")

        if not username or not password:
            return JsonResponse(
                {"success": False, "error": "Username and password required"},
                status=400,
            )

        print("working 2")
        if User.objects.filter(username=username).exists():
            return JsonResponse(
                {"success": False, "error": "Username already exists"}, status=400
            )

        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email,
        )

        profile = Profile.objects.create(
            user=user,
            neighborhood=neighborhood,
            role="neighbor",
            bio=bio,
            address=address,
            website=website,
        )

        print("working 3")
        if "avatar" in request.FILES:
            profile.photo = request.FILES["avatar"]

        profile.save()

        refresh = RefreshToken.for_user(user)

        print("working 4")
        return JsonResponse(
            {
                "success": True,
                "username": user.username,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        )

    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)


def current_user_view(request):
    if request.user.is_authenticated:
        return JsonResponse({"authenticated": True, "username": request.user.username})
    else:
        return JsonResponse({"authenticated": False})


@csrf_exempt
@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def profile_views(request, profile_id=None):
    user = request.user

    # Determine profile
    if profile_id == "me":
        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            return JsonResponse({"error": "Profile Not Found"}, status=404)
    elif profile_id:
        try:
            profile = Profile.objects.get(pk=int(profile_id))
        except Profile.DoesNotExist:
            return JsonResponse({"error": "Profile Not Found"}, status=404)
    else:
        return JsonResponse({"error": "Profile ID required"}, status=400)

    # ---- GET ----
    if request.method == "GET":
        data = model_to_dict(
            profile, fields=["bio", "website", "address", "neighborhood", "role"]
        )
        data["username"] = profile.user.username
        data["email"] = profile.user.email

        # Convert ForeignKeys to IDs or displayable info
        data["address"] = profile.address.id if profile.address else None
        data["neighborhood"] = profile.neighborhood.id if profile.neighborhood else None

        # Convert image fields to URL
        data["photo"] = (
            profile.photo.url if getattr(profile.photo, "url", None) else None
        )

        return JsonResponse(data)

    # ---- PUT ----
    elif request.method == "PUT":
        # Use FormData: text comes in request.POST, file in request.FILES
        bio = request.POST.get("bio", profile.bio)
        website = request.POST.get("website", profile.website)
        address_id = request.POST.get("address")
        neighborhood_id = request.POST.get("neighborhood")

        profile.bio = bio
        profile.website = website

        # Handle Address update
        if address_id:
            try:
                profile.address = Address.objects.get(pk=int(address_id))
            except Address.DoesNotExist:
                pass

        # Handle Neighborhood update
        if neighborhood_id:
            try:
                profile.neighborhood = Neighborhood.objects.get(pk=int(neighborhood_id))
            except Neighborhood.DoesNotExist:
                pass

        # Handle uploaded image
        if "photo" in request.FILES:
            profile.photo = request.FILES["photo"]

        profile.save()

        return JsonResponse(
            {
                "success": True,
                "bio": profile.bio,
                "website": profile.website,
                "address": profile.address.id if profile.address else None,
                "neighborhood": (
                    profile.neighborhood.id if profile.neighborhood else None
                ),
                "photo": (
                    profile.photo.url if getattr(profile.photo, "url", None) else None
                ),
            }
        )


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
            "photo": user.photo,
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

        events = Events.objects.all()
        data = [
            {
                "id": event.pk,
                "title": event.title,
                "date": event.date,
                "address": event.address.full_address(),
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
def get_listings(request):

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
                "photo": item.photo.url if item.photo else None,
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
        if chat.transaction:
            chat_name = f"Transaction {chat.transaction.id}"
        else:
            chat_name = "Chat"

        response.append(
            {
                "id": chat.id,
                "name": chat_name,
                "is_group": False,
                "last_message": {
                    "content": last_message.content if last_message else "",
                    "timestamp": (
                        last_message.timestamp.isoformat()
                        if last_message
                        else timezone.now().isoformat()
                    ),
                },
                "unread_count": 0,
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_view(request):
    query = request.GET.get("search", "").strip()
    models_param = request.GET.get("models", "items")
    models_requested = [m.strip() for m in models_param.split(",") if m]

    results = []

    if "items" in models_requested:
        items = Item.objects.filter(
            Q(name__icontains=query) | Q(category__icontains=query)
        ).values("id", "name", "category", "status")[:25]

        for item in items:
            results.append({**item, "type": "item"})

    if "events" in models_requested:
        events = (
            Events.objects.filter(
                Q(title__icontains=query)
                | Q(address__icontains=query)
                | Q(description__icontains=query)
                | Q(host__user__first_name__icontains=query)
                | Q(host__user__last_name__icontains=query)
            )
            .select_related("host")
            .values("id", "title", "address", "description", "host_id")[:25]
        )

        for event in events:
            results.append({**event, "type": "event"})
    if "listings" in models_requested:
        listings = (
            Listing.objects.filter(
                Q(title__icontains=query)
                | Q(listing_bio__icontains=query)
                | Q(item__name__icontains=query)
                | Q(user__user__first_name__icontains=query)
                | Q(user__user__last_name__icontains=query)
            )
            .select_related("user", "user__user", "item")
            .values(
                "id",
                "title",
                "listing_bio",
                "status",
                "type",
                "item__name",
                "user__user__first_name",
                "user__user__last_name",
            )[:25]
        )

        for listing in listings:
            results.append({**listing, "type": "listing"})

    return JsonResponse({"results": results})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_saved_listing(request, listing_id):

    user = User.objects.get(user__username=request.user)

    try:
        listing = Listing.objects.get(pk=listing_id)
    except Listing.DoesNotExist:
        return JsonResponse({"error": "Listing not found"}, status=404)

    # Prevent saving your own listing
    if listing.user.user == user:
        raise ValidationError("Users cannot save their own listing.")

    existing = SavedListing.objects.filter(user=user, listing=listing).first()

    # If already saved → remove it
    if existing:
        existing.delete()
        return JsonResponse(
            {"saved": False, "message": "Listing removed from saved items."}
        )

    # Otherwise create
    saved = SavedListing.objects.create(user=user, listing=listing)

    return JsonResponse(
        {
            "saved": True,
            "message": "Listing saved successfully.",
            "saved_listing_id": saved.id,
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_saved_listings(request):

    user = request.user

    saved_listings = SavedListing.objects.filter(user=user).select_related(
        "listing", "listing__user"
    )

    data = [
        {
            "id": saved.id,
            "listing_id": saved.listing.id,
            "title": saved.listing.title,
            "listing_bio": saved.listing.listing_bio,
            "saved_at": saved.saved_At,
        }
        for saved in saved_listings
    ]

    return JsonResponse({"results": data})
