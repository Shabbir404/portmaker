import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { BuilderProvider } from './context/BuilderContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import { ToastList } from './components/UI'
import Landing from './pages/Landing'
import Pricing from './pages/Pricing'
import Dashboard from './pages/Dashboard'
import Builder from './pages/builder/Builder'
import Preview from './pages/Preview'

function ProtectedRoute({ children }) {
  const { user, setModal } = useApp()
  if (!user) { setModal('login'); return <Navigate to="/" replace /> }
  return children
}

function AppShell() {
  const { toasts, modal } = useApp()
  const location = useLocation()
  const showFooter = !['/', '/pricing'].includes(location.pathname)

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
      {modal && <AuthModal />}
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
