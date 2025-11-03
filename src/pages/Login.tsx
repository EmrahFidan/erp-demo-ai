import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-emerald-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            ERP Demo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Hesabınızla giriş yapın
          </p>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email adresi
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-emerald-500/30 bg-gray-900 placeholder-gray-500 text-gray-100 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Email adresi"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-emerald-500/30 bg-gray-900 placeholder-gray-500 text-gray-100 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Şifre"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {loading ? '⏳ Giriş yapılıyor...' : '🔐 Giriş Yap'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/signup"
              className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Hesabınız yok mu? Kayıt olun
            </Link>
          </div>
        </form>

        <div className="mt-6 bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-emerald-400 mb-3">
            Demo Hesaplar:
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            <li>
              <strong className="text-emerald-400">Admin:</strong>{' '}
              admin@erp.com / admin123
            </li>
            <li>
              <strong className="text-blue-400">Satış:</strong> sales@erp.com /
              sales123
            </li>
            <li>
              <strong className="text-yellow-400">Finans:</strong>{' '}
              finance@erp.com / finance123
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
