from django.forms import model_to_dict
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

from django.shortcuts import render
from django.utils import timezone

from .view_utils import ExampleCalculations

from .models import TrustFeedback
from .view_utils import *

from assets.scripts.sample_date import import_all_sample_data


# funcions can be ran before returning the response in context
# This is a function based view which are simple. We can swtich to class based views if we need to do things like make urls
# dynamically
def example_view(request):

    # can run functions from view_utils and other view logic in a view:
    calc_object = ExampleCalculations()

    number = calc_object.run_example_calculation(1)

    # Since we're using React frontend, there is nothing we need to know about templates
    context = {"number": number}

    return JsonResponse(context)


def test(request):

    # import_all_sample_data()

    # borrower = TrustFeedbackViews(1).borrower
    # lender = TrustFeedbackViews(1).lender

    # TrustFeedbackViews(1).calc_trust_fields(borrower)
    # TrustFeedbackViews(1).calc_trust_fields(lender)

    # print(
    #     f"Borrower Info: {borrower.trust_rating}, {borrower.trust_total_transactions}, {borrower.trust_returns_missing}, {borrower.trust_damaged_count}, {borrower.trust_late_count}, {borrower.trust_last_updated}"
    # )
    # print(
    #     f"Lender Info: {lender.trust_rating}, {lender.trust_total_transactions}, {lender.trust_returns_missing}, {lender.trust_damaged_count}, {lender.trust_late_count}, {lender.trust_last_updated}"
    # )

    print("**********************************************")
    context = {}
    return render(request, "main/index.html", context=context)


# in frontend would be called by fetch("/users")
@csrf_exempt
@require_http_methods(["GET", "POST", "PUT", "DELETE"])
def user_views(request, user_id=None):
    if request.method == "GET":
        if user_id:
            try:
                user = User.objects.get(pk=user_id)
                return JsonResponse(user)
            except User.DoesNotExist:
                return JsonResponse({"error": "Not Found"}, status=404)
        else:
            users = list(User.objects.all())
            return JsonResponse(users, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)
        user = User.objects.create(
            f_name=data["f_name"],
            l_name=data["l_name"],
            photo_url=data["photo_url"],
            user_bio=data["user_bio"],
        )

        return JsonResponse({"id": user.pk})

    elif request.method == "PUT":
        if not user_id:
            return JsonResponse({"error": "Need user id"}, status=400)

        data = json.loads(request.body)

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return JsonResponse({"error", "User Not Found"}, status=404)

        def update_user(**kwargs):
            ALLOWED_FIELDS = [
                "f_name",
                "l_name",
                "address",
                "photo_url",
                "user_bio",
                "role",
                "neighborhood",
            ]

            for field, value in kwargs:
                if field is not None and field in ALLOWED_FIELDS:
                    if field == "role" and (value != "admin" or value != "neighbor"):
                        return {"error", "invalid role keyword"}
                    setattr(user, field, value)
            user.save()
            return user

        return JsonResponse(model_to_dict(update_user(**data)))

    elif request.method == "DELETE":
        if not user_id:
            return JsonResponse({"error": "Need User ID"}, status=400)

        try:
            user = User.objects.get(pk=user_id)
            user.delete()
        except User.DoesNotExist:
            return JsonResponse({"error": "User Not Found"}, status=404)


@csrf_exempt
@require_http_methods(["GET", "POST", "PUT", "DELETE"])
def trust_factor_views(request, user_id=None):
    if request.method == "GET":
        if user_id:
            try:
                trust_feedback_obj = TrustFeedback.objects.filter(borrower_id=user_id)
                return JsonResponse(trust_feedback_obj)
            except User.DoesNotExist:
                return JsonResponse({"error": "Not Found"}, status=404)
        else:
            users = list(TrustFeedback.objects.all())
            return JsonResponse(users, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)
        trust_feedback_utils = TrustFeedbackViews()
        trust_feedback_utils.create_trust_feedback(
            f_name=data["f_name"],
            l_name=data["l_name"],
            photo_url=data["photo_url"],
            user_bio=data["user_bio"],
        )
        return JsonResponse({"id": user_utils.user.pk})

    elif request.method == "PUT":
        if not trust_factor_id:
            return JsonResponse({"error": "Need user id"}, status=400)

        data = json.loads(request.body)
        user_utils = UserViews()

        try:
            user = user_utils.get_user(trust_factor_id)
        except User.DoesNotExist:
            return JsonResponse({"error", "User Not Found"}, status=404)

        updated_user = user_utils.update_user(**data)

        return JsonResponse(model_to_dict(updated_user))

    elif request.method == "DELETE":
        if not trust_factor_id:
            return JsonResponse({"error": "Need User ID"}, status=400)

        try:
            user = User.objects.get(pk=trust_factor_id)
            user.delete()
        except User.DoesNotExist:
            return JsonResponse({"error": "User Not Found"}, status=404)


@csrf_exempt
@require_http_methods(["GET", "POST", "PUT", "DELETE"])
def listing_views(request, listing_id=None):
    if request.method == "GET":
        if listing_id:
            try:
                user = User.objects.get(pk=listing_id)
                return JsonResponse(user)
            except User.DoesNotExist:
                return JsonResponse({"error": "Not Found"}, status=404)
        else:
            users = list(User.objects.all())
            return JsonResponse(users, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)
        user_utils = UserViews()
        user_utils.create_user(
            f_name=data["f_name"],
            l_name=data["l_name"],
            photo_url=data["photo_url"],
            user_bio=data["user_bio"],
        )
        return JsonResponse({"id": user_utils.user.pk})

    elif request.method == "PUT":
        if not listing_id:
            return JsonResponse({"error": "Need user id"}, status=400)

        data = json.loads(request.body)
        user_utils = UserViews()

        try:
            user = user_utils.get_user(listing_id)
        except User.DoesNotExist:
            return JsonResponse({"error", "User Not Found"}, status=404)

        updated_user = user_utils.update_user(**data)

        return JsonResponse(model_to_dict(updated_user))

    elif request.method == "DELETE":
        if not listing_id:
            return JsonResponse({"error": "Need User ID"}, status=400)

        try:
            user = User.objects.get(pk=listing_id)
            user.delete()
        except User.DoesNotExist:
            return JsonResponse({"error": "User Not Found"}, status=404)
