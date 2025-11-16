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

These aspects demonstrate advanced full-stack development and justify the project’s distinctiveness and complexity compared to other CS50W projects.

---

## 🎯 Current Functionality

### **Week 1 – Foundations**
✅ User authentication (JWT)  
✅ User profiles  

### **Week 2 – Workout Structure**
✅ Exercise library  
✅ Create workout routines  
✅ Customize sets per exercise (reps, weight, rest)  

### **Week 3 – Training & Performance**
✅ Active workout tracking  
✅ Rest timer in workout view  
✅ Complete and save workouts  
✅ Workout history  
✅ Detailed workout breakdown  
✅ Basic stats tracking (volume, sets, reps)  

These features form a complete MVP-level application for strength training tracking.

---

## 📁 File & Folder Structure

### **Backend**
backend/
├─ config/ (Django configuration)
│ ├─ asgi.py
│ ├─ settings.py
│ ├─ urls.py
│ └─ wsgi.py
├─ nutrition/ (planned extension for nutrition tracking)
│ ├─ admin.py
│ ├─ apps.py
│ ├─ models.py
│ ├─ views.py
│ └─ migrations/
├─ social/ (planned extension for social features)
│ ├─ admin.py
│ ├─ apps.py
│ ├─ models.py
│ ├─ views.py
│ └─ migrations/
├─ users/ (authentication and user profiles)
│ ├─ admin.py
│ ├─ apps.py
│ ├─ models.py
│ ├─ serializers.py
│ ├─ urls.py
│ └─ views.py
├─ static/ (static assets such as CSS, images)
├─ media/ (uploaded media files)

markdown
Copy code

### **Frontend**
frontend/
├─ public/ (public assets for Vite)
├─ src/
│ ├─ App.tsx (main React application)
│ ├─ main.tsx (application entry point)
│ ├─ components/
│ │ ├─ Navbar.tsx (navigation bar)
│ │ └─ ProtectedRoute.tsx (authentication guard)
│ ├─ contexts/
│ │ └─ AuthContext.tsx (JWT authentication context)
│ ├─ pages/
│ │ ├─ Login.tsx (login page)
│ │ ├─ Register.tsx (registration page)
│ │ ├─ Dashboard.tsx (main user dashboard)
│ │ ├─ Workouts.tsx (view all workouts)
│ │ ├─ CreateRoutine.tsx (create and customize routines, exercises, and sets)
│ │ ├─ ActiveWorkout.tsx (track active training sessions)
│ │ ├─ WorkoutDetail.tsx (view completed workout data)
│ │ └─ History.tsx (historical workouts and statistics)
│ └─ services/
│ └─ workoutService.ts (handles API calls for exercises and routines)
├─ manage.py (Django management commands)
└─ requirements.txt (Python packages and frameworks)

markdown
Copy code

### **Other Files**
- `.gitignore` – Ignored files for git  
- `docker-compose.yml` – Database container setup  
- `LICENSE` – MIT license  
- `README.md` – Project documentation  

---

## ▶️ How to Run the Application

### **Prerequisites**
- Python 3.11+  
- Node.js 18+  
- SQLite (bundled with Django)  
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

📌 Additional Notes for Staff
The project demonstrates multi-level relational models and nested API endpoints.

Active workout sessions update the backend in real-time and include rest timers.

Full mobile responsiveness is implemented.

A demonstration video shows all current features listed above.

🧾 License
MIT License
