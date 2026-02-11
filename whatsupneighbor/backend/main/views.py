from django.http import JsonResponse
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

    borrower = TrustFeedbackViews(1).borrower
    lender = TrustFeedbackViews(1).lender

    TrustFeedbackViews(1).calc_trust_fields(borrower)
    TrustFeedbackViews(1).calc_trust_fields(lender)

    print(
        f"Borrower Info: {borrower.trust_rating}, {borrower.trust_total_transactions}, {borrower.trust_returns_missing}, {borrower.trust_damaged_count}, {borrower.trust_late_count}, {borrower.trust_last_updated}"
    )
    print(
        f"Lender Info: {lender.trust_rating}, {lender.trust_total_transactions}, {lender.trust_returns_missing}, {lender.trust_damaged_count}, {lender.trust_late_count}, {lender.trust_last_updated}"
    )

    print("**********************************************")
    context = {}
    return render(request, "main/index.html", context=context)
