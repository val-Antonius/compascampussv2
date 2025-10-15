'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { FaCalendarAlt, FaUserTie, FaBook, FaChevronDown, FaChevronRight, FaSearch } from 'react-icons/fa';

export default function MyCoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('current');
  const [expandedCourse, setExpandedCourse] = useState(null);
  
  const [studentData, setStudentData] = useState({
    name: 'Budi Santoso',
    id: 'STD2024001',
    currentSemester: 3,
  });
  
  const [myCourses, setMyCourses] = useState([
    {
      id: 'CS101',
      name: 'Introduction to Programming',
      credits: 3,
      semester: 'current',
      instructor: 'Dr. Surya Wijaya',
      schedule: 'Mon, Wed 10:00-11:30',
      grade: null,
      status: 'active',
      description: 'Pengenalan dasar tentang konsep pemrograman menggunakan bahasa Python.'
    },
    {
      id: 'MTH201',
      name: 'Advanced Calculus',
      credits: 4,
      semester: 'current',
      instructor: 'Dr. Lisa Anggraini',
      schedule: 'Tue, Thu 13:00-14:30',
      grade: null,
      status: 'active',
      description: 'Kalkulus tingkat lanjut termasuk turunan parsial dan integral multivariabel.'
    },
    {
      id: 'ENG102',
      name: 'Technical Writing',
      credits: 2,
      semester: 'current',
      instructor: 'Prof. Hadi Susanto',
      schedule: 'Fri 14:00-16:00',
      grade: null,
      status: 'active',
      description: 'Teknik penulisan teknis untuk laporan, proposal, dan dokumentasi ilmiah.'
    },
    {
      id: 'PHY101',
      name: 'Basic Physics',
      credits: 3,
      semester: 'past',
      instructor: 'Dr. Agus Setiawan',
      schedule: 'Mon, Wed 08:00-09:30',
      grade: 'A-',
      status: 'completed',
      description: 'Konsep dasar fisika meliputi mekanika, gelombang, dan termodinamika.'
    },
    {
      id: 'CHM101',
      name: 'Introduction to Chemistry',
      credits: 3,
      semester: 'past',
      instructor: 'Dr. Sinta Dewi',
      schedule: 'Tue, Thu 10:00-11:30',
      grade: 'B+',
      status: 'completed',
      description: 'Dasar-dasar ilmu kimia termasuk struktur atom, tabel periodik, dan ikatan kimia.'
    },
  ]);
  
  // Filtered courses
  const filteredCourses = myCourses.filter(course => {
    const matchesSearch = 
      course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedSemester === 'all') return matchesSearch;
    return matchesSearch && course.semester === selectedSemester;
  });
  
  // Toggle course details
  const toggleCourseDetails = (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
    } else {
      setExpandedCourse(courseId);
    }
  };
  
  // Get status badge styling
  const getStatusClass = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'dropped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Calculate semester statistics
  const currentSemesterCredits = myCourses
    .filter(course => course.semester === 'current')
    .reduce((sum, course) => sum + course.credits, 0);
  
  const totalCredits = myCourses.reduce((sum, course) => sum + course.credits, 0);
  
  const completedCourses = myCourses.filter(course => course.status === 'completed').length;
  
  // Simulate loading data from an API
  useEffect(() => {
    console.log('Loading my courses data...');
    // setMyCourses(data from API)
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header studentName={studentData.name} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mata Kuliah Saya</h1>
        
        {/* Semester summary */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Semester {studentData.currentSemester} (Aktif)</h2>
              <p className="text-gray-600">Total SKS semester ini: <span className="font-medium">{currentSemesterCredits}</span></p>
              <p className="text-gray-600">Total SKS akumulatif: <span className="font-medium">{totalCredits}</span></p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col md:items-end">
              <div className="flex items-center mb-2">
                <span className="text-gray-600 mr-2">Mata kuliah yang diselesaikan:</span>
                <span className="font-medium">{completedCourses}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search and filter controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari mata kuliah..."
              className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Semester:</span>
            <select 
              className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="current">Semester Saat Ini ({studentData.currentSemester})</option>
              <option value="past">Semester Sebelumnya</option>
              <option value="all">Semua Semester</option>
            </select>
          </div>
        </div>
        
        {/* Course List */}
        <div className="space-y-4">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Course header */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleCourseDetails(course.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h3 className="font-medium text-lg text-red-800">{course.name}</h3>
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
                        {course.id}
                      </span>
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                        {course.credits} SKS
                      </span>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusClass(course.status)}`}>
                        {course.status === 'active' ? 'Aktif' : 
                         course.status === 'completed' ? 'Selesai' : 
                         'Dibatalkan'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center text-sm text-gray-500">
                      <div className="flex items-center mr-4">
                        <FaUserTie className="mr-1 text-gray-400" />
                        {course.instructor}
                      </div>
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-1 text-gray-400" />
                        {course.schedule}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {course.grade && (
                      <span className="mr-4 font-bold text-lg">{course.grade}</span>
                    )}
                    {expandedCourse === course.id ? (
                      <FaChevronDown className="text-gray-400" />
                    ) : (
                      <FaChevronRight className="text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Course details (expanded) */}
                {expandedCourse === course.id && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    
                    <div className="flex justify-end mt-4">
                      <Link 
                        href={`/course-detail/${course.id}`}
                        className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-2 rounded-md text-sm font-medium transition"
                      >
                        Lihat Detail Lengkap
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <FaBook className="mx-auto text-gray-400 text-3xl mb-2" />
              <p className="text-gray-600 mb-2">Tidak ada mata kuliah yang ditemukan</p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Reset Pencarian
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-red-800 text-white py-4 text-center mt-12">
        <p>© 2025 CompassCampus - Sistem Registrasi Mata Kuliah</p>
      </footer>
    </div>
  );
} 