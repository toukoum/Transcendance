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

        if not User.objects.filter(username='toukoum').exists():
            User.objects.create_user('toukoum', 'toukoumcode@gmail.com', 'ekb.UGU0kyr*xaj_tup')
        

        if not User.objects.filter(username='raph').exists():
            User.objects.create_user('raph', 'raphaelgiraud12@gmail.com', 'ekb.UGU0kyr*xaj_tup')




if __name__ == '__main__':
    main()
