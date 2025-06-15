# Expense Tracker

A full-stack web application for tracking personal expenses, built with Django REST Framework (backend) and React with Vite and Tailwind CSS (frontend). The application allows users to register, log in, manage expenses, and view spending summaries via interactive charts. It includes a dedicated admin panel for staff users to oversee all expenses, with secure JWT-based authentication and role-based access control.

## Features
- User registration and login with JWT authentication.
- Add, edit, delete, and filter expenses by date or category.
- View spending summaries with pie charts.
- Admin panel to view and manage all users' expenses.
- Responsive design with Tailwind CSS.

## Tech Stack
- Backend: Django, Django REST Framework, SimpleJWT, SQLite
- Frontend: React, Vite, React Router, Tailwind CSS, Axios, Chart.js

## Prerequisites
- Python 3.11+
- Node.js 18+
- npm 8+

## Installation

### 1. Clone the repository
```bash
  git clone https://github.com/Rabeeh-m/expense-tracker.git
  cd expense-tracker
```

### 2. Set up the backend
```bash
  cd backend
  python -m venv venv
  source venv/bin/activate     # Windows: venv\Scripts\activate
  pip install -r requirements.txt

  echo "SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')" > .env

  python manage.py migrate
  python manage.py createsuperuser  # Create admin user
  python manage.py runserver
```

### 3. Set up the frontend
```bash
  cd ../frontend
  npm install
  npm run dev
```

## API Endpoints

| Method | Endpoint                         | Description                     |
|--------|----------------------------------|---------------------------------|
| POST   | `/api/auth/users/`               | Register a new user             |
| POST   | `/api/auth/jwt/create/`          | Login and obtain JWT tokens     |
| GET    | `/api/auth/users/me/`            | Get authenticated user details  |
| GET    | `/api/expenses/`                 | List all expenses               |
| POST   | `/api/expenses/`                 | Create a new expense            |
| GET    | `/api/expenses/<id>/`            | Retrieve a specific expense     |
| PUT    | `/api/expenses/<id>/`            | Update a specific expense       |
| DELETE | `/api/expenses/<id>/`            | Delete a specific expense       |
| GET    | `/api/expenses/summary/`         | Get expense summary by category |

## Contributing
- Fork the repository.
- Create a feature branch (git checkout -b feature-name).
- Commit changes (git commit -m "Add feature").
- Push to the branch (git push origin feature-name).
- Open a pull request.
