# Task Manager Fullstack Application

A comprehensive task management system with role-based access control, activity logging, and modern web technologies.

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
- **PostgreSQL** database
- **Prisma ORM** for type-safe database operations
- **JWT** for authentication
- **bcrypt** for password hashing

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Context API** for state management
- **Axios** for API calls

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

## Project Structure

```
task-manager/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Authentication & validation
│   │   └── prisma/         # Database schema & migrations
│   ├── .env                # Environment variables
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── services/      # API service layer
│   └── package.json
├── ARCHITECTURE_SPECIFICATION.md  # Technical documentation
└── README.md             # This file
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