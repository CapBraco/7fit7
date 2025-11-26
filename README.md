# 🏋️‍♂️ 7Fit7: A Performance-Focused Workout Tracking Platform

## Overview

7Fit7 is a full-stack, performance-focused web application designed to help users structure, track, and analyze their strength training and workout routines. Built using **Django** for the robust back-end API and **React with TypeScript** for the dynamic, mobile-responsive front-end, it serves as a sophisticated tool for serious lifters and fitness enthusiasts who require detailed, set-by-set logging of their exercise sessions.

---
## 🎬 Project Demonstration

Watch a full demonstration of 7Fit7's core features, including routine creation, active workout tracking, and history viewing, in the video below.

**Screencast Link:** https://www.youtube.com/watch?v=d1y-WOFjGXM&t=6s


## 📌 Distinctiveness and Complexity: Why this Project is Sufficient

### Distinctiveness from CS50W Projects

7Fit7 is architecturally and functionally distinct from the course's foundational projects, which largely focused on social networking, e-commerce, or simple knowledge-based systems.

1.  **Not E-commerce (Project 2):** While a user *could* track a workout routine, the core of 7Fit7 is not about transactions, listings, bidding, or selling products. The application's main purpose is **data logging and performance analysis**. The primary user actions involve creating structured routines, initiating a live workout session, logging sets (reps, weight), and completing a session, which is fundamentally different from the CRUD operations central to an e-commerce platform. The complexity lies in managing session state and nested data structures, not marketplace dynamics.
2.  **Not a Social Network (Project 4):** 7Fit7 is explicitly **not** a social network. It does not feature 'following,' a global timeline, or any public-facing mechanisms for viewing other users' activity. While it has user authentication and profiles, its purpose is **private, individual performance tracking**. The user interaction is with their *own data* (routines, history, statistics), not with a feed of other users' posts or comments. It lacks the core functionality that defines a social network.

### Architectural and Functional Complexity

The complexity of 7Fit7 stems from its nested data models, dynamic state management during an active session, and the calculation of performance statistics from raw log data.

**1. Nested Relational Data Model (Django Backend):**
The application uses a **deeply nested relational model** implemented with Django ORM to capture the necessary granularity for strength training:
* A **Routine** contains multiple **RoutineExercises**.
* A **RoutineExercise** is linked to a base **Exercise** (e.g., Squat) and defines specific **RoutineSets** (e.g., 3 sets of 10 reps).
* When a user starts a workout, the system generates a **Session** object, which contains **SessionExercises**, which in turn contain the logged **SessionSets**.
This structure necessitates complex **Django REST Framework (DRF) serializers** (including nested serializers) and custom view logic to handle the creation and updating of entire workout sessions in a single API call, validating and saving data across five different models simultaneously.

