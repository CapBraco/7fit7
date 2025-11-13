# 🏋️ 7Fit7

> AI-powered fitness tracking platform with social features

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Django](https://img.shields.io/badge/Django-5.0+-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)](https://www.typescriptlang.org/)

## 🎯 Overview

7fit7 is a comprehensive fitness tracking application that combines intelligent workout planning, progress analytics, and community engagement. Built with Django REST Framework and React, it provides a seamless experience for fitness enthusiasts to track, optimize, and share their fitness journey.

## ✨ Key Features

### 🎪 Workout Management
- Create and customize workout routines
- Real-time workout logging with timers
- Exercise library with detailed instructions
- Progressive overload tracking
- Rest time optimization

### 📊 Progress Analytics
- Visual progress tracking with charts
- AI-powered recommendations
- Volume and intensity analytics
- Personal record tracking
- Body part specific insights

### 🍎 Nutrition Tracking
- Calorie and macro tracking
- Food database integration
- Meal planning
- Hydration monitoring

### 😴 Recovery Tracking
- Sleep logging and analysis
- Recovery recommendations
- Rest day suggestions

### 👥 Social Features
- Share routines with community
- Progress updates with media
- Like, comment, and rate workouts
- Follow other users
- Community challenges

## 🏗️ Tech Stack

### Backend
- **Framework:** Django 5.0 + Django REST Framework
- **Database:** PostgreSQL 15
- **Cache:** Redis
- **Task Queue:** Celery
- **Authentication:** JWT (djangorestframework-simplejwt)
- **API Documentation:** drf-spectacular (OpenAPI 3.0)

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Routing:** React Router v6

### DevOps
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Code Quality:** ESLint, Prettier, Black, Flake8
- **Testing:** Jest, React Testing Library, Pytest

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (recommended)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/7fit7.git
cd 7fit7
```

2. **Start Docker services** (Database & Redis)
```bash
docker-compose up -d
```

3. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

4. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- Admin Panel: http://localhost:8000/admin
- API Docs: http://localhost:8000/api/schema/swagger-ui/

## 📖 Documentation

- [Setup Guide](docs/SETUP.md) - Detailed installation instructions
- [API Documentation](docs/API.md) - API endpoints and usage
- [Contributing Guide](docs/CONTRIBUTING.md) - How to contribute

## 🗺️ Roadmap

### Phase 1: MVP (Weeks 1-4)
- [x] Project setup
- [ ] User authentication
- [ ] Workout CRUD operations
- [ ] Basic workout logging
- [ ] Progress dashboard

### Phase 2: Intelligence (Weeks 5-8)
- [ ] AI recommendations
- [ ] Nutrition tracking
- [ ] Sleep tracking
- [ ] Advanced analytics

### Phase 3: Social (Weeks 9-12)
- [ ] Social feed
- [ ] Workout sharing
- [ ] Community features
- [ ] Challenges & achievements

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **CapBraco** - *Initial work* - [YourGitHub](https://github.com/CapBraco)
git
## 🙏 Acknowledgments

- Django REST Framework team
- React community
- All contributors

## 📧 Contact

Project Link: [https://github.com/CapBraco/7fit7](https://github.com/CapBraco/7fit7)

---

**Built with ❤️ for the fitness community**
