from datetime import timedelta
from django.utils import timezone
from pydantic_core import ValidationError
from .models import *


class TransactionViews:

    LISTING_UNAVAILABLE = "unavailable"

    def __init__(self, pk: int):
        self.transaction = Transaction.objects.get(pk=pk)

    def create_transaction(
        self,
        listing: Listing,
        borrower: User,
        start_date=None,
        end_date=None,
        status: str = Status.IN_PROGRESS,
    ) -> Transaction:
        """
        Creates a new transaction, locks the listing,
        and creates a chat between the lender and borrower
        for the transaction.
        """
        if start_date is None:
            start_date = timezone.now()
        if end_date is None:
            end_date = start_date + timedelta(days=1)

        if start_date >= end_date:
            raise ValidationError("start_date must be before end_date.")

        with Transaction.atomic():
            locked_listing = Listing.objects.select_for_update().get(pk=listing.pk)

            if locked_listing.status != Status.OPEN:
                raise ValidationError("Listing is not available.")

            if borrower.pk == locked_listing.user_id:
                raise ValidationError("Cannot complete a transaction with yourself.")

            # Keeps transactions according to availability
            if (
                start_date < locked_listing.start_date
                or end_date > locked_listing.end_date
            ):
                raise ValidationError(
                    "Transaction dates must be within the listing start or end dates."
                )

            # Locks the selected listing
            locked_listing.status = self.LISTING_UNAVAILABLE
            locked_listing.save()

            new_tx = Transaction.objects.create(
                listing=locked_listing,
                lender=locked_listing.user,
                borrower=borrower,
                start_date=start_date,
                end_date=end_date,
                status=status,
            )

            Chat.objects.create(transaction=new_tx)
            return new_tx

    def update_transaction(
        self,
        start_date=None,
        end_date=None,
        status: str = None,
        borrower: User = None,
    ) -> Transaction:
        if start_date is not None:
            self.transaction.start_date = start_date
        if end_date is not None:
            self.transaction.end_date = end_date

        if (start_date is not None) or (end_date is not None):
            if self.transaction.start_date >= self.transaction.end_date:
                raise ValidationError("start_date must be before end_date.")

        if status is not None:
            self.transaction.status = status
        if borrower is not None:
            self.transaction.borrower = borrower

        self.transaction.save()
        return self.transaction

    def complete_transaction(self, acting_user: User) -> Transaction:
        """
        Mark transaction completed & unlock listing.
        """
        with Transaction.atomic():
            tx = Transaction.objects.select_for_update().get(pk=self.transaction.pk)

            if tx.status == Status.COMPLETED:
                self.transaction = tx
                return tx

            if acting_user.pk not in (tx.lender_id, tx.borrower_id):
                raise ValidationError("Not authorized to complete this transaction.")

            listing = Listing.objects.select_for_update().get(pk=tx.listing_id)

            tx.status = Status.COMPLETED
            tx.save()


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
    def __init__(self, pk: int):
        self.listing = Listing.objects.get(pk=pk)

    def create_listing(
        self,
        owner: User,
        title: str,
        listing_bio: str,
        photo_url: str,
        listing_type: str = Listing.Type.REQUEST,
        item: Item = None,
        skill: Skill = None,
        status: str = Status.OPEN,
    ):
        new_listing = Listing.objects.create(
            user=owner,
            title=title,
            listing_bio=listing_bio,
            image_url=photo_url,
            type=listing_type,
            item=item,
            skill=skill,
            start_date=timezone.now(),
            end_date=timezone.now()
            + timedelta(days=7),  # end dates are defaulted to 7 days out
            status=status,
            neighborhood=owner.neighborhood,
        )
        new_listing.save()
        return new_listing

    def update_listing(
        self,
        title: str = None,
        listing_bio: str = None,
        photo_url: str = None,
        listing_type: str = None,
        status: str = None,
        item: Item = None,
        skill: Skill = None,
    ):
        if title:
            self.listing.title = title
        if listing_bio:
            self.listing.listing_bio = listing_bio
        if photo_url:
            self.listing.image_url = photo_url
        if listing_type:
            self.listing.type = listing_type
        if status:
            self.listing.status = status
        if item is not None:
            self.listing.item = item
        if skill is not None:
            self.listing.skill = skill

        self.listing.save()
        return self.listing

    def delete_listing(self):
        self.listing.delete()
        return True


class NeighborhoodViews:
    def __init__(self, pk: int):
        try:
            self.neighborhood = Neighborhood.objects.get(pk=pk)
    
        except Neighborhood.DoesNotExist:
            self.neighborhood = None

    # get listings for a neighborhood
    def get_listings(self):
        return Listing.objects.filter(neighborhood = self.neighborhood.pk)  

    #get users for a neighborhood
    def get_users(self):
        return User.objects.filter(neighborhood = self.neighborhood.pk)   
            
      

class ChatViews:
    def __init__(self, pk: int):
        try:
            self.chat = Chat.objects.get(pk=pk)
        except Chat.DoesNotExist:
            self.chat = None

    def transactionChat(transaction_id):
        return Chat.objects.filter(transaction_id = transaction_id)

    def get_chat(self):
        return self.chat


class MessageViews:
    def __init__(self, pk: int):
        try:
            self.message = Message.objects.get(pk=pk)
        except Message.DoesNotExist:
            self.message = None

    def create_message(self, chat: Chat, sender: User, content: str, timestamp=None):
        if timestamp is None:
            timestamp = timezone.now()
        new_message = Message.objects.create(
            chat=chat, sender=sender, content=content, timestamp=timestamp
        )
        new_message.save()
        return new_message

    def update_message(self, content: str):
        self.message.content = content 
        self.message.timestamp = timezone.now()
        self.message.save()
        return self.message
    
    def get_messages_by_chat(self, chat_id):
        return Message.objects.filter(chat_id=chat_id).order_by("timestamp")

    def delete_message(self):
        self.message.delete()
        self.message = None
        return True

class ItemViews:
    pass


class SkillViews:
    pass
