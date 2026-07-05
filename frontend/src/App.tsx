import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import TaskDetails from './pages/TaskDetails';
import Settings from './pages/Settings';
import Layout from './components/Layout/LayoutWrapper';
import RCA from './pages/RCA';
import MyTasks from './pages/MyTasks';
import Notifications from './pages/Notifications';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<Layout />}>
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/project/:projectId" 
            element={isAuthenticated ? <ProjectDetails /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/task/:taskId" 
            element={isAuthenticated ? <TaskDetails /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/rca/:projectId" 
            element={isAuthenticated ? <RCA /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/settings" 
            element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/mytasks" 
            element={isAuthenticated ? <MyTasks /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/notifications" 
            element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />} 
          />
        </Route>
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;