# Generated migration for adding share_count field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reels', '0002_reelcomment_likes'),
    ]

    operations = [
        migrations.AddField(
            model_name='reel',
            name='share_count',
            field=models.IntegerField(default=0, help_text='Número de veces compartido'),
        ),
    ]
