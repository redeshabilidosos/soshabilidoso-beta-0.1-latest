"""
Script para verificar comentarios en la base de datos
"""
import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')
django.setup()

from apps.posts.models import Comment, Post

print("=" * 60)
print("VERIFICACIÓN DE COMENTARIOS")
print("=" * 60)

# Contar comentarios
total_comments = Comment.objects.count()
print(f"\n📊 Total de comentarios en la base de datos: {total_comments}")

if total_comments > 0:
    print("\n📝 Últimos 5 comentarios:")
    for comment in Comment.objects.select_related('user', 'post').order_by('-created_at')[:5]:
        print(f"\n  ID: {comment.id}")
        print(f"  Usuario: {comment.user.username}")
        print(f"  Contenido: {comment.content[:80]}...")
        print(f"  Post: {comment.post.id}")
        print(f"  Likes: {comment.likes_count}")
        print(f"  Respuestas: {comment.replies_count}")
        print(f"  Fecha: {comment.created_at}")
        if comment.parent:
            print(f"  Es respuesta a: {comment.parent.id}")
else:
    print("\n⚠️  No hay comentarios en la base de datos")

# Verificar posts con comentarios
posts_with_comments = Post.objects.filter(comments_count__gt=0).count()
print(f"\n📊 Posts con comentarios: {posts_with_comments}")

print("\n" + "=" * 60)
