from django.contrib import admin
from .models import User, contactList
import logging
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm,UserChangeForm
from django.contrib import admin
from django import forms
from .models import contactList
from .form import SignupFormAdmin


class contactListAdminForm(forms.ModelForm):

    class Meta:
        model = contactList
        fields = '__all__'

class userAdminForm(forms.ModelForm):

    class Meta:
        model = User
        fields = '__all__'

class contactListAdmin(admin.ModelAdmin):
    form = contactListAdminForm
    list_display = ['date_created',"friend_ship_initiator","friend"]
    readonly_fields = ['date_created']
class CustomUserCreateForm(UserCreationForm):
    email = forms.EmailField(label = "Email", required = True)
    first_name = forms.CharField(label = "First Name",required = True)
    last_name = forms.CharField(label = "last_name",required = True)
    def __init__(self, *args, **kwargs):
        super(CustomUserCreateForm, self).__init__(*args, **kwargs)
        self.fields['email'].required = True
        self.fields['first_name'].required = True
        self.fields['last_name'].required = True
    class Meta:
        model =  User
        fields = (
            'username',
            'first_name',
            'last_name',
            'email',
            'password1',
            'password2'
        )


class UserAdminForm(forms.ModelForm):
    
    class Meta:
        model = User
        fields = '__all__'
class CustomUserChangeForm(UserChangeForm):
    
    class Meta:
        model = User
        fields = ('__all__')

class CustomerUserAdmin(UserAdmin):
    add_form = SignupFormAdmin
    form =CustomUserChangeForm
    # The forms to add and change user instances
    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', "username", 'is_staff', 'is_active', "uuid", "user_image")
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()
    fieldsets = (
        (('User'), {'fields': ('username', 'email','is_staff', 'uuid', 'user_image')}),
    )



admin.site.register(User,CustomerUserAdmin)
admin.site.register(contactList, contactListAdmin)