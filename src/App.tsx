import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { AdminDashboard } from './pages/AdminDashboard';
import { PublicProfile } from './pages/PublicProfile';
import { Auth } from './pages/Auth';
import { store } from './lib/store';
import { supabase } from './lib/supabase';

export default function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    store.getUser().then(user => {
      if (user.theme) {
        document.documentElement.dataset.theme = user.theme;
      } else {
        document.documentElement.dataset.theme = 'dark-minimal'; // Default
      }
    });
    
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!supabase) return <Navigate to="/login" replace />; // Will show the config warning
    if (!session) return <Navigate to="/login" replace />;
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Auth type="login" />} />
        <Route path="/signup" element={<Auth type="signup" />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/:username" element={<PublicProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

