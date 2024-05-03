from django.forms import ModelForm
from .models import documents

class documentForm(ModelForm):
    class Meta:
        model = documents
        fields = ['content']