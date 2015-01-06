from django.db import models

class StudentLog(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=40)
    email = models.EmailField(blank=True,verbose_name='e-mail')
    active_datetime = models.DateTimeField(blank=True, null=True)
    inactive_datetime = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return u'%s %s' % (self.first_name, self.last_name)

    

# Create your models here.
