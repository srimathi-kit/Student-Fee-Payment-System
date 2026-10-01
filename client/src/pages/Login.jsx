import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, GraduationCap, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('student');

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !password) {
      setError('Please provide your credentials.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(studentId, password, role);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-background-soft">
      {/* Left Side: Premium Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-royal-navy overflow-hidden flex-col justify-between p-12 text-white">
        {/* Subtle royal gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-royal-purple/40 to-royal-navy/90 mix-blend-multiply z-10"></div>
        
        {/* Abstract shapes / architectural placeholder */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-deep-purple/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-20">
          <div className="flex items-center gap-3 mb-16">
            <GraduationCap className="text-gold w-10 h-10" />
            <span className="font-serif text-2xl tracking-wider font-semibold text-champagne">Royal Athena University</span>
          </div>
        </div>

        <div className="relative z-20 max-w-lg">
          <div className="w-16 h-1 bg-gold mb-8 rounded-full"></div>
          <h1 className="font-serif text-5xl leading-tight mb-6 font-bold">
            Empowering Education Through Seamless Payments
          </h1>
          <p className="text-lg text-gray-300 font-light tracking-wide mb-12">
            Experience a frictionless financial journey. Manage your tuition, track receipts, and focus on what truly matters—your academic excellence.
          </p>
          
          <div className="flex gap-6 text-sm text-champagne/80 uppercase tracking-widest font-semibold">
            <div className="flex items-center gap-2"><ShieldCheck size={16} /> Secure</div>
            <div className="flex items-center gap-2"><span>•</span> Simple</div>
            <div className="flex items-center gap-2"><span>•</span> Transparent</div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="font-serif text-4xl font-bold text-royal-navy mb-3">Welcome Back</h2>
            <p className="text-gray-500">Access your secure academic fee portal</p>
          </div>

          {/* Role Selector */}
          <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
            <button 
              type="button"
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${role === 'student' ? 'bg-white shadow-sm text-royal-purple' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setRole('student')}
            >
              Student
            </button>
            <button 
              type="button"
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${role === 'admin' ? 'bg-white shadow-sm text-royal-purple' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setRole('admin')}
            >
              Administrator
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {role === 'student' ? 'Register Number' : 'Admin ID'}
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-royal-purple/20 focus:border-royal-purple outline-none transition-all" 
                placeholder={role === 'student' ? 'e.g. 23CSE001' : 'Admin ID'}
                value={studentId} 
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm text-royal-purple hover:text-deep-purple font-medium">Forgot Password?</a>
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-royal-purple/20 focus:border-royal-purple outline-none transition-all" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button 
              type="submit" 
              className="relative overflow-hidden w-full bg-royal-navy text-white py-3.5 rounded-lg font-medium tracking-wide hover:bg-deep-purple transition-colors disabled:opacity-70 group mt-4"
              disabled={loading}
            >
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-royal-purple to-deep-purple transition-all duration-[250ms] ease-out group-hover:w-full opacity-50"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-champagne" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : 'Sign In'}
              </span>
            </button>
          </form>

          <div className="mt-12 text-center border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Secure Academic Payment Portal
            </p>
            <div className="w-12 h-[2px] bg-gold/50 mx-auto mt-3 rounded-full"></div>
          </div>
          
          <div className="mt-8 bg-champagne/10 p-4 rounded text-xs text-gray-500 border border-champagne/20">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            <p>Student: 23CSE001 / Student@123</p>
            <p>Admin: admin@college.edu / Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
