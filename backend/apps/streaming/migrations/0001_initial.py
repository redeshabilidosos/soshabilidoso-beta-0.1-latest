# Generated migration for streaming app

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='StreamSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True)),
                ('stream_key', models.CharField(max_length=100, unique=True)),
                ('status', models.CharField(choices=[('live', 'En Vivo'), ('ended', 'Finalizado'), ('banned', 'Baneado')], default='live', max_length=20)),
                ('started_at', models.DateTimeField(auto_now_add=True)),
                ('ended_at', models.DateTimeField(blank=True, null=True)),
                ('peak_viewers', models.IntegerField(default=0)),
                ('total_gifts_received', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('is_banned', models.BooleanField(default=False)),
                ('ban_reason', models.TextField(blank=True)),
                ('banned_at', models.DateTimeField(blank=True, null=True)),
                ('banned_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='banned_streams', to=settings.AUTH_USER_MODEL)),
                ('streamer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stream_sessions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'streaming_sessions',
                'ordering': ['-started_at'],
                'app_label': 'streaming',
            },
        ),
        migrations.CreateModel(
            name='StreamGift',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gift_type', models.CharField(choices=[('heart', 'Corazón'), ('star', 'Estrella'), ('zap', 'Rayo'), ('crown', 'Corona'), ('diamond', 'Diamante'), ('gift', 'Regalo')], max_length=20)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('message', models.TextField(blank=True)),
                ('sent_at', models.DateTimeField(auto_now_add=True)),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_gifts', to=settings.AUTH_USER_MODEL)),
                ('stream_session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='gifts', to='streaming.streamsession')),
            ],
            options={
                'db_table': 'streaming_gifts',
                'ordering': ['-sent_at'],
                'app_label': 'streaming',
            },
        ),
        migrations.CreateModel(
            name='StreamViewer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('joined_at', models.DateTimeField(auto_now_add=True)),
                ('left_at', models.DateTimeField(blank=True, null=True)),
                ('is_banned', models.BooleanField(default=False)),
                ('ban_reason', models.TextField(blank=True)),
                ('banned_at', models.DateTimeField(blank=True, null=True)),
                ('banned_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='banned_viewers', to=settings.AUTH_USER_MODEL)),
                ('stream_session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='viewers', to='streaming.streamsession')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='viewed_streams', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'streaming_viewers',
                'unique_together': {('stream_session', 'user')},
                'app_label': 'streaming',
            },
        ),
        migrations.CreateModel(
            name='StreamChatMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('sent_at', models.DateTimeField(auto_now_add=True)),
                ('is_deleted', models.BooleanField(default=False)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
                ('deleted_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='deleted_messages', to=settings.AUTH_USER_MODEL)),
                ('stream_session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chat_messages', to='streaming.streamsession')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stream_messages', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'streaming_chat_messages',
                'ordering': ['sent_at'],
                'app_label': 'streaming',
            },
        ),
        migrations.CreateModel(
            name='StreamReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('report_type', models.CharField(choices=[('offensive', 'Contenido Ofensivo'), ('spam', 'Spam'), ('harassment', 'Acoso'), ('inappropriate', 'Contenido Inapropiado'), ('other', 'Otro')], max_length=20)),
                ('description', models.TextField()),
                ('status', models.CharField(choices=[('pending', 'Pendiente'), ('reviewed', 'Revisado'), ('action_taken', 'Acción Tomada'), ('dismissed', 'Descartado')], default='pending', max_length=20)),
                ('reviewed_at', models.DateTimeField(blank=True, null=True)),
                ('action_taken', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('reported_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stream_reports_made', to=settings.AUTH_USER_MODEL)),
                ('reported_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='stream_reports_received', to=settings.AUTH_USER_MODEL)),
                ('reviewed_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='stream_reviewed_reports', to=settings.AUTH_USER_MODEL)),
                ('stream_session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reports', to='streaming.streamsession')),
            ],
            options={
                'db_table': 'streaming_reports',
                'ordering': ['-created_at'],
                'app_label': 'streaming',
            },
        ),
        migrations.CreateModel(
            name='StreamEarnings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('platform_fee', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('net_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('is_paid', models.BooleanField(default=False)),
                ('paid_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('stream_session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='earnings', to='streaming.streamsession')),
                ('streamer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stream_earnings', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'streaming_earnings',
                'ordering': ['-created_at'],
                'app_label': 'streaming',
            },
        ),
    ]
