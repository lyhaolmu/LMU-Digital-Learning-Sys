# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('UserLog', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='studentlog',
            old_name='student',
            new_name='students',
        ),
        migrations.AddField(
            model_name='studentlog',
            name='studentid',
            field=models.CharField(max_length=100, default='blank'),
            preserve_default=True,
        ),
    ]
