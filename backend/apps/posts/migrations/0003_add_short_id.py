# Generated migration for adding short_id field to Post model

from django.db import migrations, models
import string
import random


def generate_short_id():
    """Genera un ID corto único de 8 caracteres alfanuméricos"""
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=8))


def populate_short_ids(apps, schema_editor):
    """Poblar short_id para posts existentes"""
    Post = apps.get_model('posts', 'Post')
    for post in Post.objects.all():
        post.short_id = generate_short_id()
        post.save()


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='short_id',
            field=models.CharField(max_length=8, unique=True, null=True, blank=True, verbose_name='ID Corto'),
        ),
        migrations.RunPython(populate_short_ids, reverse_code=migrations.RunPython.noop),
        migrations.AlterField(
            model_name='post',
            name='short_id',
            field=models.CharField(max_length=8, unique=True, verbose_name='ID Corto'),
        ),
    ]
