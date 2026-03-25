'use client';

import { LoginPage } from '../../components/Login';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/AuthContext';
import { useEffect } from 'react';

export default function Login() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (loading || !isAuthenticated) return;

    // Use a default role if user.role is missing
    const role = (user?.role || 'user').trim().toLowerCase();

    if (role === 'admin') router.push('/admin');
    else if (role === 'vendor') router.push('/vendor/dashboard');
    else if (role === 'sales') router.push('/sales/dashboard');
    else router.push('/profile');
  }, [isAuthenticated, user, router, loading]);

  const handleGoBack = () => {
    router.back();
  };

  const handleLoginSuccess = () => {
    const role = (user?.role || "user").trim().toLowerCase();
    if (role === "admin") router.push("/admin");
    else if (role === "vendor") router.push("/vendor/dashboard");
    else router.push("/profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Redirecting...</h2>
          <p className="text-gray-500">Please wait while we redirect you.</p>
        </div>
      </div>
    );
  }

  return (
    <LoginPage
      onGoBack={handleGoBack}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}
