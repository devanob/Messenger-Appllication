from rest_framework import serializers
from .models import User

class UserDetailedSerializers(serializers.ModelSerializer):
    # uuid = serializers.UUIDField(format='hex')
    class Meta:
        model = User
        fields = "__all__"


class UserBasicSerializers(serializers.ModelSerializer):
    # uuid = serializers.UUIDField(format='hex')
    class Meta:
        model = User
        fields = ['uuid',"username", "user_image"]