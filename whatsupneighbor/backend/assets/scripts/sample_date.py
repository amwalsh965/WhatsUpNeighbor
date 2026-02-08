from datetime import timedelta
from main.models import *
from django.utils import timezone


# def import_all_sample_data():

#     # Neighborhoods
#     neighborhood1 = Neighborhood.objects.create(name="Neighborhood A", zip=48348)

#     neighborhood2 = Neighborhood.objects.create(name="Neighborhood B", zip=48346)

#     neighborhood3 = Neighborhood.objects.create(name="Neighborhood C", zip=93849)

#     # Users
#     user1 = User.objects.create(
#         f_name="Adam",
#         l_name="Walsh",
#         address="7432 Foxburg Ct. Clarkston, MI, 48348",
#         neighborhood=neighborhood1,
#         photo_url="Sample URL",
#         user_bio="I am a user",
#         role="admin",
#         trust_rating=5,
#         trust_total_transactions=0,
#         trust_returns_missing=0,
#         trust_damaged_count=0,
#         trust_late_count=0,
#         trust_last_updated=timezone.now(),
#     )
#     user2 = User.objects.create(
#         f_name="Danielle",
#         l_name="Pagano",
#         address="777 Brockton Avenue, Abington MA 2351",
#         neighborhood=neighborhood2,
#         photo_url="Sample URL",
#         user_bio="I am a user",
#         role="admin",
#         trust_rating=5,
#         trust_total_transactions=0,
#         trust_returns_missing=0,
#         trust_damaged_count=0,
#         trust_late_count=0,
#         trust_last_updated=timezone.now(),
#     )
#     user3 = User.objects.create(
#         f_name="Izabela",
#         l_name="Camaj",
#         address="66-4 Parkhurst Rd, Chelmsford MA 1824",
#         neighborhood=neighborhood2,
#         photo_url="Sample URL",
#         user_bio="I am a user",
#         role="admin",
#         trust_rating=5,
#         trust_total_transactions=0,
#         trust_returns_missing=0,
#         trust_damaged_count=0,
#         trust_late_count=0,
#         trust_last_updated=timezone.now(),
#     )
#     user4 = User.objects.create(
#         f_name="Evan",
#         l_name="Dallas",
#         address="700 Oak Street, Brockton MA 2301",
#         neighborhood=neighborhood3,
#         photo_url="Sample URL",
#         user_bio="I am a user",
#         role="admin",
#         trust_rating=5,
#         trust_total_transactions=0,
#         trust_returns_missing=0,
#         trust_damaged_count=0,
#         trust_late_count=0,
#         trust_last_updated=timezone.now(),
#     )
#     user5 = User.objects.create(
#         f_name="Sayman",
#         l_name="Zaya",
#         address="250 Hartford Avenue, Bellingham MA 2019",
#         neighborhood=neighborhood3,
#         photo_url="Sample URL",
#         user_bio="I am a user",
#         role="admin",
#         trust_rating=5,
#         trust_total_transactions=0,
#         trust_returns_missing=0,
#         trust_damaged_count=0,
#         trust_late_count=0,
#         trust_last_updated=timezone.now(),
#     )
#     user6 = User.objects.create(
#         f_name="John",
#         l_name="Doe",
#         address="30 Memorial Drive, Avon MA 2322",
#         neighborhood=neighborhood1,
#         photo_url="Sample URL",
#         user_bio="I am a user",
#         role="neighbor",
#         trust_rating=5,
#         trust_total_transactions=0,
#         trust_returns_missing=0,
#         trust_damaged_count=0,
#         trust_late_count=0,
#         trust_last_updated=timezone.now(),
#     )
#     user7 = User.objects.create(
#         f_name="Mike",
#         l_name="Oxlong",
#         address="591 Memorial Dr, Chicopee MA 1020",
#         neighborhood=neighborhood2,
#         photo_url="Sample URL",
#         user_bio="I am a user",
#         role="neighbor",
#         trust_rating=5,
#         trust_total_transactions=0,
#         trust_returns_missing=0,
#         trust_damaged_count=0,
#         trust_late_count=0,
#         trust_last_updated=timezone.now(),
#     )

