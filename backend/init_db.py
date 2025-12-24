"""
One-time script to run migrations on Railway
Save this as: backend/init_db.py
"""

import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings_prod')
django.setup()

# Run migrations
from django.core.management import call_command

print("=" * 80)
print("RUNNING DATABASE MIGRATIONS")
print("=" * 80)

call_command('migrate', '--noinput')

print("=" * 80)
print("MIGRATIONS COMPLETE!")
print("=" * 80)

print("\nSeeding exercises...")
try:
    call_command('seed_exercises', '--noinput')
    print("Exercises seeded successfully!")
except Exception as e:
    print(f"Could not seed exercises: {e}")
    print("You can seed manually later with: python manage.py seed_exercises")

print("\n" + "=" * 80)
print("DATABASE INITIALIZATION COMPLETE!")
print("=" * 80)
