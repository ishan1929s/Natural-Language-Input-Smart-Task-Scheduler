import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { AuthProvider } from '../auth/AuthProvider';
import { LoginPage } from '../auth/pages/LoginPage';
import { RegisterPage } from '../auth/pages/RegisterPage';
import { ProfilePage } from '../auth/pages/ProfilePage';
import { ChangePasswordPage } from '../auth/pages/ChangePasswordPage';
import { EmailConfigPage } from '../auth/pages/EmailConfigPage';
import { ForgotPasswordPage } from '../auth/pages/ForgotPasswordPage';
import { TasksPage } from '../tasks/pages/TasksPage';
import { TaskDetailPage } from '../tasks/pages/TaskDetailPage';
import { RecurringTasksPage } from '../tasks/pages/RecurringTasksPage';
import { VoicePage } from '../voice/pages/VoicePage';
import { JobsPage } from '../jobs/pages/JobsPage';
import { AdminPage } from '../admin/pages/AdminPage';
import { RequireAuth } from '../auth/RequireAuth';
import { RequireAdmin } from '../auth/RequireAdmin';
import { NotFoundPage } from './components/NotFoundPage';
import { DashboardPage } from './pages/DashboardPage';

export default function App() {
  return (
    <AuthProvider>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route element={<RequireAuth />}>
            <Route index element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/email-config" element={<EmailConfigPage />} />

            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
            <Route path="/recurring" element={<RecurringTasksPage />} />
            <Route path="/voice" element={<VoicePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppLayout>
    </AuthProvider>
  );
}
