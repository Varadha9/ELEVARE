import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, BarChart3, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';
import Dashboard from '../components/Dashboard';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ELEVARE
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <User size={20} />
                <span>{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 bg-white border-r">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'chat'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MessageSquare size={20} />
              <span>Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'dashboard'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </button>
          </nav>

          <div className="p-4 border-t mt-4">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">💡 Daily Tip</h3>
              <p className="text-xs text-gray-600">
                Consistent daily conversations help build a more accurate career profile.
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-hidden">
          {activeTab === 'chat' && (
            <div className="h-full p-6">
              <Chat />
            </div>
          )}
          {activeTab === 'dashboard' && (
            <div className="h-full overflow-y-auto">
              <Dashboard />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
