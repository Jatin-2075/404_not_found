from django.db import models
import uuid
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    def __str__(self):
        return self.user.username


class Create_profile(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    name = models.CharField(max_length=50)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=50)
    weight = models.FloatField()
    height = models.FloatField()
    bloodgroup = models.CharField(max_length=100)
    allergies = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username