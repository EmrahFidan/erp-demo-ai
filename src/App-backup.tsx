import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Stock from './pages/Stock';
import Invoice from './pages/Invoice';
import Payment from './pages/Payment';
import AIChat from './pages/AIChat';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-950">
        {/* Navigation */}
        <nav className="bg-gradient-to-r from-gray-900/90 to-emerald-950/90 backdrop-blur-lg shadow-2xl border-b border-emerald-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                    💼 ERP Demo
                  </h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="border-transparent text-gray-300 hover:border-emerald-400 hover:text-emerald-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/orders"
                    className="border-transparent text-gray-300 hover:border-emerald-400 hover:text-emerald-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/stock"
                    className="border-transparent text-gray-300 hover:border-emerald-400 hover:text-emerald-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200"
                  >
                    Stock
                  </Link>
                  <Link
                    to="/invoice"
                    className="border-transparent text-gray-300 hover:border-emerald-400 hover:text-emerald-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200"
                  >
                    Invoice
                  </Link>
                  <Link
                    to="/payment"
                    className="border-transparent text-gray-300 hover:border-emerald-400 hover:text-emerald-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200"
                  >
                    Payment
                  </Link>
                  <Link
                    to="/ai-chat"
                    className="border-transparent text-gray-300 hover:border-emerald-400 hover:text-emerald-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200"
                  >
                    AI Chat
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
