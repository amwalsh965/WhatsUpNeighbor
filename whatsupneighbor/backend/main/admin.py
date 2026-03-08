from django.contrib import admin

# models must be imported before being used
from .models import *


@admin.register(ExampleModel)
class ExampleModelAdmin(admin.ModelAdmin):
    pass


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    pass


@admin.register(TrustFeedback)
class TrustFeedbackAdmin(admin.ModelAdmin):
    pass


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    pass


@admin.register(Neighborhood)
class NeighborhoodAdmin(admin.ModelAdmin):
    pass


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    pass


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    pass


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    pass


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    pass
