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
    )
    to_User = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, related_name="receiver_contact", 
    )

    mssg_date_stamp = models.DateTimeField(auto_now=True, editable=False)

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

    class Meta:
        #ordering = ('-direct_conversation_id',)
        db_table = "Messages"


  


class DirectConversationRecords(models.Model):
    user_one = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE, related_name="user_one_direct", db_column='user_one_id')
    user_two = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE, related_name="user_two_direct", db_column='user_two_id')
    conversation_id = models.AutoField(primary_key=True, db_column='conversation_id')
    class Meta:
        db_table = "DirectConversationRecords"
    def __str__(self):
        return "{} {}".format(self.user_one, self.user_two)

