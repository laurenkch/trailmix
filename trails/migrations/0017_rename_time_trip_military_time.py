# Generated by Django 3.2.12 on 2022-03-15 01:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trails', '0016_userfeedback_created_at'),
    ]

    operations = [
        migrations.RenameField(
            model_name='trip',
            old_name='time',
            new_name='military_time',
        ),
    ]
