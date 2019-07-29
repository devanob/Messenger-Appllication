from User.models import User, contactList
testUser = User.objects.all()[3]
for user in testUser.getContact():
    print(user)