**2. Dynamic Frontend State Management (React & TypeScript):**
The `ActiveWorkout.tsx` page is the most complex front-end component. It requires **real-time state management** (using React's context/hooks and a library like **Zustand**) to track the live progress of the user through a routine. This includes:
* Managing the state of the **current set, current exercise, and overall session time.**
* Implementing and running a **Rest Timer** that automatically pauses the workout flow and updates the UI every second.
* Handling user input for reps and weight for a set, saving it instantly, and automatically transitioning the user to the next set/exercise upon completion.
* Using a state management library (like **React Query**) to handle asynchronous API updates and data fetching, ensuring the local state and the Django back-end database remain synchronized throughout the session.
* 
<img width="2879" height="1628" alt="image" src="https://github.com/user-attachments/assets/64f29ab3-ed22-4b13-a6c3-1d356c5a49dd" />


**3. Mobile-Responsiveness and Design:**
The application must be fully functional and aesthetically pleasing on both desktop and mobile devices. This was achieved using **Tailwind CSS** for a utility-first approach to styling, implementing complex flexbox and grid layouts to ensure the `ActiveWorkout` interface remains usable and clear on small screens, which is crucial for an application used *during* physical activity.

<img width="2874" height="1622" alt="image" src="https://github.com/user-attachments/assets/9cd54892-db96-42ff-92db-3a13fb45a02f" />

---

## 💻 File Documentation: My Code Contributions

The following outlines the purpose and contents of the primary files I created or significantly modified for this project, highlighting the areas of core logic and functionality.

| File Path | Purpose and Contents |
| :--- | :--- |
| **users/models.py** | Defines the custom `User` model, extending Django's built-in `AbstractUser` to include performance-related fields, necessary for managing user profiles and authentication tokens. |
| **users/views.py** | Contains the API view logic for user management, including the `UserViewSet` for profile retrieval, update, and the custom view for JWT token creation and refresh. Implements Django REST Framework's **ViewSets and permissions**. |
| **workouts/models.py** | This is the **most complex model file**, defining the core relational schema: `Exercise`, `Routine`, `RoutineExercise`, `RoutineSet`, `Session`, `SessionExercise`, and `SessionSet`. This includes all the foreign key relationships and custom methods for data integrity. **This file utilizes the at least one model requirement.** |
| **workouts/serializers.py** | Implements the **nested DRF serializers** required to handle the complex relationships defined in `models.py`. For example, the `RoutineSerializer` nests `RoutineExerciseSerializer` and `RoutineSetSerializer` to allow a user to create a complete routine structure in a single POST request. |
| **workouts/views.py** | Houses the core application logic via DRF ViewSets for `Exercise`, `Routine`, `Session`, and statistical endpoints. This includes custom filtering for user-specific data and dedicated actions for starting and completing a workout session, updating **SessionSets** as the user logs them. |
| **config/settings.py** | Configuration for Django, including environment variables, database setup (configured for SQLite and Docker for development), CORS configuration to allow the React front-end to connect, and **JWT settings** (using `djangorestframework-simplejwt`). |
| **requirements.txt** | Lists all required Python packages: `django`, `djangorestframework`, `Pillow`, `gunicorn`, `djangorestframework-simplejwt`, among others. |
| **src/pages/ActiveWorkout.tsx** | The **most complex front-end component**. This page manages the entire live workout session. It contains the logic for **timer control** (handling rest and work time), state transitions between sets/exercises, and the forms for logging reps and weight. It uses React Query to communicate set completions to the Django API in real-time. |
| **src/pages/CreateRoutine.tsx** | Contains the dynamic form logic for building a multi-exercise routine. It manages the array state of exercises and their corresponding sets, allowing users to add, remove, and edit sets before submitting the entire nested routine object to the backend via a single API call. |
| **src/contexts/AuthContext.tsx** | A custom React Context that handles **JSON Web Token (JWT)** authentication, managing the user's logged-in state, storing and refreshing access tokens, and providing methods for secure login/logout. This is used by the `ProtectedRoute` component to gate access to the app's internal pages. |
| **src/components/WorkoutTimer.tsx** | A reusable component specifically built for the `ActiveWorkout` page. It handles the minute/second display and the countdown logic for the rest timer, receiving the rest duration and triggering a callback when the time is up. |
| **src/services/apiService.ts** | Configures the **Axios** HTTP client with the base URL and an interceptor to **automatically attach the user's JWT access token** to all outgoing requests, ensuring that the backend can authenticate every API interaction. |
| **src/pages/Dashboard.tsx** | Fetches and displays aggregated user performance statistics (total volume, total sets, exercise PRs) by making asynchronous calls to the Django statistics endpoints, presenting the data in a user-friendly format. |

---

## 🚀 How to Run the Application

Follow these steps to run **7Fit7** locally.

### **Prerequisites**
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (recommended for a simple setup)

### 1. Clone the Repository and Navigate
```bash
git clone https://github.com/me50/CapBraco.git
cd 7fit7
```
### 2. Start Docker Services (Recommended)
Using Docker Compose will automatically set up the Python environment, install dependencies, and run the server.

```Bash
docker-compose up -d --build
```
### 3. Manual Backend Setup (If not using Docker)
```Bash

cd backend
python -m venv venv
source venv/bin/activate       # macOS/Linux
venv\Scripts\activate          # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser # Create an admin account
python manage.py runserver
```
### 4. Frontend Setup
```Bash

cd frontend
npm install
# Start the React development server
npm run dev
```
### 5. Access the Application

Frontend (Browser): http://localhost:5173

API Root: http://localhost:8000/api

Django Admin Panel: http://localhost:8000/admin
