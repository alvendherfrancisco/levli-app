import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';

import { AppStateProvider, useAppState } from '@/lib/AppState';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// App pages
import Onboarding from '@/pages/Onboarding';
import Home from '@/pages/Home';
import Shots from '@/pages/Shots';
import History from '@/pages/History';
import Insights from '@/pages/Insights';
import Journal from '@/pages/Journal';
import Profile from '@/pages/Profile';
import SettingsPage from '@/pages/SettingsPage';
import ReportPage from '@/pages/ReportPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsPage from '@/pages/TermsPage';
import MyMedications from '@/pages/MyMedications';
import InventoryPage from '@/pages/InventoryPage';

// Layout
import AppLayout from '@/components/AppLayout';

function HomeOrOnboarding() {
  const { onboardingCompleted } = useAppState();
  // null = still loading profile; show spinner until we know
  if (onboardingCompleted === null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }
  return onboardingCompleted ? <Home /> : <Navigate to="/onboarding" replace />;
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  const onPublicPath = publicPaths.includes(window.location.pathname);

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required' && !onPublicPath) {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomeOrOnboarding />} />
          <Route path="/shots" element={<Shots />} />
          <Route path="/medications" element={<MyMedications />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/history" element={<History />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <AppStateProvider>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </AppStateProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App