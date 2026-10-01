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
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reports/dashboard`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
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
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} tickFormatter={(v) => `₹${v/1000}k`} />
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