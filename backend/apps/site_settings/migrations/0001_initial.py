# Generated migration

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SiteSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('show_register_habilidosos_button', models.BooleanField(default=True, help_text="Activa o desactiva la visibilidad del botón de registro de habilidosos en toda la aplicación", verbose_name="Mostrar botón 'Registrarte'")),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Última actualización')),
            ],
            options={
                'verbose_name': 'Configuración del Sitio',
                'verbose_name_plural': 'Configuraciones del Sitio',
                'db_table': 'site_settings',
            },
        ),
    ]
