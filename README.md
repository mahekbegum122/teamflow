# TeamFlow - Project Management Platform

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/yourusername/teamflow)
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
