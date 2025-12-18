# Task Manager Fullstack Application - Technical Specification

## Overview

The Task Manager application is a fullstack web application designed to help teams and individuals organize, track, and manage tasks efficiently. The system supports role-based access control, allowing administrators to manage users and tasks, while regular users can create and manage their own tasks.

### Key Features
- User authentication and authorization
- Task creation, editing, deletion, and status tracking
- Role-based permissions (Admin, User)
- Activity logging for audit trails
- Responsive web interface
- Real-time task updates (future enhancement)

## Architecture Overview

The application follows a modern fullstack architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React/Vite)  │◄──►│ (Node.js/Express│◄──►│ (PostgreSQL)    │
│                 │    │   + Prisma)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack
- **Backend**: Node.js, Express.js, PostgreSQL, Prisma ORM
- **Frontend**: React 18, Vite, React Router
- **Database**: PostgreSQL 15+
- **Authentication**: JWT tokens with role-based access
- **Deployment**: Docker containers (future consideration)

## Backend Architecture

### Core Components

#### 1. Express Server Setup
- Main application server handling HTTP requests
- Middleware stack for CORS, JSON parsing, authentication
- Error handling and logging middleware
- Environment-based configuration

#### 2. Authentication & Authorization
- JWT-based authentication system
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Middleware for route protection
- Refresh token mechanism for session management

#### 3. API Routes Structure
```
/api
├── /auth
│   ├── POST /login
│   ├── POST /register
│   ├── POST /refresh
│   └── POST /logout
├── /users
│   ├── GET / (Admin only)
│   ├── GET /:id
│   ├── PUT /:id (Admin only)
│   └── DELETE /:id (Admin only)
├── /tasks
│   ├── GET / (Filtered by user role)
│   ├── POST /
│   ├── GET /:id
│   ├── PUT /:id
│   └── DELETE /:id
└── /logs
    └── GET / (Admin only - activity logs)
```

#### 4. Database Layer (Prisma ORM)
- Type-safe database operations
- Automatic migration management
- Data validation and constraints
- Optimized queries with relations

#### 5. Activity Logging System
- Comprehensive audit trail
- Tracks user actions on tasks and users
- Timestamped log entries
- Admin-only access to logs

### Security Considerations
- Input validation and sanitization
- SQL injection prevention via ORM
- XSS protection
- Rate limiting
- Secure password policies
- CORS configuration

## Frontend Architecture

### Core Components

#### 1. React Application Structure
- Component-based architecture
- Hooks for state management
- Context API for global state (auth, user data)
- React Router for navigation

#### 2. Key Components
- **Authentication Components**
  - LoginForm
  - RegisterForm
  - ProtectedRoute wrapper

- **Task Management Components**
  - TaskList (displays tasks with filtering)
  - TaskCard (individual task display)
  - TaskForm (create/edit task)
  - TaskFilters (status, priority, assignee)

- **User Interface Components**
  - Dashboard
  - Navigation
  - UserProfile
  - AdminPanel (role-restricted)

- **Common Components**
  - Button, Input, Select, Modal
  - LoadingSpinner, ErrorMessage
  - ConfirmationDialog

#### 3. State Management
- React Context for authentication state
- Local component state for forms and UI
- React Query (TanStack Query) for server state management
- Optimistic updates for better UX

#### 4. UI Restrictions by Role
- **Admin Users**:
  - Full access to all tasks
  - User management interface
  - Activity logs access
  - System-wide task assignment

- **Regular Users**:
  - CRUD operations on own tasks
  - View tasks assigned to them
  - Limited profile editing
  - No access to admin features

### User Experience Flow
1. User authentication (login/register)
2. Dashboard with task overview
3. Task creation and management
4. Real-time updates (future)
5. Role-based feature access

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) NOT NULL DEFAULT 'user', -- 'admin' or 'user'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tasks Table
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'todo', -- 'todo', 'in_progress', 'done'
  priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high'
  assigned_to INTEGER REFERENCES users(id),
  created_by INTEGER REFERENCES users(id) NOT NULL,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Activity Logs Table
```sql
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(255) NOT NULL, -- 'create_task', 'update_task', 'delete_task', etc.
  resource_type VARCHAR(100) NOT NULL, -- 'task', 'user'
  resource_id INTEGER,
  details JSONB, -- Additional context data
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relationships
- Users can create multiple tasks (created_by)
- Users can be assigned multiple tasks (assigned_to)
- Tasks belong to one creator and one assignee (optional)
- Activity logs reference users and track all system actions

### Indexes
- Email index on users table
- Status index on tasks table
- Created_by and assigned_to indexes on tasks
- User_id and created_at indexes on activity_logs

## Project Folder Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── taskController.js
│   │   │   └── logController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   └── (Prisma generated)
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── tasks.js
│   │   │   └── logs.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── taskService.js
│   │   │   └── logService.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   └── validators.js
│   │   ├── config/
│   │   │   └── database.js
│   │   └── app.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── tests/
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── tasks/
│   │   │   │   ├── TaskList.jsx
│   │   │   │   ├── TaskCard.jsx
│   │   │   │   ├── TaskForm.jsx
│   │   │   │   └── TaskFilters.jsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── LoadingSpinner.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TaskDetails.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useTasks.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── constants.js
│   │   └── App.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── USER_GUIDE.md
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
├── .gitignore
├── package.json (root - for monorepo scripts)
└── README.md
```

## Integration and Data Flow

### API Integration
1. Frontend makes authenticated HTTP requests to backend API
2. Backend validates requests and processes business logic
3. Database operations handled through Prisma ORM
4. Responses include appropriate HTTP status codes and data
5. Error handling provides meaningful messages to frontend

### Authentication Flow
1. User submits credentials to `/api/auth/login`
2. Backend validates credentials and generates JWT
3. Token stored in frontend (localStorage/sessionStorage)
4. Subsequent requests include Authorization header
5. Backend middleware validates token and extracts user info

### Task Management Flow
1. User creates task via frontend form
2. Frontend sends POST request to `/api/tasks`
3. Backend validates data and creates task record
4. Activity log entry created for audit trail
5. Frontend updates UI with new task data

### Role-Based Access Control
- Route-level middleware checks user roles
- Database queries filtered based on user permissions
- Frontend conditionally renders UI elements
- API responses filtered to prevent data leakage

## Development and Deployment Considerations

### Environment Configuration
- Separate configs for development, staging, production
- Environment variables for sensitive data (DB credentials, JWT secrets)
- Docker containers for consistent deployment

### Testing Strategy
- Unit tests for individual functions
- Integration tests for API endpoints
- E2E tests for critical user flows
- Test database for isolated testing

### Performance Optimizations
- Database query optimization
- API response caching
- Frontend code splitting
- Image optimization and lazy loading

### Monitoring and Logging
- Structured logging with Winston
- Error tracking and alerting
- Performance monitoring
- Database query monitoring

## Future Enhancements

### Phase 2 Features
- Real-time notifications with WebSockets
- File attachments for tasks
- Task comments and discussion threads
- Advanced filtering and search
- Task templates
- Time tracking
- Reporting and analytics

### Scalability Considerations
- Database read replicas
- API rate limiting
- CDN for static assets
- Horizontal scaling with load balancer

This specification provides a comprehensive foundation for building a robust, scalable task management application with clear separation of concerns and modern development practices.