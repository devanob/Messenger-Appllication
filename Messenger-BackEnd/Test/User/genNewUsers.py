from User.models import User
from essential_generators import DocumentGenerator
gen = DocumentGenerator()
import random
import string
newUsersGen = 8000
template = {
     'username' : 'name',
     "email" : "email"
 }
N= 4
gen.set_template(template)
documents = gen.documents(newUsersGen)
for doc in documents:

        randomContraint = ''.join(random.choices(string.ascii_uppercase + string.digits, k=N))
        try:
            user = User.objects.create_user(username=doc["username"]+randomContraint,
                                    email=doc["email"],
                                    password='beefpattiestesting')
        except Exception as e:
            print(e)