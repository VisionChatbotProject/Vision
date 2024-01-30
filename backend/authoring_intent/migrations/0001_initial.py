# Generated by Django 4.0.4 on 2023-03-27 16:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('authoring_core', '0002_auto_20211122_1118'), 
    ]

    operations = [
        migrations.CreateModel(
            name='Intent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text='Creation datetime of this model')),
                ('modified_at', models.DateTimeField(auto_now=True, help_text='Last modification datetime of this model')),
                ('external_id', models.BigIntegerField(blank=True, help_text='Specifies the id on the remote server', null=True)),
                ('last_synchronized', models.DateTimeField(help_text='The last synchronization date for this model', null=True)),
                ('synchronization_policy', models.PositiveSmallIntegerField(choices=[(1, 'Synchronize on every save'), (2, 'Synchronize on every save, async'), (3, 'Synchronize only on external trigger')], default=1, help_text='Defines the synchronization policy for this model')),
                ('name', models.CharField(help_text='Specifies the name of this intent', max_length=200)),
                ('intents', models.JSONField(help_text='A json array field holding all intents')),
                ('response', models.TextField(help_text='The response for this intent')),
                ('created_by', models.ForeignKey(help_text='The creator of this model', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='authoring_core.organizationmembership')),
                ('modified_by', models.ForeignKey(help_text='The last modifier of this model', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='authoring_core.organizationmembership')),
                ('organization', models.ForeignKey(help_text='The organization this intent belongs to', on_delete=django.db.models.deletion.CASCADE, related_name='+', to='authoring_core.organization')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]