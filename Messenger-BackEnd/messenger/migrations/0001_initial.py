# Generated by Django 2.2.4 on 2019-08-16 00:26

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Messages',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('from_User', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sender_contact', to=settings.AUTH_USER_MODEL)),
                ('to_User', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='receiver_contact', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('-pk',),
            },
        ),
    ]