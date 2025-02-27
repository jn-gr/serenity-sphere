from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_alter_journalentry_unique_together'),
    ]

    operations = [
        migrations.RunSQL(
            # Drop the existing constraint
            "ALTER TABLE core_journalentry DROP CONSTRAINT IF EXISTS unique_user_date_entry;",
            # No reverse SQL needed
            ""
        ),
    ] 