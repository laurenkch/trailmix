# Generated by Django 3.2.12 on 2022-03-20 01:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trails', '0021_auto_20220318_0200'),
    ]

    operations = [
        migrations.AddField(
            model_name='trip',
            name='notes',
            field=models.TextField(blank=True, null=True),
        ),
    ]