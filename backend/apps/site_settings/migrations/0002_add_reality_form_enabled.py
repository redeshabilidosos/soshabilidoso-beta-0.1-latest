# Generated migration

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('site_settings', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='sitesettings',
            name='reality_form_enabled',
            field=models.BooleanField(
                default=True,
                help_text='Activa o desactiva el formulario de registro para el Reality Show Habilidosos',
                verbose_name='Formulario Reality Habilidosos Activado'
            ),
        ),
    ]
