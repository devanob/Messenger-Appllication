# Generated by Django 2.2.4 on 2019-08-16 13:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messenger', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='messages',
            name='mssg_date_stamp',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
