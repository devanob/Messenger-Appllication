# Generated by Django 2.2.3 on 2019-07-24 20:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0002_auto_20190723_1658'),
    ]

    operations = [
        migrations.AddField(
            model_name='contactlist',
            name='active_contact',
            field=models.BooleanField(default=True),
        ),
    ]
