'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaGraduationCap, 
  FaChevronRight, 
  FaCalendarAlt, 
  FaUserTie, 
  FaCheck,
  FaExclamationCircle 
} from 'react-icons/fa';
import { useAuth } from '@/lib/AuthContext';
import { enrollCourse } from '@/lib/api';

export default function CourseList({ recommendedCourses, popularElectives }) {
  const router = useRouter();
  const { authFetch } = useAuth();
  
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(null);
  const [enrollmentError, setEnrollmentError] = useState(null);
  
  const handleEnroll = async (courseId) => {
    try {
      setEnrollingCourseId(courseId);
      setEnrollmentSuccess(null);
      setEnrollmentError(null);
      
      // Panggil API untuk mendaftar mata kuliah
      const result = await enrollCourse(authFetch, courseId);
      
      // Tampilkan notifikasi sukses
      setEnrollmentSuccess(`Berhasil mendaftar mata kuliah: ${result.course_name}`);
      
      // Reset enrolling state setelah 3 detik
      setTimeout(() => {
        setEnrollmentSuccess(null);
        setEnrollingCourseId(null);
      }, 3000);
    } catch (error) {
      console.error('Error enrolling course:', error);
      setEnrollmentError(error.message || 'Gagal mendaftar mata kuliah');
      
      // Reset error state setelah 3 detik
      setTimeout(() => {
        setEnrollmentError(null);
        setEnrollingCourseId(null);
      }, 3000);
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Notifikasi enrollment */}
      {enrollmentSuccess && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md flex items-center mb-4">
          <FaCheck className="mr-2" />
          {enrollmentSuccess}
        </div>
      )}
      
      {enrollmentError && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md flex items-center mb-4">
          <FaExclamationCircle className="mr-2" />
          {enrollmentError}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <h2 className="text-xl font-semibold p-5 text-gray-800">
            Mata Kuliah yang Direkomendasikan
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recommendedCourses.length === 0 ? (
            <div className="p-5 text-center text-gray-500">
              Tidak ada mata kuliah yang direkomendasikan saat ini
            </div>
          ) : (
            recommendedCourses.map(course => (
              <div key={course.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-red-800">{course.name}</h3>
                    <div className="flex items-center flex-wrap mt-1">
                      <span className="inline-flex items-center text-sm text-gray-500 mr-3">
                        <FaGraduationCap className="mr-1 text-gray-400" />
                        {course.id}
                      </span>
                      <span className="inline-flex items-center text-sm text-gray-500 mr-3">
                        <FaCalendarAlt className="mr-1 text-gray-400" />
                        {course.schedule}
                      </span>
                      <span className="inline-flex items-center text-sm text-gray-500">
                        <FaUserTie className="mr-1 text-gray-400" />
                        {course.instructor}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="inline-block bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full font-medium">
                      {course.credits} SKS
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      {course.available_seats} dari {course.total_seats} kursi tersedia
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrollingCourseId === course.id || course.available_seats <= 0}
                    className={`inline-flex items-center text-sm font-medium px-3 py-1 rounded ${
                      course.available_seats <= 0 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    {enrollingCourseId === course.id ? (
                      <span className="flex items-center">
                        <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-r-2 border-red-600 rounded-full"></span>
                        Mendaftar...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        {course.available_seats > 0 ? 'Tambahkan ke Enrollment' : 'Kelas Penuh'} 
                        <FaChevronRight className="ml-1" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
          <Link href="/course-catalog" className="inline-flex items-center text-red-600 hover:text-red-800 font-medium">
            Lihat Semua Mata Kuliah 
            <FaChevronRight className="ml-1" />
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <h2 className="text-xl font-semibold p-5 text-gray-800">
            Mata Kuliah Pilihan Populer
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y divide-x-0 md:divide-y-0 md:divide-x divide-gray-200">
          {popularElectives.length === 0 ? (
            <div className="p-5 text-center text-gray-500 md:col-span-2">
              Tidak ada mata kuliah pilihan saat ini
            </div>
          ) : (
            popularElectives.map((course, index) => (
              <div 
                key={course.id} 
                className={`p-4 hover:bg-gray-50 transition ${
                  index % 2 === 0 ? 'md:border-r md:border-gray-200' : ''
                }`}
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-red-800">{course.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className="inline-block text-xs px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full mr-2">
                        {course.id}
                      </span>
                      <span className="inline-block text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                        {course.category}
                      </span>
                    </div>
                  </div>
                  <span className="inline-block bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full font-medium">
                    {course.credits} SKS
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mb-3">
                  <FaCalendarAlt className="inline mr-1 text-gray-400" /> {course.schedule}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    <FaUserTie className="inline mr-1 text-gray-400" /> {course.instructor}
                  </span>
                  <button 
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrollingCourseId === course.id || course.available_seats <= 0}
                    className={`inline-flex items-center text-sm font-medium ${
                      course.available_seats <= 0 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-red-600 hover:text-red-800'
                    }`}
                  >
                    {enrollingCourseId === course.id ? (
                      <span className="flex items-center">
                        <span className="animate-spin h-4 w-4 mr-1 border-t-2 border-r-2 border-red-600 rounded-full"></span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        {course.available_seats > 0 ? 'Pilih' : 'Kelas Penuh'} 
                        {course.available_seats > 0 && <FaCheck className="ml-1" />}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
          <Link href="/course-catalog?filter=electives" className="inline-flex items-center text-red-600 hover:text-red-800 font-medium">
            Lihat Semua Mata Kuliah Pilihan
            <FaChevronRight className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}