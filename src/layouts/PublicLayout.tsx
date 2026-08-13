import { Outlet, ScrollRestoration } from 'react-router-dom';
import { PublicNavbar } from '@/components/PublicNavbar';
import { Footer } from '@/components/Footer';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
