import math

from django.forms import ValidationError, model_to_dict
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from django.db.models import Q
from django.utils import timezone


from datetime import datetime, timedelta

from .models import *

from django.contrib.auth.decorators import login_required

from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
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

    data = json.loads(request.body)

    address_object, _ = Address.objects.get_or_create(
        street=data.get("street"),
        city=data.get("city"),
    )
    address = address_object.full_address()
    neighborhoods = Neighborhood.objects.all()

    def geocode_address(city, state, zip_code, country):
        query = f"{city}, {state}, {zip_code}, {country}"
        url = "https://nominatim.openstreetmap.org/search"
        params = {"q": query, "format": "json", "limit": 1}
        headers = {"User-Agent": "my-app"}
        try:
            res = requests.get(url, params=params, headers=headers, timeout=10)
            res.raise_for_status()
            data = res.json()
            if not data:
                return None
            return float(data[0]["lat"]), float(data[0]["lon"])
        except (requests.RequestException, ValueError) as e:
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

    closest = None
    closest_dist = float("inf")

    for entry in neighborhoods:
        if entry.address.latitude is None or entry.address.longitude is None:
            continue
        d = distance(lat1, lon1, entry.address.latitude, entry.address.longitude)

        if d < closest_dist:
            closest_dist = d
            closest = entry

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

        if "avatar" in request.FILES:
            profile.photo = request.FILES["avatar"]
        else:
            profile.photo = None

        profile.save()

        user = authenticate(username=username, password=password)
        refresh = RefreshToken.for_user(user)

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


@csrf_exempt
@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    if request.user.is_authenticated:
        return JsonResponse(
            {
                "authenticated": True,
                "username": request.user.username,
                "name": request.user.first_name + " " + request.user.last_name,
            }
        )
    else:
        return JsonResponse({"authenticated": False})


@csrf_exempt
@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def profile_views(request, profile_id=None):
    profile = ""
    # Determine profile
    if profile_id == "me":
        try:

            profile = Profile.objects.get(user__username=request.user)
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

        listings = Listing.objects.filter(user=profile)

        data = model_to_dict(
            profile,
            fields=["bio", "website", "address", "neighborhood", "role"],
        )

        items = []
        for listing in listings:
            items.append(
                {
                    "id": listing.item.pk,
                    "name": listing.item.name,
                    "category": listing.item.category,
                    "description": listing.item.description,
                    "photo": listing.item.photo.url if listing.item.photo else None,
                    "status": listing.item.status,
                }
            )

        data["assets"] = items
        data["username"] = profile.user.username
        data["email"] = profile.user.email

        # Convert ForeignKeys to IDs or displayable info
        data["address"] = profile.address.full_address() if profile.address else None
        data["neighborhood"] = (
            profile.neighborhood.name if profile.neighborhood else None
        )

        # Convert image fields to URL
        data["photo"] = (
            None if profile.photo is None or profile.photo == "" else profile.photo.url
        )
        data["rating"] = profile.trust_rating

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


@csrf_exempt
@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def members_list_view(request):
    """
    Returns a list of all members with basic info.
    """
    members = Profile.objects.all()  # Adjust to filter out inactive users if needed
    results = []

    for m in members:
        results.append(
            {
                "id": m.user.id,
                "name": f"{m.user.first_name} {m.user.last_name}",
                "bio": m.bio,
                "trust_rating": round(m.rating or 0, 1),
                "items_lent": m.items.count(),  # Adjust based on your assets relation
                "photo": m.photo.url if m.photo else None,
            }
        )

    return JsonResponse({"members": results})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def member_profile_view(request, id):
    try:
        profile = Profile.objects.get(user__pk=id)

        # Get shared items
        items = [
            {
                "id": i.item.id,
                "name": i.item.name,
                "status": i.item.status,
            }
            for i in Listing.objects.filter(user=profile)
        ]

        response_data = {
            "user_id": profile.user.pk,
            "profile_id": profile.pk,
            "name": f"{profile.user.first_name} {profile.user.last_name}",
            "bio": profile.bio,
            "website": profile.website,
            "joined": profile.user.date_joined.strftime("%B %Y"),
            "rating": profile.trust_rating if hasattr(profile, "trust_rating") else 5.0,
            "items_lent": len(items),
            "photo": profile.photo.url if profile.photo else None,
            "items": items,
        }

        return JsonResponse(response_data)

    except Profile.DoesNotExist:
        return JsonResponse({"error": "Member not found"}, status=404)


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
def load_more_view(request, key_word):
    if key_word == "events":
        pass
    elif key_word == "borrowing":
        pass


