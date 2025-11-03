import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'sales' | 'finance' | 'admin';
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-emerald-950">
        <div className="text-emerald-400 text-2xl">⏳ Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirement
  if (requiredRole && userProfile) {
    const hasRequiredRole = userProfile.roles?.[requiredRole] === true;
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-emerald-950">
          <div className="bg-gradient-to-br from-gray-900 to-red-950/50 border border-red-500/30 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              🚫 Yetkisiz Erişim
            </h2>
            <p className="text-gray-300 mb-6">
              Bu sayfaya erişim için <strong>{requiredRole}</strong> yetkisine
              ihtiyacınız var.
            </p>
            <a
              href="/"
              className="text-emerald-400 hover:text-emerald-300 underline"
            >
              Ana sayfaya dön
            </a>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
