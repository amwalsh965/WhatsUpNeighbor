from django.test import TestCase
from django.utils import timezone
from datetime import timedelta

from main.models import User, Neighborhood, Listing


class UserProfileEndpointTests(TestCase):
    def setUp(self):
        self.neighborhood = Neighborhood.objects.create(
            name="Test Neighborhood",
            zip="48326",
        )

        self.user = User.objects.create(
            f_name="Test",
            l_name="User",
            address="123 Test St",
            photo_url="",
            user_bio="Hello",
            neighborhood=self.neighborhood,
            trust_rating=0,
        )

    def test_inactive_listing_is_red(self):
        now = timezone.now()
        start = now - timedelta(days=3)
        end = now - timedelta(days=1)

        Listing.objects.create(
            user=self.user,
            neighborhood=self.neighborhood,
            type="offer",
            title="Canoe",
            status="active", #status is active but the date says it is expired
            start_date=start,
            end_date=end,
            image_url="test.jpg",
        )

        resp = self.client.get(f"/main/user/{self.user.id}/profile/")
        self.assertEqual(resp.status_code, 200)

        data = resp.json()
        listing = data["listings"][0]
        self.assertEqual(listing["availability"]["signal"], "red")

    def test_active_listing_is_green(self):
        now = timezone.now()
        start = now - timedelta(days=1)
        end = now + timedelta(days=1)

        Listing.objects.create(
            user=self.user,
            neighborhood=self.neighborhood,
            type="offer",
            title="Canoe",
            status="active",
            start_date=start,
            end_date=end,
            image_url="test.jpg",
        )

        resp = self.client.get(f"/main/user/{self.user.id}/profile/")
        self.assertEqual(resp.status_code, 200)

        data = resp.json()
        listing = data["listings"][0]
        self.assertEqual(listing["availability"]["signal"], "green")

    def test_computed_counts_update(self):
        now = timezone.now()
        start = now - timedelta(days=1)
        end = now + timedelta(days=1)

        Listing.objects.create(
            user=self.user,
            neighborhood=self.neighborhood,
            type="offer",
            title="Offer 1",
            status="active",
            start_date=start,
            end_date=end,
            image_url="test.jpg",
        )

        Listing.objects.create(
            user=self.user,
            neighborhood=self.neighborhood,
            type="request",
            title="Request 1",
            status="active",
            start_date=start,
            end_date=end,
            image_url="test.jpg",
        )

        resp = self.client.get(f"/main/user/{self.user.id}/profile/")
        self.assertEqual(resp.status_code, 200)

        data = resp.json()
        computed = data["computed"]["overall_availability"]
        self.assertEqual(computed["available_offers_count"], 1)
        self.assertEqual(computed["active_requests_count"], 1)

    def test_profile_404_for_missing_user(self):
        resp = self.client.get("/main/user/99999/profile/")
        self.assertEqual(resp.status_code, 404)
        
    def test_profile_with_no_listings(self):
        resp = self.client.get(f"/main/user/{self.user.id}/profile/")
        self.assertEqual(resp.status_code, 200)

        data = resp.json()

        # listings should be an empty list
        self.assertEqual(data["listings"], [])

        # computed counts should be 0
        computed = data["computed"]["overall_availability"]
        self.assertEqual(computed["available_offers_count"], 0)
        self.assertEqual(computed["active_requests_count"], 0)

        # optional: signal should be green or whatever your rule is when nothing is active
        # self.assertIn(computed["signal"], ["green", "yellow", "red"])
    
    def test_profile_payload_shape(self):
        resp = self.client.get(f"/main/user/{self.user.id}/profile/")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()

        # top-level keys your frontend expects
        self.assertIn("user", data)
        self.assertIn("trust", data)
        self.assertIn("listings", data)
        self.assertIn("items", data)
        self.assertIn("skills", data)
        self.assertIn("computed", data)

        # nested user keys
        self.assertIn("id", data["user"])
        self.assertIn("f_name", data["user"])
        self.assertIn("l_name", data["user"])
        self.assertIn("neighborhood", data["user"])