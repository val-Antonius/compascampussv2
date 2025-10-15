'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import AdminQuickActionsPanel from '@/components/AdminQuickActionsPanel';
import AdminEnrollmentActivity from '@/components/AdminEnrollmentActivity';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function AdminDashboardPage() {
  const [adminData, setAdminData] = useState({
    name: 'Ahmad Suryanto',
    role: 'System Administrator',
    totalStudents: 1250,
    activeCourses: 85,
    pendingEnrollments: 28,
    systemNotifications: 3,
  });

  const [creditDistribution, setCreditDistribution] = useState([
    { name: 'Mata Kuliah Inti', value: 45 },
    { name: 'Mata Kuliah Pilihan', value: 25 },
    { name: 'Praktikum', value: 15 },
  ]);

  const [enrollmentData, setEnrollmentData] = useState([
    { 
      id: 1, 
      studentName: 'Budi Santoso', 
      studentId: 'STD2024001',
      courseName: 'Introduction to Programming',
      courseId: 'CS101',
      enrollmentDate: '2025-04-10', 
      status: 'pending'
    },
    { 
      id: 2, 
      studentName: 'Dewi Lestari', 
      studentId: 'STD2024005',
      courseName: 'Advanced Calculus',
      courseId: 'MTH201',
      enrollmentDate: '2025-04-09', 
      status: 'active'
    },
    { 
      id: 3, 
      studentName: 'Rudi Hartono', 
      studentId: 'STD2024010',
      courseName: 'Technical Writing',
      courseId: 'ENG102',
      enrollmentDate: '2025-04-07', 
      status: 'pending'
    },
    { 
      id: 4, 
      studentName: 'Siti Rahayu', 
      studentId: 'STD2024018',
      courseName: 'Database Systems',
      courseId: 'CS303',
      enrollmentDate: '2025-04-05', 
      status: 'rejected'
    },
  ]);

  // Colors for pie chart
  const COLORS = ['#ef4444', '#f97316', '#f59e0b'];
  
  // Simulate loading data from an API
  useEffect(() => {
    // This would be a fetch call to your actual API in production
    console.log('Loading admin data...');
    // setAdminData(data from API)
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader adminName={adminData.name} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Admin Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <h3 className="text-sm text-gray-500 mb-1">Total Mahasiswa</h3>
            <p className="text-2xl font-bold">{adminData.totalStudents}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-sm text-gray-500 mb-1">Mata Kuliah Aktif</h3>
            <p className="text-2xl font-bold">{adminData.activeCourses}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500">
            <h3 className="text-sm text-gray-500 mb-1">Enrollment Tertunda</h3>
            <p className="text-2xl font-bold">{adminData.pendingEnrollments}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <h3 className="text-sm text-gray-500 mb-1">Notifikasi Sistem</h3>
            <p className="text-2xl font-bold">{adminData.systemNotifications}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left sidebar - 1/4 width on desktop */}
          <div className="lg:col-span-1">
            <AdminQuickActionsPanel />
          </div>
          
          {/* Main content area - 3/4 width on desktop */}
          <div className="lg:col-span-3 space-y-8">
            <AdminEnrollmentActivity enrollments={enrollmentData} />
            
            {/* Credit Distribution Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Distribusi SKS Mata Kuliah</h2>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={creditDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {creditDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} SKS`, 'SKS']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Distribusi SKS saat ini untuk seluruh jenis mata kuliah dalam sistem. Informasi ini membantu dalam perencanaan penawaran mata kuliah dan alokasi sumber daya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-red-800 text-white py-4 text-center mt-12">
        <p>© 2025 CompassCampus - Panel Administrator</p>
      </footer>
    </div>
  );
} 