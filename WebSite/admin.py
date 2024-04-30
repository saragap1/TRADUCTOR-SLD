from django.contrib import admin
from .models import documents 

class documents_admin(admin.ModelAdmin):
    readonly_fields = ("created", )

admin.site.register(documents,documents_admin)