from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

import os,sys,sqlite3,string,datetime
from UserLog.models import Student, StudentLog

def TAILSwelcome(request):
     return render_to_response("welcome.html",context_instance=RequestContext(request))

def register(request):
    if request.method == 'POST':
        cform = UserCreationForm(request.POST)
        if cform.is_valid():
            new_user = cform.save()
            p = Student.objects.create(first_name = new_user, last_name = "new_user", email="lynn@gmail.com")
            p1 = StudentLog.objects.create(studentid = new_user, students = Student.objects.get(first_name=new_user),active_datetime=datetime.datetime.now())
            return render_to_response("TAILS_navigation.html",{'newst': new_user},context_instance=RequestContext(request))  
    else:
        cform = UserCreationForm()
    return render_to_response("register.html", {'form': cform},context_instance=RequestContext(request))

def login(request):
    stuusername = request.POST['username']
    stupassword = request.POST['password']
    user = authenticate(username=stuusername, password=stupassword)
    if user is not None:
        if user.is_active:
            login(request, user)
            
            #conn=db.sqlite3.connect(user='lynn',db='db.sqlite3', password = '880306', host='localhost')
            #print conn
            #cursor = conn.cursor()
            #insert1 = cursor.execute("INSERT INTO Student (first_name, last_name, email) values ('username', username, '1@lmu')")
            #insert2 = cursor.execute("INSERT INTO StudentLog (active_datetime) values (datetime.datetime.now())")
            #cursor.close()
            #conn.close()
            return render_to_response("TAILS_navigation.html",context_instance=RequestContext(request))
        else:
            pass
    else:
        return render_to_response("login.html", context_instance=RequestContext(request))

@login_required
def TAILSindex(request):
    return render_to_response("index.html",context_instance=RequestContext(request))

@login_required
def TAILStree(request):
    return render_to_response("tree.html",context_instance=RequestContext(request))

@login_required
def TAILS_navigation(request):
     return render_to_response("TAILS_navigation.html",context_instance=RequestContext(request))
	 
@login_required
def TAILS_concept(request):
     return render_to_response("TAILS_concept.html",context_instance=RequestContext(request))
	 
@login_required
def logout(request):
      p1 = StudentLog.objects.create(studentid = new_user, students = Student.objects.get(first_name=new_user),active_datetime=datetime.datetime.now())
     return render_to_response("logged_out.html",context_instance=RequestContext(request))


