# Generated by Django 3.2.12 on 2022-03-18 01:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trails', '0019_alter_trip_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='park',
            name='latitude',
            field=models.DecimalField(decimal_places=6, max_digits=17),
        ),
        migrations.AlterField(
            model_name='park',
            name='longitude',
            field=models.DecimalField(decimal_places=6, max_digits=17),
        ),
        migrations.AlterField(
            model_name='trip',
            name='time',
            field=models.TimeField(blank=True, default=None, null=True),
        ),
    ]
