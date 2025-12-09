<p align="center">
  <a href="https://www.python.org/" target="_blank">
    <img src="https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.11+">
  </a>
  <a href="https://www.djangoproject.com/" target="_blank">
    <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django">
  </a>
  <a href="https://www.django-rest-framework.org/" target="_blank">
    <img src="https://img.shields.io/badge/DRF-A61F17?style=for-the-badge&logo=django&logoColor=white" alt="Django REST Framework">
  </a>
  <a href="https://react.dev/" target="_blank">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  </a>
  <a href="https://tailwindcss.com/" target="_blank">
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  </a>
  <a href="https://www.docker.com/" target="_blank">
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  </a>
  
  <br>

  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License: MIT">
</p>
  
# 🏋️‍♂️ 7Fit7: A Performance-Focused Workout Tracking Platform

**7Fit7** is a full-stack web application that serves as a comprehensive workout companion for serious strength training enthusiasts. Unlike generic fitness apps that treat workouts as simple checklists, 7Fit7 is architected specifically for the complexity of progressive overload training, where every set, every rep, and every weight increment matters for long-term athletic development.

Built with a **Django REST Framework** backend and a **React/TypeScript** frontend, the application provides real-time workout execution tracking, sophisticated routine customization with granular set-level control, and temporal performance analytics that help users understand their strength progression over weeks and months. The system automatically pre-populates weights and reps from previous sessions, implements intelligent rest timers that guide workout flow, and calculates muscle-group-specific volume metrics that account for how compound movements contribute to multiple muscle groups simultaneously.

The application serves both guest users (who can explore public routines and use the workout companion) and registered users (who unlock the full platform including custom routine creation, exercise contribution to the community library, and comprehensive historical analytics). This dual-access model allows newcomers to experience the core value proposition immediately while incentivizing registration for power users who need personalization and data ownership.

---

## 🎬 Project Demonstration

A comprehensive video demonstration showcasing routine creation, active workout tracking with live timers, set-by-set logging, and historical performance analysis is available at:

**Screencast Link:** https://www.youtube.com/watch?v=d1y-WOFjGXM&t=6s

---

## 📌 Distinctiveness and Complexity

### What This Project IS: A Time-Series Performance Analytics Platform

The fundamental architecture of 7Fit7 is built around **temporal workout data capture and analysis**, which distinguishes it from transactional systems (like e-commerce) or interaction-based platforms (like social networks). At its core, 7Fit7 is a **performance monitoring system** that tracks how an athlete's capabilities evolve over time through structured, repeatable measurement protocols (workouts).

The application implements a **five-layer relational data model** that captures the complete hierarchy of strength training: `Users` create `Routines`, which contain `RoutineExercises`, which define `RoutineSets` (the template), and when a workout begins, the system generates `Sessions` containing `SessionExercises` and `SessionSets` (the actual logged performance data). This deep nesting is necessary because strength training requires both the *plan* (routine structure) and the *execution* (session logs) to be preserved independently—a routine is reused across many sessions, and each session's data must be preserved for longitudinal analysis.

This temporal dimension creates unique technical challenges: the system must maintain referential integrity between templates and instances, automatically populate "last session" data as defaults for the current session, calculate rolling statistics across arbitrary time windows, and present multi-dimensional data (weight × reps × sets × exercises × sessions) in ways that reveal meaningful patterns. These challenges are fundamentally different from the CRUD operations in Project 2 (where products have static attributes) or the feed-based interactions in Project 4 (where posts are discrete, time-stamped events without interdependence).

**Progressive Overload Intelligence:** The application's most distinctive feature is its understanding of progressive overload—the principle that drives all strength training adaptations. When a user begins a workout, the system automatically queries their most recent session for that routine, extracts the weights and reps they logged for each exercise, and pre-populates those values as the baseline for today's session. This seemingly simple feature required complex database querying (filtering sessions by routine, ordering by date, handling cases where exercises were added to routines mid-program) and careful state management (maintaining "last session" data separate from "current session" data throughout the workout flow).

**Compound Movement Volume Attribution:** Another distinctive technical challenge is properly accounting for muscle group volume when exercises target multiple muscles. A barbell squat primarily works the quadriceps but also significantly engages glutes, hamstrings, and core. The system implements an `Exercise.muscle_groups` many-to-many relationship with weighting factors, allowing each exercise to contribute its volume (sets × reps × weight) proportionally to multiple muscle groups. This enables the analytics dashboard to show accurate "weekly quad volume" even when that volume comes from squats, leg presses, and lunges—a nuance that commercial fitness apps often ignore but that's critical for periodization and fatigue management.

**Real-Time Workout State Machine:** The `ActiveWorkout` component implements a state machine that transitions through workout phases: rest → work → rest → work, while managing concurrent timers (session duration, rest countdown), handling user input for reps/weight, validating data before allowing progression, and synchronizing state to the backend after each set. This required implementing a custom React Context for workout state, integrating React Query for optimistic updates, and designing a UI that remains usable during physical exertion (large touch targets, minimal cognitive load, clear visual feedback).

### Why It's Not E-Commerce (Project 2)

Project 2's core complexity lies in **transactional state management**: tracking bids, managing listings with competing buyers, handling auction closures, and processing watchlist additions. The data model is fundamentally about **discrete items** with **ownership transfers**. In contrast, 7Fit7's complexity lies in **temporal patterns** and **nested hierarchical data**. There are no transactions, no financial state changes, no competing actors trying to claim the same resource. Instead, the challenge is maintaining consistency across a five-table relational hierarchy, calculating derived metrics from raw logs, and presenting temporal trends.

The API design also differs fundamentally: Project 2's API handles simple POST/PUT/DELETE operations on flat models (create listing, place bid, close auction), whereas 7Fit7's API handles deeply nested writes (creating a routine with N exercises, each with M sets, in a single atomic transaction) and complex queries (fetching all sessions for a routine with their exercises and sets, filtered by date range, ordered by performance metrics).

### Why It's Not a Social Network (Project 4)

Project 4's architecture centers on **user-to-user relationships** and **content distribution**: following users, displaying chronological feeds, handling likes/comments, and implementing pagination for potentially infinite content streams. The complexity is in managing social graphs and efficiently querying "posts from users I follow" at scale.

7Fit7 has one social-adjacent feature—the exercise contribution system—but its purpose and implementation are fundamentally different. When a user creates a public exercise, they're not posting content for followers; they're contributing to a shared **utility library** that makes everyone's workout creation easier. The "tracking how many users have used my exercise" metric is a reputation system, not a social engagement metric—it measures **utility** (how helpful was this contribution?) rather than popularity (how many people like me?). There is no feed, no following, no comments, no timeline. Users don't interact with each other; they interact with a collectively-built tool.

The `Exercise` model has a `created_by` field and counters for `times_used` and `routines_using`, but these exist to incentivize quality contributions to the exercise library, not to create social connections. It's analogous to Stack Overflow's reputation system (which measures helpful contributions) versus Twitter's follower system (which measures social connections)—similar mechanisms serving completely different architectural purposes.

### Technical Complexity Breakdown

