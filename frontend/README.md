# Task Manager Frontend

React-based frontend for the Task Manager fullstack application.

## Features

- Modern React 18 with Vite for fast development
- Responsive design with clean UI
- JWT-based authentication
- Role-based UI rendering
- Real-time task management
- Axios for API communication

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## Getting Started

### Prerequisites
- Node.js 18+
- Backend API running on http://localhost:5000

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will run on http://localhost:5173

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── TaskForm.jsx
│   │   └── TaskItem.jsx
│   ├── context/        # React Context for state management
│   │   └── AuthContext.jsx
│   ├── pages/          # Page components
│   │   ├── Login.jsx
│   │   └── TaskList.jsx
│   ├── services/       # API service layer
│   │   └── api.js
│   ├── App.jsx         # Main app component
│   └── main.jsx        # App entry point
├── index.html
├── vite.config.js
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Configuration

The frontend expects the backend API to be running on `http://localhost:5000`. If you need to change this, update the base URL in `src/services/api.js`.

## Features Overview

### Authentication
- Login form with JWT token storage
- Protected routes based on authentication status
- Automatic token refresh handling

### Task Management
- View all tasks (role-based filtering)
- Create new tasks (admin only)
- Edit existing tasks
- Mark tasks as complete
- Delete tasks (admin only)

### UI Components
- Responsive navbar with user info
- Task list with status indicators
- Task creation/editing forms
- Loading states and error handling

## Development Notes

- Uses modern React hooks and functional components
- Context API for global authentication state
- Axios interceptors for automatic token attachment
- Clean separation of concerns between components and services
