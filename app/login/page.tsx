'use client';

import { LoginPage } from '../../components/Login';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/AuthContext';
import { useEffect } from 'react';

export default function Login() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user?.role) return;

    const role = user.role.trim().toLowerCase();

    if (role === 'admin') router.push('/admin');
    else if (role === 'vendor') router.push('/vendor/dashboard');
    else if (role === 'sales') router.push('/sales/dashboard');
    else router.push('/');
  }, [isAuthenticated, user, router]);

  const handleGoBack = () => {
    router.back();
  };

  const handleLoginSuccess = () => {
    if (user?.role === "admin") router.push("/admin");
    else if (user?.role === "vendor") router.push("/vendor/dashboard");
    else router.push("/");
  };

  if (isAuthenticated && !user) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated && user) {
    return <div>Redirecting...</div>;
  }

  return (
    <LoginPage
      onGoBack={handleGoBack}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}