#     # Items
#     item1 = Item.objects.create(name="Canoe", bio="I'm a canoe", category="Boat")
#     item2 = Item.objects.create(name="Kayak", bio="I'm a kayak", category="Boat")
#     item3 = Item.objects.create(
#         name="Among Us", bio="I'm an among us", category="Among Us"
#     )

#     # Skills
#     skill1 = Skill.objects.create(
#         name="Among Us skill", bio="I'm an among us skill", category="Among Us"
#     )
#     skill2 = Skill.objects.create(
#         name="Woodworking", bio="I can work some wood", category="Handyman"
#     )
#     skill3 = Skill.objects.create(name="Welding", bio="I can weld", category="Handyman")

#     # Listings
#     listing1 = Listing.objects.create(
#         user=user1,
#         type="offer",
#         item=item1,
#         skill=None,
#         title="I have among us",
#         listing_bio="Really really need and among us",
#         status="in progress",
#         start_date=timezone.now(),
#         end_date=timezone.now() + timedelta(days=1),
#         image_url="bungus.jpg",
#         neighborhood=neighborhood1,
#     )
#     listing2 = Listing.objects.create(
#         user=user2,
#         type="request",
#         item=None,
#         skill=skill1,
#         title="I have among us",
#         listing_bio="Really really need and among us",
#         status="in progress",
#         start_date=timezone.now(),
#         end_date=timezone.now() + timedelta(days=1),
#         image_url="bungus.jpg",
#         neighborhood=neighborhood1,
#     )
#     listing3 = Listing.objects.create(
#         user=user3,
#         type="offer",
#         item=item2,
#         skill=None,
#         title="I have among us",
#         listing_bio="Really really need and among us",
#         status="in progress",
#         start_date=timezone.now(),
#         end_date=timezone.now() + timedelta(days=1),
#         image_url="bungus.jpg",
#         neighborhood=neighborhood2,
#     )
#     listing4 = Listing.objects.create(
#         user=user4,
#         type="offer",
#         item=None,
#         skill=skill2,
#         title="I have among us",
#         listing_bio="Really really need and among us",
#         status="in progress",
#         start_date=timezone.now(),
#         end_date=timezone.now() + timedelta(days=1),
#         image_url="bungus.jpg",
#         neighborhood=neighborhood3,
#     )
#     listing5 = Listing.objects.create(
#         user=user5,
#         type="offer",
#         item=item3,
#         skill=None,
#         title="I have among us",
#         listing_bio="Really really need and among us",
#         status="in progress",
#         start_date=timezone.now(),
#         end_date=timezone.now() + timedelta(days=1),
#         image_url="bungus.jpg",
#         neighborhood=neighborhood2,
#     )
#     listing6 = Listing.objects.create(
#         user=user6,
#         type="offer",
#         item=None,
#         skill=skill3,
#         title="I have among us",
#         listing_bio="Really really need and among us",
#         status="in progress",
#         start_date=timezone.now(),
#         end_date=timezone.now() + timedelta(days=1),
#         image_url="bungus.jpg",
#         neighborhood=neighborhood3,
#     )

#     # Transaction
#     transaction1 = Transaction.objects.create(
#         listing=listing1,
#         lender=user1,
#         borrower=user2,
#         start_date=timezone.now(),
#         end_date=timezone.now() + timedelta(days=1),
#         status="open",
#     )

#     transaction2 = Transaction.objects.create(
#         listing=listing2,
#         lender=user2,
#         borrower=user1,
#         start_date=timezone.now(),
#         end_date=timezone.now() + timedelta(days=1),
#         status="in_progress",
#     )

#     transaction3 = Transaction.objects.create(
#         listing=listing3,
#         lender=user7,
#         borrower=user5,
#         start_date=timezone.now(),
#         end_date=timezone.now() + timedelta(days=1),
#         status="completed",
#     )

#     transaction4 = Transaction.objects.create(
#         listing=listing4,
#         lender=user3,
#         borrower=user4,
#         start_date=timezone.now(),
#         end_date=timezone.now() + timedelta(days=1),
#         status="open",
#     )

#     transaction5 = Transaction.objects.create(
#         listing=listing5,
#         lender=user6,
#         borrower=user1,
#         start_date=timezone.now(),
#         end_date=timezone.now() + timedelta(days=1),
#         status="in_progress",
#     )

