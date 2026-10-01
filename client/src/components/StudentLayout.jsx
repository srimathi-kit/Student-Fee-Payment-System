import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CreditCard, 
  History, 
  User, 
  LogOut, 
  GraduationCap, 
  Bell, 
  ChevronDown,
  FileText,
  FileBox
} from 'lucide-react';

const StudentLayout = ({ children, pageTitle }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Fees', path: '/student/dashboard', icon: FileBox },
    { name: 'Make Payment', path: '/student/payment', icon: CreditCard },
    { name: 'Payment History', path: '/student/payment-history', icon: History },
    { name: 'Profile', path: '/student/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-background-soft font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-royal-navy text-white flex flex-col hidden md:flex sticky top-0 h-screen shadow-premium z-20">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <GraduationCap className="text-gold w-8 h-8" />
          <span className="font-serif text-xl tracking-wide text-champagne font-bold">FEE PORTAL</span>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-royal-purple/40 text-white border-l-4 border-gold' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-gold' : ''} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-surface border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="font-serif text-2xl font-bold text-royal-navy">{pageTitle}</h1>
          
          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-royal-purple transition-colors">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-gray-200"></div>
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-royal-navy/5 text-royal-purple flex items-center justify-center font-bold font-serif border border-royal-purple/20 group-hover:border-royal-purple/50 transition-colors">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-royal-navy">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.studentId}</p>
              </div>
              <ChevronDown size={16} className="text-gray-400 group-hover:text-royal-purple transition-colors" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
