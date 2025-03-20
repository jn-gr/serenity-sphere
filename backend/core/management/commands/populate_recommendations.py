from django.core.management.base import BaseCommand
from core.models import Recommendation, RecommendationCategory

class Command(BaseCommand):
    help = 'Populates the database with initial recommendations'
    
    def handle(self, *args, **options):
        # First create categories
        categories = {
            'grief': 'Recommendations for dealing with grief and loss',
            'stress': 'Techniques to manage stress and anxiety',
            'loneliness': 'Strategies to combat loneliness and isolation',
            'work': 'Managing work-related stress and burnout',
            'health': 'Coping with health-related anxiety and issues',
            'relationship': 'Navigating relationship difficulties',
            'financial': 'Managing financial stress',
            # Add more categories as needed
        }
        
        created_categories = {}
        for name, description in categories.items():
            category, created = RecommendationCategory.objects.get_or_create(
                name=name,
                defaults={'description': description}
            )
            created_categories[name] = category
            action = 'Created' if created else 'Found existing'
            self.stdout.write(self.style.SUCCESS(f'{action} category: {name}'))
        
        # Then create recommendations
        recommendations = [
            # Grief recommendations
            {
                'title': 'Grief Journaling Exercise',
                'description': 'Spend 10 minutes writing about a memory with your loved one. Focus on the emotions this memory brings up.',
                'category': 'grief',
                'recommendation_type': 'journaling',
                'link': '/exercises/grief-journal'
            },
            {
                'title': 'Breathing Technique: 4-7-8',
                'description': 'Breathe in for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 times.',
                'category': 'grief',
                'recommendation_type': 'exercise',
                'link': '/exercises/breathing'
            },
            {
                'title': 'Grief Support Resources',
                'description': 'Connecting with others who understand can help. Consider joining a support group.',
                'category': 'grief',
                'recommendation_type': 'resource',
                'link': '/resources/support-groups'
            },
            
            # Stress recommendations
            {
                'title': '5-Minute Mindfulness Practice',
                'description': 'Take 5 minutes to focus on your breath and notice physical sensations without judgment.',
                'category': 'stress',
                'recommendation_type': 'meditation',
                'link': '/exercises/mindfulness'
            },
            {
                'title': 'Progressive Muscle Relaxation',
                'description': 'Tense and then release each muscle group to release physical tension.',
                'category': 'stress',
                'recommendation_type': 'exercise',
                'link': '/exercises/muscle-relaxation'
            },
            {
                'title': 'Stress Trigger Journal',
                'description': 'Track what triggers your stress to identify patterns you can address.',
                'category': 'stress',
                'recommendation_type': 'journaling',
                'link': '/exercises/stress-journal'
            },
            
            # Loneliness recommendations
            {
                'title': 'Social Connection Challenge',
                'description': 'Reach out to one person today, even with a simple text message.',
                'category': 'loneliness',
                'recommendation_type': 'strategy',
                'link': '/exercises/social-connection'
            },
            {
                'title': 'Community Volunteering',
                'description': 'Helping others can reduce feelings of isolation while making a difference.',
                'category': 'loneliness',
                'recommendation_type': 'resource',
                'link': '/resources/volunteering'
            },
            
            # Work stress recommendations
            {
                'title': 'Workday Boundaries',
                'description': 'Set clear start and end times to your workday to prevent burnout.',
                'category': 'work',
                'recommendation_type': 'strategy',
                'link': '/strategies/work-boundaries'
            },
            {
                'title': 'Desk Stretches',
                'description': 'Simple stretches you can do at your desk to release tension.',
                'category': 'work',
                'recommendation_type': 'exercise',
                'link': '/exercises/desk-stretches'
            },
            
            # Add more recommendations as needed
        ]
        
        # Add all recommendations
        for rec in recommendations:
            category = created_categories[rec['category']]
            recommendation, created = Recommendation.objects.get_or_create(
                title=rec['title'],
                category=category,
                defaults={
                    'description': rec['description'],
                    'recommendation_type': rec['recommendation_type'],
                    'link': rec['link'],
                    'is_active': True
                }
            )
            action = 'Created' if created else 'Found existing'
            self.stdout.write(self.style.SUCCESS(f'{action} recommendation: {rec["title"]}'))
        
        self.stdout.write(self.style.SUCCESS('Successfully populated recommendations')) 