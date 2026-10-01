const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  fs.writeFileSync(path.join(__dirname, 'client', 'src', p), content.trim());
};

const adminLayout = `
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, CreditCard, History, PieChart, LogOut, ShieldCheck, ChevronDown, FileBox } from 'lucide-react';

const AdminLayout = ({ children, pageTitle }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Fees', path: '/admin/fees', icon: FileBox },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Reports', path: '/admin/reports', icon: PieChart },
  ];

  return (
    <div className="min-h-screen flex bg-background-soft font-sans">
      <aside className="w-64 bg-royal-navy text-white flex flex-col hidden md:flex sticky top-0 h-screen shadow-premium z-20">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <ShieldCheck className="text-gold w-8 h-8" />
          <span className="font-serif text-xl tracking-wide text-champagne font-bold">ADMIN PORTAL</span>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.path} className={\`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 \${isActive ? 'bg-royal-purple/40 text-white border-l-4 border-gold' : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'}\`}>
                <Icon size={20} className={isActive ? 'text-gold' : ''} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-20 bg-surface border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <h1 className="font-serif text-2xl font-bold text-royal-navy">{pageTitle}</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold font-serif border border-gold/30">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-royal-navy">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
`;

const adminDashboard = `
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { Users, Wallet, CreditCard, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reports/dashboard\`, {
          headers: { 'Authorization': \`Bearer \${user.token}\` }
        });
        const data = await res.json();
        if(data.success) setStats(data.data);
      } catch (e) {
        console.error(e);
      }
    };
    if (user) fetchStats();
  }, [user]);

  const mockChartData = [
    { name: 'Jul', collection: 120000 },
    { name: 'Aug', collection: 250000 },
    { name: 'Sep', collection: 400000 },
    { name: 'Oct', collection: stats?.todaysCollection || 0 }
  ];

  return (
    <AdminLayout pageTitle="Dashboard Overview">
      <div className="space-y-6 max-w-7xl mx-auto">
        {!stats ? (
          <p className="text-gray-500 p-4">Loading dashboard statistics...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={24}/></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-royal-navy">{stats.totalStudents}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Wallet size={24}/></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Collected</p>
                  <p className="text-2xl font-bold text-royal-navy">₹{stats.totalCollected.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-red-50 text-red-500 rounded-xl"><AlertCircle size={24}/></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Pending</p>
                  <p className="text-2xl font-bold text-royal-navy">₹{stats.totalPending.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><CreditCard size={24}/></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Today's Collection</p>
                  <p className="text-2xl font-bold text-royal-navy">₹{stats.todaysCollection.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-serif text-lg font-bold text-royal-navy mb-6">Recent Collections Trend</h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} tickFormatter={(v) => \`₹\${v/1000}k\`} />
                        <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="collection" fill="#4C1D95" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>
               
               <div className="bg-royal-navy rounded-2xl p-6 text-white relative overflow-hidden shadow-premium">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                 <h3 className="font-serif text-lg font-bold text-champagne mb-4 relative z-10">System Status</h3>
                 <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                       <span className="text-gray-400 text-sm">Database Sync</span>
                       <span className="text-green-400 font-semibold text-sm">Active</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                       <span className="text-gray-400 text-sm">Payment Gateway</span>
                       <span className="text-green-400 font-semibold text-sm">Mock Mode</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                       <span className="text-gray-400 text-sm">Total Expected</span>
                       <span className="text-white font-semibold text-sm">₹{stats.totalFees.toLocaleString()}</span>
                    </div>
                 </div>
               </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};
export default AdminDashboard;
`;

const adminStudents = `
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';

const AdminStudents = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students\`, {
          headers: { 'Authorization': \`Bearer \${user.token}\` }
        });
        const data = await res.json();
        if(data.success) setStudents(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchStudents();
  }, [user]);

  return (
    <AdminLayout pageTitle="Student Directory">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
             <h3 className="font-serif font-bold text-royal-navy">All Enrolled Students</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Reg No</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Dept</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Sem</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {loading ? (
                   <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading...</td></tr>
                ) : students.map(s => (
                  <tr key={s._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-royal-navy">{s.studentId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{s.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{s.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{s.semester}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminStudents;
`;

const adminPayments = `
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';

const AdminPayments = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments\`, {
          headers: { 'Authorization': \`Bearer \${user.token}\` }
        });
        const data = await res.json();
        if(data.success) setPayments(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchPayments();
  }, [user]);

  return (
    <AdminLayout pageTitle="Transaction Global Log">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">TXN ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Student Reg</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {loading ? (
                   <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading transactions...</td></tr>
                ) : payments.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-royal-navy">{p.transactionId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{p.studentId?.studentId || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-royal-navy">₹{p.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.paymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className={\`px-2 py-1 text-xs font-bold rounded-md \${p.paymentStatus === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}\`}>
                         {p.paymentStatus}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminPayments;
`;

const appJsx = `
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudents from './pages/AdminStudents';
import AdminPayments from './pages/AdminPayments';
import StudentPaymentHistory from './pages/StudentPaymentHistory';
import StudentProfile from './pages/StudentProfile';
import { AuthContext } from './context/AuthContext';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 font-serif">Loading Secure Portal...</div>;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/student/dashboard" element={user && user.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} />
      <Route path="/student/payment" element={user && user.role === 'student' ? <PaymentPage /> : <Navigate to="/login" />} />
      <Route path="/student/payment-success" element={user && user.role === 'student' ? <PaymentSuccess /> : <Navigate to="/login" />} />
      <Route path="/student/payment-history" element={user && user.role === 'student' ? <StudentPaymentHistory /> : <Navigate to="/login" />} />
      <Route path="/student/profile" element={user && user.role === 'student' ? <StudentProfile /> : <Navigate to="/login" />} />
      
      <Route path="/admin/dashboard" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
      <Route path="/admin/students" element={user && user.role === 'admin' ? <AdminStudents /> : <Navigate to="/login" />} />
      <Route path="/admin/payments" element={user && user.role === 'admin' ? <AdminPayments /> : <Navigate to="/login" />} />
      <Route path="/admin/fees" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
      <Route path="/admin/reports" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
};
export default App;
`;

write('components/AdminLayout.jsx', adminLayout);
write('pages/AdminDashboard.jsx', adminDashboard);
write('pages/AdminStudents.jsx', adminStudents);
write('pages/AdminPayments.jsx', adminPayments);
write('App.jsx', appJsx);

console.log('Admin pages generated.');
