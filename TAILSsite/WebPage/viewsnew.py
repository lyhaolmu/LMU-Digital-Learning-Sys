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

def register(request):#When a page is requested, Django creates an HttpRequest object that contains metadata about the request.
                      #Then Django loads the appropriate view, passing the HttpRequest as the first argument to the view function. 
    if request.method == 'POST':
        form = UserCreationForm(request.POST)#create a form instance and populate it with data from the request:
                                             #request.post return a dictionary #UserCreationForm returns user
        if form.is_valid(): #We call the form’s is_valid() method; if it’s not True, we go back to the template with the form. This
                            #time the form is no longer empty (unbound) so the HTML form will be populated with the data previously submitted,
                            #where it can be edited and corrected as required.
            new_user = form.save()
            return render_to_response("TAILS_navigation.html",context_instance=RequestContext(request))  
    else:
        form = UserCreationForm()
    return render_to_response("register.html", {'form': form},context_instance=RequestContext(request))

def login(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            stu=Student(first_name="li", last_name="ming",email="12@21")
            stu.save()
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
     return render_to_response("logged_out.html",context_instance=RequestContext(request))


