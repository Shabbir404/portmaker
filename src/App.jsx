import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { BuilderProvider } from './context/BuilderContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastList } from './components/UI'
import Landing from './pages/Landing'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import Dashboard from './pages/Dashboard'
import Builder from './pages/builder/Builder'
import Preview from './pages/Preview'
import PortfolioProjects from './pages/PortfolioProjects'

function ProtectedRoute({ children }) {
  const { user, authReady } = useApp()
  const location = useLocation()
  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-white/20 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }
  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} replace />
  }
  return children
}

function AppShell() {
  const { toasts } = useApp()
  const location = useLocation()
  const isAuthRoute = ['/login', '/auth/callback'].includes(location.pathname)
  const showFooter =
    !isAuthRoute &&
    !['/', '/pricing'].includes(location.pathname) &&
    !location.pathname.startsWith('/dashboard')

  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-bg">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
        <ToastList toasts={toasts} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/portfolio/:portfolioId/projects" element={
            <ProtectedRoute><PortfolioProjects /></ProtectedRoute>
          } />
          <Route path="/builder" element={
            <ProtectedRoute><Builder /></ProtectedRoute>
          } />
          <Route path="/preview" element={
            <ProtectedRoute><Preview /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {showFooter && <Footer />}
      <ToastList toasts={toasts} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <BuilderProvider>
          <AppShell />
        </BuilderProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
