// src/router/index.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@pages/auth/LoginPage.jsx';
import NotFoundPage from '@pages/errors/NotFoundPage.jsx';
import AccessDeniedPage from '@pages/errors/AccessDeniedPage.jsx';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
