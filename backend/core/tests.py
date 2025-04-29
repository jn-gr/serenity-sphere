from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.urls import reverse
from core.models import JournalEntry, MoodLog, Notification
from core.ai_services import predict_emotions
import logging
import sys

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

User = get_user_model()

class SimpleTests(TestCase):
    # Class-level counter for test results
    tests_passed = 0
    tests_failed = 0
    total_tests = 0

    @classmethod
    def setUpClass(cls):
        """Initialize test environment and counters at the start of the test run"""
        super().setUpClass()
        cls.tests_passed = 0
        cls.tests_failed = 0
        cls.total_tests = len([name for name in dir(cls) if name.startswith('test_')])
        logger.info(f"Total tests to run: {cls.total_tests}")

    def setUp(self):
        """Set up test environment before each test"""
        logger.info("Setting up test environment...")
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        logger.info("Test environment setup complete")

    def tearDown(self):
        """Clean up after each test"""
        logger.info("Cleaning up test environment...")
        JournalEntry.objects.all().delete()
        MoodLog.objects.all().delete()
        Notification.objects.all().delete()
        logger.info("Test environment cleanup complete")

    @classmethod
    def tearDownClass(cls):
        """Print test summary after all tests are run"""
        super().tearDownClass()
        logger.info("\n" + "="*50)
        logger.info("TEST SUMMARY")
        logger.info("="*50)
        logger.info(f"Total Tests: {cls.total_tests}")
        logger.info(f"Tests Passed: {cls.tests_passed}")
        logger.info(f"Tests Failed: {cls.tests_failed}")
        if cls.total_tests > 0:
            logger.info(f"Success Rate: {(cls.tests_passed/cls.total_tests)*100:.2f}%")
        else:
            logger.info("Success Rate: N/A (No tests run)")
        logger.info("="*50)

    def _callTestMethod(self, method):
        """Override _callTestMethod to track test results"""
        try:
            method()
            self.__class__.tests_passed += 1
            logger.info(f"✓ {method.__name__} passed")
        except Exception as e:
            self.__class__.tests_failed += 1
            logger.error(f"✗ {method.__name__} failed: {str(e)}")
            raise

    def test_user_creation(self):
        """Test user creation functionality"""
        logger.info("Running test_user_creation...")
        self.assertEqual(self.user.email, 'test@example.com', 
                       "User email should match the created email")
        self.assertTrue(self.user.check_password('testpass123'),
                      "User password should be correctly set")

    def test_journal_entry_creation(self):
        """Test journal entry creation functionality"""
        logger.info("Running test_journal_entry_creation...")
        entry = JournalEntry.objects.create(
            user=self.user,
            content='Test journal entry'
        )
        self.assertEqual(entry.content, 'Test journal entry',
                       "Journal entry content should match")
        self.assertEqual(entry.user, self.user,
                       "Journal entry user should match the created user")

    def test_mood_log_creation(self):
        """Test mood log creation functionality"""
        logger.info("Running test_mood_log_creation...")
        mood_log = MoodLog.objects.create(
            user=self.user,
            mood='happy',
            intensity=8
        )
        self.assertEqual(mood_log.mood, 'happy',
                       "Mood log mood should match")
        self.assertEqual(mood_log.intensity, 8,
                       "Mood log intensity should match")

    def test_notification_creation(self):
        """Test notification creation functionality"""
        logger.info("Running test_notification_creation...")
        notification = Notification.objects.create(
            user=self.user,
            type='mood_shift',
            message='Test notification',
            severity='medium'
        )
        self.assertEqual(notification.type, 'mood_shift',
                       "Notification type should match")
        self.assertEqual(notification.message, 'Test notification',
                       "Notification message should match")

    def test_journal_api(self):
        """Test journal API endpoints functionality"""
        logger.info("Running test_journal_api...")
        # Create a journal entry
        logger.info("Testing journal entry creation via API...")
        response = self.client.post(
            reverse('journal-list'),
            {'content': 'Test journal entry'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED,
                       "Journal entry creation should return 201 status")
        
        # Get journal entries
        logger.info("Testing journal entries retrieval via API...")
        response = self.client.get(reverse('journal-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                       "Journal entries retrieval should return 200 status")
        self.assertEqual(len(response.data), 1,
                       "Should return exactly one journal entry")

    def test_emotion_prediction(self):
        """Test emotion prediction functionality"""
        logger.info("Running test_emotion_prediction...")
        predictions = predict_emotions("I am feeling happy and excited today!")
        self.assertIsInstance(predictions, list,
                            "Predictions should be a list")
        self.assertTrue(len(predictions) > 0,
                      "Predictions list should not be empty")
        for emotion, score in predictions:
            self.assertIsInstance(emotion, str,
                                "Emotion should be a string")
            self.assertIsInstance(score, float,
                                "Score should be a float")

    def test_integration_workflow(self):
        """Test integration workflow between journal entries and mood logs"""
        logger.info("Running test_integration_workflow...")
        # Create journal entry
        logger.info("Creating test journal entry...")
        journal_entry = JournalEntry.objects.create(
            user=self.user,
            content='I am feeling happy today!'
        )
        
        # Create mood log linked to journal entry
        logger.info("Creating test mood log...")
        mood_log = MoodLog.objects.create(
            user=self.user,
            mood='happy',
            intensity=8,
            journal_entry=journal_entry
        )
        
        # Verify the relationship
        self.assertEqual(mood_log.journal_entry, journal_entry,
                       "Mood log should be linked to journal entry")
        self.assertEqual(journal_entry.mood_logs.first(), mood_log,
                       "Journal entry should be linked to mood log")