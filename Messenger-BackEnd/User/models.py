from django.db import models

from django.db import models
# Create your models here.
from django.contrib.auth.models import AbstractUser,PermissionsMixin
import uuid
from django.db import models
from django.contrib import admin
from django.db.models import Q

class  User(AbstractUser): 
    email = models.EmailField(unique=True, db_column='email')
    uuid = models.UUIDField(default=uuid.uuid4, primary_key=True, db_column='uuid')
    user_image = models.ImageField(upload_to="img/users_img/", 
                                    blank=True, db_column='')
    #my_field = models.IntegerField(default=get_next_increment, editable=False, unique=True)

    def get_active_contacts(self):
        query= User.objects.raw("SELECT DISTINCT Users.Users.* \
        FROM Users.Users JOIN ContactList \
        ON (ContactList.friend_id = %s \
        OR  \
        ContactList.friend_ship_initiator_id= %s) \
        AND (ContactList.friend_id = Users.Users.uuid  OR ContactList.friend_ship_initiator_id = Users.Users.uuid) \
        AND active_contact = 1", 
        [self.uuid.hex,self.uuid.hex])
        return query
    def get_pending_contacts(self):
        user_uuid = self.uuid.hex
        query= User.objects.raw("SELECT DISTINCT Users.Users.* \
        FROM Users.Users JOIN ContactList \
        ON (ContactList.friend_id = %s ) \
        AND (ContactList.friend_id = Users.Users.uuid  OR ContactList.friend_ship_initiator_id = Users.Users.uuid) \
        AND active_contact = 0 AND Users.Users.uuid != %s", 
        [user_uuid,user_uuid])
        return query
    class Meta:
        db_table = "Users.Users"



class contactList(models.Model):
    date_created = models.DateTimeField(auto_now_add=True, editable=False, db_column='contact_date') # db_column='date_created'
    friend_ship_initiator = models.ForeignKey(User, related_name="friend_initiator",on_delete=models.CASCADE, db_column='friend_ship_initiator_id') #db_column='friend_ship_initiator
    friend = models.ForeignKey(User, related_name="friend_list",on_delete=models.CASCADE,db_column='friend_id')#db_column='friend
    active_contact = models.BooleanField(default=False, db_column='active_contact' )
    def __str__(self):
        return 'Date : {} Stated By {} To {}'.format(self.date_created, self.friend_ship_initiator,self.friend)
    class Meta:
        db_table = "ContactList"
    

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
