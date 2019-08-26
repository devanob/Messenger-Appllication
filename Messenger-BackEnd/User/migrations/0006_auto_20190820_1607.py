# Generated by Django 2.2.4 on 2019-08-20 16:07

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0005_user_user_image'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={},
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(db_column='email', max_length=254, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_image',
            field=models.ImageField(blank=True, db_column='', upload_to='img/users_img/'),
        ),
        migrations.AlterField(
            model_name='user',
            name='uuid',
            field=models.UUIDField(db_column='uuid', default=uuid.uuid4, primary_key=True, serialize=False),
        ),
        migrations.AlterModelTable(
            name='user',
            table='Users.Users',
        ),
    ]