@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def events_views(request):

    if request.method == "GET":
        try:

            offset = int(request.GET.get("offset", 0))
            limit = int(request.GET.get("limit", 6))

            events = Events.objects.all().order_by("-date")[offset : offset + limit]

            data = []

            for event in events:

                photo_url = None
                if event.photo:
                    try:
                        photo_url = event.photo.url
                    except:
                        photo_url = None

                data.append(
                    {
                        "id": event.pk,
                        "photo": photo_url,
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
                )
            return JsonResponse({"results": data, "count": Events.objects.count()})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@api_view(["GET", "PUT", "DELETE", "POST"])
@permission_classes([IsAuthenticated])
def user_events_view(request):

    profile = Profile.objects.get(user__username=request.user)

    if request.method == "GET":
        try:

            offset = int(request.GET.get("offset", 0))
            limit = int(request.GET.get("limit", 6))

            events = Events.objects.filter(host=profile).order_by("-date")[
                offset : offset + limit
            ]

            data = []

            for event in events:

                photo_url = None
                if event.photo:
                    try:
                        photo_url = event.photo.url
                    except:
                        photo_url = None

                data.append(
                    {
                        "id": event.id,
                        "host": f"{event.host.user.first_name} {event.host.user.last_name}",
                        "photo": photo_url,
                        "title": event.title,
                        "date": event.date,
                        "address": event.address.full_address(),
                        "description": event.description,
                    }
                )

            return JsonResponse(
                {"results": data, "count": Events.objects.filter(host=profile).count()}
            )

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    if request.method == "POST":
        try:
            user_profile = Profile.objects.get(user__username=request.user)

            title = request.POST.get("title")
            date = request.POST.get("date")
            description = request.POST.get("description")
            address = Address.objects.get(pk=request.POST.get("address"))
            photo = ""

            if "photo" in request.FILES:
                photo = request.FILES.get("photo")

            if not title or not date or not address:
                return JsonResponse({"error": "Missing required fields"}, status=400)

            event = Events.objects.create(
                title=title,
                date=date,
                description=description,
                address=address,
                host=user_profile,
                photo=photo,
            )

            EventSignUp.objects.create(user=user_profile, event=event)

            data = {
                "id": event.id,
                "title": event.title,
                "date": event.date,
                "description": event.description,
                "address": event.address.full_address(),
                "photo": event.photo.url if event.photo else None,
                "host": f"{event.host.user.first_name} {event.host.user.last_name}",
            }

            return JsonResponse(data, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    if request.method == "PUT":
        try:

            event_id = request.data.get("id")
            event = Events.objects.get(id=event_id, host=profile)

            event.title = request.data.get("title", event.title)
            event.description = request.data.get("description", event.description)
            event.date = request.data.get("date", event.date)

            event.save()

            return JsonResponse({"success": True})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    if request.method == "DELETE":
        try:

            event_id = request.data.get("id")
            event = Events.objects.get(id=event_id, host=profile)
            event.delete()

            return JsonResponse({"deleted": True})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@permission_classes([IsAuthenticated])
@api_view(["GET", "POST", "DELETE"])
def event_signup_view(request):
    """
    GET: list attendees for an event (event_id required)
    POST: sign up for an event (event_id in body)
    DELETE: leave an event (event_id in body)
    """
    user_profile = Profile.objects.get(user__username=request.user)

    try:
        if request.method == "GET":
            signups = EventSignUp.objects.filter(user=user_profile)
            events = []
            if len(signups) > 0:
                events = [
                    {
                        "id": s.event.id,
                        "title": s.event.title,
                        "date": s.event.date,
                        "address": s.event.address.full_address(),
                        "description": s.event.description,
                        "host": s.event.host.user.username if s.event.host else None,
                    }
                    for s in signups
                ]

            return JsonResponse({"success": True, "events": events})

        data = json.loads(request.body)
        eid = data.get("event_id")
        event = Events.objects.get(pk=eid)

        if request.method == "POST":
            obj, created = EventSignUp.objects.get_or_create(
                event=event, user=user_profile
            )
            return JsonResponse({"success": True, "signed_up": created})

        elif request.method == "DELETE":
            EventSignUp.objects.filter(event=event, user=user_profile).delete()
            return JsonResponse({"success": True, "signed_up": False})

    except Events.DoesNotExist:
        return JsonResponse({"success": False, "error": "Event not found"}, status=404)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)


@csrf_exempt
@permission_classes([IsAuthenticated])
@api_view(["GET"])
def event_participants_view(request):
    """
    Returns all events that the current user has signed up for.
    """
    event_id = request.GET.get("event_id")

    if not event_id:
        return JsonResponse(
            {"success": False, "error": "event_id required"}, status=400
        )

    try:
        event = Events.objects.get(pk=event_id)
        attendees = EventSignUp.objects.filter(event=event).select_related("user")
        users = [
            {
                "username": a.user.user.username,
                "first_name": a.user.user.first_name,
                "last_name": a.user.user.last_name,
                "profile_id": a.user.pk,
            }
            for a in attendees
        ]
        return JsonResponse({"success": True, "attendees": users})
    except Events.DoesNotExist:
        return JsonResponse({"success": False, "error": "Event not found"}, status=404)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)


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


