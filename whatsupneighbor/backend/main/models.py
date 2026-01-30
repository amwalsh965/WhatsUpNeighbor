from django.db import models

# Create your models here.


# How to make a basic class
class ExampleModel(models.Model):
    """
    Docstring for ExampleModel
    """

    # Name of table
    name = "Example Table"

    # fields
    # CharFields have to be declaired with a default and max_length parameter
    field1 = models.CharField(default="", max_length=100)

    # IntegerFields don't have to be declared with anything, but all fields have an optional blank and null
    field2 = models.IntegerField(blank=True, null=True, default=0)

    # Decimal fields have to have the decimal_places parameter, and max_digits parameter
    # help text can be written for develpers, the String in the beginning (Field 3) is used for forms
    field3 = models.DecimalField(
        "Field 3",
        decimal_places=2,
        max_digits=10,
        default=0,
        help_text="Help text here",
    )

    # Meta class can be made where info about the table itself is stored
    class Meta:
        verbose_name = "Example Model"
        verbose_name_plural = "Example Models"

    # Class specific functions can be declared here as well, functions that use multiple tables are
    # more easily created in a separate "view_utils" file
    def __str__(self):
        return f"This is the Example Table"


class ExampleModel2(models.Model):
    # Foreign Key Fields only have to have the FKey model, and the on_delete parameter
    foreignKeyField = models.ForeignKey(
        "ExampleModel", verbose_name="Example", null=True, on_delete=models.CASCADE
    )
