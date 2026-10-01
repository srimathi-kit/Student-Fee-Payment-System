import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import StudentLayout from '../components/StudentLayout';
import { User, Mail, Phone, BookOpen, GraduationCap, Calendar, Save } from 'lucide-react';

const StudentProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ email: '', phone: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students/profile`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await response.json();
      if(data.success) {
        setProfile(data.data);
        setEditForm({ email: data.data.email || '', phone: data.data.phone || '' });
      }
    } catch (error) {
      console.error("Error fetching profile", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students/profile`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      const data = await response.json();
      if(data.success) {
        setMessage('Profile updated successfully');
        setProfile(data.data);
        setIsEditing(false);
      } else {
        setMessage(data.message || 'Error updating profile');
      }
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <StudentLayout pageTitle="Profile"><p>Loading profile...</p></StudentLayout>;

  return (
    <StudentLayout pageTitle="My Profile">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {message && (
          <div className={`p-4 rounded-lg font-semibold text-sm ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}

        {/* Header Card */}
        <div className="bg-royal-navy rounded-2xl p-8 text-white relative overflow-hidden shadow-premium flex items-center gap-6">
           <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
           <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-champagne/30 shrink-0">
             <User size={40} className="text-champagne" />
           </div>
           <div className="relative z-10">
             <h2 className="font-serif text-3xl font-bold text-champagne mb-1">{profile.name}</h2>
             <p className="text-gray-300 flex items-center gap-2">
               <GraduationCap size={16} /> {profile.studentId}
             </p>
           </div>
           
           {!isEditing ? (
             <button 
               onClick={() => setIsEditing(true)}
               className="ml-auto relative z-10 bg-white/10 hover:bg-white/20 transition-colors border border-white/20 text-white px-6 py-2.5 rounded-xl font-semibold text-sm"
             >
               Edit Profile
             </button>
           ) : (
             <button 
               onClick={handleSave}
               disabled={loading}
               className="ml-auto relative z-10 bg-champagne hover:bg-gold transition-colors text-royal-navy px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
             >
               <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
             </button>
           )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
            <h3 className="font-serif text-xl font-bold text-royal-navy border-b border-gray-50 pb-4">Contact Information</h3>
            
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Mail size={14} /> Email Address
              </label>
              {isEditing ? (
                <input 
                  type="email" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-royal-purple/20 focus:border-royal-purple outline-none"
                  value={editForm.email}
                  onChange={e => setEditForm({...editForm, email: e.target.value})}
                />
              ) : (
                <p className="font-medium text-lg text-gray-800">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Phone size={14} /> Phone Number
              </label>
              {isEditing ? (
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-royal-purple/20 focus:border-royal-purple outline-none"
                  value={editForm.phone}
                  onChange={e => setEditForm({...editForm, phone: e.target.value})}
                />
              ) : (
                <p className="font-medium text-lg text-gray-800">{profile.phone || 'Not provided'}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-gray-100"></div>
            <h3 className="font-serif text-xl font-bold text-royal-navy border-b border-gray-50 pb-4">Academic Details</h3>
            
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <BookOpen size={14} /> Department
              </label>
              <p className="font-medium text-lg text-gray-800">{profile.department}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Calendar size={14} /> Year
                </label>
                <p className="font-medium text-lg text-gray-800">{profile.year}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <GraduationCap size={14} /> Semester
                </label>
                <p className="font-medium text-lg text-gray-800">{profile.semester}</p>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 italic mt-4">* Academic details can only be modified by the administration.</p>
          </div>
        </div>

      </div>
    </StudentLayout>
  );
};

export default StudentProfile;
