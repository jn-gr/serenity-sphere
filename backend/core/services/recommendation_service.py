from core.models import Recommendation, UserRecommendation, MoodCause

class RecommendationService:
    """Service for generating personalized recommendations"""
    
    @staticmethod
    def get_recommendations_for_cause(user, cause_type, limit=3):
        """Get recommendations based on a specific cause"""
        # Map cause types to recommendation categories
        cause_category_map = {
            # Sadness causes
            'loss': 'grief',
            'loneliness': 'loneliness',
            'academic': 'academic_stress',
            'job': 'work_stress',
            'health': 'health_concerns',
            'relationship': 'relationship_issues',
            'financial': 'financial_stress',
            
            # Anger causes
            'stress': 'stress_management',
            'conflict': 'conflict_resolution',
            'work': 'work_stress',
            'boundary': 'boundaries',
            'injustice': 'injustice',
            
            # Extended sadness causes
            'chronic': 'chronic_sadness',
            'isolation': 'loneliness',
            'sleep': 'sleep_issues',
            'motivation': 'motivation',
            'burnout': 'burnout',
            'seasonal': 'seasonal_affective',
            
            # Default
            'other': 'general_wellbeing'
        }
        
        category = cause_category_map.get(cause_type, 'general_wellbeing')
        
        # Get recommendations for this category
        recommendations = Recommendation.objects.filter(
            category__name=category,
            is_active=True
        ).order_by('?')[:limit]  # Random selection limited to 'limit'
        
        # If not enough recommendations in the primary category, add some general ones
        if recommendations.count() < limit:
            additional_count = limit - recommendations.count()
            general_recommendations = Recommendation.objects.filter(
                category__name='general_wellbeing',
                is_active=True
            ).exclude(
                id__in=[r.id for r in recommendations]
            ).order_by('?')[:additional_count]
            
            recommendations = list(recommendations) + list(general_recommendations)
        
        return recommendations
    
    @staticmethod
    def record_user_recommendations(user, mood_cause, recommendations):
        """Record the recommendations given to a user for a specific mood cause"""
        user_recommendations = []
        
        for recommendation in recommendations:
            user_recommendation = UserRecommendation.objects.create(
                user=user,
                recommendation=recommendation,
                mood_cause=mood_cause
            )
            user_recommendations.append(user_recommendation)
        
        return user_recommendations 