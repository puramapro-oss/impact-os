import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Resoutre from './pages/Resoutre';
import Inbox from './pages/Inbox';
import Agent from './pages/Agent';
import Impact from './pages/Impact';
import Membres from './pages/Membres';
import Documents from './pages/Documents';
import Audit from './pages/Audit';
import Parametres from './pages/Parametres';
import Profil from './pages/Profil';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import Onboarding from './pages/Onboarding';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public pages */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Onboarding (authenticated but no layout) */}
              <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />

              {/* App pages with layout */}
              <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/resoutre" element={<Resoutre />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/agent" element={<Agent />} />
                <Route path="/impact" element={<Impact />} />
                <Route path="/membres" element={<Membres />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/audit" element={<Audit />} />
                <Route path="/parametres" element={<Parametres />} />
                <Route path="/profil" element={<Profil />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
