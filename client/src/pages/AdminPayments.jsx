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
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
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
                       <span className={`px-2 py-1 text-xs font-bold rounded-md ${p.paymentStatus === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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