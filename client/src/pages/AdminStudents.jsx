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
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
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