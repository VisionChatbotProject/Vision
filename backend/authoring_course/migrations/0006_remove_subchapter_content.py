# Generated by Django 3.2.6 on 2022-01-05 14:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authoring_course', '0005_alter_slide_sub_chapter'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subchapter',
            name='content',
        ),
    ]