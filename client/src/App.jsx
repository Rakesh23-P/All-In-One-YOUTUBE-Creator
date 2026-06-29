import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Protected Route Guards
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';

// Protected Creator Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import MyChannel from './pages/MyChannel';
import Videos from './pages/Videos';
import UploadVideo from './pages/UploadVideo';
import Analytics from './pages/Analytics';
import Revenue from './pages/Revenue';
import Comments from './pages/Comments';
import Playlists from './pages/Playlists';
import Calendar from './pages/Calendar';
import Tasks from './pages/Tasks';
import Notifications from './pages/Notifications';

// Protected Admin Pages
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster 
            position="top-right" 
            toastOptions={{
              style: {
                background: '#0f1524',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: 'Inter, sans-serif'
              }
            }} 
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Creator Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['creator', 'admin']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['creator', 'admin']}>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={['creator', 'admin']}>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/channel" element={
              <ProtectedRoute allowedRoles={['creator', 'admin']}>
                <MyChannel />
              </ProtectedRoute>
            } />
            <Route path="/videos" element={
              <ProtectedRoute allowedRoles={['creator', 'admin']}>
                <Videos />
              </ProtectedRoute>
            } />
            <Route path="/videos/upload" element={
              <ProtectedRoute allowedRoles={['creator', 'admin']}>
                <UploadVideo />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute allowedRoles={['creator', 'admin']}>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/revenue" element={
              <ProtectedRoute allowedRoles={['creator', 'admin']}>
                <Revenue />
              </ProtectedRoute>
            } />
            <Route path="/comments" element={
              <ProtectedRoute allowedRoles={['creator', 'admin']}>
                <Comments />
              </ProtectedRoute>
            } />
            <Route path="/playlists" element={
              <ProtectedRoute allowedRoles={['creator', 'admin']}>
                <Playlists />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute allowedRoles={['creator', 'admin']}>
                <Calendar />
              </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute allowedRoles={['creator', 'admin']}>
                <Tasks />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute allowedRoles={['creator', 'admin']}>
                <Notifications />
              </ProtectedRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
