# Generated by Django 4.2 on 2025-02-27 04:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_alter_moodlog_options_moodlog_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='moodlog',
            name='journal_entry',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='mood_logs', to='core.journalentry'),
        ),
    ]
