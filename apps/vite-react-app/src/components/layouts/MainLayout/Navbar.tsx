import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@workspace/ui/components/button';
import { Sheet, SheetContent, SheetTrigger } from '@workspace/ui/components/sheet';
import { Menu, LogOut } from 'lucide-react';
import { navigationItems } from '@/lib/menus';
import { logoImg } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { getLinkClass } from '@/utils/common';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogoutConfirm = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <header className="px-4 md:px-6 lg:px-24 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logoImg} alt="" />
            <span className="font-bold text-md md:text-lg lg:text-xl">SIMS PPOB</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex items-center space-x-6 hidden md:flex">
          <nav className="flex items-center space-x-6 text-sm font-bold">
            {navigationItems.map((item) => (
              <Link key={item.href} to={item.href} className={getLinkClass(item.href)}>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Logout Button with ConfirmationDialog */}
          {isAuthenticated && (
            <ConfirmationDialog
              triggerText={
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-destructive/10 hover:text-destructive"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              }
              title="Konfirmasi Logout"
              description="Apakah Anda yakin ingin keluar dari akun Anda?"
              onConfirm={handleLogoutConfirm}
              confirmText="Logout"
              cancelText="Batal"
            />
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7 py-6">
                <Link to="/" className="flex items-center space-x-2">
                  <img src={logoImg} alt="" />
                  <span className="font-bold text-md md:text-lg lg:text-xl">
                    SIMS PPOB
                  </span>
                </Link>
              </div>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={getLinkClass(item.href, true)}
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}

                  {/* Mobile Logout Button with ConfirmationDialog */}
                  {isAuthenticated && (
                    <ConfirmationDialog
                      triggerText={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 hover:bg-destructive/10 hover:text-destructive text-left items-left justify-start"
                          title="Logout"
                        >
                          <LogOut className="h-5 w-5" />

                        </Button>
                      }
                      title="Konfirmasi Logout"
                      description="Apakah Anda yakin ingin keluar dari akun Anda?"
                      onConfirm={handleLogoutConfirm}
                      confirmText="Logout"
                      cancelText="Batal"
                    />
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}