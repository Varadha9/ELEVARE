import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { FloatingChat } from '../FloatingChat';

export function DashboardLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <Navbar title={title} />
        <main className="p-6">
          {children}
        </main>
      </div>
      <FloatingChat />
    </div>
  );
}
