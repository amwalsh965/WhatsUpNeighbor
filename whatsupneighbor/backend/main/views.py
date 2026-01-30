from django.http import JsonResponse

from .view_utils import ExampleCalculations


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
