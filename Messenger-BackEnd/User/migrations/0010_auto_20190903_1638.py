# Generated by Django 2.2.5 on 2019-09-03 16:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0009_contactlist_combined_friend_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contactlist',
            name='combined_friend_id',
            field=models.CharField(max_length=64, unique=True),
        ),
    ]
