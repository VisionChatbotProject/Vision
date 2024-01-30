# Generated by Django 4.0.4 on 2023-02-20 06:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authoring_course', '0028_course_course_begin_date_course_course_end_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='materials',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='course',
            name='ressources',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='course',
            name='teacher_email',
            field=models.EmailField(default='', max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='course',
            name='teacher_name',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
    ]
