# Generated by Django 4.0.4 on 2023-05-09 11:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authoring_course', '0034_courseexam'),
    ]

    operations = [
        migrations.AddField(
            model_name='courseintent',
            name='is_question',
            field=models.BooleanField(default=False, help_text='The switch if it is a question'),
        ),
    ]