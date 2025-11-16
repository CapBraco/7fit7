# 🏋️‍♂️ 7Fit7
### A Performance-Focused Workout Tracking Platform (Django + React)

---

## 📌 Distinctiveness and Complexity

7Fit7 is a full-stack workout performance platform built with **Django REST Framework** and **React + TypeScript**, designed specifically for structured strength training and exercise tracking. Unlike any project in the CS50W course, it is neither an e-commerce website nor a simple social network.

**Why it is distinct:**  
- Focused on **real-time workout execution** and **set-by-set logging** rather than selling products or sharing posts.  
- Features **nested relational models**: Users → Workouts → Exercises → Sessions → Sets, enabling complex workout tracking.  
- Implements **customizable sets** per exercise with optional reps, weights, and rest timers.  

**Why it is complex:**  
- Multi-level backend models with nested serializers and API endpoints.  
- Dynamic workout runner on the frontend with state management (Zustand) and live updates (React Query).  
- Rest timer logic integrated into active workout sessions.  
- Workout history and stats tracking derived from completed sessions.  
- Mobile-responsive design using Tailwind CSS.  
- Fully Dockerized backend with SQLite for rapid setup.  

---

## 🎯 Current Functionality

✅ User authentication (JWT)  
✅ User profiles  
✅ Exercise library  
✅ Create workout routines  
✅ Customize sets per exercise (reps, weight, rest)  
✅ Active workout tracking  
✅ Rest timer in workout view  
✅ Complete and save workouts  
✅ Workout history  
✅ Detailed workout breakdown  
✅ Basic stats tracking (volume, sets, reps)  
---

## 📁 File & Folder Structure

### **Backend**
- **config/** – Django project configuration (settings, URLs, WSGI/ASGI).  
- **nutrition/** – Models and views for nutrition features (planned extension).  
- **social/** – Models and views for social/community features (planned extension).  
- **users/** – Handles authentication, user profiles, serializers, and API endpoints.  
- **static/** – Static assets such as CSS, images, or JS files.  
- **media/** – Uploaded media files.  
- **manage.py** – Django management script for migrations, server, etc.  
- **requirements.txt** – List of Python dependencies and frameworks.

### **Frontend**
- **public/** – Public assets for the Vite React app (images, favicon, etc.).  
- **src/** – Main source code folder containing all React logic:  
  - **App.tsx & main.tsx** – Application entry points.  
  - **components/** – Reusable UI components (Navbar, ProtectedRoute).  
  - **contexts/** – Global state and JWT authentication (AuthContext).  
  - **pages/** – Main app pages: Login, Register, Dashboard, Workouts, CreateRoutine, ActiveWorkout, WorkoutDetail, and History.  
  - **services/** – API services for workouts, routines, and user data.  

- **manage.py** – Django management commands (backend).  
- **requirements.txt** – Python packages for backend.  


## ▶️ How to Run the Application

### **Prerequisites**
- Python 3.11+  
- Node.js 18+  
- postgresql
- Docker (optional for database and media)

### **1. Clone the repo**
```bash
git clone https://github.com/CapBraco/7fit7.git
cd 7fit7
2. Start Docker services (optional)
bash
Copy code
docker-compose up -d
3. Backend Setup
bash
Copy code
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
4. Frontend Setup
bash
Copy code
cd src
npm install
npm run dev
Access
Frontend: http://localhost:5173

API: http://localhost:8000/api

Admin Panel: http://localhost:8000/admin
