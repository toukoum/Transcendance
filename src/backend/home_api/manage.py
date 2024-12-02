#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'home_api.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


    if 'migrate' in sys.argv:
        from django.contrib.auth.models import User
        if not User.objects.filter(username='jul').exists():
            User.objects.create_superuser('jul', 'jul@gmail.com', 'jul')

        if not User.objects.filter(username='1').exists():
            User.objects.create_user('1', 'toukoumcode@gmail.com', 'Loul')
        
        if not User.objects.filter(username='2').exists():
            User.objects.create_user('2', 'raphaelgiraud12@gmail.com', 'Loul')
        
        if not User.objects.filter(username='3').exists():
            User.objects.create_user('3', 'raphaelgiraud13@gmail.com', 'Loul')

        
        if not User.objects.filter(username='4').exists():
            User.objects.create_user('4', 'raphaelgiraud14@gmail.com', 'Loul')





if __name__ == '__main__':
    main()
