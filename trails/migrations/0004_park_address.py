# Generated by Django 3.2.12 on 2022-03-07 17:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trails', '0003_auto_20220307_1726'),
    ]

    operations = [
        migrations.AddField(
            model_name='park',
            name='address',
            field=models.CharField(max_length=255, null=True),
        ),
    ]