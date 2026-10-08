# CoinCraft — Smart Wealth & Personal Finance Platform

CoinCraft is a modern, production-grade personal finance and digital piggy-bank web application. It enables individuals to track income and expenditures, manage monthly category budgets with live threshold alerts, establish and deposit into targeted savings goals, and visualize cash-flow trends through dynamic financial dashboards.

Built with a **React + Vite** frontend and a **Django REST Framework** backend, CoinCraft enforces strict per-user data isolation, JWT authentication, and Decimal precision for financial integrity.

---

## Architecture Overview

```
USER
  ↓
REACT SPA (React 19 + Vite + Tailwind CSS 4 + Lucide + Recharts)
  ↓
AXIOS API CLIENT (Automatic JWT Bearer Token Injection & 401 Refresh Queue)
  ↓
DJANGO REST API (Django 6 + DRF + SimpleJWT)
  ↓
AUTHENTICATION & USER ISOLATION (request.user Ownership Checks)
  ↓
DATABASE (PostgreSQL in Production / SQLite in Development)
```

### Core Capabilities
- **JWT Authentication & Security**: Secure Registration, Login, Token Refresh, Blacklist Logout, and Protected Routes.
- **Income Tracking**: Categorized income logs (Salary, Freelance, Business, Investment, Gift, Other) with date filtering and search.
- **Expense Tracking**: Categorized spending (Food, Transport, Shopping, Bills, Healthcare, Entertainment, Education, Other) with payment mode filters (Cash, UPI, Card, Bank Transfer).
- **Monthly Budgeting**: Budget limits per category, month, and year with live spent calculation, remaining balance, and visual warnings (On Track, Warning ≥80%, Exceeded >100%).
- **Digital Piggy Bank / Savings Goals**: Goal jars with target amounts, accumulated deposits, progress percentages, milestone badges, and quick deposit top-ups.
- **Real-Time Automated Notifications**: Instant notifications triggered by budget warning thresholds (≥80% used), exceeded caps, and goal milestones (≥75% and 100% completion).
- **Financial Dashboard**: Real aggregate totals (Net Balance, Income, Expense, Savings), 6-month cash flow area charts, category spending breakdown pie charts, and recent activity feed.
- **User Preferences**: Profile customization with multi-currency support (`₹ INR`, `$ USD`, `€ EUR`, `£ GBP`, `¥ JPY`, `CA$ CAD`, `AU$ AUD`) and Dark Mode preference.

---

## Directory Structure

```
coincraft/
├── .github/workflows/ci.yml       # GitHub Actions CI (Backend tests + Frontend lint & build)
├── backend/                       # Django REST API
│   ├── accounts/                  # Custom User model, auth views, profile & E2E tests
│   ├── budgets/                   # Budget model, calculations & views
│   ├── config/                    # Django settings (WhiteNoise, PostgreSQL, JWT)
│   ├── dashboard/                 # Aggregated financial analytics & charts
│   ├── goals/                     # Savings goals & progress tracking
│   ├── notifications/             # Notification model, alert engine & APIs
│   ├── transactions/              # Income & Expense models, unified search feed
│   ├── .env.example               # Backend environment variables template
│   ├── manage.py
│   ├── Procfile                   # Gunicorn WSGI startup configuration
│   └── requirements.txt           # Python dependencies
├── frontend/                      # React SPA
│   ├── src/
│   │   ├── components/            # Layout, Dashboard, and common reusable UI
│   │   ├── context/               # AuthContext (Auth & Currency) & ToastContext
│   │   ├── pages/                 # Dashboard, Income, Expenses, Budget, Goals, Notifications, Profile
│   │   ├── routes/                # ProtectedRoute and AppRoutes
│   │   └── services/              # Axios API service clients
│   ├── .env.example               # Frontend environment variables template
│   ├── package.json
│   ├── vercel.json                # Vercel SPA routing rewrite configuration
│   └── vite.config.js
└── render.yaml                    # Full-stack Blueprint for Render deployment
```

---

## Quick Start (Development)

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### 1. Backend Setup
1. Open a terminal in the `backend/` folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   # Windows:
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/macOS:
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
5. Apply database migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the API server:
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
   API is accessible at `http://127.0.0.1:8000/api/`.

