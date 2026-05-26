import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { AdminDashboard } from './pages/AdminDashboard';
import { PublicProfile } from './pages/PublicProfile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/alex" replace />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        <Route path="/:username" element={<PublicProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
