# Generated by Django 3.2.12 on 2022-03-12 19:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trails', '0013_auto_20220311_2029'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userfeedback',
            name='difficulty',
        ),
    ]
