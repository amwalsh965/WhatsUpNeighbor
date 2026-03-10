import random
from main.models import *
from django.utils import timezone


def create_events():
    eventTypes = [
        "Community",
        "Private",
        "Sale",
        "Volunteer",
        "Sports",
        "Workshop",
        "Festival",
        "Fundraiser",
        "Networking",
        "Food Drive",
        "Art Show",
        "Farmers Market",
        "Yoga Session",
        "Book Club",
        "Music Night",
        "Tech Meetup",
        "Outdoor Movie",
        "Charity Run",
        "Block party :)",
        "Birthday Party",
    ]

    locations = [
        "Maple St",
        "Oak Ave",
        "Central Park",
        "Riverfront",
        "City Hall",
        "Community Center",
        "Lakeside Pavilion",
        "Sunset Park",
        "Downtown Plaza",
        "Library Hall",
        "Highland Field",
        "Greenwood Garden",
        "Pine Street",
        "Hilltop Terrace",
        "Westside Court",
        "North End Park",
        "Harbor Walk",
        "Riverside Drive",
        "Eastwood Center",
    ]

    eventDescriptions = [
        "Meet your neighbors and build stronger connections.",
        "A fun and engaging local experience for all ages.",
        "Bring friends and family for a memorable evening.",
        "Support a great cause and make a difference.",
        "Enjoy food, music, and entertainment.",
        "Expand your network and learn something new.",
    ]

    itemNames = [
        "Ladder",
        "Drill",
        "Kayak",
        "Camera",
        "Tent",
        "Bike",
        "Projector",
        "Table",
        "Speakers",
        "Grill",
        "Snow Blower",
        "Pressure Washer",
        "Camping Stove",
        "Generator",
        "Power Saw",
        "Lawn Mower",
        "Fishing Rod",
        "Basketball Hoop",
        "Air Pump",
        "Extension Cord",
        "Tool Kit",
        "Car Jack",
        "Folding Chairs",
        "Cooler",
        "Hedge Trimmer",
    ]

    owners = [host for host in Profile.objects.all()]

    for i in range(len(eventTypes)):
        for j in range(len(locations)):
            for k in range(len(eventDescriptions)):
                Events.objects.create(
                    title=eventTypes[i],
                    address=Address.objects.get(pk=102),
                    date=timezone.now(),
                    description=eventDescriptions[k],
                    host=owners[random.randint(1, len(owners)) - 1],
                )
