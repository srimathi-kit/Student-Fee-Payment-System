import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';
import { CheckCircle, Printer, Download, ArrowLeft } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const transaction = location.state?.transaction;
  const fee = location.state?.fee;

  useEffect(() => {
    if (!transaction) {
      navigate('/student/dashboard');
    }
  }, [transaction, navigate]);

  if (!transaction) return null;

  return (
    <StudentLayout pageTitle="Payment Successful">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden printable-receipt">
          
          <div className="bg-green-50 p-8 text-center border-b border-green-100">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
              <CheckCircle size={32} />
            </div>
            <h2 className="font-serif text-3xl font-bold text-green-700 mb-2">Payment Successful!</h2>
            <p className="text-green-600/80 font-medium">Your transaction has been securely processed.</p>
          </div>

          <div className="p-8 pb-12">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-8">
               <div>
                  <h3 className="font-serif text-xl font-bold text-royal-navy">Royal Athena University</h3>
                  <p className="text-gray-500 text-sm">Official Fee Payment Receipt</p>
               </div>
               <div className="text-right">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Transaction ID</p>
                  <p className="font-mono text-royal-navy font-bold">{transaction.transactionId}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-8">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Payment Date</p>
                <p className="font-medium text-gray-800">{new Date(transaction.paymentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Payment Method</p>
                <p className="font-medium text-gray-800">{transaction.paymentMethod}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Semester</p>
                <p className="font-medium text-gray-800">Semester {fee?.semester || 'V'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Status</p>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-bold">{transaction.paymentStatus}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex justify-between items-center mt-8">
               <span className="font-semibold text-gray-600 uppercase tracking-widest text-sm">Amount Paid</span>
               <span className="font-serif text-3xl font-bold text-royal-navy">₹{transaction.amount.toLocaleString()}</span>
            </div>

          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center no-print">
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-white text-royal-navy border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Printer size={18} /> Print Receipt
          </button>
          <Link 
            to="/student/dashboard"
            className="flex items-center justify-center gap-2 bg-royal-navy text-white px-6 py-3 rounded-xl font-semibold hover:bg-deep-purple transition-colors shadow-md"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
        </div>

      </div>
    </StudentLayout>
  );
};

export default PaymentSuccess;
