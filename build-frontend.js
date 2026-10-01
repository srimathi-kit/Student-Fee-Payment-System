const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, 'client', 'src');

const files = {
  'context/AuthContext.jsx': `
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const login = async (id, password, role) => {
    try {
      const endpoint = role === 'admin' ? '/api/auth/admin/login' : '/api/auth/student/login';
      const body = role === 'admin' ? { email: id, password } : { studentId: id, password };
      
      const response = await fetch(\`http://localhost:5000\${endpoint}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const resData = await response.json();

      if (response.ok && resData.success) {
        setUser(resData.data);
        localStorage.setItem('userInfo', JSON.stringify(resData.data));
        if(resData.data.role === 'admin') navigate('/admin/dashboard');
        else navigate('/student/dashboard');
      } else {
        throw new Error(resData.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
`,
  'pages/PaymentPage.jsx': `
import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import StudentLayout from '../components/StudentLayout';
import { ShieldCheck, CreditCard as CardIcon } from 'lucide-react';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const fee = location.state?.fee;

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Card Details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  if (!fee) return <StudentLayout pageTitle="Payment"><p>No fee selected.</p></StudentLayout>;

  const handlePayment = async (e) => {
    e.preventDefault();
    if(paymentMethod === 'Credit Card' && (!cardNumber || !cardHolder || !expiry || !cvv)) {
       setError("Please fill all mock card details");
       return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${user.token}\`
        },
        body: JSON.stringify({
          feeId: fee._id,
          amount: fee.pendingAmount,
          paymentMethod
        })
      });

      const resData = await response.json();
      
      if (response.ok && resData.success) {
        navigate('/student/payment-success', { state: { transaction: resData.data, fee } });
      } else {
        throw new Error(resData.message || 'Payment failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout pageTitle="Complete Your Payment">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-gray-500 font-medium">Amount Due</h2>
          <p className="font-serif text-4xl font-bold text-royal-navy">₹{fee.pendingAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Semester {fee.semester} Fee</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Methods */}
          <div className="w-full lg:w-1/3 space-y-4">
            <h3 className="font-serif text-xl font-bold text-royal-navy mb-4">Payment Method</h3>
            {['Credit Card', 'Debit Card', 'UPI', 'Net Banking'].map(method => (
              <label 
                key={method} 
                className={\`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all \${paymentMethod === method ? 'border-royal-purple bg-royal-purple/5 ring-1 ring-royal-purple/20' : 'border-gray-200 bg-white hover:border-gray-300'}\`}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="hidden"
                />
                <div className={\`w-5 h-5 rounded-full border flex items-center justify-center \${paymentMethod === method ? 'border-royal-purple' : 'border-gray-300'}\`}>
                  {paymentMethod === method && <div className="w-2.5 h-2.5 bg-royal-purple rounded-full"></div>}
                </div>
                <span className="font-semibold text-gray-700">{method}</span>
              </label>
            ))}
          </div>

          {/* Right: Form & Card Preview */}
          <div className="w-full lg:w-2/3 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
             
             {/* Mock Card Preview */}
             {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
               <div className="w-full max-w-sm h-48 bg-gradient-to-tr from-royal-navy to-deep-purple rounded-2xl p-6 text-white mb-8 relative overflow-hidden shadow-premium">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                 <div className="flex justify-between items-center mb-8 relative z-10">
                    <CardIcon className="text-champagne/80" size={28}/>
                    <span className="font-serif font-bold tracking-widest text-gold/80 italic">ROYAL ATHENA</span>
                 </div>
                 <div className="font-mono text-xl tracking-widest mb-4 relative z-10">
                   {cardNumber || '•••• •••• •••• ••••'}
                 </div>
                 <div className="flex justify-between text-sm text-gray-300 uppercase tracking-widest font-semibold relative z-10">
                   <span>{cardHolder || 'CARD HOLDER'}</span>
                   <span>{expiry || 'MM/YY'}</span>
                 </div>
               </div>
             )}

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-semibold">{error}</div>}

            <form onSubmit={handlePayment} className="space-y-6">
              {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input type="text" maxLength="19" placeholder="XXXX XXXX XXXX XXXX" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-royal-purple/20 focus:border-royal-purple outline-none" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name</label>
                      <input type="text" placeholder="John Doe" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-royal-purple/20 focus:border-royal-purple outline-none" value={cardHolder} onChange={e => setCardHolder(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                        <input type="text" placeholder="MM/YY" maxLength="5" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-royal-purple/20 focus:border-royal-purple outline-none" value={expiry} onChange={e => setExpiry(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input type="password" placeholder="XXX" maxLength="3" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-royal-purple/20 focus:border-royal-purple outline-none" value={cvv} onChange={e => setCvv(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'UPI' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                  <input type="text" placeholder="example@upi" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-royal-purple/20 focus:border-royal-purple outline-none" />
                </div>
              )}

              <div className="bg-blue-50/50 p-4 rounded-lg flex items-start gap-3 border border-blue-100 mt-6">
                 <ShieldCheck className="text-blue-500 mt-0.5 shrink-0" size={20}/>
                 <div className="text-xs text-gray-600">
                    <p className="font-bold text-blue-700 mb-1">Demo Payment Environment</p>
                    <p>This is a mock payment system. No real money is transferred. Your inputs are not stored in any real payment gateway.</p>
                 </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-royal-navy text-white py-4 rounded-xl font-bold text-lg hover:bg-deep-purple transition-colors disabled:opacity-70 mt-6 shadow-md"
                disabled={loading}
              >
                {loading ? 'Processing Payment...' : \`Pay ₹\${fee.pendingAmount.toLocaleString()}\`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};
export default PaymentPage;
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(clientDir, filepath), content.trim());
}
console.log('Frontend built successfully.');
