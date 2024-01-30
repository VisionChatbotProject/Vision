# Generated by Django 4.0.4 on 2023-05-11 11:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authoring_course', '0037_courseintent_chapter'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courseintent',
            name='chapter',
            field=models.OneToOneField(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='intent', to='authoring_course.chapter'),
        ),
    ]
