from django.contrib import admin

# models must be imported before being used
from .models import ExampleModel, ExampleModel2


@admin.register(ExampleModel)
class ExampleModelAdmin(admin.ModelAdmin):
    list_display = ("field1", "field2", "field3")
