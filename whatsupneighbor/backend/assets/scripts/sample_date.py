from datetime import timedelta
import random
import time

import requests
from main.models import *
from django.utils import timezone


def create_points():

    def geocode_address(street, city, state, zip_code, country):
        query = f"{street}, {city}, {state}, {zip_code}, {country}"
        print(query)
        url = "https://nominatim.openstreetmap.org/search"
        params = {"q": query, "format": "json", "limit": 1}
        headers = {"User-Agent": "my-app"}
        try:
            print(1)
            res = requests.get(url, params=params, headers=headers, timeout=10)
            res.raise_for_status()
            data = res.json()
            print(data)
            print(2)
            if not data:
                return None
            return float(data[0]["lat"]), float(data[0]["lon"])
        except (requests.RequestException, ValueError) as e:
            print(3)
            print("Geocode error:", e)
            return None

    address_objects = Address.objects.all()

    for i, address_object in enumerate(address_objects):
        if i <= 31:
            continue
        try:
            lat1, lon1 = geocode_address(
                address_object.street,
                address_object.city,
                address_object.state,
                address_object.zip_code,
                address_object.country,
            )
            time.sleep(3)
            address_object.latitude = lat1
            address_object.longitude = lon1
            address_object.save()
            print("found geolocation", i + 1)
        except:
            print("geolocation not found", i + 1)


