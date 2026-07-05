# TeamFlow - Project Management Platform

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/mahekbegum122/teamflow)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green)](https://mongodb.com/)

## 📌 Project Overview

TeamFlow is a full-stack collaborative platform for software engineering teams to plan, execute, and investigate work in one place. Built as part of the 8th Element Internship Assignment, it addresses the challenges of fragmented tools that create inconsistencies, duplicated work, and poor visibility.

**🎯 Problem Solved:** Existing tools are fragmented and create inconsistencies, duplicated work, and poor visibility, especially as the number of active projects and contributors increases.

**💡 Solution:** TeamFlow provides a unified platform for project planning, task execution, incident investigations, notifications, and reporting.

---

## ✨ Features Implemented

### 🔐 Authentication
- User Registration with name, email, and password
- Secure Login with JWT token authentication
- Password hashing using bcrypt
- Session management with localStorage
- Role-based access control

### 📋 Project Management
- Create, view, and manage projects
- Project status tracking (Planning, Active, On Hold, Completed)
- Project description and metadata
- Statistics dashboard showing project counts

### ✅ Task Management
- Create tasks with title, description, priority, and due date
- Assign tasks to team members
- Task status workflow: TODO → IN_PROGRESS → IN_REVIEW → DONE
- Kanban Board view with drag-and-drop style columns
- List view with sortable table
- Task priorities: Low, Medium, High, Critical
- Task deletion with confirmation

### 🔗 Task Dependencies ⭐ (KEY FEATURE)
- **Dependency Management:** Tasks can depend on other tasks
- **Dependency Conflict Detection:** Cannot start a task if dependencies are incomplete
- **Circular Dependency Prevention:** System detects and prevents circular dependencies
- **Auto-Unblocking:** When a task is completed, dependent tasks are automatically unblocked
- **Visual Indicators:** Dependencies are shown on task cards
- **Clear Error Messages:** Users see exactly which dependencies are blocking progress

### 🔍 Root Cause Analysis (RCA)
- Report incidents with title, description, and severity
- Severity levels: Critical, High, Medium, Low
- RCA status tracking: Reported → Investigating → In Review → Approved/Rejected
- Review workflow with Approve/Reject functionality
- Review comments and decision tracking
- Incident history and audit trail

### 🔔 Notification System
- In-app notifications for:
  - Task assignment
  - Task status changes
  - RCA submissions
  - Review decisions
  - Dependency conflicts
- Unread notification count badge
- Mark as read / Mark all as read
- Notification history

### 🎨 User Interface
- **Professional Header:** Logo, user info, notifications bell, logout button
- **Sidebar Navigation:** Dashboard, My Tasks, RCA, Notifications, Settings
- **Footer:** Links and copyright information
- **Responsive Design:** Works on desktop, tablet, and mobile
- **Dark/Light Theme:** User preference stored in localStorage
- **Statistics Cards:** Total projects, active projects, completion rate

### 📊 Views
- **Kanban Board:** Visual task management by status
- **List View:** Table view with all task details
- **Dashboard:** Overview with project statistics
- **Project Details:** All tasks in a project with filtering

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| TypeScript | 4.9.5 | Type Safety |
| React Router DOM | 6.11.2 | Navigation |
| Axios | 1.4.0 | API Calls |
| CSS | - | Styling |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | Runtime Environment |
| Express.js | 4.18.2 | Web Framework |
| MongoDB | 7.x | Database |
| Mongoose | 7.0.0 | ODM |
| JSON Web Token | 9.0.0 | Authentication |
| Bcryptjs | 2.4.3 | Password Hashing |
| CORS | 2.8.5 | Cross-Origin Resource Sharing |
| Dotenv | 16.0.3 | Environment Variables |

---

## 📂 Project Structure

```
teamflow/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   ├── Task.js          # Task with dependencies
│   │   │   ├── RCA.js
│   │   │   ├── Notification.js
│   │   │   └── Comment.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   ├── taskController.js # Dependency logic ⭐
│   │   │   └── rcaController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── rcaRoutes.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── config/
│   │   │   └── db.js
│   │   └── app.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ProjectDetails.tsx
│   │   │   ├── MyTasks.tsx
│   │   │   ├── RCA.tsx
│   │   │   ├── Notifications.tsx
│   │   │   └── Settings.tsx
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── LayoutWrapper.tsx
│   │   │   └── NotificationBell.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── erd.md
│   ├── architecture.md
│   └── architecture-decisions.md
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download Link |
|----------|---------|---------------|
| Node.js | 16.x or higher | [nodejs.org](https://nodejs.org/) |
| MongoDB | 6.x or higher | [mongodb.com](https://www.mongodb.com/try/download/community) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/mahekbegum122/teamflow.git
cd teamflow
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your MongoDB URI
# Edit .env file and set MONGODB_URI

# Start backend server
npm run dev
```

The backend server will run on `http://localhost:5000`

#### 3. Frontend Setup

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start frontend server
npm start
```

The frontend application will run on `http://localhost:3003`

#### 4. Start MongoDB

```bash
# Windows
mongod

# MacOS
brew services start mongodb-community

# Linux
sudo service mongod start
```

---

## 📝 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/teamflow

# Authentication
JWT_SECRET=your_super_secret_key_here_change_this_in_production
```

### Frontend (.env)

```env
# API URL
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🔄 Task Workflow

### Status Flow

```
┌─────────┐     ┌──────────────┐     ┌───────────┐     ┌──────┐
│  TODO   │ ──▶ │ IN_PROGRESS  │ ──▶ │ IN_REVIEW │ ──▶ │ DONE │
└─────────┘     └──────────────┘     └───────────┘     └──────┘
                      │                                      │
                      ▼                                      ▼
                 ┌─────────┐                           ┌─────────┐
                 │ BLOCKED │                           │ BLOCKED │
                 └─────────┘                           └─────────┘
```

### Dependency Logic Example

```
Task A: "Design Homepage" → Status: TODO
Task B: "Implement Homepage" → Status: TODO, Depends On: Task A

User tries to move Task B to IN_PROGRESS
❌ System Error: "Cannot start task. These dependencies are not complete: Design Homepage"

User completes Task A (moves to DONE)
✅ Task B is now unblocked and can be started
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:id` | Get a single project |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/project/:projectId` | Get tasks for a project |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id/status` | Update task status |
| POST | `/api/tasks/dependency` | Add task dependency |
| DELETE | `/api/tasks/:id` | Delete a task |

### RCA
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rca/project/:projectId` | Get RCA for a project |
| POST | `/api/rca` | Create an RCA |
| PUT | `/api/rca/:id/status` | Update RCA status |
| POST | `/api/rca/:id/review` | Add RCA review |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get user notifications |
| PUT | `/api/notifications/:id/read` | Mark notification as read |
| PUT | `/api/notifications/read-all` | Mark all as read |

---

## ⚠️ Assumptions Made

1. **User Authentication:** Email and password are used for authentication
2. **Single Assignee:** Each task has exactly one assignee
3. **Dependency Type:** Only Finish-to-Start dependencies are supported
4. **Task Status:** Tasks follow: TODO → IN_PROGRESS → IN_REVIEW → DONE
5. **Project Visibility:** All authenticated users can view all projects
6. **RCA Review:** At least 2 reviews required for approval
7. **Notifications:** In-app only (email notifications are future scope)

---

## 🐛 Known Limitations

| Limitation | Description | Future Fix |
|------------|-------------|------------|
| **Email Notifications** | Not implemented yet | Add nodemailer integration |
| **File Attachments** | Cannot upload files | Add multer and S3 storage |
| **Real-time Updates** | No WebSocket support | Add Socket.io |
| **Unit Tests** | No test coverage | Add Jest tests |
| **Calendar View** | Only Kanban and List views | Implement calendar view |
| **CSV Export** | Not implemented | Add export functionality |
| **Offline Support** | No offline mode | Add PWA support |

---

## 👨‍💻 Author

**Mahek Begum**

- GitHub: [@mahekbegum122](https://github.com/mahekbegum122)
- Email: mahekbegum54@gmail.com

---


## 📊 Project Status

| Feature | Status |
|---------|--------|
| User Authentication | ✅ Complete |
| Project Management | ✅ Complete |
| Task Management | ✅ Complete |
| Task Dependencies | ✅ Complete |
| Kanban Board | ✅ Complete |
| List View | ✅ Complete |
| RCA | ✅ Complete |
| Notifications | ✅ Complete |
| My Tasks | ✅ Complete |
| Settings | ✅ Complete |
| Responsive UI | ✅ Complete |
| Documentation | ✅ Complete |

---

*Built with ❤️ for 8th Element Internship Assignment*

**© 2026 TeamFlow. All rights reserved.**
