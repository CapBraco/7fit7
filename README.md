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

  <img src="https://img.shields.io/badge/Status-Complete-success?style=for-the-badge" alt="Project Status: Complete Part 1">
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License: MIT">
  </p>
# 🏋️‍♂️ 7Fit7: A Performance-Focused Workout Tracking Platform

## Overview

7Fit7 is a full-stack, performance-focused web application designed to help users structure, track, and analyze their strength training and workout routines. Built using Django for a robust back-end API and React with TypeScript for a dynamic, mobile-responsive front-end, it serves as a sophisticated tool for serious lifters and fitness enthusiasts who require detailed, set-by-set logging and long-term performance analysis.

7Fit7 is a dedicated gym tracker application focused on detailed, granular performance logging. Its core utility is delivered through sophisticated features for the personalization and creation of both routines and individual sets. The application supports both guest and registered users. Guest users can access and utilize public routines and benefit from the real-time Workout Companion, which provides guided tracking. Registered users, however, unlock the full potential, starting with the ability to create and customize their own training routines.

A key distinct feature is the Exercise Contribution System. If a desired exercise is not in the database, a registered user can create a new one, detailing its function, categorizing it by muscle group, and choosing to make it public or private. By publishing exercises publicly, the creator gains community credit: they can track how many other users have used their exercise and how many have included it in a routine, building credibility and reputation. While this introduces a sharing aspect, it is centered entirely around data and utility (exercise content) rather than a global feed or personal interactions, clearly differentiating it from a traditional social network.

Furthermore, 7Fit7 excels in highly customized set creation, a feature rarely offered by commercial fitness apps. Users can define two main types of sets: Fixed Sets (e.g., 4 sets of 12 reps with 60 seconds rest) or sophisticated Custom Sets. Custom Sets allow experienced athletes to define every parameter of a set individually. For instance, a user can create a unique flow for a single exercise, defining a 'Warmup' set, followed by a 'Hypertrophy' set, and then multiple 'Strength' sets, each with unique reps, weight, and rest durations. Crucially, users can clone these custom sets and re-order them, enabling the accurate tracking of advanced workout methodologies like drop sets, timed sets, and high-intensity protocols. This level of set-by-set control allows the user to accurately log complex routines, which is a major point of distinctiveness and complexity.

To facilitate the core training principle of progressive overload, the weight and repetition fields for each set are automatically populated with the values from the user's last completed session. This feature provides an immediate reference to their previous performance, allowing them to make informed decisions about increasing or decreasing the load for the current session. Once a routine is defined, the Workout Companion is activated when the session begins, using a built-in timer to guide the user through their sets and rest periods. Upon finishing, the detailed statistics screen provides performance insights, including: total session duration, volume worked per muscle group, progressive strength evolution, and long-term progress for specific exercises. This focused approach on data capture and temporal analysis ensures the application acts as a comprehensive tool for fitness periodization and progress tracking.

---
## 🎬 Project Demonstration

Watch a full demonstration of 7Fit7's core features, including routine creation, active workout tracking, and history viewing, in the video below.

**Screencast Link:** https://www.youtube.com/watch?v=d1y-WOFjGXM&t=6s


## 📌 Distinctiveness and Complexity: Why this Project is Sufficient

### Distinctiveness from CS50W Projects

Distinctiveness from CS50W Projects

7Fit7 is architecturally and functionally distinct from the course's foundational projects, primarily because its complexity is rooted in nested, time-series performance data management, rather than transactional or social dynamics.

Not an E-commerce Site (Project 2): The application is unequivocally not an e-commerce platform. It involves no transactional data, listings, bidding, or selling products. The core user actions—creating routines, initiating a live session, logging set-by-set data, and analyzing statistics—are entirely focused on data logging and performance analysis. The primary complexity is managing session state and nested data structures across time, which is fundamentally different from the CRUD operations central to a marketplace.

Not a Social Network (Project 4): 7Fit7 is explicitly not a traditional social network. It lacks core Project 4 functionality such as a global timeline, 'following,' or personal post feeds. While it has a component for users to publish exercises and track their utility (a data-focused sharing system), this feature acts solely to enhance the core utility (the exercise library) and build creator reputation based on utility, not personal interaction. The user experience is primarily private and individual, centered on managing their own routines, history, and statistics.

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