#     transaction6 = Transaction.objects.create(
#         listing=listing6,
#         lender=user3,
#         borrower=user6,
#         start_date=timezone.now(),
#         end_date=timezone.now() + timedelta(days=1),
#         status="completed",
#     )

#     # TrustFeedback
#     trust_feedback1 = TrustFeedback.objects.create(
#         transaction=transaction1,
#         item_returned=True,
#         return_timeliness="on_time",
#         item_condition="good",
#         rating_score="5",
#         timestamp=timezone.now() + timedelta(days=1),
#     )

#     trust_feedback2 = TrustFeedback.objects.create(
#         transaction=transaction2,
#         item_returned=False,
#         return_timeliness="late",
#         item_condition="bad",
#         rating_score="0",
#         timestamp=timezone.now() + timedelta(days=1),
#     )

#     trust_feedback3 = TrustFeedback.objects.create(
#         transaction=transaction3,
#         item_returned=True,
#         return_timeliness="on_time",
#         item_condition="good",
#         rating_score="3",
#         timestamp=timezone.now() + timedelta(days=1),
#     )

#     trust_feedback4 = TrustFeedback.objects.create(
#         transaction=transaction4,
#         item_returned=True,
#         return_timeliness="on_time",
#         item_condition="bad",
#         rating_score="4",
#         timestamp=timezone.now() + timedelta(days=1),
#     )

#     trust_feedback5 = TrustFeedback.objects.create(
#         transaction=transaction5,
#         item_returned=True,
#         return_timeliness="late",
#         item_condition="bad",
#         rating_score="1",
#         timestamp=timezone.now() + timedelta(days=1),
#     )

#     trust_feedback6 = TrustFeedback.objects.create(
#         transaction=transaction6,
#         item_returned=True,
#         return_timeliness="on_time",
#         item_condition="good",
#         rating_score="5",
#         timestamp=timezone.now() + timedelta(days=1),
#     )

#     # Chat
#     chat1 = Chat.objects.create(
#         transaction=transaction1, chat_creation=timezone.now(), status="active"
#     )

#     chat2 = Chat.objects.create(
#         transaction=transaction2,
#         chat_creation=timezone.now(),
#         status="active",
#     )

#     chat3 = Chat.objects.create(
#         transaction=transaction3,
#         chat_creation=timezone.now(),
#         status="pending",
#     )

#     chat4 = Chat.objects.create(
#         transaction=transaction4,
#         chat_creation=timezone.now(),
#         status="pending",
#     )

#     chat5 = Chat.objects.create(
#         transaction=transaction5,
#         chat_creation=timezone.now(),
#         status="archieved",
#     )

#     chat6 = Chat.objects.create(
#         transaction=transaction6,
#         chat_creation=timezone.now(),
#         status="archieved",
#     )

#     # Messages
#     message1 = Message.objects.create(
#         chat=chat1,
#         sender=chat1.transaction.lender,
#         content="Among Us",
#         timestamp=timezone.now(),
#     )

#     message2 = Message.objects.create(
#         chat=chat1,
#         sender=chat1.transaction.lender,
#         content="Among Us",
#         timestamp=timezone.now(),
#     )
#     message3 = Message.objects.create(
#         chat=chat1,
#         sender=chat1.transaction.borrower,
#         content="Among Us",
#         timestamp=timezone.now(),
#     )
#     message4 = Message.objects.create(
#         chat=chat1,
#         sender=chat1.transaction.borrower,
#         content="Among Us",
#         timestamp=timezone.now(),
#     )

#     message5 = Message.objects.create(
#         chat=chat2,
#         sender=chat2.transaction.lender,
#         content="Among Us",
#         timestamp=timezone.now(),
#     )

#     message6 = Message.objects.create(
#         chat=chat2,
#         sender=chat2.transaction.lender,
#         content="Among Us",
#         timestamp=timezone.now(),
#     )
#     message7 = Message.objects.create(
#         chat=chat2,
#         sender=chat2.transaction.borrower,
#         content="Among Us",
#         timestamp=timezone.now(),
#     )
#     message8 = Message.objects.create(
#         chat=chat2,
#         sender=chat2.transaction.borrower,
#         content="Among Us",
#         timestamp=timezone.now(),
#     )
