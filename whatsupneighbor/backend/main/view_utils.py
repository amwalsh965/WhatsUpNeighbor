from django.utils import timezone
from .models import *


# How a class and methods would be used in view_utils. Follows normal python
class ExampleCalculations:
    def __init__(self, example: int = 0):
        self.example_num = example

    def run_example_calculation(self, num):

        # This is how you would create a new object in the database for a model
        # Automatically increments the PK, can leave fields out that aren't essential
        example_object = ExampleModel.objects.create(field1="abc", field2=1, field3=0.1)

        # Have to save
        example_object.save()

        # Fields are stored as attributes of objects. For example, to alter an object, you can just use the . operator
        example_object.field1 = "def"
        example_object.save()

        number = example_object.field2 + self.example_num + num
        return number


class TransactionViews:
    pass


class UserViews:
    def __init__(self, pk: int):
        self.user = User.objects.get(pk=pk)

    def set_name(self, f_name, l_name):
        self.user.f_name = f_name
        self.user.l_name = l_name

        self.user.save()

    def set_address(self, address):
        self.user.address = address

        self.user.save()

    def set_profile(self, photo_url, user_bio):
        self.user.photo_url = photo_url
        self.user.user_bio = user_bio

        self.user.save()

    def set_admin(self):
        self.user.role = "admin"

        self.user.save()

    def set_neighbor(self):
        self.user.role = "neighbor"

        self.user.save()

    def set_neighborhood(self, neighborhood):
        self.user.neighborhood = neighborhood

        self.user.save()


class TrustFeedbackViews:
    def __init__(self, pk: int):
        self.tfv = TrustFeedback.objects.get(pk=pk)
        self.transaction: Transaction = self.tfv.transaction
        self.lender: User = self.tfv.lender
        self.borrower: User = self.tfv.borrower

    # Calculating user trust fields for a user
    def calc_trust_fields(self, user: User):
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


class ListingViews:
    pass


class NeighborhoodViews:
    pass


class ChatViews:
    pass


class MessageViews:
    pass


class ItemViews:
    pass


class SkillViews:
    pass
