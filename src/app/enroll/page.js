'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { FaTrash, FaArrowLeft, FaPaperPlane, FaExclamationTriangle, FaCalendarAlt, FaUserTie, FaBook } from 'react-icons/fa';

export default function EnrollPage() {
  const searchParams = useSearchParams();
  const courseParam = searchParams.get('course');
  
  const [studentData, setStudentData] = useState({
    name: 'Budi Santoso',
    id: 'STD2024001',
    semester: 3,
    enrolledCredits: 12,
    maxCredits: 24,
  });
  
  const [availableCourses, setAvailableCourses] = useState([
    {
      id: 'CS101',
      name: 'Introduction to Programming',
      credits: 3,
      instructor: 'Dr. Surya Wijaya',
      schedule: 'Mon, Wed 10:00-11:30',
      description: 'Pengenalan dasar tentang konsep pemrograman menggunakan bahasa Python.'
    },
    {
      id: 'MTH201',
      name: 'Advanced Calculus',
      credits: 4,
      instructor: 'Dr. Lisa Anggraini',
      schedule: 'Tue, Thu 13:00-14:30',
      description: 'Kalkulus tingkat lanjut termasuk turunan parsial dan integral multivariabel.'
    },
    {
      id: 'CS202',
      name: 'Data Structures and Algorithms',
      credits: 4,
      instructor: 'Dr. Ahmad Rahman',
      schedule: 'Mon, Wed 08:00-09:30',
      description: 'Pemahaman fundamental tentang struktur data dan algoritma dasar.'
    }
  ]);
  
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [scheduleConflicts, setScheduleConflicts] = useState([]);
  
  // Add course from URL parameter if provided
  useEffect(() => {
    if (courseParam) {
      const course = availableCourses.find(c => c.id === courseParam);
      if (course && !selectedCourses.some(c => c.id === courseParam)) {
        setSelectedCourses([...selectedCourses, course]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseParam]);
  
  // Check for schedule conflicts whenever selected courses change
  useEffect(() => {
    const conflicts = [];
    
    // Simple schedule conflict detection
    for (let i = 0; i < selectedCourses.length; i++) {
      for (let j = i + 1; j < selectedCourses.length; j++) {
        // This is a simplified check - in a real app you'd have a more sophisticated algorithm
        if (selectedCourses[i].schedule.includes('Mon') && selectedCourses[j].schedule.includes('Mon') ||
            selectedCourses[i].schedule.includes('Tue') && selectedCourses[j].schedule.includes('Tue') ||
            selectedCourses[i].schedule.includes('Wed') && selectedCourses[j].schedule.includes('Wed') ||
            selectedCourses[i].schedule.includes('Thu') && selectedCourses[j].schedule.includes('Thu') ||
            selectedCourses[i].schedule.includes('Fri') && selectedCourses[j].schedule.includes('Fri')) {
          conflicts.push({
            course1: selectedCourses[i],
            course2: selectedCourses[j],
          });
        }
      }
    }
    
    setScheduleConflicts(conflicts);
  }, [selectedCourses]);
  
  // Calculate total credits
  const totalSelectedCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);
  
  // Add course to selection
  const addCourse = (course) => {
    if (!selectedCourses.some(c => c.id === course.id)) {
      setSelectedCourses([...selectedCourses, course]);
    }
  };
  
  // Remove course from selection
  const removeCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter(course => course.id !== courseId));
  };
  
  // Check if adding a course would exceed max credits
  const wouldExceedMaxCredits = (course) => {
    return totalSelectedCredits + course.credits > studentData.maxCredits;
  };
  
  // Submit enrollment
  const submitEnrollment = () => {
    alert(`Pendaftaran mata kuliah berhasil diajukan! Mata kuliah: ${selectedCourses.map(c => c.id).join(', ')}`);
    // In a real app, you would submit to the server here
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header studentName={studentData.name} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/courses" className="text-blue-600 hover:text-blue-800 flex items-center mr-4">
            <FaArrowLeft className="mr-1" />
            Kembali ke Katalog
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Pendaftaran Mata Kuliah</h1>
        </div>
        
        {/* Credit summary */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan SKS</h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-gray-600 mb-2">
                SKS yang telah diambil: <span className="font-medium">{studentData.enrolledCredits}</span>
              </p>
              <p className="text-gray-600 mb-2">
                SKS pilihan saat ini: <span className="font-medium">{totalSelectedCredits}</span>
              </p>
              <p className="text-gray-600">
                Total: <span className="font-medium">{studentData.enrolledCredits + totalSelectedCredits}/{studentData.maxCredits} SKS</span>
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="w-full md:w-64 bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    (studentData.enrolledCredits + totalSelectedCredits) / studentData.maxCredits > 0.8 
                      ? 'bg-yellow-500' 
                      : 'bg-blue-600'
                  }`}
                  style={{ width: `${((studentData.enrolledCredits + totalSelectedCredits) / studentData.maxCredits) * 100}%` }}>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {studentData.maxCredits - (studentData.enrolledCredits + totalSelectedCredits)} SKS tersisa yang dapat diambil
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selected Courses */}
          <div className="bg-white rounded-lg shadow-md p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Mata Kuliah Pilihan ({selectedCourses.length})</h2>
            
            {selectedCourses.length > 0 ? (
              <div className="space-y-4">
                {selectedCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4 relative">
                    <button 
                      onClick={() => removeCourse(course.id)} 
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                      aria-label="Hapus mata kuliah"
                    >
                      <FaTrash />
                    </button>
                    
                    <h3 className="font-medium text-blue-800">{course.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{course.id} • {course.credits} SKS</p>
                    
                    <div className="text-sm text-gray-600 space-y-1 mt-3">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        {course.schedule}
                      </div>
                      <div className="flex items-center">
                        <FaUserTie className="text-gray-400 mr-2" />
                        {course.instructor}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <FaBook className="mx-auto text-gray-400 text-3xl mb-2" />
                <p className="text-gray-500">Belum ada mata kuliah yang dipilih</p>
                <p className="text-sm text-gray-400 mt-1">Pilih mata kuliah dari daftar sebelah kanan</p>
              </div>
            )}
            
            {/* Conflicts warning */}
            {scheduleConflicts.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                <div className="flex">
                  <FaExclamationTriangle className="text-red-500 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-red-800">Konflik Jadwal Terdeteksi!</p>
                    <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                      {scheduleConflicts.map((conflict, index) => (
                        <li key={index}>
                          {conflict.course1.id} dan {conflict.course2.id} memiliki jadwal yang berbenturan
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Credit warning */}
            {totalSelectedCredits > 0 && totalSelectedCredits + studentData.enrolledCredits > studentData.maxCredits && (
              <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-md">
                <div className="flex">
                  <FaExclamationTriangle className="text-yellow-500 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-yellow-800">Peringatan Jumlah SKS</p>
                    <p className="text-sm text-yellow-700">
                      Jumlah SKS yang dipilih ({totalSelectedCredits + studentData.enrolledCredits}) melebihi batas maksimum ({studentData.maxCredits}).
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Submit button */}
            <div className="mt-6">
              <button 
                onClick={submitEnrollment}
                disabled={selectedCourses.length === 0 || scheduleConflicts.length > 0}
                className={`w-full flex items-center justify-center py-3 px-4 rounded-lg transition ${
                  selectedCourses.length === 0 || scheduleConflicts.length > 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <FaPaperPlane className="mr-2" />
                Ajukan Pendaftaran
              </button>
              {selectedCourses.length === 0 && (
                <p className="text-center text-sm text-gray-500 mt-2">Pilih setidaknya satu mata kuliah</p>
              )}
              {scheduleConflicts.length > 0 && (
                <p className="text-center text-sm text-red-500 mt-2">Atasi konflik jadwal sebelum melanjutkan</p>
              )}
            </div>
          </div>
          
          {/* Available Courses */}
          <div className="bg-white rounded-lg shadow-md p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Mata Kuliah Tersedia</h2>
            
            <div className="space-y-4">
              {availableCourses.map((course) => {
                const isSelected = selectedCourses.some(c => c.id === course.id);
                const exceedsMaxCredits = wouldExceedMaxCredits(course);
                
                return (
                  <div 
                    key={course.id} 
                    className={`border rounded-lg p-4 transition ${
                      isSelected 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-blue-800">{course.name}</h3>
                        <p className="text-sm text-gray-500 mb-1">{course.id} • {course.credits} SKS</p>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-gray-400 mr-2" />
                            {course.schedule}
                          </div>
                          <div className="flex items-center">
                            <FaUserTie className="text-gray-400 mr-2" />
                            {course.instructor}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        {isSelected ? (
                          <button 
                            onClick={() => removeCourse(course.id)}
                            className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-2 rounded-md text-sm font-medium transition"
                          >
                            Batalkan
                          </button>
                        ) : (
                          <button 
                            onClick={() => addCourse(course)}
                            disabled={exceedsMaxCredits}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                              exceedsMaxCredits
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }`}
                            title={exceedsMaxCredits ? 'Melebihi jumlah maksimum SKS' : ''}
                          >
                            Pilih
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-blue-900 text-white py-4 text-center mt-12">
        <p>© 2025 CompassCampus - Course Registration System</p>
      </footer>
    </div>
  );
} 