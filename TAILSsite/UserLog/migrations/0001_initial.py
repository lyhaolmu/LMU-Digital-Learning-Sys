# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='StudentLog',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=40)),
                ('email', models.EmailField(verbose_name='e-mail', blank=True, max_length=75)),
                ('active_datetime', models.DateTimeField(blank=True, null=True)),
                ('inactive_datetime', models.DateTimeField(blank=True, null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
