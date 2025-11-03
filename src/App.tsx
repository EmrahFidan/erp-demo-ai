import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Stock from './pages/Stock';
import Invoice from './pages/Invoice';
import Payment from './pages/Payment';
import AIChat from './pages/AIChat';
import Narrative from './pages/Narrative';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Test from './pages/Test';

function Navigation() {
  const { user, userProfile, logout } = useAuth();

  if (!user) return null;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-emerald-950 border-r border-emerald-500/20 shadow-2xl">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-emerald-500/20">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            ERP Demo
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-all duration-200 group"
          >
            <span className="text-xl mr-3">🏠</span>
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            to="/orders"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-all duration-200 group"
          >
            <span className="text-xl mr-3">📦</span>
            <span className="font-medium">Siparişler</span>
          </Link>
          <Link
            to="/stock"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-all duration-200 group"
          >
            <span className="text-xl mr-3">📊</span>
            <span className="font-medium">Stok</span>
          </Link>
          <Link
            to="/invoice"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-all duration-200 group"
          >
            <span className="text-xl mr-3">📄</span>
            <span className="font-medium">Faturalar</span>
          </Link>
          <Link
            to="/payment"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-all duration-200 group"
          >
            <span className="text-xl mr-3">💳</span>
            <span className="font-medium">Ödemeler</span>
          </Link>
          <Link
            to="/ai-chat"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-all duration-200 group"
          >
            <span className="text-xl mr-3">💬</span>
            <span className="font-medium">AI Chat</span>
          </Link>
          <Link
            to="/narrative"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-all duration-200 group"
          >
            <span className="text-xl mr-3">📈</span>
            <span className="font-medium">AI Narrative</span>
          </Link>
          <Link
            to="/test"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-all duration-200 group"
          >
            <span className="text-xl mr-3">🧪</span>
            <span className="font-medium">Test</span>
          </Link>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-emerald-500/20">
          <div className="mb-3">
            <p className="text-sm text-emerald-400 font-medium truncate">{userProfile?.email}</p>
            <div className="flex gap-1 mt-2">
              {userProfile?.roles?.admin && (
                <div className="w-3 h-3 bg-emerald-500 rounded-full" title="Admin"></div>
              )}
              {userProfile?.roles?.sales && (
                <div className="w-3 h-3 bg-blue-500 rounded-full" title="Sales"></div>
              )}
              {userProfile?.roles?.finance && (
                <div className="w-3 h-3 bg-yellow-500 rounded-full" title="Finance"></div>
              )}
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            Çıkış
          </button>
        </div>
      </div>
    </aside>
  );
}

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-950">
      <Navigation />
      <main className={user ? "ml-64 min-h-screen" : "min-h-screen"}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute requiredRole="sales">
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stock"
              element={
                <ProtectedRoute>
                  <Stock />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoice"
              element={
                <ProtectedRoute requiredRole="finance">
                  <Invoice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute requiredRole="finance">
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-chat"
              element={
                <ProtectedRoute>
                  <AIChat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/narrative"
              element={
                <ProtectedRoute>
                  <Narrative />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <Test />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#10b981',
              border: '1px solid #10b981',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#1f2937',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1f2937',
              },
              style: {
                background: '#1f2937',
                color: '#ef4444',
                border: '1px solid #ef4444',
              },
            },
          }}
        />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
