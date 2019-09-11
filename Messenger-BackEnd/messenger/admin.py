from django.contrib import admin
from .models import Messages
from .models import DirectConversationRecords
import logging
from django.contrib import admin
from django import forms

#Messages Admin Register
class messagesListAdminForm(forms.ModelForm):

    class Meta:
        model = Messages
        fields = '__all__'


class messagesListAdmin(admin.ModelAdmin):
    form = messagesListAdminForm
    list_display = ['message',"to_User","from_User", "direct_conversation_id", "mssg_date_stamp" ]
    # readonly_fields = ['date_created']

admin.site.register(Messages,messagesListAdmin)

#Messages Admin Register
class DirectConversationRecordsAdminForm(forms.ModelForm):

    class Meta:
        model = DirectConversationRecords
        fields = '__all__'


class DirectConversationRecordsAdmin(admin.ModelAdmin):
    form = DirectConversationRecordsAdminForm
    list_display = ['user_one',"user_two", "conversation_id","last_spoken_to" ]
    # readonly_fields = ['date_created']

admin.site.register(DirectConversationRecords,DirectConversationRecordsAdmin)