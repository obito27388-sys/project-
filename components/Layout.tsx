import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart2, 
  Award, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  LifeBuoy,
  Search,
  User as UserIcon
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: user ? `/${user.role.toLowerCase()}` : '/' },
    ...(user?.role === 'STUDENT' ? [
        { icon: BookOpen, label: 'My Quizzes', path: '/student/quizzes' },
    ] : []),
     ...(user?.role === 'TEACHER' ? [
        { icon: BookOpen, label: 'My Library', path: '/teacher/questions' },
    ] : []),
    { icon: Award, label: 'Leaderboard', path: '/leaderboard' },
    { icon: BarChart2, label: 'Reports', path: '/reports' },
    { icon: LifeBuoy, label: 'Support', path: '/support' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl hover:text-indigo-700 transition-colors">
            <BookOpen className="w-8 h-8" />
            <span>SyncQuiz</span>
          </Link>
          <button className="ml-auto lg:hidden" onClick={toggleSidebar}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-white">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 mb-1"
          >
            <Settings className="w-5 h-5 text-gray-400" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <button 
            onClick={toggleSidebar}
            className="p-2 -ml-2 lg:hidden text-gray-500 hover:bg-gray-100 rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 flex justify-center lg:justify-start lg:ml-4">
            <div className="max-w-md w-full relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                placeholder="Search quizzes, users, or reports..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.role}</div>
              </div>
              <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 overflow-hidden">
                 {user?.avatar ? <img src={user.avatar} alt="User" className="h-full w-full object-cover" /> : <UserIcon className="h-5 w-5 text-indigo-600" />}
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};