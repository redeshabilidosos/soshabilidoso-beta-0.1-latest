#!/usr/bin/env python3
"""
Script para listar usuarios registrados de forma segura (sin contraseñas).
"""
import os
import json
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sos_habilidoso.settings.development')

import django  # noqa: E402

django.setup()

from django.contrib.auth import get_user_model  # noqa: E402


def serialize_dt(dt):
    if isinstance(dt, datetime):
        return dt.isoformat()
    return str(dt)


def main():
    User = get_user_model()
    qs = User.objects.all().order_by('date_joined')
    users = list(
        qs.values('id', 'username', 'email', 'is_active', 'is_staff', 'is_superuser', 'date_joined')
    )
    print(f"Total usuarios: {qs.count()}")
    for u in users:
        joined = serialize_dt(u['date_joined'])
        print(f"- {u['username']} <{u['email']}> | activo={u['is_active']} staff={u['is_staff']} superuser={u['is_superuser']} | joined={joined}")


if __name__ == '__main__':
    main()