### 2. Frontend Setup
1. In a separate terminal, navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## Running Automated Tests & Linting

### Backend Tests
CoinCraft includes 19 comprehensive unit and integration tests covering user registration, login, token refresh, income/expense CRUD, budget spent calculations, goal progress, notifications, dashboard aggregates, and strict user data isolation.

```bash
cd backend
python manage.py test
```

### Frontend Code Quality
Check ESLint standards:
```bash
cd frontend
npm run lint
```

Verify production build bundle:
```bash
cd frontend
npm run build
```

---

## API Reference

### Authentication (`/api/accounts/`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/accounts/register/` | Register with username, email, password, confirm_password |
| `POST` | `/api/accounts/login/` | Authenticate with email/password, returns access & refresh tokens |
| `GET` | `/api/accounts/me/` | Retrieve authenticated user profile |
| `PATCH` | `/api/accounts/me/` | Update username, currency, or dark mode preference |
| `POST` | `/api/accounts/refresh/` | Refresh expired JWT access token |
| `POST` | `/api/accounts/logout/` | Blacklist refresh token and invalidate session |

### Transactions (`/api/transactions/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/transactions/all/` | Unified search feed across both incomes and expenses |
| `GET` / `POST` | `/api/transactions/income/` | List filtered incomes or log new income inflow |
| `GET` / `PATCH` / `DELETE` | `/api/transactions/income/<id>/` | Retrieve, update, or remove income record |
| `GET` / `POST` | `/api/transactions/expense/` | List filtered expenses or log new expense outflow |
| `GET` / `PATCH` / `DELETE` | `/api/transactions/expense/<id>/` | Retrieve, update, or remove expense record |

### Budgets (`/api/budgets/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` / `POST` | `/api/budgets/` | List monthly budgets with live spent/remaining or create new cap |
| `GET` / `PATCH` / `DELETE` | `/api/budgets/<id>/` | Retrieve, update limit, or delete budget |

### Goals (`/api/goals/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` / `POST` | `/api/goals/` | List savings goals or create new targeted goal jar |
| `GET` / `PATCH` / `DELETE` | `/api/goals/<id>/` | Retrieve, update/deposit funds, or delete goal |

### Dashboard (`/api/dashboard/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/` | Full financial aggregates, monthly trend, category distribution, recent activity |

### Notifications (`/api/notifications/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notifications/` | List alerts (auto-evaluates budget & goal thresholds) |
| `PATCH` | `/api/notifications/<id>/` | Mark single notification as read |
| `POST` | `/api/notifications/mark-all-read/` | Mark all user notifications as read |
| `DELETE` | `/api/notifications/<id>/` | Delete a notification |

---

## Production Deployment Guide

### Deployment Architecture
- **Backend API**: Render or Railway (Python 3.12 + Gunicorn)
- **Database**: Managed PostgreSQL (Render Postgres, Neon, or Supabase)
- **Frontend SPA**: Vercel or Render Static Site

### Step 1: Managed Database (PostgreSQL)
1. Provision a PostgreSQL database on Render, Supabase, or Railway.
2. Obtain your `DATABASE_URL` (format: `postgres://user:password@host:5432/dbname`).

### Step 2: Backend Deployment (Render)
1. In your Render Dashboard, click **New > Blueprint** and link this repository (`render.yaml`).
2. Alternatively, create a **Web Service**:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - **Start Command**: `gunicorn config.wsgi:application`
   - **Environment Variables**:
     ```env
     SECRET_KEY=<secure-random-key>
     DEBUG=False
     DATABASE_URL=<your-postgresql-url>
     ALLOWED_HOSTS=coincraft-api.onrender.com,your-custom-domain.com
     CORS_ALLOWED_ORIGINS=https://coincraft.vercel.app,https://coincraft-web.onrender.com
     USE_SQLITE=False
     ```

### Step 3: Frontend Deployment (Vercel)
1. In your Vercel Dashboard, import the Git repository.
2. Select `frontend` as the **Root Directory**.
3. Set the **Framework Preset** to `Vite`.
4. Configure Environment Variable:
   ```env
   VITE_API_BASE_URL=https://coincraft-api.onrender.com/api/
   ```
5. Click **Deploy**. Vercel will build the React SPA, and `frontend/vercel.json` ensures client-side routing works on full page refreshes.