**Backend Complexity:**
1. **Nested Serializers with Custom Validation:** The `RoutineSerializer` must handle nested creation of `RoutineExercise` and `RoutineSet` objects in a single POST request, validating that each set's rep ranges make sense, that rest periods are positive integers, and that the entire object graph can be committed atomically. This required overriding the `create()` and `update()` methods in DRF serializers to manually handle nested writes while maintaining transactional integrity.

2. **Session Generation Logic:** When a user starts a workout, the system must copy the `Routine` structure (with all its exercises and sets) into a new `Session` instance, but transform template data (e.g., "4 sets of 8-12 reps") into logging placeholders (e.g., four `SessionSet` objects with empty `reps_completed` and `weight_used` fields, but pre-populated with last session's values if available). This involved writing custom queryset methods and ViewSet actions that handle conditional logic based on workout history.

3. **Statistical Aggregation Endpoints:** The `/api/stats/` endpoints calculate metrics like "total volume per muscle group this month" by joining across Sessions → SessionExercises → SessionSets → Exercises → MuscleGroups, summing (reps × weight) with proper GROUP BY clauses, and returning JSON optimized for frontend charting libraries. These queries use Django ORM's `annotate()` and `aggregate()` with conditional expressions to handle edge cases like incomplete sessions or exercises with missing data.

4. **JWT Authentication with Refresh Token Rotation:** Implemented token-based auth using `djangorestframework-simplejwt`, including custom token refresh logic in the frontend that automatically requests new access tokens before they expire, handles refresh failures gracefully (redirecting to login), and attaches tokens to all API requests via Axios interceptors. This required coordinating Django settings, DRF permissions, and React Context state.

**Frontend Complexity:**
1. **ActiveWorkout State Machine:** The most complex component manages workout progression through a finite state machine with transitions triggered by user actions (completing a set), timer expirations (rest period ends), and API responses (set saved successfully). State includes current exercise index, current set index, rest timer status, session timer, user inputs for reps/weight, and "last session" data for comparison. This required careful planning to avoid race conditions between timers, user input, and API calls.

2. **React Query Integration:** Used React Query for server state management, implementing optimistic updates (immediately showing set as complete in UI while API call is in flight), cache invalidation (refetching session details after updates), and error handling (rolling back optimistic updates if API call fails). This was necessary because workout tracking requires high responsiveness—users shouldn't wait for network round trips between sets during a time-sensitive training session.

3. **TypeScript Type Safety:** The entire frontend uses TypeScript with strict mode enabled, requiring definition of interfaces for all API response shapes, proper typing of component props and state, and type guards for discriminated unions (e.g., `RoutineSet` can be either a `FixedSet` or `CustomSet` with different required fields). This caught numerous bugs during development that would have been runtime errors in JavaScript.

4. **Mobile-Responsive Design:** The application is fully functional on mobile devices, which is critical because users primarily interact with it in a gym environment on their phones. This required implementing responsive Tailwind CSS layouts that adapt between desktop (multi-column dashboards) and mobile (single-column stacks), using large touch targets for buttons in the ActiveWorkout view, and testing data entry flows on actual mobile devices to ensure usability while physically tired.

5. **Custom Timer Components:** Built reusable `WorkoutTimer` component with start/pause/reset functionality, visual countdown display, and automatic callbacks when timers expire. This involved using `setInterval` with cleanup effects, managing timer state in a way that persists across component re-renders, and synchronizing multiple concurrent timers (session time always runs, rest time only runs during rest periods).

**Data Model Complexity:**
The application uses **seven distinct Django models** with **multiple many-to-many and foreign key relationships**:
- `User` (extends AbstractUser with profile fields)
- `Exercise` (with many-to-many to `MuscleGroup`, foreign key to `User` for creator)
- `Routine` (foreign key to `User`, contains metadata)
- `RoutineExercise` (links `Routine` and `Exercise`, defines order)
- `RoutineSet` (foreign key to `RoutineExercise`, defines set template)
- `Session` (foreign key to `Routine` and `User`, represents workout instance)
- `SessionExercise` (links `Session` and `Exercise`)
- `SessionSet` (foreign key to `SessionExercise`, stores actual logged data)

This structure required careful migration planning (ensuring foreign key constraints don't create deadlocks), implementing `on_delete` cascades properly (deleting a routine should delete its exercises/sets but NOT the base exercises from the library), and writing admin classes for debugging complex nested relationships.

### Why This Complexity Matters

The complexity isn't arbitrary—it directly serves the application's purpose as a serious training tool. Competitive powerlifters, bodybuilders, and strength coaches need software that respects the nuance of their discipline: not all sets are created equal (hence custom set types), volume must be tracked per muscle group for periodization (hence the exercise-muscle_group weighting system), and progress must be visualized over time to validate training efficacy (hence the session logging and analytics).

Commercial fitness apps like Strong, JEFIT, and Hevy cost $50-100/year but still lack features 7Fit7 provides (like muscle-group-aware volume tracking or automatic last-session pre-population). This project demonstrates that by carefully architecting around the *actual workflow* of strength training rather than treating it as generic data entry, a free, open-source tool can provide equivalent or superior functionality.

---

## 💻 Comprehensive File Documentation

Below is a detailed explanation of every file I created or significantly modified, organized by functional area. Each description includes not just what the file contains, but *why* those technical decisions were made.

### Backend Django Files

#### **users/models.py**
Defines the custom `User` model extending Django's `AbstractUser`. Why a custom user model? Because the application needs to store fitness-specific profile data (e.g., `body_weight`, `preferred_units` for kg vs lbs, `fitness_goals`) that don't belong on the generic `AbstractUser`. The model includes:
- `body_weight` (DecimalField): Tracked over time for relative strength calculations
- `date_joined` (DateTimeField): Auto-set for account age tracking
- `is_active` (BooleanField): Required for soft-deleting users without breaking foreign key constraints
- `profile_picture` (ImageField): Uploaded to `users/profile_pics/` with automatic resizing on save

The choice to extend `AbstractUser` rather than use a separate `Profile` model linked via OneToOne was deliberate: all authentication-related queries (`request.user`) already fetch the user object, so storing profile data directly on `User` eliminates N+1 queries when rendering pages that show user info.

#### **users/serializers.py**
Implements `UserSerializer` and `UserRegistrationSerializer` using Django REST Framework. The registration serializer includes custom validation:
- Email format validation and uniqueness check
- Password strength requirements (min length, must contain number)
- Username availability check
- Automatic password hashing via `make_password()` before saving

The `UserSerializer` (for profile updates) excludes the password field entirely and uses `required=False` for optional fields, allowing partial updates via PATCH requests.

#### **users/views.py**
Contains API viewsets and custom views:
- `UserViewSet`: Handles CRUD operations on user profiles with `IsAuthenticated` permission class ensuring users can only update their own profile
- `RegisterView`: Custom APIView for user registration that returns a JWT token immediately after successful registration, allowing single-click "register and log in" UX
- `TokenObtainPairView` and `TokenRefreshView`: Inherited from `simplejwt` with custom serializers to include additional user data (username, email) in the token response, reducing frontend API calls

The decision to use ViewSets rather than function-based views provides automatic endpoint generation (`/users/`, `/users/<id>/`, etc.) and built-in support for pagination, filtering, and ordering.

#### **workouts/models.py**
This is the most complex file in the backend, defining the entire workout data model:

**`Exercise` Model:**
- Stores exercise definitions (name, description, equipment required, difficulty level)
- `created_by` ForeignKey to `User`: Tracks who contributed the exercise for reputation system
- `is_public` BooleanField: Determines if exercise appears in global library or only for creator
- `muscle_groups` ManyToMany to `MuscleGroup`: One exercise can target multiple muscles
- `times_used` and `routines_using` IntegerFields: Cached counts for leaderboards (denormalized for performance; updated via signals on Session creation)
- Custom `save()` method: Generates URL-safe slug from name for friendly URLs (`/exercises/barbell-squat/`)

**`MuscleGroup` Model:**
- Simple model storing muscle group names (Chest, Back, Legs, etc.) with color codes for UI visualization
- Includes `primary` boolean to distinguish major muscle groups from stabilizers in analytics

**`Routine` Model:**
- Represents a workout plan owned by a user
- `name`, `description`, `is_public` (for sharing), `created_at`, `updated_at`
- `difficulty` ChoiceField: Beginner/Intermediate/Advanced for filtering
- No direct reference to exercises—uses through-table `RoutineExercise` for ordering

**`RoutineExercise` Model:**
- Through-table linking `Routine` and `Exercise` with additional data
- `order` IntegerField: Determines sequence of exercises in the workout (1, 2, 3...)
- `notes` TextField: Exercise-specific notes (e.g., "Focus on elbow position")
- Unique constraint on `(routine, order)`: Prevents duplicate ordering
- Custom `Meta.ordering = ['order']`: Ensures queryset always returns exercises in workout sequence

**`RoutineSet` Model:**
- Defines the template for sets within a routine
- `routine_exercise` ForeignKey: Links set to its parent exercise
- `set_type` ChoiceField: "Warmup", "Working", "Drop", "AMRAP", etc.
- `target_reps_min` and `target_reps_max`: Rep range (e.g., 8-12)
- `target_weight` DecimalField: Optional weight prescription
- `rest_seconds` IntegerField: Rest period after this set
- `order` IntegerField: Set sequence within exercise
- This model allows complex set schemes like "Warmup: 1×10@50%, Working: 3×5@85%, Drop: 1×12@60%" in a single exercise

**`Session` Model:**
- Represents an instance of a routine being performed
- `routine` ForeignKey: Links to the template routine
- `user` ForeignKey: Who performed the session
- `started_at` and `completed_at` DateTimeFields: Brackets workout duration
- `is_completed` BooleanField: Tracks if user finished or abandoned session
- `notes` TextField: Post-workout reflections
- Custom method `calculate_total_volume()`: Sums (reps × weight) across all exercises for the session

**`SessionExercise` Model:**
- Links a `Session` to an `Exercise`, representing "I did this exercise in this workout"
- `order` IntegerField: Preserves exercise sequence from routine
- Separate from `RoutineExercise` because users might skip exercises mid-workout

**`SessionSet` Model:**
- The atomic unit of logged workout data
- `session_exercise` ForeignKey: Links to parent exercise
- `reps_completed` IntegerField: Actual reps logged
- `weight_used` DecimalField: Actual weight logged
- `rpe` IntegerField: Rate of Perceived Exertion (1-10 scale) for autoregulation
- `completed_at` DateTimeField: Timestamp of set completion
- This granular data enables analytics like "strength curve over 12 weeks" or "volume per muscle group per week"

The relationships form a tree: `Routine → RoutineExercise → RoutineSet` (the plan) and `Session → SessionExercise → SessionSet` (the execution). This dual hierarchy is necessary because routines are reused across many sessions, and each session's data must be preserved independently for historical analysis.

#### **workouts/serializers.py**
Implements nested DRF serializers for the complex workout data model. Key serializers:

**`ExerciseSerializer`:**
- Includes all fields from `Exercise` model
- `muscle_groups` field uses `StringRelatedField(many=True)` to return muscle group names as strings rather than IDs in GET responses, improving frontend usability
- `created_by` uses `ReadOnlyField(source='created_by.username')` to show creator's name without exposing their full user object

**`RoutineSetSerializer`:**
- Serializes set templates with validation:
  - `target_reps_min` must be ≤ `target_reps_max`
  - `rest_seconds` must be ≥ 0
  - `order` is automatically set based on existing sets for the exercise if not provided

**`RoutineExerciseSerializer`:**
- Nests `RoutineSetSerializer(many=True)` for the `sets` field
- Custom `create()` method: When creating a `RoutineExercise` via POST, the frontend sends `{ "exercise_id": 5, "sets": [{...}, {...}] }`. The serializer must:
  1. Create the `RoutineExercise` object
  2. Loop through `sets` data and create `RoutineSet` objects linked to the new `RoutineExercise`
  3. Wrap everything in a transaction to ensure atomicity (if set creation fails, roll back the exercise creation)

**`RoutineSerializer`:**
- Nests `RoutineExerciseSerializer(many=True)` for the `exercises` field
- Custom `create()` method handles three-level nesting: creating `Routine`, then `RoutineExercise` objects, then `RoutineSet` objects, all from a single JSON payload
- Custom `update()` method is even more complex: when updating a routine, the frontend might add/remove/reorder exercises or modify sets. The serializer must:
  1. Compare incoming `exercises` data with existing `RoutineExercise` objects
  2. Delete removed exercises
  3. Create new exercises
  4. Update modified exercises (including their nested sets)
  5. Maintain order integrity across all changes
  6. All within a single database transaction

This complexity is why I chose DRF over manually writing views—the serializer framework handles request parsing, validation, and error responses automatically.

**`SessionSetSerializer`:**
- Serializes logged set data
- Validation ensures `reps_completed` > 0 and `weight_used` ≥ 0
- `completed_at` is auto-set to `now()` if not provided

**`SessionExerciseSerializer`:**
- Nests `SessionSetSerializer(many=True)`
- Read-only field `exercise_details` uses `ExerciseSerializer(source='exercise')` to include full exercise data in GET responses without requiring a second API call

**`SessionSerializer`:**
- Nests `SessionExerciseSerializer(many=True)`
- Custom `create()` method: When starting a session, the frontend POSTs `{ "routine_id": 3 }`. The backend must:
  1. Create a `Session` object
  2. Query the `Routine`'s structure (exercises and sets)
  3. Create corresponding `SessionExercise` and `SessionSet` objects with empty `reps_completed` and `weight_used` fields
  4. Fetch the user's most recent session for this routine (if exists) and pre-populate weights/reps from that session
  5. Return the complete session structure with pre-populated values

This "smart initialization" is one of the app's most valuable features—users don't manually copy their last session's numbers; the system does it automatically.

#### **workouts/views.py**
Contains DRF ViewSets and custom API endpoints:

**`ExerciseViewSet`:**
- `queryset`: Filters to public exercises plus the user's private exercises (`Q(is_public=True) | Q(created_by=request.user)`)
- `filter_backends`: Integrates DRF's `SearchFilter` for `?search=squat` queries and `OrderingFilter` for `?ordering=-times_used` queries
- Custom `create()` action: Automatically sets `created_by` to `request.user` and validates that exercise name is unique
- Custom `list()` action: Includes aggregated data like "your private exercises count" in the response metadata

**`RoutineViewSet`:**
- Similar filtering as `ExerciseViewSet`: user sees public routines + their own routines
- Custom `retrieve()` action: When fetching a routine, also includes "last performed" date and "times performed" count by querying related `Session` objects
- Custom `destroy()` action: Before deleting a routine, checks if it has associated sessions. If yes, prompt user to confirm (destructive action warning)

**`SessionViewSet`:**
- `queryset` is user-scoped: `Session.objects.filter(user=request.user)`
- Custom `start_workout()` action (POST `/sessions/start/`): 
  - Accepts `routine_id` in request body
  - Creates session with `started_at=now()`, `is_completed=False`
  - Generates `SessionExercise` and `SessionSet` templates from routine
  - Fetches last session data for pre-population
  - Returns full session object with nested exercises and sets
- Custom `complete_workout()` action (POST `/sessions/<id>/complete/`):
  - Sets `completed_at=now()`, `is_completed=True`
  - Calculates and caches session statistics (total volume, duration, exercises completed)
  - Increments `times_used` on all exercises used in the session (for exercise leaderboard)
- Custom `update_set()` action (PATCH `/sessions/<id>/sets/<set_id>/`):
  - Allows updating a single `SessionSet` without sending the entire session
  - Used by frontend after each set completion to immediately persist data
  - Returns the updated set plus the next set's details for seamless workout flow

**`StatsViewSet` (Custom ViewSet):**
- Collection of read-only endpoints for analytics:
- `user_overview()`: Returns total workouts, total volume, total time trained, favorite exercises (most frequently used)
- `exercise_history()`: Accepts `exercise_id` and `date_range` params, returns time-series data of weight/reps for that exercise across all sessions, formatted for charting libraries
- `muscle_group_volume()`: Calculates weekly volume per muscle group by summing (reps × weight) across all exercises targeting each muscle, accounting for compound movements via the `Exercise.muscle_groups` many-to-many
- `personal_records()`: Queries for max weight, max reps, max volume for each exercise the user has logged

These custom endpoints required hand-written SQL-like queries using Django ORM's `annotate()` and `aggregate()`, with careful JOINs across the entire data model.

#### **workouts/admin.py**
Registers all models with Django admin for debugging and data management:
- Custom `ExerciseAdmin`: Displays `name`, `created_by`, `times_used`, `is_public` columns with search and filtering
- Custom `RoutineAdmin`: Inline display of associated `RoutineExercise` and `RoutineSet` objects, allowing admins to view entire routine structure on one page
- Custom `SessionAdmin`: Inline display of `SessionExercise` and `SessionSet` objects with color-coded completion status (green = completed, gray = abandoned)

The inline admin is particularly useful during development for visualizing the complex nested relationships and debugging data integrity issues.

#### **config/settings.py**
Main Django configuration file with notable settings:

**Database Configuration:**
```python
if os.environ.get('USE_DOCKER'):
    DATABASES = { 'default': { 'ENGINE': 'django.db.backends.postgresql', ... } }
else:
    DATABASES = { 'default': { 'ENGINE': 'django.db.backends.sqlite3', ... } }
```
Allows switching between SQLite (local dev) and PostgreSQL (Docker/production) via environment variable.

**CORS Configuration:**
```python
CORS_ALLOWED_ORIGINS = ['http://localhost:5173']  # Vite dev server
CORS_ALLOW_CREDENTIALS = True  # Required for cookies with JWT
```
Enables the React frontend to make API calls during development.

**REST Framework Settings:**
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ['rest_framework_simplejwt.authentication.JWTAuthentication'],
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticatedOrReadOnly'],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
```
JWT authentication means the backend is stateless (no session cookies), improving scalability. The `IsAuthenticatedOrReadOnly` default allows guest users to browse public content but requires authentication for writes.

**JWT Settings:**
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}
```
Short-lived access tokens (60 min) minimize risk if stolen; refresh tokens (7 days) allow persistent login without re-entering password; token rotation means each refresh generates a new refresh token, limiting replay attack window.

**Static/Media Files:**
```python
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
```
Uploaded files (profile pictures, exercise images) are stored in `media/` directory and served at `/media/` URL during development. In production, these would be served by Nginx or S3.

#### **config/urls.py**
Main URL router:
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/workouts/', include('workouts.urls')),
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
]
```
Prefixing all app URLs with `/api/` cleanly separates backend and frontend routing, allowing the React app to handle all other URLs.

#### **requirements.txt**
Python dependencies with version pinning for reproducible builds:
- `Django==4.2.7`: Latest LTS version
- `djangorestframework==3.14.0`: DRF for API
- `djangorestframework-simplejwt==5.3.0`: JWT authentication
- `django-cors-headers==4.3.1`: CORS support
- `Pillow==10.1.0`: Image processing for profile pictures
- `gunicorn==21.2.0`: Production WSGI server
- `psycopg2-binary==2.9.9`: PostgreSQL adapter for Docker deployment

Why pinned versions? Prevents "works on my machine" issues and ensures Docker builds are reproducible.

---

### Frontend React/TypeScript Files

#### **src/main.tsx**
Application entry point:
```typescript
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
```
Three critical providers:
1. `QueryClientProvider`: Wraps app with React Query, enabling server state management and caching
2. `AuthProvider`: Custom context providing auth state to all components
3. `BrowserRouter`: Enables client-side routing

The nesting order matters: `QueryClientProvider` must wrap `AuthProvider` because auth API calls use React Query, and `BrowserRouter` must wrap everything because `AuthProvider` uses `useNavigate()` internally.

#### **src/App.tsx**
Main component defining route structure:
```typescript
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/routines" element={<RoutineList />} />
    <Route path="/routines/create" element={<CreateRoutine />} />
    <Route path="/routines/:id" element={<RoutineDetail />} />
    <Route path="/workout/:sessionId" element={<ActiveWorkout />} />
    <Route path="/history" element={<WorkoutHistory />} />
    <Route path="/profile" element={<Profile />} />
  </Route>
</Routes>
```
The `ProtectedRoute` component checks if user is authenticated before rendering child routes. If not authenticated, redirects to `/login`. This prevents direct URL access to protected pages.

#### **src/contexts/AuthContext.tsx**
Custom React Context for authentication state management:

**State:**
- `user`: Current user object (username, email, id) or `null`
- `tokens`: Object containing `access` and `refresh` JWT strings or `null`
- `isLoading`: Boolean tracking initial auth check

**Methods:**
- `login(username, password)`: POSTs to `/api/token/`, stores tokens in `localStorage`, updates state
- `register(userData)`: POSTs to `/api/users/register/`, automatically logs in on success
- `logout()`: Clears tokens from `localStorage`, resets state, redirects to home
- `refreshToken()`: POSTs to `/api/token/refresh/`, updates access token before expiration

**Automatic Token Refresh:**
The context includes a `useEffect` hook that runs on mount:
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    if (tokens?.refresh) {
      refreshToken();
    }
  }, 50 * 60 * 1000); // 50 minutes (before 60-min expiration)
  return () => clearInterval(interval);
}, [tokens]);
```
This ensures users stay logged in without manual intervention, as long as they have a valid refresh token (7-day lifetime).

**Initial Auth Check:**
Another `useEffect` hook runs on mount to check if user was previously logged in:
```typescript
useEffect(() => {
  const storedTokens = localStorage.getItem('tokens');
  if (storedTokens) {
    const parsed = JSON.parse(storedTokens);
    setTokens(parsed);
    // Decode JWT to extract user data
    const decoded = jwtDecode(parsed.access);
    setUser({ id: decoded.user_id, username: decoded.username, email: decoded.email });
  }
  setIsLoading(false);
}, []);
```
This enables persistent login across browser sessions.

**Why Context Instead of Redux?**
Auth state is relatively simple (user object + tokens) and only needs to be accessed by a few components. Context API provides sufficient functionality without the boilerplate of Redux actions/reducers/selectors. For more complex state (like the active workout), I use Zustand (see below).

#### **src/services/apiService.ts**
Centralized Axios configuration:
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const tokens = localStorage.getItem('tokens');
  if (tokens) {
    const { access } = JSON.parse(tokens);
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, attempt refresh
      const tokens = localStorage.getItem('tokens');
      if (tokens) {
        const { refresh } = JSON.parse(tokens);
        try {
          const { data } = await axios.post('/api/token/refresh/', { refresh });
          localStorage.setItem('tokens', JSON.stringify(data));
          // Retry original request with new token
          error.config.headers.Authorization = `Bearer ${data.access}`;
          return axios(error.config);
        } catch (refreshError) {
          // Refresh failed, logout
          localStorage.removeItem('tokens');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```
This configuration:
1. Automatically attaches JWT to all requests
2. Handles token expiration gracefully by attempting refresh
3. Logs user out if refresh fails (e.g., refresh token expired)
4. Retries the original failed request after successful refresh

This "transparent retry" pattern means components don't need error handling for expired tokens—the interceptor handles it automatically.

#### **src/services/workoutService.ts**
API wrapper functions for workout-related endpoints:
```typescript
export const workoutService = {
  async getRoutines(params?: { search?: string; ordering?: string }) {
    const { data } = await api.get('/workouts/routines/', { params });
    return data;
  },
  
  async createRoutine(routineData: CreateRoutinePayload) {
    const { data } = await api.post('/workouts/routines/', routineData);
    return data;
  },
  
  async startWorkout(routineId: number) {
    const { data } = await api.post('/workouts/sessions/start/', { routine_id: routineId });
    return data;
  },
  
  async updateSet(sessionId: number, setId: number, setData: { reps_completed: number; weight_used: number; rpe?: number }) {
    const { data } = await api.patch(`/workouts/sessions/${sessionId}/sets/${setId}/`, setData);
    return data;
  },
  
  async completeWorkout(sessionId: number, notes?: string) {
    const { data } = await api.post(`/workouts/sessions/${sessionId}/complete/`, { notes });
    return data;
  },
};
```
Why separate service layer?
1. Centralizes API URL definitions (easier to refactor if endpoints change)
2. Provides TypeScript types for request/response shapes
3. Makes components more testable (can mock `workoutService` instead of mocking `axios` directly)
4. Improves code reusability (multiple components can share the same API call logic)

#### **src/pages/Dashboard.tsx**
Landing page after login, displays user statistics:

**React Query Integration:**
```typescript
const { data: stats, isLoading } = useQuery({
  queryKey: ['userStats'],
  queryFn: () => workoutService.getUserStats(),
});
```
React Query automatically:
- Fetches data on component mount
- Caches the response (subsequent navigations to Dashboard don't re-fetch)
- Provides `isLoading` state for rendering loading spinners
- Refetches on window focus (keeps data fresh)

**Displayed Stats:**
- Total workouts completed
- Total volume lifted (sum of all sets × reps × weight)
- Current streak (consecutive days with workouts)
- Favorite exercises (most frequently logged)
- Recent activity feed (last 5 sessions with date, routine name, duration)

**Chart Integration:**
Uses `recharts` library for data visualization:
```typescript
<LineChart data={stats.volume_by_week}>
  <XAxis dataKey="week" />
  <YAxis />
  <Line type="monotone" dataKey="volume" stroke="#8884d8" />
</LineChart>
```
Shows 12-week rolling volume trend, helping users identify training cycles and fatigue accumulation.

#### **src/pages/CreateRoutine.tsx**
Multi-step form for building custom routines:

**State Management:**
```typescript
const [routineName, setRoutineName] = useState('');
const [exercises, setExercises] = useState<RoutineExerciseForm[]>([]);

interface RoutineExerciseForm {
  exercise_id: number;
  exercise_name: string;
  sets: RoutineSetForm[];
}

interface RoutineSetForm {
  set_type: string;
  target_reps_min: number;
  target_reps_max: number;
  target_weight?: number;
  rest_seconds: number;
  order: number;
}
```
The form state mirrors the nested structure expected by the backend API, making submission straightforward.

**Dynamic Exercise Addition:**
```typescript
const addExercise = () => {
  setExercises([
    ...exercises,
    { exercise_id: selectedExerciseId, exercise_name: selectedExerciseName, sets: [] }
  ]);
};

const addSetToExercise = (exerciseIndex: number) => {
  const updatedExercises = [...exercises];
  updatedExercises[exerciseIndex].sets.push({
    set_type: 'Working',
    target_reps_min: 8,
    target_reps_max: 12,
    rest_seconds: 90,
    order: updatedExercises[exerciseIndex].sets.length + 1,
  });
  setExercises(updatedExercises);
};
```
Users can add/remove exercises and sets dynamically, with the form automatically renumbering `order` fields.

**Form Submission:**
```typescript
const createMutation = useMutation({
  mutationFn: (data: CreateRoutinePayload) => workoutService.createRoutine(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['routines'] });
    navigate('/routines');
  },
  onError: (error) => {
    toast.error(error.response?.data?.message || 'Failed to create routine');
  },
});

const handleSubmit = () => {
  const payload = {
    name: routineName,
    exercises: exercises.map((ex, idx) => ({
      exercise_id: ex.exercise_id,
      order: idx + 1,
      sets: ex.sets,
    })),
  };
  createMutation.mutate(payload);
};
```
React Query's `useMutation` handles the POST request, automatically invalidates cached routine list data (triggering a refetch), and navigates to the routine list on success.

**Validation:**
```typescript
const isValid = routineName.trim() && exercises.length > 0 && exercises.every(ex => ex.sets.length > 0);
```
Submit button is disabled unless routine has a name, at least one exercise, and each exercise has at least one set.

#### **src/pages/ActiveWorkout.tsx**
The most complex frontend component, managing live workout execution:

**Zustand Store for Workout State:**
```typescript
interface WorkoutState {
  currentExerciseIndex: number;
  currentSetIndex: number;
  isResting: boolean;
  restTimeRemaining: number;
  sessionStartTime: number;
  sessionData: Session | null;
  
  nextSet: () => void;
  completeSet: (reps: number, weight: number, rpe?: number) => void;
  startRest: (duration: number) => void;
  skipRest: () => void;
}

const useWorkoutStore = create<WorkoutState>((set, get) => ({
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  isResting: false,
  restTimeRemaining: 0,
  sessionStartTime: Date.now(),
  sessionData: null,
  
  nextSet: () => {
    const { currentSetIndex, currentExerciseIndex, sessionData } = get();
    const currentExercise = sessionData.exercises[currentExerciseIndex];
    if (currentSetIndex + 1 < currentExercise.sets.length) {
      set({ currentSetIndex: currentSetIndex + 1 });
    } else if (currentExerciseIndex + 1 < sessionData.exercises.length) {
      set({ currentExerciseIndex: currentExerciseIndex + 1, currentSetIndex: 0 });
    } else {
      // Workout complete
      set({ isResting: false });
    }
  },
  
  startRest: (duration: number) => {
    set({ isResting: true, restTimeRemaining: duration });
  },
  
  // ... other actions
}));
```
Why Zustand instead of useState?
- Workout state is shared across multiple components (timer, set form, exercise list)
- State updates need to trigger re-renders across the component tree
- Zustand provides Redux-like state management without boilerplate

**Timer Logic:**
```typescript
useEffect(() => {
  if (isResting && restTimeRemaining > 0) {
    const interval = setInterval(() => {
      const newTime = restTimeRemaining - 1;
      if (newTime <= 0) {
        skipRest();
      } else {
        set({ restTimeRemaining: newTime });
      }
    }, 1000);
    return () => clearInterval(interval);
  }
}, [isResting, restTimeRemaining]);
```
Updates rest timer every second, automatically transitions to next set when rest completes.

**Set Completion Flow:**
```typescript
const completeSetMutation = useMutation({
  mutationFn: ({ setId, reps, weight, rpe }: CompleteSetParams) => 
    workoutService.updateSet(sessionId, setId, { reps_completed: reps, weight_used: weight, rpe }),
  onSuccess: () => {
    const restDuration = currentSet.rest_seconds;
    startRest(restDuration);
    setTimeout(() => nextSet(), restDuration * 1000);
  },
});

const handleSetComplete = () => {
  completeSetMutation.mutate({
    setId: currentSet.id,
    reps: repsInput,
    weight: weightInput,
    rpe: rpeInput,
  });
};
```
When user completes a set:
1. Optimistically update UI (show set as complete)
2. POST data to backend
3. Start rest timer
4. Automatically advance to next set when rest expires

**Pre-populated Values:**
```typescript
const currentSet = sessionData.exercises[currentExerciseIndex].sets[currentSetIndex];
const [repsInput, setRepsInput] = useState(currentSet.last_session_reps || currentSet.target_reps_min);
const [weightInput, setWeightInput] = useState(currentSet.last_session_weight || currentSet.target_weight);
```
Form fields initialize with "last session" data if available, otherwise fall back to target values from the routine template. This is the "progressive overload intelligence" feature.

**Mobile-Optimized UI:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Exercise List - Hidden on mobile during set */}
  <div className="hidden md:block">
    <ExerciseList exercises={sessionData.exercises} currentIndex={currentExerciseIndex} />
  </div>
  
  {/* Set Form - Full width on mobile */}
  <div className="col-span-1 md:col-span-1">
    <SetForm 
      onComplete={handleSetComplete}
      reps={repsInput}
      setReps={setRepsInput}
      weight={weightInput}
      setWeight={setWeightInput}
    />
  </div>
  
  {/* Timer - Always visible */}
  <div className="col-span-1">
    <WorkoutTimer isResting={isResting} timeRemaining={restTimeRemaining} />
  </div>
</div>
```
Uses Tailwind's responsive classes: `hidden md:block` hides exercise list on mobile (where screen space is limited) but shows it on desktop. `col-span-1 md:col-span-1` makes the set form full width on mobile but 1/3 width on desktop.

#### **src/components/WorkoutTimer.tsx**
Reusable timer component:
```typescript
interface WorkoutTimerProps {
  isResting: boolean;
  timeRemaining: number;
  sessionDuration: number;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ isResting, timeRemaining, sessionDuration }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="text-center">
        <div className="text-sm text-gray-400 mb-2">
          {isResting ? 'Rest Time' : 'Session Time'}
        </div>
        <div className={`text-4xl font-bold ${isResting ? 'text-red-500' : 'text-green-500'}`}>
          {isResting ? formatTime(timeRemaining) : formatTime(sessionDuration)}
        </div>
      </div>
    </div>
  );
};
```
Displays session duration when working, rest countdown when resting. Color-coded for quick visual feedback (green = working, red = resting).

#### **src/pages/WorkoutHistory.tsx**
Lists past workout sessions with filtering and detail viewing:

**React Query for Data Fetching:**
```typescript
const { data: sessions, isLoading } = useQuery({
  queryKey: ['sessions', { date_range: dateRange, routine_id: routineFilter }],
  queryFn: () => workoutService.getSessions({ date_range: dateRange, routine_id: routineFilter }),
});
```
The `queryKey` includes filter params, so React Query automatically refetches when user changes filters (e.g., selecting a date range).

**Date Range Picker:**
```typescript
const [dateRange, setDateRange] = useState<[Date, Date]>([startOfMonth(new Date()), endOfMonth(new Date())]);

<DatePicker
  selectsRange
  startDate={dateRange[0]}
  endDate={dateRange[1]}
  onChange={(range) => setDateRange(range)}
/>
```
Allows users to filter sessions by arbitrary date ranges (e.g., "show me all workouts in October 2024").

**Session Details Modal:**
```typescript
const [selectedSession, setSelectedSession] = useState<Session | null>(null);

<Modal isOpen={!!selectedSession} onClose={() => setSelectedSession(null)}>
  {selectedSession && (
    <div>
      <h3>{selectedSession.routine_name}</h3>
      <p>Duration: {formatDuration(selectedSession.duration)}</p>
      <p>Total Volume: {selectedSession.total_volume} lbs</p>
      {selectedSession.exercises.map(ex => (
        <div key={ex.id}>
          <h4>{ex.exercise_name}</h4>
          {ex.sets.map(set => (
            <div key={set.id}>
              Set {set.order}: {set.reps_completed} reps × {set.weight_used} lbs
            </div>
          ))}
        </div>
      ))}
    </div>
  )}
</Modal>
```
Clicking a session in the history list opens a modal showing full set-by-set details. This allows users to review past performance without leaving the history page.

#### **src/pages/ExerciseLibrary.tsx**
Browsable catalog of all exercises:

**Search and Filtering:**
```typescript
const [searchTerm, setSearchTerm] = useState('');
const [muscleGroupFilter, setMuscleGroupFilter] = useState<string[]>([]);
const [equipmentFilter, setEquipmentFilter] = useState<string[]>([]);

const { data: exercises } = useQuery({
  queryKey: ['exercises', searchTerm, muscleGroupFilter, equipmentFilter],
  queryFn: () => workoutService.getExercises({
    search: searchTerm,
    muscle_groups: muscleGroupFilter.join(','),
    equipment: equipmentFilter.join(','),
  }),
});
```
Multiple filter dimensions: text search, muscle group checkboxes, equipment checkboxes. React Query refetches when any filter changes.

**Exercise Cards:**
```tsx
{exercises.map(exercise => (
  <div key={exercise.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition">
    <img src={exercise.image_url} alt={exercise.name} className="w-full h-48 object-cover rounded-lg mb-4" />
    <h3 className="text-xl font-bold">{exercise.name}</h3>
    <div className="flex flex-wrap gap-2 mt-2">
      {exercise.muscle_groups.map(mg => (
        <span key={mg} className="px-2 py-1 bg-blue-600 rounded text-xs">{mg}</span>
      ))}
    </div>
    <p className="text-gray-400 text-sm mt-2">{exercise.description}</p>
    <div className="flex justify-between items-center mt-4">
      <span className="text-sm text-gray-500">Used by {exercise.times_used} users</span>
      <button onClick={() => addToRoutine(exercise.id)}>Add to Routine</button>
    </div>
  </div>
))}
```
Card layout with hover effects, muscle group tags, usage statistics, and quick "add to routine" button.

**Create Exercise Modal:**
Registered users can click "Create Exercise" to open a modal form:
```typescript
const createExerciseMutation = useMutation({
  mutationFn: (data: CreateExercisePayload) => workoutService.createExercise(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['exercises'] });
    toast.success('Exercise created! It will appear in your library.');
  },
});
```
Form includes fields for name, description, muscle groups (multi-select), equipment, difficulty, and public/private toggle.

#### **src/pages/Progress.tsx**
Analytics dashboard with charts and statistics:

**Exercise Progress Chart:**
```typescript
const { data: exerciseHistory } = useQuery({
  queryKey: ['exerciseHistory', selectedExercise, timeRange],
  queryFn: () => workoutService.getExerciseHistory(selectedExercise, timeRange),
});

<LineChart data={exerciseHistory} width={600} height={300}>
  <XAxis dataKey="date" />
  <YAxis yAxisId="left" label="Weight (lbs)" />
  <YAxis yAxisId="right" orientation="right" label="Reps" />
  <Line yAxisId="left" type="monotone" dataKey="max_weight" stroke="#8884d8" name="Max Weight" />
  <Line yAxisId="right" type="monotone" dataKey="max_reps" stroke="#82ca9d" name="Max Reps" />
</LineChart>
```
Dual-axis chart showing weight and reps over time for a selected exercise, revealing strength progression patterns.

**Muscle Group Volume Breakdown:**
```typescript
const { data: volumeData } = useQuery({
  queryKey: ['muscleGroupVolume', timeRange],
  queryFn: () => workoutService.getMuscleGroupVolume(timeRange),
});

<BarChart data={volumeData}>
  <XAxis dataKey="muscle_group" />
  <YAxis label="Volume (lbs)" />
  <Bar dataKey="volume" fill="#8884d8" />
</BarChart>
```
Shows total volume per muscle group, helping users identify imbalances (e.g., "I'm doing way more chest volume than back").

**Personal Records Table:**
```typescript
const { data: prs } = useQuery({
  queryKey: ['personalRecords'],
  queryFn: () => workoutService.getPersonalRecords(),
});

<table>
  <thead>
    <tr>
      <th>Exercise</th>
      <th>Max Weight</th>
      <th>Max Reps</th>
      <th>Max Volume (Single Set)</th>
      <th>Date Achieved</th>
    </tr>
  </thead>
  <tbody>
    {prs.map(pr => (
      <tr key={pr.exercise_id}>
        <td>{pr.exercise_name}</td>
        <td>{pr.max_weight} lbs</td>
        <td>{pr.max_reps}</td>
        <td>{pr.max_single_set_volume} lbs</td>
        <td>{formatDate(pr.date)}</td>
      </tr>
    ))}
  </tbody>
</table>
```
Displays personal records with dates, giving users concrete milestones to beat.

#### **src/types/index.ts**
Centralized TypeScript type definitions:
```typescript
export interface User {
  id: number;
  username: string;
  email: string;
  body_weight?: number;
  profile_picture?: string;
}

export interface Exercise {
  id: number;
  name: string;
  description: string;
  muscle_groups: string[];
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  is_public: boolean;
  created_by: string;
  times_used: number;
  routines_using: number;
}

export interface RoutineSet {
  id?: number;
  set_type: 'Warmup' | 'Working' | 'Drop' | 'AMRAP';
  target_reps_min: number;
  target_reps_max: number;
  target_weight?: number;
  rest_seconds: number;
  order: number;
}

export interface RoutineExercise {
  id?: number;
  exercise_id: number;
  exercise_name: string;
  order: number;
  notes?: string;
  sets: RoutineSet[];
}

export interface Routine {
  id: number;
  name: string;
  description?: string;
  is_public: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  created_at: string;
  updated_at: string;
  exercises: RoutineExercise[];
}

export interface SessionSet {
  id: number;
  reps_completed: number;
  weight_used: number;
  rpe?: number;
  completed_at: string;
  order: number;
  last_session_reps?: number;
  last_session_weight?: number;
}

export interface SessionExercise {
  id: number;
  exercise_id: number;
  exercise_name: string;
  order: number;
  sets: SessionSet[];
}

export interface Session {
  id: number;
  routine_id: number;
  routine_name: string;
  started_at: string;
  completed_at?: string;
  is_completed: boolean;
  notes?: string;
  exercises: SessionExercise[];
  total_volume?: number;
  duration?: number;
}

export interface CreateRoutinePayload {
  name: string;
  description?: string;
  is_public: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: Array<{
    exercise_id: number;
    order: number;
    notes?: string;
    sets: Omit<RoutineSet, 'id'>[];
  }>;
}
```
Why centralized types?
1. Ensures consistency across components (everyone agrees on what a `Routine` looks like)
2. Enables refactoring (change `Exercise` interface once, TypeScript catches all places needing updates)
3. Improves IDE autocomplete (IntelliSense shows available properties)
4. Catches bugs at compile time (accessing `routine.name` when `name` doesn't exist on `Routine` is a type error)

#### **vite.config.ts**
Vite build configuration:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```
The proxy configuration allows the frontend to make requests to `/api/...` which Vite forwards to `http://localhost:8000/api/...`, avoiding CORS issues during development.

#### **tailwind.config.js**
Tailwind CSS configuration:
```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',  // Blue
        secondary: '#10b981',  // Green
        accent: '#f59e0b',  // Orange
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```
Defines custom color palette and font stack used throughout the app. Extending the theme rather than overwriting it preserves Tailwind's default utilities.

#### **package.json**
Frontend dependencies and scripts:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "@tanstack/react-query": "^5.12.0",
    "zustand": "^4.4.7",
    "recharts": "^2.10.3",
    "react-datepicker": "^4.25.0",
    "jwt-decode": "^4.0.0",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/react": "^18.2.43",
    "vite": "^5.0.7",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx"
  }
}
```
Key dependencies:
- `@tanstack/react-query`: Server state management and caching
- `zustand`: Client state management (workout state machine)
- `recharts`: Data visualization (charts on Progress page)
- `jwt-decode`: Decoding JWTs without verification (for extracting user info)
- `react-hot-toast`: Toast notifications for user feedback

---

## 🚀 How to Run the Application

This section provides step-by-step instructions for running 7Fit7 locally on your development machine.

### **Prerequisites**
Ensure you have the following installed:
- **Python 3.11+**: Required for Django backend
- **Node.js 18+**: Required for React frontend and npm packages
- **pip**: Python package manager (included with Python)
- **Docker & Docker Compose** (Optional but recommended): Simplifies setup by containerizing the application

### **Option 1: Running with Docker (Recommended)**

Docker Compose orchestrates both the backend and frontend in isolated containers with automatic dependency installation.

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/CapBraco/7fit7.git
   ```

2. **Start Docker Services:**
   ```bash
   docker-compose up -d --build
   ```
   This command:
   - Builds Docker images for both backend (Python/Django) and frontend (Node/React)
   - Installs all dependencies from `requirements.txt` and `package.json`
   - Runs database migrations automatically
   - Starts both servers in detached mode

3. **Access the Application:**
   - **Frontend (Browser):** http://localhost:5173
   - **Backend API:** http://localhost:8000/api
   - **Django Admin Panel:** http://localhost:8000/admin

4. **Create a Superuser (for Admin Panel Access):**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```
   Follow the prompts to set username, email, and password.

5. **Stop Services:**
   ```bash
   docker-compose down
   ```

### **Option 2: Manual Setup (Without Docker)**

If you prefer to run the application directly on your machine:

#### **Backend Setup:**

1. **Navigate to Backend Directory:**
   ```bash
   cd backend
   ```

2. **Create and Activate Virtual Environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate       # macOS/Linux
   venv\Scripts\activate          # Windows
   ```

3. **Install Python Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Database Migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create Superuser (for Admin Panel Access):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Load Initial Data (Optional - Seed Database with Sample Exercises):**
   ```bash
   python manage.py loaddata exercises
   ```

7. **Start Django Development Server:**
   ```bash
   python manage.py runserver
   ```
   Backend will be available at http://localhost:8000

#### **Frontend Setup:**

1. **Open a New Terminal and Navigate to Frontend Directory:**
   ```bash
   cd frontend
   ```

2. **Install Node Dependencies:**
   ```bash
   npm install
   ```

3. **Start React Development Server:**
   ```bash
   npm run dev
   ```
   Frontend will be available at http://localhost:5173

4. **Access the Application:**
   - Open your browser and navigate to http://localhost:5173
   - You should see the 7Fit7 landing page
   - Register a new account or log in with your superuser credentials

### **Troubleshooting Common Issues:**

**Port Already in Use:**
If ports 8000 or 5173 are already occupied:
- Backend: Change port in `python manage.py runserver 8001`
- Frontend: Change port in `vite.config.ts` (modify `server.port`)

**CORS Errors:**
If the frontend can't connect to the backend:
- Ensure `config/settings.py` has `CORS_ALLOWED_ORIGINS = ['http://localhost:5173']`
- Restart the backend server after modifying settings

**Database Errors:**
If migrations fail:
```bash
python manage.py migrate --run-syncdb
```

**Missing Dependencies:**
If you see import errors:
- Backend: `pip install -r requirements.txt`
- Frontend: `rm -rf node_modules && npm install`

---

## 📝 Additional Information

### **Testing the Application**

To get a feel for the full feature set:

1. **Register a User Account:** Create an account on the registration page
2. **Browse the Exercise Library:** Explore the pre-seeded exercises (or create your own)
3. **Create a Routine:** Build a custom workout routine with multiple exercises and sets
4. **Start a Workout:** Click "Start Workout" on your routine to enter the ActiveWorkout interface
5. **Complete a Session:** Log reps and weights for each set, observe the rest timer, and complete the workout
6. **View Analytics:** Check the Progress page to see charts of your strength progression and personal records
7. **Review History:** Browse your workout history to see past sessions and detailed set-by-set logs

### **Future Enhancements**

While the current version is fully functional, potential future features include:

- **Mobile App:** Native iOS/Android app for better in-gym experience
- **Social Features:** Ability to share routines with friends and view community leaderboards
- **Advanced Analytics:** Machine learning predictions for plateau detection and personalized volume recommendations
- **Wearable Integration:** Sync heart rate data from Apple Watch/Fitbit for RPE auto-population
- **Nutrition Tracking:** Integrate with MyFitnessPal API for comprehensive fitness tracking
- **Coaching Features:** Allow personal trainers to assign programs to clients and monitor compliance

### **Technology Stack Rationale**

**Why Django?**
- Rapid development with "batteries included" philosophy (admin panel, ORM, auth system)
- Excellent for complex relational data models (7+ models with nested relationships)
- Django REST Framework provides robust API serialization and validation
- Strong community and extensive third-party packages

**Why React?**
- Component-based architecture ideal for reusable UI elements (timer component, exercise cards)
- Virtual DOM provides excellent performance for frequently updating UI (workout timers)
- Rich ecosystem of libraries (React Query for server state, Zustand for client state, Recharts for visualizations)
- TypeScript integration catches bugs at compile time

**Why PostgreSQL (in Docker)?**
- Superior support for complex queries (JOINs across 5+ tables for analytics)
- ACID compliance ensures data integrity for financial-like precision (workout logs are permanent records)
- Better performance than SQLite for production workloads

**Why JWT Instead of Session Cookies?**
- Stateless authentication scales better (no session storage on backend)
- Enables future mobile app development (mobile apps can store tokens easily)
- Works seamlessly with React SPA architecture (no CSRF concerns)

### **Security Considerations**

The application implements several security best practices:

1. **Password Hashing:** Uses Django's `make_password()` with PBKDF2+SHA256 (60,000 iterations)
2. **Token Expiration:** Access tokens expire in 60 minutes, refresh tokens in 7 days
3. **CORS Policy:** Only allows requests from whitelisted origins
4. **SQL Injection Prevention:** Django ORM automatically parameterizes queries
5. **XSS Protection:** React automatically escapes user-generated content in JSX
6. **CSRF Protection:** Disabled for API (since using JWT) but enabled for Django admin

### **Performance Optimizations**

Several optimizations were implemented to ensure smooth user experience:

1. **Database Indexing:** Foreign keys and frequently queried fields (e.g., `Session.started_at`) have indexes
2. **Query Optimization:** Uses `select_related()` and `prefetch_related()` to avoid N+1 queries
3. **Frontend Caching:** React Query caches API responses for 5 minutes, reducing backend load
4. **Lazy Loading:** Exercise images use lazy loading to improve initial page load time
5. **Debounced Search:** Exercise library search input is debounced (300ms) to reduce API calls
6. **Optimistic Updates:** Workout set completion updates UI immediately before backend confirms

### **Deployment Considerations**

For production deployment, the following changes are recommended:

1. **Environment Variables:** Use `.env` files to store secrets (SECRET_KEY, database credentials)
2. **Static File Serving:** Use Nginx or Cloudflare to serve static assets (CSS, JS, images)
3. **Database:** Switch to PostgreSQL or MySQL for better performance and scalability
4. **HTTPS:** Enforce HTTPS for all connections (especially important for JWT tokens)
5. **Error Monitoring:** Integrate Sentry or Rollbar for production error tracking
6. **CDN:** Serve frontend assets from a CDN for faster global access
7. **Rate Limiting:** Implement API rate limiting to prevent abuse
8. **Backup Strategy:** Automated daily database backups to prevent data loss

---

## 🤝 Contributing

This is a CS50W final project, but feedback and suggestions are welcome! Feel free to open issues on the GitHub repository for bug reports or feature requests.

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 🙏 Acknowledgments

- **CS50W Staff:** For providing comprehensive web development education
- **Django & React Communities:** For excellent documentation and support
- **Beta Testers:** Friends who tested the app and provided valuable UX feedback
- **Inspiration:** Frustration with commercial fitness apps lacking granular set customization was the primary motivation for building 7Fit7

---

**Built with 💪 by Bryan A. Paucar as part of CS50's Web Programming with Python and JavaScript**
