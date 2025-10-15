'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import QuickActionsPanel from '@/components/QuickActionsPanel';
import CourseList from '@/components/CourseList';
import { useAuth } from '@/lib/AuthContext';
import { getCourses, getUserEnrollments } from '@/lib/api';

export default function HomePage() {
  const router = useRouter();
  const { user, authFetch, loading } = useAuth();
  
  const [studentData, setStudentData] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [popularElectives, setPopularElectives] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  
  // Redirect ke halaman login jika tidak ada user yang login
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  // Dapatkan data mahasiswa dan mata kuliah
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);
  
  const fetchData = async () => {
    try {
      setPageLoading(true);
      
      // Dapatkan data mahasiswa dari user
      setStudentData({
        name: user.fullname,
        id: user.student_id,
        semester: user.semester || 1,
        enrolledCredits: 0, // Akan dihitung dari enrollment
        maxCredits: 24,
        activeCourses: 0, // Akan dihitung dari enrollment
        pendingApprovals: 0, // Akan dihitung dari enrollment
      });
      
      // Dapatkan mata kuliah yang direkomendasikan
      const courses = await getCourses();
      setRecommendedCourses(courses.slice(0, 3)); // Ambil 3 mata kuliah teratas
      
      // Dapatkan mata kuliah pilihan populer
      const electiveCourses = courses.filter(course => 
        course.category !== 'Computer Science' && course.category !== 'Mathematics'
      );
      setPopularElectives(electiveCourses.slice(0, 4)); // Ambil 4 mata kuliah pilihan teratas
      
      // Dapatkan enrollment mahasiswa
      const enrollments = await getUserEnrollments(authFetch);
      
      // Update data mahasiswa dengan data enrollment
      if (enrollments) {
        const activeEnrollments = enrollments.filter(e => e.status === 'approved');
        const pendingEnrollments = enrollments.filter(e => e.status === 'pending');
        
        // Hitung jumlah SKS yang diambil
        const totalCredits = activeEnrollments.reduce((sum, e) => sum + e.credits, 0);
        
        setStudentData(prev => ({
          ...prev,
          enrolledCredits: totalCredits,
          activeCourses: activeEnrollments.length,
          pendingApprovals: pendingEnrollments.length,
        }));
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setPageLoading(false);
    }
  };
  
  // Tampilkan loading jika data belum siap
  if (loading || !user || pageLoading || !studentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Student Dashboard Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Selamat Datang, {studentData.name}!</h1>
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="md:w-1/2">
              <p className="text-gray-600 mb-2">ID Mahasiswa: <span className="font-semibold">{studentData.id}</span></p>
              <p className="text-gray-600 mb-2">Semester: <span className="font-semibold">{studentData.semester}</span></p>
              <p className="text-gray-600">SKS yang diambil: <span className="font-semibold">{studentData.enrolledCredits}/{studentData.maxCredits}</span></p>
            </div>
            <div className="md:w-1/2">
              <div className="mb-2">
                <span className="text-gray-600">Status SKS:</span>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div 
                    className="h-2.5 rounded-full bg-red-600"
                    style={{ width: `${(studentData.enrolledCredits / studentData.maxCredits) * 100}%` }}>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="bg-red-50 px-3 py-1 rounded-full text-red-700 text-sm font-medium">
                  Mata Kuliah Aktif: {studentData.activeCourses}
                </div>
                <div className="bg-amber-50 px-3 py-1 rounded-full text-amber-700 text-sm font-medium">
                  Menunggu Persetujuan: {studentData.pendingApprovals}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left sidebar - 1/4 width on desktop */}
          <div className="lg:col-span-1">
            <QuickActionsPanel />
          </div>
          
          {/* Main content area - 3/4 width on desktop */}
          <div className="lg:col-span-3 space-y-8">
            <CourseList 
              recommendedCourses={recommendedCourses}
              popularElectives={popularElectives}
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-red-800 text-white py-4 text-center mt-12">
        <p>© 2025 CompassCampus - Sistem Registrasi Mata Kuliah</p>
      </footer>
    </div>
  );
}