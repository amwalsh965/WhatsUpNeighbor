from django.forms import model_to_dict
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

from django.shortcuts import render
from django.utils import timezone


from .models import TrustFeedback
from .view_utils import *

from assets.scripts.sample_date import import_all_sample_data


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
@require_http_methods(["GET", "POST"])
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


@csrf_exempt
@require_http_methods(["GET", "PUT"])
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
