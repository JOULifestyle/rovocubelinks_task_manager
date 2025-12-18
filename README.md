# Task Manager Fullstack Application

A comprehensive task management system with role-based access control, activity logging, and modern web technologies. Built with a clean separation of concerns using React frontend and Node.js/Express backend with PostgreSQL database.

## Features

- 🔐 **User Authentication**: JWT-based login with secure password hashing
- 👥 **Role-Based Access**: Admin and User roles with different permissions
- ✅ **Task Management**: Full CRUD operations for tasks
- 📊 **Activity Logging**: Complete audit trail of user actions (admin view)
- 🎨 **Modern UI**: Responsive React frontend with clean design
- 🛡️ **Security**: Input validation, SQL injection prevention, CORS protection

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database with Prisma ORM
- **JWT** for authentication with role-based access control
- **bcrypt** for password hashing
- **Comprehensive API** with proper error handling

### Frontend
- **React 18** with Vite for fast development
- **React Router** for client-side navigation
- **Context API** for global state management
- **Axios** for HTTP requests with interceptors
- **Responsive design** with custom CSS

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   ```

3. **Setup Database**
   ```bash
   # Make sure PostgreSQL is running
   npx prisma migrate deploy
   npx tsx prisma/seed.mjs  # Seed with test data
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm start
   ```
   Backend will run on http://localhost:5000

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:5173

3. **Database** (should already be running)
   - PostgreSQL server on localhost:5432
   - Database: revocubelinks

### Test Accounts

- **Admin**: admin@example.com / adminpassword
- **User**: user@example.com / userpassword

## API Documentation

### Authentication Endpoints
- `POST /auth/login` - User login

### Task Endpoints
- `GET /tasks` - Get all tasks (filtered by role)
- `POST /tasks` - Create new task (admin only)
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task (admin only)

### Activity Logging
- `GET /activities` - Get activity logs (admin only)

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
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
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_by INTEGER REFERENCES users(id),
  assigned_to INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Activity Logs Table
```sql
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id INTEGER,
  details TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
task-manager/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Authentication & validation
│   │   └── generated/      # Prisma client (auto-generated)
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   ├── migrations/     # Database migrations
│   │   └── seed.mjs        # Database seeding script
│   ├── .env.example        # Environment template
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context for state
│   │   └── services/       # API service layer
│   └── package.json
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npx prisma studio` - Open database GUI
- `npx prisma migrate dev` - Create and apply migrations

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your-super-secret-jwt-key"
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- SQL injection prevention via Prisma ORM

## Activity Logging

The application maintains a comprehensive audit trail:

- **CREATE**: Task creation events
- **UPDATE**: Task modification events
- **DELETE**: Task deletion events
- **LOGIN**: User authentication events

Logs include user information, timestamps, and detailed action descriptions. Only administrators can access activity logs.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.