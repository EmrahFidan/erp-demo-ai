import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState({
    admin: true,
    sales: true,
    finance: true,
  });
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signup(email, password, selectedRoles);
      toast.success('Hesap başarıyla oluşturuldu!');
      navigate('/');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Hesap oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-emerald-950 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            ERP Demo
          </h2>
          <p className="mt-2 text-gray-400">Yeni Hesap Oluştur</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-emerald-950/50 border border-emerald-500/30 rounded-lg p-8 space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-emerald-400 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-emerald-500/30 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                placeholder="admin@erp.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-emerald-400 mb-2">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-emerald-500/30 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                placeholder="Minimum 6 karakter"
                minLength={6}
              />
            </div>

            {/* Roles */}
            <div>
              <label className="block text-sm font-medium text-emerald-400 mb-2">
                Roller
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedRoles.admin}
                    onChange={(e) => setSelectedRoles({ ...selectedRoles, admin: e.target.checked })}
                    className="rounded border-emerald-500/30 bg-gray-900 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-gray-300">Admin (Tüm yetkilere sahip)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedRoles.sales}
                    onChange={(e) => setSelectedRoles({ ...selectedRoles, sales: e.target.checked })}
                    className="rounded border-emerald-500/30 bg-gray-900 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-gray-300">Sales (Sipariş yönetimi)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedRoles.finance}
                    onChange={(e) => setSelectedRoles({ ...selectedRoles, finance: e.target.checked })}
                    className="rounded border-emerald-500/30 bg-gray-900 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-gray-300">Finance (Fatura/Ödeme)</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? '⏳ Oluşturuluyor...' : '✅ Hesap Oluştur'}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Zaten hesabınız var mı? Giriş yapın
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
