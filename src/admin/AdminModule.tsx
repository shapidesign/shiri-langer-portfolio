import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import AdminProjectList from './AdminProjectList';
import AdminProjectEdit from './AdminProjectEdit';
import AdminSiteSettings from './AdminSiteSettings';
import RequireAuth from './RequireAuth';
import './admin.css';

export default function AdminModule() {
  return (
    <div className="admin-root">
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="projects" replace />} />
            <Route path="projects" element={<AdminProjectList />} />
            <Route path="projects/:id" element={<AdminProjectEdit />} />
            <Route path="site" element={<AdminSiteSettings />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    </div>
  );
}
