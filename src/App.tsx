import { useEffect } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { AdminDashboard } from './pages/AdminDashboard';
import { PublicProfile } from './pages/PublicProfile';
import { store } from './lib/store';

export default function App() {
  useEffect(() => {
    store.getUser().then(user => {
      if (user.theme) {
        document.documentElement.dataset.theme = user.theme;
      } else {
        document.documentElement.dataset.theme = 'dark-minimal'; // Default
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/alex" replace />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/:username" element={<PublicProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
