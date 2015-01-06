from django.db import models

# Create your models here.
class Student(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=40)
    email = models.EmailField(blank=True,verbose_name='e-mail')

    def __str__(self):
        return u'%s %s' % (self.first_name, self.last_name)
    
class StudentLog(models.Model):
    studentid = models.CharField(max_length=100,default = "blank",null=True)
    students = models.OneToOneField(Student)
    active_datetime = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.studentid
