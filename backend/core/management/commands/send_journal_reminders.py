from django.core.management.base import BaseCommand
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from core.models import CustomUser, JournalEntry, JournalReminder
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Sends email reminders to users who haven\'t completed their daily journal entry'

    def handle(self, *args, **options):
        today = timezone.now().date()
        users = CustomUser.objects.all()
        
        for user in users:
            try:
                # Check if user has already received a reminder today
                if JournalReminder.objects.filter(
                    user=user,
                    sent_at__date=today
                ).exists():
                    continue

                # Check if user has made an entry today
                has_entry = JournalEntry.objects.filter(
                    user=user,
                    created_at__date=today
                ).exists()

                if not has_entry:
                    # Get user's streak
                    streak = 0
                    current_date = today
                    while JournalEntry.objects.filter(
                        user=user,
                        created_at__date=current_date
                    ).exists():
                        streak += 1
                        current_date -= timedelta(days=1)

                    # Prepare email content based on streak
                    if streak > 0:
                        subject = f'Don\'t Break Your {streak}-Day Journaling Streak!'
                        message = f'''Hi {user.username},

We noticed you haven't completed your journal entry today. You're currently on a {streak}-day streak! Don't let it break - take a few minutes to reflect on your day.

Your journal is waiting for you at Serenity Sphere.

Best regards,
The Serenity Sphere Team'''
                        reminder_type = 'streak'
                    else:
                        subject = 'Time for Your Daily Journal Entry'
                        message = f'''Hi {user.username},

We noticed you haven't completed your journal entry today. Take a few minutes to reflect on your day and maintain your mindfulness practice.

Your journal is waiting for you at Serenity Sphere.

Best regards,
The Serenity Sphere Team'''
                        reminder_type = 'regular'

                    # Send email
                    send_mail(
                        subject=subject,
                        message=message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[user.email],
                        fail_silently=False,
                    )

                    # Record the reminder
                    JournalReminder.objects.create(
                        user=user,
                        reminder_type=reminder_type
                    )

                    logger.info(f"Sent {reminder_type} reminder to {user.email}")

            except Exception as e:
                logger.error(f"Error sending reminder to {user.email}: {str(e)}")

        self.stdout.write(self.style.SUCCESS('Successfully processed journal reminders')) 