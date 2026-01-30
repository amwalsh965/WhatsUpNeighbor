from .models import ExampleModel


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
