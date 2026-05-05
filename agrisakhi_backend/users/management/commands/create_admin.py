from django.core.management.base import BaseCommand
from users.models import User


class Command(BaseCommand):
    help = 'Create the default admin user'

    def handle(self, *args, **kwargs):
        if not User.objects.filter(role='admin').exists():
            User.objects.create_user(
                phone='0000000000',
                password='agrisakhi_admin_2024',
                name='Admin',
                role='admin',
                village='Bengaluru',
                district='Bengaluru Urban',
                lat=12.9716,
                lng=77.5946,
            )
            self.stdout.write(self.style.SUCCESS('Admin created. Phone: 0000000000 / Password: agrisakhi_admin_2024'))
        else:
            self.stdout.write('Admin already exists.')
