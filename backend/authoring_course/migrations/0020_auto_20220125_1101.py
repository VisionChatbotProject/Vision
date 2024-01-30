# Generated by Django 3.2.6 on 2022-01-25 10:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('smartstudy_assets', '0001_initial'),
        ('authoring_course', '0019_auto_20220120_0938'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='assets',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='course', to='smartstudy_assets.assetstore'),
        ),
        migrations.AlterField(
            model_name='answerchoice',
            name='asset',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='answer_choice', to='smartstudy_assets.asset'),
        ),
        migrations.AlterField(
            model_name='answerchoice',
            name='asset_de',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='answer_choice', to='smartstudy_assets.asset'),
        ),
        migrations.AlterField(
            model_name='answerchoice',
            name='asset_en',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='answer_choice', to='smartstudy_assets.asset'),
        ),
    ]
