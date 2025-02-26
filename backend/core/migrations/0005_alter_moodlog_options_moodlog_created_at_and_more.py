# Generated by Django 4.2 on 2025-02-26 23:43

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_alter_journalentry_unique_together_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='moodlog',
            options={'ordering': ['-date']},
        ),
        migrations.AddField(
            model_name='moodlog',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='moodlog',
            name='date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='moodlog',
            name='intensity',
            field=models.IntegerField(default=5, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(10)]),
        ),
        migrations.AddField(
            model_name='moodlog',
            name='journal_entry',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='mood_logs', to='core.journalentry'),
        ),
        migrations.AddField(
            model_name='moodlog',
            name='mood',
            field=models.CharField(choices=[('happy', 'Happy'), ('sad', 'Sad'), ('anxious', 'Anxious'), ('calm', 'Calm'), ('angry', 'Angry'), ('excited', 'Excited'), ('neutral', 'Neutral'), ('amused', 'Amused'), ('loving', 'Loving'), ('optimistic', 'Optimistic'), ('caring', 'Caring'), ('proud', 'Proud'), ('grateful', 'Grateful'), ('relieved', 'Relieved'), ('surprised', 'Surprised'), ('curious', 'Curious'), ('confused', 'Confused'), ('nervous', 'Nervous'), ('remorseful', 'Remorseful'), ('embarrassed', 'Embarrassed'), ('disappointed', 'Disappointed'), ('grieving', 'Grieving'), ('disgusted', 'Disgusted'), ('annoyed', 'Annoyed'), ('disapproving', 'Disapproving')], default='neutral', max_length=20),
        ),
        migrations.AddField(
            model_name='moodlog',
            name='notes',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='moodlog',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mood_logs', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='moodlog',
            unique_together={('user', 'date', 'mood')},
        ),
    ]
