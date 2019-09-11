from rest_framework import serializers
from .models import Messages
from User.models import contactList
from User.serializers import UserBasicSerializers

class MessagesBasicSerializers(serializers.ModelSerializer):
    
    class Meta:
        model = Messages
        fields = ['id',"to_User", "from_User", "mssg_date_stamp", "message"]



class ContactsBasicSerializers(serializers.ModelSerializer):
    friend_ship_initiator = UserBasicSerializers(read_only=True)
    friend= UserBasicSerializers(read_only=True)
    class Meta:
        model = contactList
        fields = ['id',"friend_ship_initiator", "friend",]

