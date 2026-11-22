import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';
import { ToastProvider } from './contexts/ToastProvider';
import { AuthProvider } from './contexts/AuthProvider';
import AppLayout from './components/layout/AppLayout';
import RouteContent from './components/ui/RouteContent';
import Landing from './pages/Landing';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Resoutre = lazy(() => import('./pages/Resoutre'));
const Inbox = lazy(() => import('./pages/Inbox'));
const Agent = lazy(() => import('./pages/Agent'));
const Impact = lazy(() => import('./pages/Impact'));
const Membres = lazy(() => import('./pages/Membres'));
const Documents = lazy(() => import('./pages/Documents'));
const Audit = lazy(() => import('./pages/Audit'));
const Parametres = lazy(() => import('./pages/Parametres'));
const Profil = lazy(() => import('./pages/Profil'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public pages */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<RouteContent><Login /></RouteContent>} />
              <Route path="/register" element={<RouteContent><Register /></RouteContent>} />

              {/* App pages with layout */}
              <Route element={<AppLayout />}>
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
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
