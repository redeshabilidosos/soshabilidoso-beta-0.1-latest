"""
Configuración del admin para usuarios
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group, Permission
from django.utils.html import format_html
from .models import User, Follow, FriendRequest, Friendship


class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'display_name', 'role_display', 'is_active_display', 'is_verified_display', 'date_joined']
    list_filter = ['is_active', 'is_staff', 'is_superuser', 'email_verified', 'is_private', 'groups', 'date_joined']
    search_fields = ['username', 'email', 'display_name', 'first_name', 'last_name']
    readonly_fields = ['id', 'date_joined', 'last_login']
    ordering = ['-date_joined']
    filter_horizontal = ['groups', 'user_permissions']
    
    fieldsets = (
        ('🔐 Información de Cuenta', {
            'fields': ('id', 'username', 'email', 'password'),
            'description': 'Datos básicos de acceso al sistema'
        }),
        ('👤 Información Personal', {
            'fields': ('display_name', 'first_name', 'last_name', 'bio', 'avatar', 'cover_photo')
        }),
        ('⚽ Información Deportiva', {
            'fields': ('position', 'team', 'interests', 'social_links'),
            'classes': ('collapse',)
        }),
        ('📞 Contacto', {
            'fields': ('contact_number',),
            'classes': ('collapse',)
        }),
        ('🔒 Privacidad', {
            'fields': ('is_private', 'show_email', 'show_phone'),
            'classes': ('collapse',)
        }),
        ('⚙️ PERMISOS Y ACCESO AL PANEL', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'email_verified'),
            'description': '''
                <b>is_active:</b> Si está desactivado, el usuario no puede iniciar sesión<br>
                <b>is_staff:</b> Permite acceso al panel de administración<br>
                <b>is_superuser:</b> Tiene TODOS los permisos sin asignarlos explícitamente
            '''
        }),
        ('👥 GRUPOS Y PERMISOS ESPECÍFICOS', {
            'fields': ('groups', 'user_permissions'),
            'description': '''
                <b>Grupos:</b> Asigna roles predefinidos (ej: Moderador, Editor)<br>
                <b>Permisos:</b> Permisos individuales para acciones específicas
            '''
        }),
        ('📅 Fechas', {
            'fields': ('date_joined', 'last_login'),
        }),
    )
    
    add_fieldsets = (
        ('Crear Nuevo Usuario', {
            'classes': ('wide',),
            'fields': ('username', 'email', 'display_name', 'password1', 'password2'),
            'description': 'Complete los datos básicos del nuevo usuario'
        }),
        ('Tipo de Usuario', {
            'classes': ('wide',),
            'fields': ('is_staff', 'is_superuser', 'groups'),
            'description': '''
                <b>is_staff:</b> Marcar para dar acceso al panel de admin<br>
                <b>is_superuser:</b> Marcar para dar TODOS los permisos<br>
                <b>Grupos:</b> Asignar a un grupo con permisos predefinidos
            '''
        }),
    )
    
    actions = ['ban_users', 'unban_users', 'verify_users', 'make_staff', 'make_superuser', 'remove_staff']
    
    def role_display(self, obj):
        if obj.is_superuser:
            return format_html('<span style="background: #dc3545; color: white; padding: 2px 8px; border-radius: 3px;">👑 Superusuario</span>')
        elif obj.is_staff:
            return format_html('<span style="background: #007bff; color: white; padding: 2px 8px; border-radius: 3px;">⚙️ Staff</span>')
        else:
            return format_html('<span style="background: #6c757d; color: white; padding: 2px 8px; border-radius: 3px;">👤 Usuario</span>')
    role_display.short_description = 'Rol'
    
    def is_active_display(self, obj):
        if obj.is_active:
            return format_html('<span style="color: green;">✓ Activo</span>')
        return format_html('<span style="color: red;">✗ Baneado</span>')
    is_active_display.short_description = 'Estado'
    
    def is_verified_display(self, obj):
        if obj.email_verified:
            return format_html('<span style="color: green;">✓</span>')
        return format_html('<span style="color: red;">✗</span>')
    is_verified_display.short_description = 'Verificado'
    
    def ban_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} usuarios baneados.')
    ban_users.short_description = '🚫 Banear usuarios'
    
    def unban_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} usuarios desbaneados.')
    unban_users.short_description = '✅ Desbanear usuarios'
    
    def verify_users(self, request, queryset):
        updated = queryset.update(email_verified=True)
        self.message_user(request, f'{updated} usuarios verificados.')
    verify_users.short_description = '✓ Verificar usuarios'
    
    def make_staff(self, request, queryset):
        updated = queryset.update(is_staff=True)
        self.message_user(request, f'{updated} usuarios ahora tienen acceso al panel de admin.')
    make_staff.short_description = '⚙️ Dar acceso al panel (Staff)'
    
    def make_superuser(self, request, queryset):
        updated = queryset.update(is_staff=True, is_superuser=True)
        self.message_user(request, f'{updated} usuarios convertidos en superusuarios con todos los permisos.')
    make_superuser.short_description = '👑 Convertir en Superusuario'
    
    def remove_staff(self, request, queryset):
        # No permitir quitarse permisos a uno mismo
        queryset = queryset.exclude(pk=request.user.pk)
        updated = queryset.update(is_staff=False, is_superuser=False)
        self.message_user(request, f'{updated} usuarios ya no tienen acceso al panel.')
    remove_staff.short_description = '🚫 Quitar acceso al panel'


class FollowAdmin(admin.ModelAdmin):
    list_display = ['follower', 'following', 'created_at']
    list_filter = ['created_at']
    search_fields = ['follower__username', 'following__username']
    readonly_fields = ['id', 'created_at']
    
    def has_add_permission(self, request):
        return False


class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['sender__username', 'receiver__username']
    readonly_fields = ['id', 'created_at', 'updated_at']


class FriendshipAdmin(admin.ModelAdmin):
    list_display = ['user1', 'user2', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user1__username', 'user2__username']
    readonly_fields = ['id', 'created_at']


# Personalizar el admin de Grupos
class CustomGroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'permissions_count', 'users_count']
    search_fields = ['name']
    filter_horizontal = ['permissions']
    
    def permissions_count(self, obj):
        count = obj.permissions.count()
        return format_html('<span style="color: #007bff;">{} permisos</span>', count)
    permissions_count.short_description = 'Permisos'
    
    def users_count(self, obj):
        count = obj.user_set.count()
        return format_html('<span style="color: #28a745;">{} usuarios</span>', count)
    users_count.short_description = 'Usuarios'


# Desregistrar el Group por defecto y registrar el personalizado
admin.site.unregister(Group)
admin.site.register(Group, CustomGroupAdmin)
