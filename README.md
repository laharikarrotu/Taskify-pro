# Taskify Pro 🚀

A modern, full-stack task management application built with React and Node.js. Taskify Pro helps individuals and teams manage tasks efficiently with an intuitive interface, powerful filtering, and comprehensive task tracking.

![Taskify Pro](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-19.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen)

## ✨ Features

### 🔐 Authentication & Security
- **User Registration & Login** - Secure JWT-based authentication
- **Password Encryption** - Bcrypt password hashing
- **Protected Routes** - Private routes with authentication middleware
- **Session Management** - Persistent login with token storage

### 📋 Task Management
- **Full CRUD Operations** - Create, Read, Update, and Delete tasks
- **Task Status Tracking** - Pending, In Progress, and Completed states
- **Priority Levels** - High, Medium, and Low priority classification
- **Task Categories** - Organize tasks by custom categories
- **Due Dates** - Set and track task deadlines with overdue indicators
- **Task Descriptions** - Detailed task descriptions for better context

### 🎯 Advanced Features
- **Real-time Statistics Dashboard** - Track task completion rates and metrics
- **Advanced Filtering** - Filter by status, priority, category, and search
- **Smart Sorting** - Sort by date, priority, title, and due date
- **Responsive Design** - Beautiful UI that works on all devices
- **Modern UI/UX** - Clean, intuitive interface with smooth animations

### 📊 Dashboard & Analytics
- Total tasks count
- Tasks by status (Pending, In Progress, Completed)
- High priority tasks tracking
- Overdue tasks alerts
- Completion rate visualization

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management
- **CSS3** - Modern styling with animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Taskify-pro/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── TaskCard.js
│   │   │   ├── TaskForm.js
│   │   │   ├── TaskFilters.js
│   │   │   ├── StatsCard.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Navbar.js
│   │   ├── context/       # React Context
│   │   │   └── AuthContext.js
│   │   ├── utils/         # Utility functions
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── models/            # Mongoose models
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── middleware/        # Custom middleware
│   │   └── auth.js
│   ├── index.js           # Server entry point
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Taskify-pro.git
   cd Taskify-pro
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/taskify-pro
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   ```

   Create a `.env` file in the `client` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Run the application**

   Start the server (from `server` directory):
   ```bash
   npm run dev
   ```

   Start the client (from `client` directory):
   ```bash
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (protected, supports query params)
- `GET /api/tasks/stats` - Get task statistics (protected)
- `GET /api/tasks/:id` - Get single task (protected)
- `POST /api/tasks` - Create new task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)
- `DELETE /api/tasks` - Bulk delete tasks (protected)

### Query Parameters
- `status` - Filter by status (pending, in-progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `category` - Filter by category
- `search` - Search in title and description
- `sortBy` - Sort field (createdAt, dueDate, priority, title)
- `order` - Sort order (asc, desc)

## 🎨 Key Features Showcase

### 1. User Authentication
- Secure registration and login
- JWT token-based authentication
- Protected API routes
- Persistent sessions

### 2. Task Management
- Create tasks with title, description, priority, category, and due date
- Update task status with one click
- Edit task details
- Delete tasks with confirmation
- Visual indicators for priority and status

### 3. Advanced Filtering & Search
- Real-time search across task titles and descriptions
- Filter by status, priority, and category
- Multiple sorting options
- Clear filters functionality

### 4. Dashboard Analytics
- Real-time statistics
- Completion rate visualization
- Overdue task alerts
- High priority task tracking

### 5. Responsive Design
- Mobile-first approach
- Works seamlessly on all screen sizes
- Touch-friendly interface
- Modern UI with smooth animations

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Environment variable management

## 🧪 Testing

```bash
# Run client tests
cd client
npm test

# Run server tests (if implemented)
cd server
npm test
```

## 📦 Building for Production

### Build the client
```bash
cd client
npm run build
```

### Start production server
```bash
cd server
NODE_ENV=production npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


⭐ If you found this project helpful, please give it a star!

