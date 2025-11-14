from django.core.management.base import BaseCommand
from workouts.models import Exercise


class Command(BaseCommand):
    help = 'Populate database with common exercises'

    def handle(self, *args, **kwargs):
        exercises = [
            # Chest
            {
                'name': 'Bench Press',
                'description': 'Classic chest exercise',
                'category': 'strength',
                'muscle_group': 'chest',
                'equipment': 'barbell',
                'instructions': 'Lie on bench, lower bar to chest, press up',
            },
            {
                'name': 'Dumbbell Chest Press',
                'description': 'Chest press with dumbbells',
                'category': 'strength',
                'muscle_group': 'chest',
                'equipment': 'dumbbell',
            },
            {
                'name': 'Push-ups',
                'description': 'Bodyweight chest exercise',
                'category': 'strength',
                'muscle_group': 'chest',
                'equipment': 'bodyweight',
            },
            {
                'name': 'Incline Dumbbell Press',
                'description': 'Upper chest focus',
                'category': 'strength',
                'muscle_group': 'chest',
                'equipment': 'dumbbell',
            },
            
            # Back
            {
                'name': 'Deadlift',
                'description': 'Full body compound movement',
                'category': 'strength',
                'muscle_group': 'back',
                'equipment': 'barbell',
            },
            {
                'name': 'Pull-ups',
                'description': 'Bodyweight back exercise',
                'category': 'strength',
                'muscle_group': 'back',
                'equipment': 'bodyweight',
            },
            {
                'name': 'Barbell Row',
                'description': 'Back thickness builder',
                'category': 'strength',
                'muscle_group': 'back',
                'equipment': 'barbell',
            },
            {
                'name': 'Lat Pulldown',
                'description': 'Machine back exercise',
                'category': 'strength',
                'muscle_group': 'back',
                'equipment': 'machine',
            },
            
            # Legs
            {
                'name': 'Squat',
                'description': 'King of leg exercises',
                'category': 'strength',
                'muscle_group': 'legs',
                'equipment': 'barbell',
            },
            {
                'name': 'Leg Press',
                'description': 'Machine leg exercise',
                'category': 'strength',
                'muscle_group': 'legs',
                'equipment': 'machine',
            },
            {
                'name': 'Romanian Deadlift',
                'description': 'Hamstring focus',
                'category': 'strength',
                'muscle_group': 'legs',
                'equipment': 'barbell',
            },
            {
                'name': 'Lunges',
                'description': 'Unilateral leg exercise',
                'category': 'strength',
                'muscle_group': 'legs',
                'equipment': 'dumbbell',
            },
            {
                'name': 'Leg Curl',
                'description': 'Hamstring isolation',
                'category': 'strength',
                'muscle_group': 'legs',
                'equipment': 'machine',
            },
            {
                'name': 'Calf Raises',
                'description': 'Calf muscle exercise',
                'category': 'strength',
                'muscle_group': 'legs',
                'equipment': 'machine',
            },
            
            # Shoulders
            {
                'name': 'Overhead Press',
                'description': 'Shoulder builder',
                'category': 'strength',
                'muscle_group': 'shoulders',
                'equipment': 'barbell',
            },
            {
                'name': 'Dumbbell Shoulder Press',
                'description': 'Dumbbell overhead press',
                'category': 'strength',
                'muscle_group': 'shoulders',
                'equipment': 'dumbbell',
            },
            {
                'name': 'Lateral Raises',
                'description': 'Side delt focus',
                'category': 'strength',
                'muscle_group': 'shoulders',
                'equipment': 'dumbbell',
            },
            {
                'name': 'Face Pulls',
                'description': 'Rear delt exercise',
                'category': 'strength',
                'muscle_group': 'shoulders',
                'equipment': 'cable',
            },
            
            # Arms
            {
                'name': 'Barbell Curl',
                'description': 'Bicep builder',
                'category': 'strength',
                'muscle_group': 'arms',
                'equipment': 'barbell',
            },
            {
                'name': 'Tricep Dips',
                'description': 'Tricep exercise',
                'category': 'strength',
                'muscle_group': 'arms',
                'equipment': 'bodyweight',
            },
            {
                'name': 'Hammer Curls',
                'description': 'Neutral grip curls',
                'category': 'strength',
                'muscle_group': 'arms',
                'equipment': 'dumbbell',
            },
            {
                'name': 'Tricep Pushdown',
                'description': 'Cable tricep exercise',
                'category': 'strength',
                'muscle_group': 'arms',
                'equipment': 'cable',
            },
            
            # Core
            {
                'name': 'Plank',
                'description': 'Core stability',
                'category': 'strength',
                'muscle_group': 'core',
                'equipment': 'bodyweight',
            },
            {
                'name': 'Russian Twists',
                'description': 'Oblique exercise',
                'category': 'strength',
                'muscle_group': 'core',
                'equipment': 'bodyweight',
            },
            {
                'name': 'Leg Raises',
                'description': 'Lower ab exercise',
                'category': 'strength',
                'muscle_group': 'core',
                'equipment': 'bodyweight',
            },
            {
                'name': 'Cable Crunches',
                'description': 'Weighted ab exercise',
                'category': 'strength',
                'muscle_group': 'core',
                'equipment': 'cable',
            },
            
            # Cardio
            {
                'name': 'Running',
                'description': 'Cardiovascular exercise',
                'category': 'cardio',
                'muscle_group': 'cardio',
                'equipment': 'bodyweight',
            },
            {
                'name': 'Cycling',
                'description': 'Low impact cardio',
                'category': 'cardio',
                'muscle_group': 'cardio',
                'equipment': 'machine',
            },
            {
                'name': 'Rowing Machine',
                'description': 'Full body cardio',
                'category': 'cardio',
                'muscle_group': 'full_body',
                'equipment': 'machine',
            },
            {
                'name': 'Jump Rope',
                'description': 'High intensity cardio',
                'category': 'cardio',
                'muscle_group': 'cardio',
                'equipment': 'other',
            },
        ]

        created_count = 0
        for exercise_data in exercises:
            exercise, created = Exercise.objects.get_or_create(
                name=exercise_data['name'],
                defaults=exercise_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created exercise: {exercise.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSuccessfully created {created_count} exercises!'
            )
        )