# Rydify (Rent Vehicle) - Fullstack Project Reference

## Overview
Rydify is a comprehensive vehicle rental platform featuring role-based access for Admins, Dealers, and Users. The system allows users to browse, compare, and book cars, while dealers manage their inventory and requests.

## Technology Stack

### Backend
- **Core**: Node.js, Express.js
- **Databases**: 
  - **MySQL** (Legacy/Active): Managed via Sequelize ORM.
  - **MongoDB** (New): Managed via Mongoose ODM.
- **ORM/ODM**: Sequelize (MySQL), Mongoose (MongoDB)
- **Authentication**: JWT (JSON Web Tokens) with Cookie-based storage
- **Features**:
  - Role-based middleware (`AuthorizeUser`, `AuthorizeDealer`, `AuthorizeAdmin`)
  - File uploads using `express-fileupload`
  - Email notifications via `nodemailer`
  - Validation using `express-validator`

### Frontend
- **Framework**: React (Vite)
- **State Management**: Zustand (Persisted for Auth)
- **Routing**: React Router DOM (v6) with Protected Routes
- **Styling**: Vanilla CSS with CSS Modules
- **API Client**: Axios with global interceptors and `react-hot-toast`

## Directory Structure

```text
/backend
├── controllers/      # Business logic for routes
├── middleware/       # Auth and validation middleware
├── models/           # Sequelize database models (MySQL)
├── mongo_models/     # Mongoose database models (MongoDB) [NEW]
├── routes/           # API endpoints defined by role
├── public/           # Static assets and uploads
├── db.config.js      # Sequelize & DB connection setup
├── mongodb.config.js # Mongoose & MongoDB connection setup [NEW]
├── app.js            # Entry point
└── package.json      # Dependencies

/frontend
├── src/
│   ├── components/   # Reusable UI components
│   ├── context/      # React Context (AuthContext)
│   ├── hooks/        # Custom React hooks
│   ├── layouts/      # Main, Admin, Dealer, User layouts
│   ├── pages/        # Page-level components
│   ├── routes/       # Route definitions (AppRoutes.jsx)
│   ├── services/     # API service layer (apiService, authService)
│   └── store/        # Zustand stores (authStore)
├── vite.config.js    # Vite configuration
└── package.json      # Frontend dependencies
```

## Key Database Entities
- **Users**: Standard customers (book cars, write reviews).
- **Dealers**: Vehicle providers (manage car listings, approve requests).
- **Admins**: Platform managers (manage dealers, categories, view all bookings).
- **Cars**: Vehicle listings with detailed specifications.
- **Categories**: Vehicle types (Sedan, SUV, etc.).
- **Car Requests / Bookings**: Transaction records between Users and Dealers.
- **Reviews**: User feedback on specific vehicles.

## Authentication Flow
1. User/Dealer/Admin logs in via `/api/v1/[role]/login`.
2. Backend generates a JWT and sets it as an HTTP-only cookie (e.g., `UserToken`).
3. Frontend stores basic user info and role in **Zustand** store.
4. `ProtectedRoute` on the frontend checks the Zustand state and validates the token via `/api/v1/[role]/token` on mount/refresh.
5. `apiClient` interceptor handles 401 errors by triggering a logout/session expiration toast.

## Development Commands
- **Backend**: `npm run dev` (runs `nodemon app.js`)
- **Frontend**: `npm run dev` (runs `vite`)
