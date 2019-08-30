from User.models import User
import random
from messenger.models import DirectConversationRecords, Messages
from django.db.models import Q
from essential_generators import DocumentGenerator
gen = DocumentGenerator()
user = User.objects.get(username="Devano")
user_uuid= str(user.uuid)
generate_num = 5000
user_list = list(User.objects.all())
import random

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
channel_layer = get_channel_layer()

for i in range(generate_num):
   user_one = random.choice(user_list)
   async_to_sync(channel_layer.group_send)(user_uuid, {
       "type": "message",
       "to_User": user_uuid,
       "from_User": str(user_one.uuid),
       "message": gen.sentence()
       })
         




