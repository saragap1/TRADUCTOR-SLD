from django.db import models
from django.contrib.auth.models import User

class documents(models.Model):
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True) 
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.content + ' - by: ' + self.user.username