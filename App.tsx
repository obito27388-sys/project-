import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Features from './pages/Features';
import AuthPage from './pages/Auth';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import StudentQuizzes from './pages/StudentQuizzes';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import QuestionBank from './pages/dashboards/QuestionBank';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Reports from './pages/Reports';
import Support from './pages/Support';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import Contact from './pages/Contact';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ allowedRoles?: string[] }> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  }

  return <Layout><Outlet /></Layout>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<AuthPage type="LOGIN" />} />
          <Route path="/register" element={<AuthPage type="REGISTER" />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
             <Route path="/profile" element={<Profile />} />
             <Route path="/leaderboard" element={<Leaderboard />} />
             <Route path="/reports" element={<Reports />} />
             <Route path="/support" element={<Support />} />
          </Route>

          {/* Role Specific Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/quizzes" element={<StudentQuizzes />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/questions" element={<QuestionBank />} />
            <Route path="/teacher/*" element={<TeacherDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;