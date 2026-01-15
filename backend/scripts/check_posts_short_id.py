"""
Script para verificar y generar short_id para posts
"""
import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from apps.posts.models import Post

print("=" * 60)
print("VERIFICACIÓN DE SHORT_ID EN POSTS")
print("=" * 60)

# Contar posts
total_posts = Post.objects.count()
posts_with_short_id = Post.objects.exclude(short_id='').exclude(short_id__isnull=True).count()
posts_without_short_id = Post.objects.filter(short_id='').count() + Post.objects.filter(short_id__isnull=True).count()

print(f"\n📊 Total de posts: {total_posts}")
print(f"✅ Posts con short_id: {posts_with_short_id}")
print(f"❌ Posts sin short_id: {posts_without_short_id}")

if posts_without_short_id > 0:
    print(f"\n🔧 Generando short_id para {posts_without_short_id} posts...")
    for post in Post.objects.filter(short_id='') | Post.objects.filter(short_id__isnull=True):
        post.save()  # El método save() generará el short_id automáticamente
        print(f"  ✓ Post {post.id} -> short_id: {post.short_id}")
    print("\n✅ Todos los posts ahora tienen short_id")

print("\n📝 Ejemplos de posts con short_id:")
for post in Post.objects.all()[:5]:
    print(f"\n  UUID: {post.id}")
    print(f"  Short ID: {post.short_id}")
    print(f"  Usuario: {post.user.username}")
    print(f"  Tipo: {post.post_type}")
    print(f"  URL: http://localhost:4000/profile/{post.user.username}/post/{post.short_id}")

print("\n" + "=" * 60)