@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def user_lend_views(request, pk=None):
    profile = Profile.objects.get(user=request.user)

    if request.method == "GET":
        listings = Listing.objects.filter(user=profile)
        items = []
        for listing in listings:
            items.append(
                {
                    "id": listing.item.pk,
                    "name": listing.item.name,
                    "category": listing.item.category,
                    "description": listing.item.description,
                    "photo": listing.item.photo.url if listing.item.photo else None,
                    "status": listing.item.status,
                }
            )
        return JsonResponse(items, safe=False)

    if request.method == "POST":
        name = request.POST.get("name")
        category = request.POST.get("category")
        description = request.POST.get("description")
        status = request.POST.get("status")

        item = Item.objects.create(
            name=name,
            category=category,
            description=description,
            status=status,
        )

        if "photo" in request.FILES:
            item.photo = request.FILES["photo"]
        else:
            item.photo = None

        item.save()

        listing = Listing.objects.create(
            user=profile,
            item=item,
            title=item.name,
            listing_bio=item.description,
            status="Available",
            start_date=timezone.now(),
            end_date=timezone.now() + timedelta(7),
            neighborhood=profile.neighborhood,
        )

        return JsonResponse(
            {
                "id": item.id,
                "name": item.name,
                "category": item.category,
                "description": item.description,
                "status": item.status,
                "photo": listing.item.photo.url if listing.item.photo else None,
            },
            status=201,
        )

    if request.method == "DELETE":
        if not pk:
            return JsonResponse({"error": "Item ID required"}, status=400)

        try:
            item = Item.objects.get(pk=pk)
            item.delete()
            return JsonResponse({"success": True})
        except Item.DoesNotExist:
            return JsonResponse({"error": "Item not found"}, status=404)


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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_chats_view(request):
    """Return all active chats for the user's profile"""
    profile = Profile.objects.get(user__username=request.user)

    chats = Chat.objects.filter(
        Q(transaction__lender=profile) | Q(transaction__borrower=profile),
    )

    results = []

    for chat in chats:
        messages = chat.message_set.order_by("timestamp")
        last_msg = messages.last()

        transaction = chat.transaction

        if transaction.lender == profile:
            other = transaction.borrower
        else:
            other = transaction.lender

        chat_name = f"{other.user.first_name} {other.user.last_name}"

        results.append(
            {
                "id": chat.pk,
                "transaction_id": transaction.pk,
                "name": chat_name,
                "is_group": False,
                "last_message": {
                    "content": last_msg.content if last_msg else "",
                    "timestamp": last_msg.timestamp.isoformat() if last_msg else None,
                },
                "messages": [
                    {
                        "id": m.pk,
                        "from": m.sender.user.get_full_name(),
                        "text": m.content,
                        "timestamp": m.timestamp.isoformat(),
                    }
                    for m in messages
                ],
                "unread_count": 0,
            }
        )

    return JsonResponse(results, safe=False)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message_view(request, chat_id):
    profile = Profile.objects.get(user__username=request.user)
    try:
        chat = Chat.objects.get(pk=chat_id)
    except Chat.DoesNotExist:
        return JsonResponse({"error": "Chat not found"}, status=404)

    content = request.data.get("content", "").strip()
    if not content:
        return JsonResponse({"error": "Message cannot be empty"}, status=400)

    msg = Message.objects.create(
        chat=chat, sender=profile, content=content, timestamp=timezone.now()
    )

    return JsonResponse(
        {
            "success": True,
            "id": msg.pk,
            "from": profile.user.get_full_name(),
            "text": msg.content,
            "timestamp": msg.timestamp.isoformat(),
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def chat_detail_view(request, chat_id):
    profile = Profile.objects.get(user__username=request.user)
    try:
        chat = Chat.objects.get(pk=chat_id)
    except Chat.DoesNotExist:
        return JsonResponse({"error": "Chat not found"}, status=404)

    messages = chat.message_set.order_by("timestamp")

    participants = (
        [chat.transaction.lender, chat.transaction.borrower]
        if hasattr(chat, "transaction")
        else []
    )
    other_participant = [p for p in participants if p != profile]
    chat_name = ", ".join([p.user.get_full_name() for p in other_participant])

    transaction_data = None
    if hasattr(chat, "transaction") and chat.transaction is not None:
        t = chat.transaction
        transaction_data = {
            "id": t.id,
            "status": t.status,
            "lender_username": t.lender.user.username,
            "borrower_username": t.borrower.user.username,
            "start_date": t.start_date.isoformat(),
            "end_date": t.end_date.isoformat(),
        }

    return JsonResponse(
        {
            "id": chat.pk,
            "name": chat_name,
            "is_group": False,
            "messages": [
                {
                    "id": m.pk,
                    "from": m.sender.user.username,
                    "text": m.content,
                    "timestamp": m.timestamp.isoformat(),
                }
                for m in messages
            ],
            "transaction": transaction_data,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_chat_view(request):
    borrower = Profile.objects.get(user__username=request.user)
    listing_id = request.data.get("listing_id")
    message = request.data.get("message", "").strip()

    try:
        listing = Listing.objects.get(pk=listing_id)
    except Listing.DoesNotExist:
        return JsonResponse({"error": "Listing not found"}, status=404)

    lender = listing.user

    transaction = Transaction.objects.filter(
        listing=listing, borrower=borrower, lender=lender
    ).first()

    if not transaction:
        transaction = Transaction.objects.create(
            listing=listing,
            borrower=borrower,
            lender=lender,
            start_date=timezone.now(),
            end_date=timezone.now(),
            status="pending",
        )

    chat, created = Chat.objects.get_or_create(
        transaction=transaction,
        defaults={"status": "pending"},
    )

    if message:
        Message.objects.create(
            chat=chat,
            sender=borrower,
            content=message,
            timestamp=timezone.now(),
        )

    return JsonResponse({"chat_id": chat.pk, "transaction_id": transaction.pk})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_transaction(request, transaction_id):
    try:
        t = Transaction.objects.get(pk=transaction_id)
    except Transaction.DoesNotExist:
        return JsonResponse({"error": "Transaction not found"}, status=404)

    t.status = "completed"
    t.end_date = timezone.now()
    t.save()

    return JsonResponse({"status": "completed"})


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def admin_views(request):
    pass


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_transaction_view(request, chat_id):
    try:
        chat = Chat.objects.get(pk=chat_id)
    except Chat.DoesNotExist:
        return JsonResponse({"error": "Chat not found"}, status=404)

    transaction = chat.transaction
    transaction.status = "in_progress"
    transaction.start_date = timezone.now()
    transaction.save()

    chat.status = "active"
    chat.save()

    return JsonResponse({"status": "transaction_started"})


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
                | Q(address__street__icontains=query)
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
                "photo",
            )[:25]
        )

        for listing in listings:
            results.append({**listing, "type": "listing"})
    if "users" in models_requested or "profiles" in models_requested:
        profiles = (
            Profile.objects.filter(
                Q(user__first_name__icontains=query)
                | Q(user__last_name__icontains=query)
                | Q(bio__icontains=query)
            )
            .select_related("user")
            .values(
                "id",
                "bio",
                "photo",
                "trust_rating",
                "user__first_name",
                "user__last_name",
            )[:25]
        )

        for p in profiles:
            results.append(
                {
                    "id": p["id"],
                    "name": f"{p['user__first_name']} {p['user__last_name']}",
                    "bio": p["bio"],
                    "trust_rating": p["trust_rating"] or 0,
                    "items_lent": p.get("items_count", 0),
                    "photo": p["photo"],
                    "type": "profile",
                }
            )

    return JsonResponse({"results": results})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_saved_listing(request, listing_id):

    user = Profile.objects.get(user__username=request.user)

    try:
        listing = Listing.objects.get(pk=listing_id)
    except Listing.DoesNotExist:
        return JsonResponse({"error": "Listing not found"}, status=404)

    if listing.user.user == user:
        raise ValidationError("Users cannot save their own listing.")

    existing = SavedListing.objects.filter(user=user, listing=listing).first()

    if existing:
        existing.delete()
        return JsonResponse(
            {"saved": False, "message": "Listing removed from saved items."}
        )

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

    user = Profile.objects.get(user__username=request.user)

    saved_listings = SavedListing.objects.filter(user=user)

    data = [
        {
            "id": saved.id,
            "listing_id": saved.listing.id,
            "title": saved.listing.title,
            "bio": saved.listing.listing_bio,
            "photo": (
                saved.listing.item.photo.url if saved.listing.item.photo else None
            ),
            "saved_at": saved.saved_At,
        }
        for saved in saved_listings
    ]

    return JsonResponse({"results": data})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_borrowed_items_view(request):

    profile = Profile.objects.get(user__username=request.user)

    transactions = Transaction.objects.filter(
        borrower=profile, status="in_progress"
    ).select_related("listing", "lender__user")

    results = []

    for t in transactions:
        results.append(
            {
                "transaction_id": t.pk,
                "chat_id": Chat.objects.get(transaction=t).pk,
                "name": t.listing.name,
                "photo": t.listing.photo.url if t.listing.photo else None,
                "lender": t.lender.user.get_full_name(),
                "start_date": t.start_date.isoformat() if t.start_date else None,
            }
        )

    return JsonResponse(results, safe=False)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_borrow_request(request):
    profile = request.user.profile
    data = request.data
    listing_id = data.get("listing_id")
    message = data.get("message", "").strip()

    try:
        listing = Listing.objects.get(pk=listing_id)
    except Listing.DoesNotExist:
        return JsonResponse({"error": "Listing not found"}, status=404)

    if listing.owner == profile:
        return JsonResponse({"error": "Cannot borrow your own listing"}, status=400)

    transaction = Transaction.objects.create(
        listing=listing,
        lender=listing.owner,
        borrower=profile,
        start_date=timezone.now(),
        end_date=timezone.now() + timezone.timedelta(days=7),
        status="open",
    )

    chat = Chat.objects.create(transaction=transaction, status="active")

    if message:
        Message.objects.create(
            chat=chat, sender=profile, content=message, timestamp=timezone.now()
        )

    return JsonResponse({"transaction_id": transaction.pk, "chat_id": chat.pk})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def approve_borrow_request(request, transaction_id):
    profile = request.user.profile
    try:
        transaction = Transaction.objects.get(pk=transaction_id, status="open")
    except Transaction.DoesNotExist:
        return JsonResponse(
            {"error": "Transaction not found or already approved"}, status=404
        )

    if transaction.lender != profile:
        return JsonResponse({"error": "Not authorized"}, status=403)

    transaction.status = "in_progress"
    transaction.start_date = timezone.now()
    transaction.end_date = transaction.start_date + timezone.timedelta(days=7)
    transaction.save()

    return JsonResponse({"message": "Borrow request approved"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_item_returned(request, transaction_id):
    profile = Profile.objects.get(user__username=request.user)
    try:
        transaction = Transaction.objects.get(pk=transaction_id, status="in_progress")
    except Transaction.DoesNotExist:
        return JsonResponse({"error": "Transaction not in progress"}, status=404)

    if profile != transaction.borrower and profile != transaction.lender:
        return JsonResponse({"error": "Not authorized"}, status=403)

    transaction.status = "completed"
    transaction.save()

    return JsonResponse({"message": "Transaction completed, ready for trust feedback"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_trust_feedback(request, transaction_id):
    profile = Profile.objects.get(user__username=request.user)
    try:
        transaction = Transaction.objects.get(pk=transaction_id, status="completed")
    except Transaction.DoesNotExist:
        return JsonResponse({"error": "Transaction not completed"}, status=404)

    if transaction.lender != profile:
        return JsonResponse({"error": "Only lender can submit feedback"}, status=403)

    borrower = transaction.borrower

    data = request.data
    feedback = TrustFeedback.objects.create(
        transaction=transaction,
        borrower=transaction.borrower,
        lender=profile,
        item_returned=data.get("item_returned", True),
        return_timeliness=data.get("return_timeliness", "on_time"),
        item_condition=data.get("item_condition", "good"),
        rating_score=data.get("rating_score", 5),
    )

    calc_trust_fields(borrower)

    return JsonResponse({"id": feedback.pk})


def calc_trust_fields(user: Profile):
    trust_objs_borrowing = TrustFeedback.objects.filter(borrower_id=user.pk)
    trust_objs_lending = TrustFeedback.objects.filter(lender_id=user.pk)
    user.trust_rating = round(
        sum([t.rating_score for t in trust_objs_borrowing])
        / trust_objs_borrowing.count(),
        1,
    )
    user.trust_total_transactions = (
        trust_objs_borrowing.count() + trust_objs_lending.count()
    )
    user.trust_returns_missing = trust_objs_borrowing.filter(
        item_returned=False
    ).count()
    user.trust_damaged_count = trust_objs_borrowing.filter(
        item_condition="damaged"
    ).count()
    user.trust_late_count = trust_objs_borrowing.filter(
        return_timeliness="late"
    ).count()
    user.trust_last_updated = timezone.now()

    user.save()
