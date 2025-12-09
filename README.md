# 🏋️‍♂️ 7Fit7: A Performance-Focused Workout Tracking Platform

## Overview

7Fit7 is a full-stack, performance-focused web application designed to help users structure, track, and analyze their strength training and workout routines. Built using Django for a robust back-end API and React with TypeScript for a dynamic, mobile-responsive front-end, it serves as a sophisticated tool for serious lifters and fitness enthusiasts who require detailed, set-by-set logging and long-term performance analysis.

7Fit7 is a dedicated gym tracker application focused on detailed, granular performance logging. Its core utility is delivered through sophisticated features for the personalization and creation of both routines and individual sets.

The application supports both guest and registered users. Guest users can access and utilize public routines and benefit from the real-time Workout Companion, which provides guided tracking. Registered users, however, unlock the full potential, starting with the ability to create and customize their own training routines.

A key distinct feature is the **Exercise Contribution System**. If a desired exercise is not in the database, a registered user can create a new one, detailing its function, categorizing it by muscle group, and choosing to make it public or private. By publishing exercises publicly, the creator gains community credit: they can track how many other users have used their exercise and how many have included it in a routine, building credibility and reputation. While this introduces a sharing aspect, it is centered entirely around data and utility (exercise content) rather than a global feed or personal interactions, clearly differentiating it from a traditional social network.

Furthermore, 7Fit7 excels in **highly customized set creation**, a feature rarely offered by commercial fitness apps. Users can define two main types of sets:

- **Fixed Sets** (e.g., 4 sets of 12 reps with 60 seconds rest)
- **Custom Sets**, which allow experienced athletes to define every parameter individually

For example, a user can define a “Warmup” set, followed by a “Hypertrophy” set, then several “Strength” sets — each with unique reps, weight, and rest durations. Users can also clone and reorder sets, enabling advanced workout strategies such as drop sets, timed sets, and intensity protocols.

To support progressive overload, weight and rep fields automatically populate using values from the user’s previous session.

Once a routine begins, the **Workout Companion** uses a built-in timer to guide the session. After completion, the detailed statistics screen provides insights such as:

- Total session duration  
- Volume per muscle group  
- Progressive strength evolution  
- Long-term exercise performance  

---

## 🎬 Project Demonstration

Watch a full demonstration of 7Fit7's features:

**Screencast Link:**  
https://www.youtube.com/watch?v=d1y-WOFjGXM&t=6s

---

## 📌 Distinctiveness and Complexity: Why this Project is Sufficient

### Distinctiveness from CS50W Projects

#### Not an E-commerce Site (Project 2)
The application is not an e-commerce platform. There is no transactional data, bidding, or selling. The complexity lies in session state, nested performance data, and time-series logs — not marketplace CRUD operations.

#### Not a Social Network (Project 4)
There is no global feed, following system, or personal posts.  
The exercise publishing system is purely utility-based, not social-driven.

### Architectural and Functional Complexity

#### 1. Nested Relational Data Model with Custom Logic (Django Backend)
The relational structure includes:

- Routine  
- RoutineExercise  
- RoutineSet  
- Session  
- SessionExercise  
- SessionSet  

Custom set creation and nested serializers introduce significant complexity beyond simple CRUD.

#### 2. Dynamic Frontend Session State Management (React & TypeScript)
The `ActiveWorkout.tsx` component handles:

- Current set/exercise state  
- Live rest timer  
- Real-time logging and syncing with Django  
- Zustand for internal state  
- React Query for caching and mutations  

#### 3. Mobile-Responsiveness and Design
Tailwind CSS ensures responsive UI for workouts performed on mobile devices.

---

## 💻 File Documentation: My Code Contributions

| File Path | Purpose and Contents |
|----------|-----------------------|
| **users/models.py** | Custom User model based on AbstractUser, includes performance-related fields. |
| **users/views.py** | UserViewSet, JWT creation/refresh, DRF permissions. |
| **workouts/models.py** | Core schema: Exercise, Routine, RoutineExercise, RoutineSet, Session, SessionExercise, SessionSet. |
| **workouts/serializers.py** | Nested DRF serializers supporting complex routine/session creation. |
| **workouts/views.py** | DRF ViewSets for Exercise, Routine, Session, stats endpoints. |
| **config/settings.py** | Django config, DB setup, CORS, JWT, Docker compatibility. |
| **requirements.txt** | Django, DRF, Pillow, SimpleJWT, Gunicorn, etc. |
| **src/pages/ActiveWorkout.tsx** | Full session control, timers, transitions, set logging. |
| **src/pages/CreateRoutine.tsx** | Dynamic routine creation UI with nested sets/exercises. |
| **src/contexts/AuthContext.tsx** | JWT auth management and ProtectedRoute logic. |
| **src/components/WorkoutTimer.tsx** | Countdown timer component for rest periods. |
| **src/services/apiService.ts** | Axios instance + JWT interceptor. |
| **src/pages/Dashboard.tsx** | Aggregated statistics fetching and display. |

---

## 🚀 How to Run the Application

### Prerequisites
- Python 3.11+  
- Node.js 18+  
- Docker & Docker Compose (recommended)

---

### 1. Clone the Repository and Navigate

```bash
git clone https://github.com/me50/CapBraco.git
cd 7fit7
```
### 2. Start Docker Services (Recommended)
```
docker-compose up -d --build
```
### 3. Manual Backend Setup (If not using Docker)
```
cd backend
python -m venv venv
```
# macOS/Linux
```
source venv/bin/activate
```
# Windows
```
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
### 4. Frontend Setup
```
cd frontend
npm install
npm run dev
```
### 5. Access the Application

Frontend: http://localhost:5173

API Root: http://localhost:8000/api

Django Admin: http://localhost:8000/admin
