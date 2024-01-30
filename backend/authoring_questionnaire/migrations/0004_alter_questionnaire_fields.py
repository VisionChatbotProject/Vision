from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('authoring_core', '0002_auto_20211122_1118'),
        ('authoring_course', '0026_chapter_parent'),
        ('authoring_questionnaire', '0003_question_asset_de_question_asset_en_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='questionnaire',
            old_name='creator',
            new_name='created_by',
        ),
        migrations.AlterField(
            model_name='questionnaire',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questionnaires', to='authoring_course.course'),
        ),
        migrations.AlterField(
            model_name='questionnaire',
            name='created_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_questionnaires', to='authoring_core.organizationmembership'),
        ),
    ]
