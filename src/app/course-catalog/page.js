'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { FaSearch, FaFilter, FaCalendarAlt, FaUserTie, FaInfoCircle } from 'react-icons/fa';

export default function CourseCatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    semester: '',
    credits: '',
    category: '',
  });
  
  const [studentData, setStudentData] = useState({
    name: 'Budi Santoso',
    id: 'STD2024001',
    semester: 3,
  });
  
  // Dummy data for courses
  const [courses, setCourses] = useState([
    {
      id: 'CS101',
      name: 'Introduction to Programming',
      credits: 3,
      semester: 1,
      category: 'Core',
      instructor: 'Dr. Surya Wijaya',
      schedule: 'Mon, Wed 10:00-11:30',
      description: 'Pengenalan dasar tentang konsep pemrograman menggunakan bahasa Python.'
    },
    {
      id: 'MTH101',
      name: 'Calculus I',
      credits: 4,
      semester: 1,
      category: 'Core',
      instructor: 'Dr. Lisa Anggraini',
      schedule: 'Tue, Thu 13:00-14:30',
      description: 'Pengenalan kalkulus diferensial dan integral satu variabel.'
    },
    {
      id: 'CS202',
      name: 'Data Structures and Algorithms',
      credits: 4,
      semester: 3,
      category: 'Core',
      instructor: 'Dr. Ahmad Rahman',
      schedule: 'Mon, Wed 10:00-11:30',
      description: 'Kursus ini mengajarkan konsep struktur data dan algoritma yang penting dalam pemrograman.'
    },
    {
      id: 'CS303',
      name: 'Database Systems',
      credits: 3,
      semester: 3,
      category: 'Core',
      instructor: 'Dr. Maya Putri',
      schedule: 'Tue, Thu 13:00-14:30',
      description: 'Pengenalan sistem basis data, SQL, dan desain basis data.'
    },
    {
      id: 'CS304',
      name: 'Software Engineering',
      credits: 4,
      semester: 3,
      category: 'Core',
      instructor: 'Prof. Rudi Hartono',
      schedule: 'Wed, Fri 08:00-09:30',
      description: 'Prinsip-prinsip rekayasa perangkat lunak, metodologi pengembangan, dan manajemen proyek.'
    },
    {
      id: 'CS401',
      name: 'Computer Networks',
      credits: 3,
      semester: 4,
      category: 'Core',
      instructor: 'Dr. Bambang Sutejo',
      schedule: 'Tue, Thu 10:00-11:30',
      description: 'Konsep jaringan komputer, protokol, dan teknologi komunikasi.'
    },
    {
      id: 'CS405',
      name: 'Artificial Intelligence',
      credits: 4,
      semester: 4,
      category: 'Elective',
      instructor: 'Prof. Lina Dewi',
      schedule: 'Mon, Wed 15:00-16:30',
      description: 'Pengantar kecerdasan buatan, algoritma pembelajaran mesin, dan aplikasinya.'
    },
    {
      id: 'HUM101',
      name: 'Introduction to Philosophy',
      credits: 2,
      semester: 2,
      category: 'General Education',
      instructor: 'Dr. Indra Wijaya',
      schedule: 'Fri 15:00-17:00',
      description: 'Pengantar filsafat dan pemikiran kritis.'
    },
    {
      id: 'ART202',
      name: 'Digital Art and Design',
      credits: 3,
      semester: 5,
      category: 'Elective',
      instructor: 'Prof. Nina Sari',
      schedule: 'Tue 15:00-18:00',
      description: 'Pengenalan teknik seni dan desain digital.'
    },
    {
      id: 'BUS101',
      name: 'Entrepreneurship Basics',
      credits: 2,
      semester: 5,
      category: 'General Education',
      instructor: 'Dr. Anton Wijaya',
      schedule: 'Thu 10:00-12:00',
      description: 'Dasar-dasar kewirausahaan dan pengembangan bisnis.'
    },
  ]);
  
  // Filtering logic
  const filteredCourses = courses.filter(course => {
    // Search term filtering
    const searchMatch = 
      course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter criteria
    const semesterMatch = filter.semester === '' || course.semester.toString() === filter.semester;
    const creditsMatch = filter.credits === '' || course.credits.toString() === filter.credits;
    const categoryMatch = filter.category === '' || course.category === filter.category;
    
    return searchMatch && semesterMatch && creditsMatch && categoryMatch;
  });
  
  // Reset filters
  const resetFilters = () => {
    setFilter({
      semester: '',
      credits: '',
      category: '',
    });
    setSearchTerm('');
  };
  
  // Get unique values for filter dropdowns
  const uniqueSemesters = [...new Set(courses.map(course => course.semester))].sort((a, b) => a - b);
  const uniqueCredits = [...new Set(courses.map(course => course.credits))].sort((a, b) => a - b);
  const uniqueCategories = [...new Set(courses.map(course => course.category))].sort();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header studentName={studentData.name} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Katalog Mata Kuliah</h1>
        <p className="text-gray-600 mb-6">Jelajahi seluruh mata kuliah yang tersedia di kampus kami.</p>
        
        {/* Search and filters */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            {/* Search box */}
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari mata kuliah..."
                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="w-full md:w-1/2 grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={filter.semester}
                onChange={(e) => setFilter({...filter, semester: e.target.value})}
              >
                <option value="">Semua Semester</option>
                {uniqueSemesters.map(semester => (
                  <option key={semester} value={semester}>Semester {semester}</option>
                ))}
              </select>
              
              <select
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={filter.credits}
                onChange={(e) => setFilter({...filter, credits: e.target.value})}
              >
                <option value="">Semua SKS</option>
                {uniqueCredits.map(credit => (
                  <option key={credit} value={credit}>{credit} SKS</option>
                ))}
              </select>
              
              <select
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={filter.category}
                onChange={(e) => setFilter({...filter, category: e.target.value})}
              >
                <option value="">Semua Kategori</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Reset button */}
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Reset
            </button>
          </div>
          
          {/* Filter summary */}
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <FaFilter className="mr-2" />
            <span>
              Menampilkan {filteredCourses.length} dari {courses.length} mata kuliah
              {(filter.semester || filter.credits || filter.category || searchTerm) && ' (dengan filter)'}
            </span>
          </div>
        </div>
        
        {/* Course list as table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kode
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Mata Kuliah
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKS
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dosen
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jadwal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map(course => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-800">
                        {course.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {course.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          course.category === 'Core' 
                            ? 'bg-red-100 text-red-800'
                            : course.category === 'Elective'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {course.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaUserTie className="mr-1 text-gray-400" />
                          {course.instructor}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1 text-gray-400" />
                          {course.schedule}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => alert(`Detail mata kuliah: ${course.description}`)}
                        >
                          <FaInfoCircle />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                      Tidak ada mata kuliah yang ditemukan berdasarkan filter Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <footer className="bg-red-800 text-white py-4 text-center mt-12">
        <p>© 2025 CompassCampus - Sistem Registrasi Mata Kuliah</p>
      </footer>
    </div>
  );
} 