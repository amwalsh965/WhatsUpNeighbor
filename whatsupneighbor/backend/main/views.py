from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone

from .view_utils import ExampleCalculations

from .models import TrustFeedback

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

    import_all_sample_data()

    print("**********************************************")
    context = {}
    return render(request, "main/index.html", context=context)
