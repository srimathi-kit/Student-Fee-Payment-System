import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import StudentLayout from '../components/StudentLayout';
import { Search, Filter, Download, CheckCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentPaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await response.json();
        if(data.success) {
          setPayments(data.data);
        }
      } catch (error) {
        console.error("Error fetching payments", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchPayments();
  }, [user]);

  const filteredPayments = payments.filter(p => 
    p.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StudentLayout pageTitle="Payment History">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Transaction ID or Method..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-royal-purple/20 focus:border-royal-purple outline-none text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors w-full sm:w-auto">
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Semester</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Receipt</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 font-medium">Loading transaction history...</td>
                  </tr>
                ) : filteredPayments.length > 0 ? (
                  filteredPayments.map(payment => (
                    <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-royal-navy font-mono">
                        {payment.transactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(payment.paymentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        Sem {payment.feeId?.semester || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-royal-navy">
                        ₹{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {payment.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-md flex items-center gap-1 w-max ${
                          payment.paymentStatus === 'SUCCESS' ? 'bg-green-100 text-green-700' : 
                          payment.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.paymentStatus === 'SUCCESS' && <CheckCircle size={12} />}
                          {payment.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button 
                          onClick={() => navigate('/student/payment-success', { state: { transaction: payment, fee: payment.feeId } })}
                          className="text-gray-400 hover:text-royal-purple transition-colors p-2 rounded-lg hover:bg-royal-purple/10 inline-flex items-center justify-center"
                          title="View Receipt"
                        >
                          <FileText size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 font-medium">
                      No payment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentPaymentHistory;
