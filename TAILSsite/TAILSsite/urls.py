from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf.urls import *
from django.contrib.auth.views import login, logout
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'TAILSsite.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += patterns('WebPage.views',
    ('^welcome/','TAILSwelcome'),
    (r'^accounts/login/$', login, {'extra_context': {'next': '/navigation'}}),
    (r'^accounts/logout/$', logout, {'extra_context': {'next': '/welcome'}}),
    ('^register/$', 'register'),
    ('^navigation/','TAILS_navigation'),
    ('^concept/','TAILS_concept'),
    ('^index/','TAILSindex'),
    ('^tree/','TAILStree'),                   
)
