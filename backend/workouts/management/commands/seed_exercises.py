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
                'secondary_muscles': ['shoulders', 'triceps'],  # ✅ Changed to list
                'instructions': 'Lie on bench, lower bar to chest, press up',
            },
            {
                'name': 'Dumbbell Chest Press',
                'description': 'Chest press with dumbbells',
                'category': 'strength',
                'muscle_group': 'chest',
                'equipment': 'dumbbell',
                'secondary_muscles': ['shoulders', 'triceps'],  # ✅ Changed to list
            },
            {
                'name': 'Push-ups',
                'description': 'Bodyweight chest exercise',
                'category': 'strength',
                'muscle_group': 'chest',
                'equipment': 'bodyweight',
                'secondary_muscles': ['shoulders', 'triceps'],  # ✅ Changed to list
            },
            {
                'name': 'Incline Dumbbell Press',
                'description': 'Upper chest focus',
                'category': 'strength',
                'muscle_group': 'chest',
                'equipment': 'dumbbell',
                'secondary_muscles': ['shoulders', 'triceps'],  # ✅ Changed to list
            },
            
            # Back
            {
                'name': 'Deadlift',
                'description': 'Full body compound movement',
                'category': 'strength',
                'muscle_group': 'back',
                'equipment': 'barbell',
                'secondary_muscles': [],  # ✅ Empty list is fine
            },
            {
                'name': 'Pull-ups',
                'description': 'Bodyweight back exercise',
                'category': 'strength',
                'muscle_group': 'back',
                'equipment': 'bodyweight',
                'secondary_muscles': ['biceps'],  # ✅ Changed to list
            },
            {
                'name': 'Barbell Row',
                'description': 'Back thickness builder',
                'category': 'strength',
                'muscle_group': 'back',
                'equipment': 'barbell',
                'secondary_muscles': ['biceps'],  # ✅ Changed to list
            },
            {
                'name': 'Lat Pulldown',
                'description': 'Machine back exercise',
                'category': 'strength',
                'muscle_group': 'back',
                'equipment': 'machine',
                'secondary_muscles': ['biceps'],  # ✅ Changed to list
            },
            
            # Legs
            {
                'name': 'Squat',
                'description': 'King of leg exercises',
                'category': 'strength',
                'muscle_group': 'legs',
                'equipment': 'barbell',
                'secondary_muscles': [],  # ✅ Empty list
            },
            {
                'name': 'Leg Press',
                'description': 'Machine leg exercise',
                'category': 'strength',
                'muscle_group': 'legs',
                'equipment': 'machine',
                'secondary_muscles': [],  # ✅ Empty list
            },
            {
                'name': 'Romanian Deadlift',
                'description': 'Hamstring focus',
                'category': 'strength',
                'muscle_group': 'legs',
                'equipment': 'barbell',
                'secondary_muscles': ['back'],  # ✅ Changed to list
            },
            {
                'name': 'Lunges',
                'description': 'Unilateral leg exercise',
                'category': 'strength',
                'muscle_group': 'legs',
                'equipment': 'dumbbell',
                'secondary_muscles': [],  # ✅ Empty list
            },
            {
                'name': 'Leg Curl',
                'description': 'Hamstring isolation',
                'category': 'strength',
                'muscle_group': 'legs',
                'equipment': 'machine',
                'secondary_muscles': [],  # ✅ Empty list
            },
            {
                'name': 'Calf Raises',
                'description': 'Calf muscle exercise',
                'category': 'strength',
                'muscle_group': 'legs',
                'equipment': 'machine',
                'secondary_muscles': ['calves'],  # ✅ Changed to list
            },
            
            # Shoulders
            {
                'name': 'Overhead Press',
                'description': 'Shoulder builder',
                'category': 'strength',
                'muscle_group': 'shoulders',
                'equipment': 'barbell',
                'secondary_muscles': ['triceps'],  # ✅ Changed to list
            },
            {
                'name': 'Dumbbell Shoulder Press',
                'description': 'Dumbbell overhead press',
                'category': 'strength',
                'muscle_group': 'shoulders',
                'equipment': 'dumbbell',
                'secondary_muscles': ['triceps'],  # ✅ Changed to list
            },
            {
                'name': 'Lateral Raises',
                'description': 'Side delt focus',
                'category': 'strength',
                'muscle_group': 'shoulders',
                'equipment': 'dumbbell',
                'secondary_muscles': [],  # ✅ Empty list
            },
            {
                'name': 'Face Pulls',
                'description': 'Rear delt exercise',
                'category': 'strength',
                'muscle_group': 'shoulders',
                'equipment': 'cable',
                'secondary_muscles': ['back'],  # ✅ Changed to list
            },
            
            # Arms
            {
                'name': 'Barbell Curl',
                'description': 'Bicep builder',
                'category': 'strength',
                'muscle_group': 'arms',
                'equipment': 'barbell',
                'secondary_muscles': ['biceps', 'forearms'],  # ✅ Changed to list
            },
            {
                'name': 'Tricep Dips',
                'description': 'Tricep exercise',
                'category': 'strength',
                'muscle_group': 'arms',
                'equipment': 'bodyweight',
                'secondary_muscles': ['triceps', 'chest'],  # ✅ Changed to list
            },
            {
                'name': 'Hammer Curls',
                'description': 'Neutral grip curls',
                'category': 'strength',
                'muscle_group': 'arms',
                'equipment': 'dumbbell',
                'secondary_muscles': ['biceps', 'forearms'],  # ✅ Changed to list
            },
            {
                'name': 'Tricep Pushdown',
                'description': 'Cable tricep exercise',
                'category': 'strength',
                'muscle_group': 'arms',
                'equipment': 'cable',
                'secondary_muscles': ['triceps'],  # ✅ Changed to list
            },
            
            # Core
            {
                'name': 'Plank',
                'description': 'Core stability',
                'category': 'strength',
                'muscle_group': 'core',
                'equipment': 'bodyweight',
                'secondary_muscles': [],  # ✅ Empty list
            },
            {
                'name': 'Russian Twists',
                'description': 'Oblique exercise',
                'category': 'strength',
                'muscle_group': 'core',
                'equipment': 'bodyweight',
                'secondary_muscles': [],  # ✅ Empty list
            },
            {
                'name': 'Leg Raises',
                'description': 'Lower ab exercise',
                'category': 'strength',
                'muscle_group': 'core',
                'equipment': 'bodyweight',
                'secondary_muscles': [],  # ✅ Empty list
            },
            {
                'name': 'Cable Crunches',
                'description': 'Weighted ab exercise',
                'category': 'strength',
                'muscle_group': 'core',
                'equipment': 'cable',
                'secondary_muscles': [],  # ✅ Empty list
            },
            
            # Cardio
            {
                'name': 'Running',
                'description': 'Cardiovascular exercise',
                'category': 'cardio',
                'muscle_group': 'cardio',
                'equipment': 'bodyweight',
                'secondary_muscles': [],  # ✅ Empty list
            },
            {
                'name': 'Cycling',
                'description': 'Low impact cardio',
                'category': 'cardio',
                'muscle_group': 'cardio',
                'equipment': 'machine',
                'secondary_muscles': [],  # ✅ Empty list
            },
            {
                'name': 'Rowing Machine',
                'description': 'Full body cardio',
                'category': 'cardio',
                'muscle_group': 'full_body',
                'equipment': 'machine',
                'secondary_muscles': ['back'],  # ✅ Changed to list
            },
            {
                'name': 'Jump Rope',
                'description': 'High intensity cardio',
                'category': 'cardio',
                'muscle_group': 'cardio',
                'equipment': 'other',
                'secondary_muscles': ['calves'],  # ✅ Changed to list
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