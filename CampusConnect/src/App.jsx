import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ROUTES, ROLES } from './utils/constants';

// Auth Pages
import Login from './pages/auth/Login';
import FirstTimeSetup from './pages/auth/FirstTimeSetup';
import PasswordReset from './pages/auth/PasswordReset';
import Unauthorized from './pages/common/Unauthorized';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import BulkUpload from './pages/admin/BulkUpload';
import PasswordResetApproval from './pages/admin/PasswordResetApproval';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import AdminAttendanceDashboard from './pages/admin/AdminAttendanceDashboard';

// Dashboards
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

// Faculty Pages
import FacultyAttendanceHistory from './pages/faculty/FacultyAttendanceHistory';
import FacultyStudentList from './pages/faculty/FacultyStudentList';
import ManageMaterials from './pages/faculty/ManageMaterials';

// Announcements
import AnnouncementList from './pages/announcements/AnnouncementList';
import AnnouncementDetail from './pages/announcements/AnnouncementDetail';
import CreateAnnouncement from './pages/announcements/CreateAnnouncement';

// Notifications
import NotificationList from './pages/notifications/NotificationList';

// Chat
import Chat from './pages/chat/Chat';

// Attendance
import MarkAttendance from './pages/faculty/MarkAttendance';
import StudentAttendance from './pages/student/StudentAttendance';

// Study Materials
import UploadMaterial from './pages/faculty/UploadMaterial';
import StudyMaterials from './pages/student/StudyMaterials';

// Profile
import Profile from './pages/common/Profile';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ChatProvider>
          <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route
            path={ROUTES.FIRST_TIME_SETUP}
            element={
              <ProtectedRoute>
                <FirstTimeSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PASSWORD_RESET}
            element={
              <ProtectedRoute>
                <PasswordReset />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_USERS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_BULK_UPLOAD}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <BulkUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_PASSWORD_RESET_REQUESTS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <PasswordResetApproval />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminAttendanceDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_DEPARTMENTS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DepartmentManagement />
              </ProtectedRoute>
            }
          />

          {/* Announcement Routes */}
          <Route
            path={ROUTES.ANNOUNCEMENTS}
            element={
              <ProtectedRoute>
                <AnnouncementList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements/:id"
            element={
              <ProtectedRoute>
                <AnnouncementDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ANNOUNCEMENTS_CREATE}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACULTY]}>
                <CreateAnnouncement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements/:id/edit"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACULTY]}>
                <CreateAnnouncement />
              </ProtectedRoute>
            }
          />

          {/* Notification Routes */}
          <Route
            path={ROUTES.NOTIFICATIONS}
            element={
              <ProtectedRoute>
                <NotificationList />
              </ProtectedRoute>
            }
          />

          {/* Chat Routes */}
          <Route
            path={ROUTES.CHAT}
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          {/* Attendance - Faculty */}
          <Route
            path="/faculty/attendance/mark"
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY, ROLES.ADMIN]}>
                <MarkAttendance />
              </ProtectedRoute>
            }
          />

          {/* Attendance - Student */}
          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentAttendance />
              </ProtectedRoute>
            }
          />

          {/* Study Materials - Faculty */}
          <Route
            path="/faculty/materials/upload"
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY, ROLES.ADMIN]}>
                <UploadMaterial />
              </ProtectedRoute>
            }
          />

          {/* Study Materials - Student */}
          <Route
            path="/student/materials"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudyMaterials />
              </ProtectedRoute>
            }
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Faculty Routes */}
          <Route
            path={ROUTES.FACULTY_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/attendance/history"
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY, ROLES.ADMIN]}>
                <FacultyAttendanceHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/students"
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                <FacultyStudentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/materials/manage"
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY, ROLES.ADMIN]}>
                <ManageMaterials />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path={ROUTES.STUDENT_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
    </BrowserRouter>
  );
}


export default App;
