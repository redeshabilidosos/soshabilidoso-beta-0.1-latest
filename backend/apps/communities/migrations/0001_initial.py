# Generated migration for communities app

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Community',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100, verbose_name='Nombre')),
                ('slug', models.SlugField(blank=True, max_length=120, unique=True)),
                ('description', models.TextField(verbose_name='Descripción')),
                ('category', models.CharField(choices=[('deportes', 'Deportes'), ('musica', 'Música'), ('arte', 'Arte'), ('gaming', 'Gaming'), ('tecnologia', 'Tecnología'), ('lifestyle', 'Lifestyle'), ('educacion', 'Educación'), ('negocios', 'Negocios'), ('salud', 'Salud'), ('viajes', 'Viajes')], max_length=20, verbose_name='Categoría')),
                ('type', models.CharField(choices=[('public', 'Comunidad Pública'), ('private', 'Comunidad Privada'), ('page', 'Página Abierta')], default='public', max_length=10, verbose_name='Tipo')),
                ('profile_image', models.ImageField(blank=True, null=True, upload_to='communities/profiles/', verbose_name='Imagen de perfil')),
                ('cover_image', models.ImageField(blank=True, null=True, upload_to='communities/covers/', verbose_name='Imagen de portada')),
                ('is_active', models.BooleanField(default=True, verbose_name='Activa')),
                ('is_verified', models.BooleanField(default=False, verbose_name='Verificada')),
                ('allow_posts', models.BooleanField(default=True, verbose_name='Permitir publicaciones')),
                ('require_approval', models.BooleanField(default=False, verbose_name='Requiere aprobación para unirse')),
                ('location', models.CharField(blank=True, max_length=100, verbose_name='Ubicación')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Última actualización')),
                ('moderators', models.ManyToManyField(blank=True, related_name='moderated_communities', to=settings.AUTH_USER_MODEL, verbose_name='Moderadores')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owned_communities', to=settings.AUTH_USER_MODEL, verbose_name='Propietario')),
            ],
            options={
                'verbose_name': 'Comunidad',
                'verbose_name_plural': 'Comunidades',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='CommunityPost',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('content', models.TextField(verbose_name='Contenido')),
                ('post_type', models.CharField(choices=[('text', 'Texto'), ('image', 'Imagen'), ('video', 'Video'), ('podcast', 'Podcast'), ('live', 'En Vivo'), ('link', 'Enlace'), ('poll', 'Encuesta')], default='text', max_length=10, verbose_name='Tipo')),
                ('video_url', models.URLField(blank=True, null=True, verbose_name='URL del Video')),
                ('podcast_url', models.URLField(blank=True, null=True, verbose_name='URL del Podcast')),
                ('live_url', models.URLField(blank=True, null=True, verbose_name='URL de Transmisión en Vivo')),
                ('is_pinned', models.BooleanField(default=False, verbose_name='Fijado')),
                ('is_approved', models.BooleanField(default=True, verbose_name='Aprobado')),
                ('is_active', models.BooleanField(default=True, verbose_name='Activo')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Última actualización')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='community_posts', to=settings.AUTH_USER_MODEL, verbose_name='Autor')),
                ('community', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='communities.community', verbose_name='Comunidad')),
                ('likes', models.ManyToManyField(blank=True, related_name='liked_community_posts', to=settings.AUTH_USER_MODEL, verbose_name='Me gusta')),
            ],
            options={
                'verbose_name': 'Publicación de Comunidad',
                'verbose_name_plural': 'Publicaciones de Comunidad',
                'ordering': ['-is_pinned', '-created_at'],
            },
        ),
        migrations.CreateModel(
            name='CommunityPostComment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('content', models.TextField(verbose_name='Contenido')),
                ('is_active', models.BooleanField(default=True, verbose_name='Activo')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Última actualización')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='community_comments', to=settings.AUTH_USER_MODEL, verbose_name='Autor')),
                ('likes', models.ManyToManyField(blank=True, related_name='liked_community_comments', to=settings.AUTH_USER_MODEL, verbose_name='Me gusta')),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='replies', to='communities.communitypostcomment', verbose_name='Comentario padre')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='communities.communitypost', verbose_name='Publicación')),
            ],
            options={
                'verbose_name': 'Comentario',
                'verbose_name_plural': 'Comentarios',
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='CommunitySocialLink',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('platform', models.CharField(choices=[('instagram', 'Instagram'), ('twitter', 'Twitter/X'), ('facebook', 'Facebook'), ('youtube', 'YouTube'), ('website', 'Sitio Web'), ('linkedin', 'LinkedIn'), ('tiktok', 'TikTok'), ('discord', 'Discord')], max_length=20, verbose_name='Plataforma')),
                ('url', models.URLField(verbose_name='URL')),
                ('username', models.CharField(blank=True, max_length=100, verbose_name='Usuario')),
                ('is_active', models.BooleanField(default=True, verbose_name='Activo')),
                ('community', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='social_links', to='communities.community', verbose_name='Comunidad')),
            ],
            options={
                'verbose_name': 'Enlace Social',
                'verbose_name_plural': 'Enlaces Sociales',
                'unique_together': {('community', 'platform')},
            },
        ),
        migrations.CreateModel(
            name='CommunityMembership',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('member', 'Miembro'), ('moderator', 'Moderador'), ('admin', 'Administrador')], default='member', max_length=10, verbose_name='Rol')),
                ('joined_at', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de unión')),
                ('is_active', models.BooleanField(default=True, verbose_name='Activo')),
                ('community', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='communities.community', verbose_name='Comunidad')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Usuario')),
            ],
            options={
                'verbose_name': 'Membresía',
                'verbose_name_plural': 'Membresías',
                'unique_together': {('community', 'user')},
            },
        ),
        migrations.AddField(
            model_name='community',
            name='members',
            field=models.ManyToManyField(through='communities.CommunityMembership', related_name='joined_communities', to=settings.AUTH_USER_MODEL, verbose_name='Miembros'),
        ),
    ]
