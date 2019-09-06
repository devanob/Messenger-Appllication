from django.shortcuts import render
from django.views.generic import View

class messengerView(View):
    template_name = "messenger/index.html"
    def get(self,request):
        return  render(request, self.template_name)