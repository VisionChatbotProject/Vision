# Generated by Django 4.0.4 on 2023-05-10 08:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authoring_questionnaire', '0014_remove_questionnaire_title_de_and_more'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='questionnaire',
            name='course_or_chapter_required',
        ),
    ]
