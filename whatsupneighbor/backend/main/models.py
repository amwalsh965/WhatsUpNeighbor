from django import forms
from django.db import models
from django.contrib.auth.models import User


class Status(models.TextChoices):
    OPEN = "open", "Open"
    IN_PROGRESS = "in_progress", "In Progress"
    COMPLETED = "completed", "Completed"
    CLOSED = "closed", "Closed"


class TrustFeedback(models.Model):

    class ReturnTimeliness(models.TextChoices):
        ON_TIME = "on_time", "On Time"
        LATE = "late", "Late"

    class ItemCondition(models.TextChoices):
        GOOD = "good", "Good"
        DAMAGED = "damaged", "Damaged"

    transaction = models.ForeignKey(
        "Transaction",
        related_name="transaction",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    borrower = models.ForeignKey(
        "Profile", related_name="borrower_trust", on_delete=models.CASCADE
    )
    lender = models.ForeignKey(
        "Profile", related_name="lender_trust", on_delete=models.CASCADE
    )
    item_returned = models.BooleanField(default=False)
    return_timeliness = models.CharField(
        max_length=7, choices=ReturnTimeliness.choices, default=ReturnTimeliness.LATE
    )
    item_condition = models.CharField(
        max_length=7, choices=ItemCondition.choices, default=ItemCondition.DAMAGED
    )
    rating_score = models.IntegerField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.pk} {self.transaction} {self.lender} {self.rating_score}"


class Transaction(models.Model):

    listing = models.ForeignKey("Listing", on_delete=models.CASCADE)
    lender = models.ForeignKey(
        "Profile", related_name="lending_transaction", on_delete=models.CASCADE
    )
    borrower = models.ForeignKey(
        "Profile", related_name="borrowing_transaction", on_delete=models.CASCADE
    )
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(
        max_length=12, choices=Status.choices, default=Status.IN_PROGRESS
    )

    def __str__(self):
        return f"{self.pk} {self.listing} {self.lender} {self.borrower}"


class Address(models.Model):
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default="USA")

    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def full_address(self):
        return (
            f"{self.street}, {self.city}, {self.state} {self.zip_code}, {self.country}"
        )

    def __str__(self):
        return self.full_address()


# Might change to form.Forms
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.ForeignKey(Address, on_delete=models.CASCADE)
    neighborhood = models.ForeignKey("Neighborhood", on_delete=models.CASCADE)
    photo = models.ImageField(upload_to="profile_images/", blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    website = models.CharField(max_length=100, blank=True, null=True)

    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        NEIGHBOR = "neighbor", "Neighbor"

    role = models.CharField(max_length=8, choices=Role.choices, default=Role.ADMIN)

    # Trust fields
    trust_rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    trust_total_transactions = models.IntegerField(default=0)
    trust_returns_missing = models.IntegerField(default=0)
    trust_damaged_count = models.IntegerField(default=0)
    trust_late_count = models.IntegerField(default=0)
    trust_last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} ({self.user.first_name})"


class Neighborhood(models.Model):
    name = models.CharField(max_length=100)
    address = models.ForeignKey(Address, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.pk} {self.name}"


class Listing(models.Model):
    class Type(models.TextChoices):
        OFFER = "offer", "Offer"
        REQUEST = "request", "Request"

    EXTRA_STATUS_CHOICES = Status.choices + [
        ("unavailable", "Unavailable"),
    ]

    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    type = models.CharField(max_length=7, choices=Type.choices, default=Type.REQUEST)
    item = models.ForeignKey("Item", on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=150)
    listing_bio = models.TextField()
    status = models.CharField(
        max_length=15, choices=EXTRA_STATUS_CHOICES, default=Status.OPEN
    )
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    neighborhood = models.ForeignKey(Neighborhood, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.pk}"


class Chat(models.Model):

    class ChatStatus(models.TextChoices):
        ACTIVE = "active", "Active"
        PENDING = "pending", "Pending"
        ARCHIVED = "archived", "Archived"

    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    chat_creation = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=8, choices=ChatStatus.choices, default=ChatStatus.PENDING
    )

    def __str__(self):
        return f"{self.pk}"


class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE)
    content = models.TextField()
    transaction = models.ForeignKey(
        Transaction, null=True, blank=True, on_delete=models.CASCADE
    )
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"{self.pk}"


class ItemStatus(models.TextChoices):
    AVAILABLE = "available", "Available"
    TAKEN = "taken", "Taken"


class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)
    status = models.CharField(
        max_length=50, choices=ItemStatus.choices, default=ItemStatus.AVAILABLE
    )
    photo = models.ImageField(upload_to="item_images/", blank=True, null=True)

    def __str__(self):
        return f"{self.pk}"


class Events(models.Model):
    title = models.CharField(max_length=255)
    photo = models.ImageField("event_images/", null=True, blank=True)
    date = models.DateTimeField()
    address = models.ForeignKey(Address, on_delete=models.CASCADE)
    description = models.TextField()
    host = models.ForeignKey(Profile, on_delete=models.CASCADE)


class EventSignUp(models.Model):
    event = models.ForeignKey(Events, on_delete=models.CASCADE)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("event", "user")


class SavedListing(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    saved_At = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "listing")

    def __str__(self):
        return f"{self.user} saved {self.listing}"