def import_all_sample_data():
    from main.models import Address

    addresses = [
        ("1243 W Boston Blvd", "Detroit", "MI", "48202"),
        ("5821 Livernois Ave", "Detroit", "MI", "48210"),
        ("9123 Strathcona Dr", "Detroit", "MI", "48221"),
        ("6732 McNichols Rd", "Detroit", "MI", "48221"),
        ("4510 Woodward Ave", "Detroit", "MI", "48201"),
        ("3327 Trumbull St", "Detroit", "MI", "48208"),
        ("2184 Rosa Parks Blvd", "Detroit", "MI", "48216"),
        ("7640 Seven Mile Rd", "Detroit", "MI", "48221"),
        ("4901 Grand River Ave", "Detroit", "MI", "48208"),
        ("2900 Cass Ave", "Detroit", "MI", "48201"),
        ("412 W Liberty St", "Ann Arbor", "MI", "48103"),
        ("702 S Ashley St", "Ann Arbor", "MI", "48104"),
        ("1345 Pauline Blvd", "Ann Arbor", "MI", "48103"),
        ("825 Packard St", "Ann Arbor", "MI", "48104"),
        ("2903 Dexter Rd", "Ann Arbor", "MI", "48103"),
        ("1187 Huron Pkwy", "Ann Arbor", "MI", "48105"),
        ("400 Miller Ave", "Ann Arbor", "MI", "48103"),
        ("1520 Washtenaw Ave", "Ann Arbor", "MI", "48104"),
        ("2665 Plymouth Rd", "Ann Arbor", "MI", "48105"),
        ("523 Maple Rd", "Ann Arbor", "MI", "48103"),
        ("1342 Lake Dr SE", "Grand Rapids", "MI", "49506"),
        ("908 Wealthy St SE", "Grand Rapids", "MI", "49506"),
        ("311 Fuller Ave NE", "Grand Rapids", "MI", "49503"),
        ("762 Leonard St NW", "Grand Rapids", "MI", "49504"),
        ("522 Diamond Ave NE", "Grand Rapids", "MI", "49503"),
        ("240 Union Ave SE", "Grand Rapids", "MI", "49503"),
        ("1732 Plainfield Ave NE", "Grand Rapids", "MI", "49505"),
        ("1890 Kalamazoo Ave SE", "Grand Rapids", "MI", "49507"),
        ("950 Cherry St SE", "Grand Rapids", "MI", "49506"),
        ("431 Bridge St NW", "Grand Rapids", "MI", "49504"),
        ("1500 W Michigan Ave", "Lansing", "MI", "48915"),
        ("223 S Cedar St", "Lansing", "MI", "48912"),
        ("640 E Saginaw St", "Lansing", "MI", "48906"),
        ("1125 N Washington Ave", "Lansing", "MI", "48906"),
        ("735 Kalamazoo St", "Lansing", "MI", "48912"),
        ("4901 S Martin Luther King Jr Blvd", "Lansing", "MI", "48910"),
        ("1820 E Grand River Ave", "Lansing", "MI", "48912"),
        ("3415 W St Joseph St", "Lansing", "MI", "48917"),
        ("711 N Pennsylvania Ave", "Lansing", "MI", "48906"),
        ("2950 Delta River Dr", "Lansing", "MI", "48906"),
        ("842 Orchard Lake Rd", "Pontiac", "MI", "48341"),
        ("3315 Elizabeth Lake Rd", "Waterford", "MI", "48328"),
        ("5712 Dixie Hwy", "Clarkston", "MI", "48346"),
        ("4045 Baldwin Rd", "Auburn Hills", "MI", "48326"),
        ("2920 Crooks Rd", "Troy", "MI", "48084"),
        ("1560 Adams Rd", "Rochester Hills", "MI", "48309"),
        ("910 Opdyke Rd", "Auburn Hills", "MI", "48326"),
        ("2840 Walton Blvd", "Rochester Hills", "MI", "48309"),
        ("4700 Sashabaw Rd", "Clarkston", "MI", "48346"),
        ("3650 Joslyn Rd", "Orion Township", "MI", "48360"),
    ]

    address_objects = []
    for street, city, state, zip_code in addresses:
        address = Address.objects.create(
            street=street, city=city, state=state, zip_code=zip_code, country="USA"
        )

        address_objects.append(address)

    address1 = Address.objects.create(
        street="7432 Foxburg Ct",
        city="Clarkston",
        state="MI",
        zip_code="48348",
        country="USA",
    )

    print("Addresses added successfully.")

    # Neighborhoods
    neighborhood1 = Neighborhood.objects.create(
        name="Neighborhood A", address=random.choice(address_objects)
    )
    neighborhood2 = Neighborhood.objects.create(
        name="Neighborhood B", address=random.choice(address_objects)
    )
    neighborhood3 = Neighborhood.objects.create(
        name="Neighborhood C", address=random.choice(address_objects)
    )
    neighborhood4 = Neighborhood.objects.create(
        name="Neighborhood C", address=random.choice(address_objects)
    )
    neighborhood5 = Neighborhood.objects.create(
        name="Neighborhood D", address=random.choice(address_objects)
    )
    neighborhood6 = Neighborhood.objects.create(
        name="Neighborhood E", address=random.choice(address_objects)
    )
    neighborhood7 = Neighborhood.objects.create(
        name="Neighborhood F", address=random.choice(address_objects)
    )
    neighborhood8 = Neighborhood.objects.create(
        name="Neighborhood G", address=random.choice(address_objects)
    )
    neighborhood9 = Neighborhood.objects.create(
        name="Neighborhood H", address=random.choice(address_objects)
    )
    neighborhood10 = Neighborhood.objects.create(
        name="Neighborhood I", address=random.choice(address_objects)
    )

    first_names = ["Alice", "Bob", "Charlie", "Danielle", "Evan", "Sophia"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones"]
    neighborhoods = list(Neighborhood.objects.all())

    profile_list = []
    for i in range(10):
        username = f"user{i+1}"
        password = "password123"
        email = f"{username}@example.com"

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=random.choice(first_names),
            last_name=random.choice(last_names),
        )

        profile = Profile.objects.create(
            user=user,
            address=address1,
            neighborhood=random.choice(neighborhoods),
            bio="This is a sample bio.",
            role="neighbor",
            trust_rating=5,
            trust_total_transactions=0,
            trust_returns_missing=0,
            trust_damaged_count=0,
            trust_late_count=0,
            trust_last_updated=timezone.now(),
        )
        profile_list.append(profile)

    # Items
    item1 = Item.objects.create(
        name="Canoe", description="I'm a canoe", category="Boat", status="taken"
    )
    item2 = Item.objects.create(
        name="Kayak", description="I'm a kayak", category="Boat", status="taken"
    )
    item3 = Item.objects.create(
        name="Among Us", description="I'm an among us", category="Among Us"
    )
    item4 = Item.objects.create(
        name="Item 4", description="Item 4", category="Item 4", status="taken"
    )
    item5 = Item.objects.create(
        name="Item 5", description="Item 5", category="Item 5", status="taken"
    )
    item6 = Item.objects.create(
        name="Item 6", description="Item 6", category="Item 6", status="taken"
    )
    item7 = Item.objects.create(
        name="Item 7", description="Item 7", category="Item 7", status="taken"
    )
    item8 = Item.objects.create(
        name="Item 8", description="Item 8", category="Item 8", status="taken"
    )
    item9 = Item.objects.create(
        name="Item 9", description="Item 9", category="Item 9", status="taken"
    )
    item10 = Item.objects.create(
        name="Item 10", description="Item 10", category="Item 10", status="taken"
    )

    # Listings
    listing1 = Listing.objects.create(
        user=profile_list[0],
        type="offer",
        item=item1,
        title="I have among us",
        listing_bio="Really really need and among us",
        status="in progress",
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        image_url="bungus.jpg",
        neighborhood=neighborhood1,
    )
    listing2 = Listing.objects.create(
        user=profile_list[1],
        type="request",
        item=item1,
        title="I have among us",
        listing_bio="Really really need and among us",
        status="in progress",
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        image_url="bungus.jpg",
        neighborhood=neighborhood1,
    )
    listing3 = Listing.objects.create(
        user=profile_list[2],
        type="offer",
        item=item2,
        title="I have among us",
        listing_bio="Really really need and among us",
        status="in progress",
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        image_url="bungus.jpg",
        neighborhood=neighborhood2,
    )
    listing4 = Listing.objects.create(
        user=profile_list[3],
        type="offer",
        item=item2,
        title="I have among us",
        listing_bio="Really really need and among us",
        status="in progress",
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        image_url="bungus.jpg",
        neighborhood=neighborhood3,
    )
    listing5 = Listing.objects.create(
        user=profile_list[4],
        type="offer",
        item=item3,
        title="I have among us",
        listing_bio="Really really need and among us",
        status="in progress",
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        image_url="bungus.jpg",
        neighborhood=neighborhood2,
    )
    listing6 = Listing.objects.create(
        user=profile_list[5],
        type="offer",
        item=item3,
        title="I have among us",
        listing_bio="Really really need and among us",
        status="in progress",
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        image_url="bungus.jpg",
        neighborhood=neighborhood3,
    )

    listing7 = Listing.objects.create(
        user=profile_list[7],
        type="offer",
        item=item4,
        title="I have an offer",
        listing_bio="Really really need some thing",
        status="in progress",
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        image_url="bungus.jpg",
        neighborhood=neighborhood7,
    )

    listing8 = Listing.objects.create(
        user=profile_list[7],
        type="offer",
        item=item5,
        title="I have an offer",
        listing_bio="Really really need some thing",
        status="in progress",
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        image_url="bungus.jpg",
        neighborhood=neighborhood10,
    )
    listing9 = Listing.objects.create(
        user=profile_list[9],
        type="offer",
        item=item6,
        title="I have an offer",
        listing_bio="Really really need some thing",
        status="in progress",
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        image_url="bungus.jpg",
        neighborhood=neighborhood10,
    )
    listing10 = Listing.objects.create(
        user=profile_list[9],
        type="offer",
        item=item7,
        title="I have an offer",
        listing_bio="Really really need some thing",
        status="in progress",
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        image_url="bungus.jpg",
        neighborhood=neighborhood10,
    )

    # Transaction
    transaction1 = Transaction.objects.create(
        listing=listing1,
        lender=profile_list[0],
        borrower=profile_list[1],
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        status="open",
    )

    transaction2 = Transaction.objects.create(
        listing=listing2,
        lender=profile_list[1],
        borrower=profile_list[0],
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        status="in_progress",
    )

    transaction3 = Transaction.objects.create(
        listing=listing3,
        lender=profile_list[6],
        borrower=profile_list[4],
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        status="completed",
    )

    transaction4 = Transaction.objects.create(
        listing=listing4,
        lender=profile_list[2],
        borrower=profile_list[3],
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        status="open",
    )

    transaction5 = Transaction.objects.create(
        listing=listing5,
        lender=profile_list[5],
        borrower=profile_list[0],
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        status="in_progress",
    )

    transaction6 = Transaction.objects.create(
        listing=listing6,
        lender=profile_list[2],
        borrower=profile_list[5],
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        status="completed",
    )

    transaction7 = Transaction.objects.create(
        listing=listing7,
        lender=profile_list[7],
        borrower=profile_list[8],
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        status="completed",
    )

    transaction8 = Transaction.objects.create(
        listing=listing8,
        lender=profile_list[7],
        borrower=profile_list[8],
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        status="completed",
    )

    transaction9 = Transaction.objects.create(
        listing=listing9,
        lender=profile_list[8],
        borrower=profile_list[9],
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        status="completed",
    )

    transaction10 = Transaction.objects.create(
        listing=listing10,
        lender=profile_list[9],
        borrower=profile_list[7],
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        status="completed",
    )

    # TrustFeedback
    trust_feedback1 = TrustFeedback.objects.create(
        transaction=transaction1,
        lender=transaction1.lender,
        borrower=transaction1.borrower,
        item_returned=True,
        return_timeliness="on_time",
        item_condition="good",
        rating_score="5",
        timestamp=timezone.now() + timedelta(days=1),
    )

    trust_feedback2 = TrustFeedback.objects.create(
        transaction=transaction2,
        lender=transaction2.lender,
        borrower=transaction2.borrower,
        item_returned=False,
        return_timeliness="late",
        item_condition="bad",
        rating_score="0",
        timestamp=timezone.now() + timedelta(days=1),
    )

    trust_feedback3 = TrustFeedback.objects.create(
        transaction=transaction3,
        lender=transaction3.lender,
        borrower=transaction3.borrower,
        item_returned=True,
        return_timeliness="on_time",
        item_condition="good",
        rating_score="3",
        timestamp=timezone.now() + timedelta(days=1),
    )

    trust_feedback4 = TrustFeedback.objects.create(
        transaction=transaction4,
        lender=transaction4.lender,
        borrower=transaction4.borrower,
        item_returned=True,
        return_timeliness="on_time",
        item_condition="bad",
        rating_score="4",
        timestamp=timezone.now() + timedelta(days=1),
    )

    trust_feedback5 = TrustFeedback.objects.create(
        transaction=transaction5,
        lender=transaction5.lender,
        borrower=transaction5.borrower,
        item_returned=True,
        return_timeliness="late",
        item_condition="bad",
        rating_score="1",
        timestamp=timezone.now() + timedelta(days=1),
    )

    trust_feedback6 = TrustFeedback.objects.create(
        transaction=transaction6,
        lender=transaction6.lender,
        borrower=transaction6.borrower,
        item_returned=True,
        return_timeliness="on_time",
        item_condition="good",
        rating_score="5",
        timestamp=timezone.now() + timedelta(days=1),
    )

    trust_feedback7 = TrustFeedback.objects.create(
        transaction=transaction7,
        lender=transaction7.lender,
        borrower=transaction7.borrower,
        item_returned=True,
        return_timeliness="on_time",
        item_condition="good",
        rating_score="5",
        timestamp=timezone.now() + timedelta(days=1),
    )

    trust_feedback8 = TrustFeedback.objects.create(
        transaction=transaction8,
        lender=transaction8.lender,
        borrower=transaction8.borrower,
        item_returned=True,
        return_timeliness="on_time",
        item_condition="good",
        rating_score="5",
        timestamp=timezone.now() + timedelta(days=1),
    )

    trust_feedback9 = TrustFeedback.objects.create(
        transaction=transaction9,
        lender=transaction9.lender,
        borrower=transaction9.borrower,
        item_returned=True,
        return_timeliness="on_time",
        item_condition="good",
        rating_score="5",
        timestamp=timezone.now() + timedelta(days=1),
    )

    trust_feedback10 = TrustFeedback.objects.create(
        transaction=transaction10,
        lender=transaction10.lender,
        borrower=transaction10.borrower,
        item_returned=True,
        return_timeliness="on_time",
        item_condition="good",
        rating_score="5",
        timestamp=timezone.now() + timedelta(days=1),
    )

    # Chat
    chat1 = Chat.objects.create(
        transaction=transaction1, chat_creation=timezone.now(), status="active"
    )

    chat2 = Chat.objects.create(
        transaction=transaction2,
        chat_creation=timezone.now(),
        status="active",
    )

    chat3 = Chat.objects.create(
        transaction=transaction3,
        chat_creation=timezone.now(),
        status="pending",
    )

    chat4 = Chat.objects.create(
        transaction=transaction4,
        chat_creation=timezone.now(),
        status="pending",
    )

    chat5 = Chat.objects.create(
        transaction=transaction5,
        chat_creation=timezone.now(),
        status="archieved",
    )

    chat6 = Chat.objects.create(
        transaction=transaction6,
        chat_creation=timezone.now(),
        status="archieved",
    )

    chat7 = Chat.objects.create(
        transaction=transaction7,
        chat_creation=timezone.now(),
        status="archieved",
    )

    chat8 = Chat.objects.create(
        transaction=transaction8,
        chat_creation=timezone.now(),
        status="archieved",
    )

    chat9 = Chat.objects.create(
        transaction=transaction9,
        chat_creation=timezone.now(),
        status="archieved",
    )

    chat10 = Chat.objects.create(
        transaction=transaction10,
        chat_creation=timezone.now(),
        status="archieved",
    )

    # Messages
    message1 = Message.objects.create(
        chat=chat1,
        sender=chat1.transaction.lender,
        content="Among Us",
        timestamp=timezone.now(),
    )

    message2 = Message.objects.create(
        chat=chat1,
        sender=chat1.transaction.lender,
        content="Among Us",
        timestamp=timezone.now(),
    )
    message3 = Message.objects.create(
        chat=chat1,
        sender=chat1.transaction.borrower,
        content="Among Us",
        timestamp=timezone.now(),
    )
    message4 = Message.objects.create(
        chat=chat1,
        sender=chat1.transaction.borrower,
        content="Among Us",
        timestamp=timezone.now(),
    )

    message5 = Message.objects.create(
        chat=chat2,
        sender=chat2.transaction.lender,
        content="Among Us",
        timestamp=timezone.now(),
    )

    message6 = Message.objects.create(
        chat=chat2,
        sender=chat2.transaction.lender,
        content="Among Us",
        timestamp=timezone.now(),
    )
    message7 = Message.objects.create(
        chat=chat2,
        sender=chat2.transaction.borrower,
        content="Among Us",
        timestamp=timezone.now(),
    )
    message8 = Message.objects.create(
        chat=chat2,
        sender=chat2.transaction.borrower,
        content="Among Us",
        timestamp=timezone.now(),
    )

    message9 = Message.objects.create(
        chat=chat9,
        sender=chat9.transaction.borrower,
        content="Among Us",
        timestamp=timezone.now(),
    )
    message10 = Message.objects.create(
        chat=chat10,
        sender=chat10.transaction.borrower,
        content="Among Us",
        timestamp=timezone.now(),
    )
