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
            'work': 'Managing work-related challenges and burnout',
            'health': 'Coping with health-related anxiety and issues',
            'relationship': 'Navigating relationship difficulties',
            'financial': 'Managing financial stress',
            'achievement': 'Celebrating and building on personal achievements',
            'gratitude': 'Practicing and deepening gratitude',
            'creative': 'Enhancing creative expression and flow',
            'anger': 'Healthy ways to process and express anger',
            'anxiety': 'Managing anxiety and nervous feelings',
            'disappointment': 'Coping with disappointment and setbacks',
            'joy': 'Sustaining and amplifying joy and happiness',
            'optimism': 'Cultivating and maintaining optimism',
            'confusion': 'Finding clarity when feeling confused',
            'transition': 'Navigating life changes and transitions'
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
            {
                'title': 'Digital Detox Evening',
                'description': 'Replace social media scrolling with a book, hobby, or self-care activity to reduce comparison and feelings of isolation.',
                'category': 'loneliness',
                'recommendation_type': 'strategy',
                'link': '/strategies/digital-detox'
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
            {
                'title': 'Priority Matrix',
                'description': 'Organize tasks by urgency and importance to reduce feeling overwhelmed.',
                'category': 'work',
                'recommendation_type': 'strategy',
                'link': '/strategies/priority-matrix'
            },
            
            # Achievement recommendations
            {
                'title': 'Achievement Journal',
                'description': 'Document your accomplishments, big and small, to build confidence and motivation.',
                'category': 'achievement',
                'recommendation_type': 'journaling',
                'link': '/exercises/achievement-journal'
            },
            {
                'title': 'Next Level Goal Setting',
                'description': 'Build on your success by setting a related goal that takes you to the next level.',
                'category': 'achievement',
                'recommendation_type': 'strategy',
                'link': '/strategies/goal-setting'
            },
            {
                'title': 'Celebration Ritual',
                'description': 'Create a personal ritual to mark achievements and reinforce positive emotions.',
                'category': 'achievement',
                'recommendation_type': 'exercise',
                'link': '/exercises/celebration-ritual'
            },
            
            # Gratitude recommendations
            {
                'title': 'Three Good Things Practice',
                'description': 'Write down three things you are grateful for each day, including why they happened and how they made you feel.',
                'category': 'gratitude',
                'recommendation_type': 'journaling',
                'link': '/exercises/three-good-things'
            },
            {
                'title': 'Gratitude Letter',
                'description': 'Write a letter expressing thanks to someone who has positively impacted your life.',
                'category': 'gratitude',
                'recommendation_type': 'exercise',
                'link': '/exercises/gratitude-letter'
            },
            {
                'title': 'Savoring Walk',
                'description': 'Take a 20-minute walk focusing exclusively on the positive aspects of your environment.',
                'category': 'gratitude',
                'recommendation_type': 'exercise',
                'link': '/exercises/savoring-walk'
            },
            
            # Creative recommendations
            {
                'title': 'Creative Expression Session',
                'description': 'Set aside 30 minutes for a creative activity with no expectations or judgment.',
                'category': 'creative',
                'recommendation_type': 'exercise',
                'link': '/exercises/creative-expression'
            },
            {
                'title': 'Idea Generation Technique',
                'description': 'Try the "SCAMPER" method to spark new ideas: Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse.',
                'category': 'creative',
                'recommendation_type': 'strategy',
                'link': '/strategies/idea-generation'
            },
            
            # Anger recommendations
            {
                'title': 'Anger Cooling Technique',
                'description': 'When anger arises, count to 10 while taking deep breaths before responding.',
                'category': 'anger',
                'recommendation_type': 'exercise',
                'link': '/exercises/anger-cooling'
            },
            {
                'title': 'Physical Release',
                'description': 'Channel anger physically through exercise, like a brisk walk or punching a pillow.',
                'category': 'anger',
                'recommendation_type': 'exercise',
                'link': '/exercises/physical-release'
            },
            {
                'title': 'Anger Triggers Journal',
                'description': 'Record what triggers your anger and identify patterns to develop better responses.',
                'category': 'anger',
                'recommendation_type': 'journaling',
                'link': '/exercises/anger-journal'
            },
            
            # Anxiety recommendations
            {
                'title': '5-4-3-2-1 Grounding Exercise',
                'description': 'Focus on 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.',
                'category': 'anxiety',
                'recommendation_type': 'exercise',
                'link': '/exercises/grounding'
            },
            {
                'title': 'Worry Time Technique',
                'description': 'Schedule a dedicated 15-minute "worry time" each day to contain anxiety to a specific period.',
                'category': 'anxiety',
                'recommendation_type': 'strategy',
                'link': '/strategies/worry-time'
            },
            {
                'title': 'Body Scan Meditation',
                'description': 'Practice a 10-minute body scan to release physical tension associated with anxiety.',
                'category': 'anxiety',
                'recommendation_type': 'meditation',
                'link': '/exercises/body-scan'
            },
            
            # Disappointment recommendations
            {
                'title': 'Expectation Reset',
                'description': 'Reflect on whether your expectations were realistic and adjust them for the future.',
                'category': 'disappointment',
                'recommendation_type': 'strategy',
                'link': '/strategies/expectation-reset'
            },
            {
                'title': 'Silver Linings Journal',
                'description': 'Write about potential positive outcomes or lessons from the disappointing situation.',
                'category': 'disappointment',
                'recommendation_type': 'journaling',
                'link': '/exercises/silver-linings'
            },
            
            # Joy recommendations
            {
                'title': 'Joy Collection',
                'description': 'Create a physical or digital collection of things that bring you joy to revisit when needed.',
                'category': 'joy',
                'recommendation_type': 'exercise',
                'link': '/exercises/joy-collection'
            },
            {
                'title': 'Flow Activity',
                'description': 'Engage in an activity that fully absorbs you and brings a sense of timelessness.',
                'category': 'joy',
                'recommendation_type': 'exercise',
                'link': '/exercises/flow-activity'
            },
            {
                'title': 'Joy Sharing',
                'description': 'Share your positive experiences with others to amplify and extend feelings of joy.',
                'category': 'joy',
                'recommendation_type': 'strategy',
                'link': '/strategies/joy-sharing'
            },
            
            # Optimism recommendations
            {
                'title': 'Future Visualization',
                'description': 'Spend 5 minutes visualizing a positive future in vivid detail.',
                'category': 'optimism',
                'recommendation_type': 'exercise',
                'link': '/exercises/future-visualization'
            },
            {
                'title': 'Optimistic Explanatory Style',
                'description': 'Practice explaining events in ways that are temporary, specific, and external when negative, but permanent, pervasive, and personal when positive.',
                'category': 'optimism',
                'recommendation_type': 'strategy',
                'link': '/strategies/explanatory-style'
            },
            
            # Confusion recommendations
            {
                'title': 'Mind Map Clarity Exercise',
                'description': 'Create a mind map of your thoughts to organize them visually and find connections.',
                'category': 'confusion',
                'recommendation_type': 'exercise',
                'link': '/exercises/mind-mapping'
            },
            {
                'title': 'Question Refinement',
                'description': 'Transform vague confusion into specific questions to make challenges more approachable.',
                'category': 'confusion',
                'recommendation_type': 'strategy',
                'link': '/strategies/question-refinement'
            },
            
            # Transition recommendations
            {
                'title': 'Transition Bridge Visualization',
                'description': 'Visualize yourself walking across a bridge from your past to your future, acknowledging both what you are leaving behind and what lies ahead.',
                'category': 'transition',
                'recommendation_type': 'exercise',
                'link': '/exercises/transition-bridge'
            },
            {
                'title': 'One Small Step',
                'description': 'Identify one small, manageable action you can take today to move forward in your transition.',
                'category': 'transition',
                'recommendation_type': 'strategy',
                'link': '/strategies/small-steps'
            },
            
            # Health recommendations
            {
                'title': 'Health Worry Containment',
                'description': 'Limit health research to specific times and credible sources to reduce anxiety.',
                'category': 'health',
                'recommendation_type': 'strategy',
                'link': '/strategies/health-worry'
            },
            {
                'title': 'Gentle Movement Practice',
                'description': 'Engage in 10 minutes of gentle movement like stretching or walking to reconnect with your body.',
                'category': 'health',
                'recommendation_type': 'exercise',
                'link': '/exercises/gentle-movement'
            },
            
            # Relationship recommendations
            {
                'title': 'Active Listening Exercise',
                'description': 'Practice listening without interrupting, then summarize what you heard before responding.',
                'category': 'relationship',
                'recommendation_type': 'exercise',
                'link': '/exercises/active-listening'
            },
            {
                'title': 'Needs and Boundaries Reflection',
                'description': 'Reflect on your needs in relationships and identify boundaries that would help meet them.',
                'category': 'relationship',
                'recommendation_type': 'journaling',
                'link': '/exercises/needs-boundaries'
            },
            {
                'title': 'Appreciation Practice',
                'description': 'Share one specific thing you appreciate about someone in your life.',
                'category': 'relationship',
                'recommendation_type': 'exercise',
                'link': '/exercises/appreciation'
            },
            
            # Financial recommendations
            {
                'title': 'Financial Values Clarification',
                'description': 'Identify your core values and how they relate to your financial decisions.',
                'category': 'financial',
                'recommendation_type': 'exercise',
                'link': '/exercises/financial-values'
            },
            {
                'title': 'One Small Financial Action',
                'description': 'Take one small action today to improve your financial situation or knowledge.',
                'category': 'financial',
                'recommendation_type': 'strategy',
                'link': '/strategies/financial-action'
            }
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