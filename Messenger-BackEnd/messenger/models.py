from django.urls import reverse
from django.db.models import TextField
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models as models


class Messages(models.Model):
    
    # Fields
    message = models.TextField()

    # Relationship Fields
    from_User = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, related_name="sender_contact",
        db_column='from_User'
    )
    to_User = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, related_name="receiver_contact",
        db_column='to_User'
    )

    mssg_date_stamp = models.DateTimeField(auto_now=True, editable=False, db_column='mssg_date_stamp')

    direct_conversation_id = models.ForeignKey(
        "messenger.DirectConversationRecords",
        on_delete=models.CASCADE, related_name="conversation_direct_id", 
        blank = True,
        db_column='direct_conversation_id',
        default = False
    )

    # group_conversation_id = models.ForeignKey(
    #     settings.AUTH_USER_MODEL,
    #     on_delete=models.CASCADE, related_name="receiver_contact", 
    # )
    def __str__(self):
        return "Message From: {} To: {} Message: {} ConvoID: {} ". \
        format(self.from_User, self.to_User, self.message, self.direct_conversation_id)
    class Meta:
        #ordering = ('-direct_conversation_id',)
        db_table = "Messages"


  


class DirectConversationRecords(models.Model):
    user_one = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE, related_name="user_one_direct", db_column='user_one_id')
    user_two = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE, related_name="user_two_direct", db_column='user_two_id')
    conversation_id = models.AutoField(primary_key=True, db_column='conversation_id')
    last_spoken_to = models.DateTimeField(auto_now=True, editable=False, db_column='last_spoken_to')

    class Meta:
        db_table = "DirectConversationRecords"
    def __str__(self):
        return "{} {}".format(self.user_one, self.user_two)

