from User.models import User
import random
from messenger.models import DirectConversationRecords, Messages
from django.db.models import Q
from essential_generators import DocumentGenerator
gen = DocumentGenerator()
user_list = list(User.objects.all())
generate_num = 8000
import random



for i in range(generate_num):
    user_one = random.choice(user_list)
    user_two = random.choice(user_list)
    query1 = Q(user_one=user_one) & Q(user_two=user_two)
    query2 = Q(user_one=user_two) & Q(user_two=user_one)
    finalQuery = DirectConversationRecords.objects.filter(query1 | query2)
    if finalQuery.exists():
        direct_convo =  finalQuery[0]
        mssg = Messages(from_User = user_one,  to_User = user_two, direct_conversation_id = direct_convo)
        if random.randint(0,9) <= 9 :
            mssgRand = gen.sentence()
            mssg.message = mssgRand
        else :
            mssgRand = gen.paragraph()
            mssg.message = mssgRand
        mssg.save()
    else :
        direct_convo =  DirectConversationRecords(user_one = user_one, user_two = user_two)
        direct_convo.save()
        mssg = Messages(from_User = user_one,  to_User = user_two, direct_conversation_id = direct_convo)
        if random.randint(0,9) <= 9 :
            mssgRand = gen.sentence()
            mssg.message = mssgRand
        else :
            mssgRand = gen.paragraph()
            mssg.message = mssgRand
        mssg.save()




