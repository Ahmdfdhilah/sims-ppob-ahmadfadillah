import { ReactNode, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from './Navbar';
import Header from './Header';

interface MainLayoutProps {
  children?: ReactNode;
  showHeader?: boolean;
}

export function MainLayout({ children, showHeader = true }: MainLayoutProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Jika tidak authenticated dan tidak loading, redirect ke login
    if (!isAuthenticated && !isLoading) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-2 md:px-4 md:px-6 lg:px-12 py-4 lg:py-8">
        {showHeader && <Header />}
        <div className="py-4">
          {children || <Outlet />}
        </div>

      </main>
    </div>
  );
}