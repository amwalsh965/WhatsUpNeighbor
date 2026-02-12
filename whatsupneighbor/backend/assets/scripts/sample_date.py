from datetime import timedelta
from main.models import *
from django.utils import timezone


def import_all_sample_data():

    # Neighborhoods
    # neighborhood1 = Neighborhood.objects.create(name="Neighborhood A", zip=48348)

    # neighborhood2 = Neighborhood.objects.create(name="Neighborhood B", zip=48346)

    # neighborhood3 = Neighborhood.objects.create(name="Neighborhood C", zip=93849)

    neighborhood4 = Neighborhood.objects.create(name="Neighborhood C", zip=48348)
    neighborhood5 = Neighborhood.objects.create(name="Neighborhood D", zip=48348)
    neighborhood6 = Neighborhood.objects.create(name="Neighborhood E", zip=48348)
    neighborhood7 = Neighborhood.objects.create(name="Neighborhood F", zip=48348)
    neighborhood8 = Neighborhood.objects.create(name="Neighborhood G", zip=48348)
    neighborhood9 = Neighborhood.objects.create(name="Neighborhood H", zip=48348)
    neighborhood10 = Neighborhood.objects.create(name="Neighborhood I", zip=48348)

    # Users
    # user1 = User.objects.create(
    #     f_name="Adam",
    #     l_name="Walsh",
    #     address="7432 Foxburg Ct. Clarkston, MI, 48348",
    #     neighborhood=neighborhood1,
    #     photo_url="Sample URL",
    #     user_bio="I am a user",
    #     role="admin",
    #     trust_rating=5,
    #     trust_total_transactions=0,
    #     trust_returns_missing=0,
    #     trust_damaged_count=0,
    #     trust_late_count=0,
    #     trust_last_updated=timezone.now(),
    # )
    # user2 = User.objects.create(
    #     f_name="Danielle",
    #     l_name="Pagano",
    #     address="777 Brockton Avenue, Abington MA 2351",
    #     neighborhood=neighborhood2,
    #     photo_url="Sample URL",
    #     user_bio="I am a user",
    #     role="admin",
    #     trust_rating=5,
    #     trust_total_transactions=0,
    #     trust_returns_missing=0,
    #     trust_damaged_count=0,
    #     trust_late_count=0,
    #     trust_last_updated=timezone.now(),
    # )
    # user3 = User.objects.create(
    #     f_name="Izabela",
    #     l_name="Camaj",
    #     address="66-4 Parkhurst Rd, Chelmsford MA 1824",
    #     neighborhood=neighborhood2,
    #     photo_url="Sample URL",
    #     user_bio="I am a user",
    #     role="admin",
    #     trust_rating=5,
    #     trust_total_transactions=0,
    #     trust_returns_missing=0,
    #     trust_damaged_count=0,
    #     trust_late_count=0,
    #     trust_last_updated=timezone.now(),
    # )
    # user4 = User.objects.create(
    #     f_name="Evan",
    #     l_name="Dallas",
    #     address="700 Oak Street, Brockton MA 2301",
    #     neighborhood=neighborhood3,
    #     photo_url="Sample URL",
    #     user_bio="I am a user",
    #     role="admin",
    #     trust_rating=5,
    #     trust_total_transactions=0,
    #     trust_returns_missing=0,
    #     trust_damaged_count=0,
    #     trust_late_count=0,
    #     trust_last_updated=timezone.now(),
    # )
    # user5 = User.objects.create(
    #     f_name="Sayman",
    #     l_name="Zaya",
    #     address="250 Hartford Avenue, Bellingham MA 2019",
    #     neighborhood=neighborhood3,
    #     photo_url="Sample URL",
    #     user_bio="I am a user",
    #     role="admin",
    #     trust_rating=5,
    #     trust_total_transactions=0,
    #     trust_returns_missing=0,
    #     trust_damaged_count=0,
    #     trust_late_count=0,
    #     trust_last_updated=timezone.now(),
    # )
    # user6 = User.objects.create(
    #     f_name="John",
    #     l_name="Doe",
    #     address="30 Memorial Drive, Avon MA 2322",
    #     neighborhood=neighborhood1,
    #     photo_url="Sample URL",
    #     user_bio="I am a user",
    #     role="neighbor",
    #     trust_rating=5,
    #     trust_total_transactions=0,
    #     trust_returns_missing=0,
    #     trust_damaged_count=0,
    #     trust_late_count=0,
    #     trust_last_updated=timezone.now(),
    # )
    # user7 = User.objects.create(
    #     f_name="Mike",
    #     l_name="Oxlong",
    #     address="591 Memorial Dr, Chicopee MA 1020",
    #     neighborhood=neighborhood2,
    #     photo_url="Sample URL",
    #     user_bio="I am a user",
    #     role="neighbor",
    #     trust_rating=5,
    #     trust_total_transactions=0,
    #     trust_returns_missing=0,
    #     trust_damaged_count=0,
    #     trust_late_count=0,
    #     trust_last_updated=timezone.now(),
    # )

    user8 = User.objects.create(
        f_name="First Name 1",
        l_name="Last Name 1",
        address="591 Memorial Dr, Chicopee MA 1020",
        neighborhood=neighborhood6,
        photo_url="Sample URL",
        user_bio="I am a user",
        role="neighbor",
        trust_rating=5,
        trust_total_transactions=0,
        trust_returns_missing=0,
        trust_damaged_count=0,
        trust_late_count=0,
        trust_last_updated=timezone.now(),
    )

    user9 = User.objects.create(
        f_name="First Name 2",
        l_name="Last Name 2",
        address="591 Memorial Dr, Chicopee MA 1020",
        neighborhood=neighborhood6,
        photo_url="Sample URL",
        user_bio="I am a user",
        role="neighbor",
        trust_rating=5,
        trust_total_transactions=0,
        trust_returns_missing=0,
        trust_damaged_count=0,
        trust_late_count=0,
        trust_last_updated=timezone.now(),
    )

    user10 = User.objects.create(
        f_name="First Name 3",
        l_name="Last Name 3",
        address="591 Memorial Dr, Chicopee MA 1020",
        neighborhood=neighborhood6,
        photo_url="Sample URL",
        user_bio="I am a user",
        role="neighbor",
        trust_rating=5,
        trust_total_transactions=0,
        trust_returns_missing=0,
        trust_damaged_count=0,
        trust_late_count=0,
        trust_last_updated=timezone.now(),
    )

    # Items
    # item1 = Item.objects.create(name="Canoe", bio="I'm a canoe", category="Boat")
    # item2 = Item.objects.create(name="Kayak", bio="I'm a kayak", category="Boat")
    # item3 = Item.objects.create(
    #     name="Among Us", bio="I'm an among us", category="Among Us"
    # )
    item4 = Item.objects.create(name="Item 4", bio="Item 4", category="Item 4")
    item5 = Item.objects.create(name="Item 5", bio="Item 5", category="Item 5")
    item6 = Item.objects.create(name="Item 6", bio="Item 6", category="Item 6")
    item7 = Item.objects.create(name="Item 7", bio="Item 7", category="Item 7")
    item8 = Item.objects.create(name="Item 8", bio="Item 8", category="Item 8")
    item9 = Item.objects.create(name="Item 9", bio="Item 9", category="Item 9")
    item10 = Item.objects.create(name="Item 10", bio="Item 10", category="Item 10")

    # Skills
    # skill1 = Skill.objects.create(
    #     name="Among Us skill", bio="I'm an among us skill", category="Among Us"
    # )
    # skill2 = Skill.objects.create(
    #     name="Woodworking", bio="I can work some wood", category="Handyman"
    # )
    # skill3 = Skill.objects.create(name="Welding", bio="I can weld", category="Handyman")

    skill4 = Skill.objects.create(name="Skill 4", bio="Skill 4", category="Skill")
    skill5 = Skill.objects.create(name="Skill 5", bio="Skill 5", category="Skill")
    skill6 = Skill.objects.create(name="Skill 6", bio="Skill 6", category="Skill")
    skill7 = Skill.objects.create(name="Skill 7", bio="Skill 7", category="Skill")
    skill8 = Skill.objects.create(name="Skill 8", bio="Skill 8", category="Skill")
    skill9 = Skill.objects.create(name="Skill 9", bio="Skill 9", category="Skill")
    skill10 = Skill.objects.create(name="Skill 10", bio="Skill 10", category="Skill")

    # Listings
    # listing1 = Listing.objects.create(
    #     user=user1,
    #     type="offer",
    #     item=item1,
    #     skill=None,
    #     title="I have among us",
    #     listing_bio="Really really need and among us",
    #     status="in progress",
    #     start_date=timezone.now(),
    #     end_date=timezone.now() + timedelta(days=1),
    #     image_url="bungus.jpg",
    #     neighborhood=neighborhood1,
    # )
    # listing2 = Listing.objects.create(
    #     user=user2,
    #     type="request",
    #     item=None,
    #     skill=skill1,
    #     title="I have among us",
    #     listing_bio="Really really need and among us",
    #     status="in progress",
    #     start_date=timezone.now(),
    #     end_date=timezone.now() + timedelta(days=1),
    #     image_url="bungus.jpg",
    #     neighborhood=neighborhood1,
    # )
    # listing3 = Listing.objects.create(
    #     user=user3,
    #     type="offer",
    #     item=item2,
    #     skill=None,
    #     title="I have among us",
    #     listing_bio="Really really need and among us",
    #     status="in progress",
    #     start_date=timezone.now(),
    #     end_date=timezone.now() + timedelta(days=1),
    #     image_url="bungus.jpg",
    #     neighborhood=neighborhood2,
    # )
    # listing4 = Listing.objects.create(
    #     user=user4,
    #     type="offer",
    #     item=None,
    #     skill=skill2,
    #     title="I have among us",
    #     listing_bio="Really really need and among us",
    #     status="in progress",
    #     start_date=timezone.now(),
    #     end_date=timezone.now() + timedelta(days=1),
    #     image_url="bungus.jpg",
    #     neighborhood=neighborhood3,
    # )
    # listing5 = Listing.objects.create(
    #     user=user5,
    #     type="offer",
    #     item=item3,
    #     skill=None,
    #     title="I have among us",
    #     listing_bio="Really really need and among us",
    #     status="in progress",
    #     start_date=timezone.now(),
    #     end_date=timezone.now() + timedelta(days=1),
    #     image_url="bungus.jpg",
    #     neighborhood=neighborhood2,
    # )
    # listing6 = Listing.objects.create(
    #     user=user6,
    #     type="offer",
    #     item=None,
    #     skill=skill3,
    #     title="I have among us",
    #     listing_bio="Really really need and among us",
    #     status="in progress",
    #     start_date=timezone.now(),
    #     end_date=timezone.now() + timedelta(days=1),
    #     image_url="bungus.jpg",
    #     neighborhood=neighborhood3,
    # )

    listing7 = Listing.objects.create(
        user=user8,
        type="offer",
        item=None,
        skill=skill7,
        title="I have an offer",
        listing_bio="Really really need some thing",
        status="in progress",
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        image_url="bungus.jpg",
        neighborhood=neighborhood7,
    )

    listing8 = Listing.objects.create(
        user=user8,
        type="offer",
        item=None,
        skill=skill8,
        title="I have an offer",
        listing_bio="Really really need some thing",
        status="in progress",
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        image_url="bungus.jpg",
        neighborhood=neighborhood10,
    )
    listing9 = Listing.objects.create(
        user=user10,
        type="offer",
        item=None,
        skill=skill9,
        title="I have an offer",
        listing_bio="Really really need some thing",
        status="in progress",
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        image_url="bungus.jpg",
        neighborhood=neighborhood10,
    )
    listing10 = Listing.objects.create(
        user=user10,
        type="offer",
        item=None,
        skill=skill7,
        title="I have an offer",
        listing_bio="Really really need some thing",
        status="in progress",
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        image_url="bungus.jpg",
        neighborhood=neighborhood10,
    )

    # Transaction
    # transaction1 = Transaction.objects.create(
    #     listing=listing1,
    #     lender=user1,
    #     borrower=user2,
    #     start_date=timezone.now(),
    #     end_date=timezone.now() + timedelta(days=1),
    #     status="open",
    # )

    # transaction2 = Transaction.objects.create(
    #     listing=listing2,
    #     lender=user2,
    #     borrower=user1,
    #     start_date=timezone.now(),
    #     end_date=timezone.now() + timedelta(days=1),
    #     status="in_progress",
    # )

    # transaction3 = Transaction.objects.create(
    #     listing=listing3,
    #     lender=user7,
    #     borrower=user5,
    #     start_date=timezone.now(),
    #     end_date=timezone.now() + timedelta(days=1),
    #     status="completed",
    # )

    # transaction4 = Transaction.objects.create(
    #     listing=listing4,
    #     lender=user3,
    #     borrower=user4,
    #     start_date=timezone.now(),
    #     end_date=timezone.now() + timedelta(days=1),
    #     status="open",
    # )

    # transaction5 = Transaction.objects.create(
    #     listing=listing5,
    #     lender=user6,
    #     borrower=user1,
    #     start_date=timezone.now(),
    #     end_date=timezone.now() + timedelta(days=1),
    #     status="in_progress",
    # )

    # transaction6 = Transaction.objects.create(
    #     listing=listing6,
    #     lender=user3,
    #     borrower=user6,
    #     start_date=timezone.now(),
    #     end_date=timezone.now() + timedelta(days=1),
    #     status="completed",
    # )

    transaction7 = Transaction.objects.create(
        listing=listing7,
        lender=user8,
        borrower=user9,
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        status="completed",
    )

    transaction8 = Transaction.objects.create(
        listing=listing8,
        lender=user8,
        borrower=user9,
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        status="completed",
    )

    transaction9 = Transaction.objects.create(
        listing=listing9,
        lender=user9,
        borrower=user10,
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        status="completed",
    )

    transaction10 = Transaction.objects.create(
        listing=listing10,
        lender=user10,
        borrower=user8,
        start_date=timezone.now(),
        end_date=timezone.now() + timedelta(days=1),
        status="completed",
    )

    # TrustFeedback
    # trust_feedback1 = TrustFeedback.objects.create(
    #     transaction=transaction1,
    #     lender=transaction1.lender,
    #     borrower=transaction1.borrower,
    #     item_returned=True,
    #     return_timeliness="on_time",
    #     item_condition="good",
    #     rating_score="5",
    #     timestamp=timezone.now() + timedelta(days=1),
    # )

    # trust_feedback2 = TrustFeedback.objects.create(
    #     transaction=transaction2,
    #     lender=transaction2.lender,
    #     borrower=transaction2.borrower,
    #     item_returned=False,
    #     return_timeliness="late",
    #     item_condition="bad",
    #     rating_score="0",
    #     timestamp=timezone.now() + timedelta(days=1),
    # )

    # trust_feedback3 = TrustFeedback.objects.create(
    #     transaction=transaction3,
    #     lender=transaction3.lender,
    #     borrower=transaction3.borrower,
    #     item_returned=True,
    #     return_timeliness="on_time",
    #     item_condition="good",
    #     rating_score="3",
    #     timestamp=timezone.now() + timedelta(days=1),
    # )

    # trust_feedback4 = TrustFeedback.objects.create(
    #     transaction=transaction4,
    #     lender=transaction4.lender,
    #     borrower=transaction4.borrower,
    #     item_returned=True,
    #     return_timeliness="on_time",
    #     item_condition="bad",
    #     rating_score="4",
    #     timestamp=timezone.now() + timedelta(days=1),
    # )

    # trust_feedback5 = TrustFeedback.objects.create(
    #     transaction=transaction5,
    #     lender=transaction5.lender,
    #     borrower=transaction5.borrower,
    #     item_returned=True,
    #     return_timeliness="late",
    #     item_condition="bad",
    #     rating_score="1",
    #     timestamp=timezone.now() + timedelta(days=1),
    # )

    # trust_feedback6 = TrustFeedback.objects.create(
    #     transaction=transaction6,
    #     lender=transaction6.lender,
    #     borrower=transaction6.borrower,
    #     item_returned=True,
    #     return_timeliness="on_time",
    #     item_condition="good",
    #     rating_score="5",
    #     timestamp=timezone.now() + timedelta(days=1),
    # )

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
    # chat1 = Chat.objects.create(
    #     transaction=transaction1, chat_creation=timezone.now(), status="active"
    # )

    # chat2 = Chat.objects.create(
    #     transaction=transaction2,
    #     chat_creation=timezone.now(),
    #     status="active",
    # )

    # chat3 = Chat.objects.create(
    #     transaction=transaction3,
    #     chat_creation=timezone.now(),
    #     status="pending",
    # )

    # chat4 = Chat.objects.create(
    #     transaction=transaction4,
    #     chat_creation=timezone.now(),
    #     status="pending",
    # )

    # chat5 = Chat.objects.create(
    #     transaction=transaction5,
    #     chat_creation=timezone.now(),
    #     status="archieved",
    # )

    # chat6 = Chat.objects.create(
    #     transaction=transaction6,
    #     chat_creation=timezone.now(),
    #     status="archieved",
    # )

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
    # message1 = Message.objects.create(
    #     chat=chat1,
    #     sender=chat1.transaction.lender,
    #     content="Among Us",
    #     timestamp=timezone.now(),
    # )

    # message2 = Message.objects.create(
    #     chat=chat1,
    #     sender=chat1.transaction.lender,
    #     content="Among Us",
    #     timestamp=timezone.now(),
    # )
    # message3 = Message.objects.create(
    #     chat=chat1,
    #     sender=chat1.transaction.borrower,
    #     content="Among Us",
    #     timestamp=timezone.now(),
    # )
    # message4 = Message.objects.create(
    #     chat=chat1,
    #     sender=chat1.transaction.borrower,
    #     content="Among Us",
    #     timestamp=timezone.now(),
    # )

    # message5 = Message.objects.create(
    #     chat=chat2,
    #     sender=chat2.transaction.lender,
    #     content="Among Us",
    #     timestamp=timezone.now(),
    # )

    # message6 = Message.objects.create(
    #     chat=chat2,
    #     sender=chat2.transaction.lender,
    #     content="Among Us",
    #     timestamp=timezone.now(),
    # )
    # message7 = Message.objects.create(
    #     chat=chat2,
    #     sender=chat2.transaction.borrower,
    #     content="Among Us",
    #     timestamp=timezone.now(),
    # )
    # message8 = Message.objects.create(
    #     chat=chat2,
    #     sender=chat2.transaction.borrower,
    #     content="Among Us",
    #     timestamp=timezone.now(),
    # )

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
