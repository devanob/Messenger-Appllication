from rest_framework import serializers
from .models import Messages

class MessagesBasicSerializers(serializers.ModelSerializer):
    
    class Meta:
        model = Messages
        fields = ['id',"to_User", "from_User", "mssg_date_stamp", "message"]