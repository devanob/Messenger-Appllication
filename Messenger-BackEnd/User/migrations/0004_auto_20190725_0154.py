# Generated by Django 2.2.3 on 2019-07-25 01:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0003_contactlist_active_contact'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contactlist',
            name='active_contact',
            field=models.BooleanField(default=False),
        ),
    ]
