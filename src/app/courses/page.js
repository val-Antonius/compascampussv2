'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { FaSearch, FaFilter, FaCalendarAlt, FaUserTie, FaChair, FaLayerGroup } from 'react-icons/fa';

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [creditFilter, setCreditFilter] = useState('all');
  
  const [courses, setCourses] = useState([
    {
      id: 'CS101',
      name: 'Introduction to Programming',
      credits: 3,
      category: 'Computer Science',
      instructor: 'Dr. Surya Wijaya',
      schedule: 'Mon, Wed 10:00-11:30',
      totalSeats: 40,
      availableSeats: 15,
      description: 'Pengenalan dasar tentang konsep pemrograman menggunakan bahasa Python.'
    },
    {
      id: 'MTH201',
      name: 'Advanced Calculus',
      credits: 4,
      category: 'Mathematics',
      instructor: 'Dr. Lisa Anggraini',
      schedule: 'Tue, Thu 13:00-14:30',
      totalSeats: 30,
      availableSeats: 8,
      description: 'Kalkulus tingkat lanjut termasuk turunan parsial dan integral multivariabel.'
    },
    {
      id: 'ENG102',
      name: 'Technical Writing',
      credits: 2,
      category: 'English',
      instructor: 'Prof. Hadi Susanto',
      schedule: 'Fri 14:00-16:00',
      totalSeats: 35,
      availableSeats: 15,
      description: 'Teknik penulisan teknis untuk laporan, proposal, dan dokumentasi ilmiah.'
    },
    {
      id: 'CS202',
      name: 'Data Structures and Algorithms',
      credits: 4,
      category: 'Computer Science',
      instructor: 'Dr. Ahmad Rahman',
      schedule: 'Mon, Wed 08:00-09:30',
      totalSeats: 40,
      availableSeats: 2,
      description: 'Pemahaman fundamental tentang struktur data dan algoritma dasar.'
    },
    {
      id: 'CS303',
      name: 'Database Systems',
      credits: 3,
      category: 'Computer Science',
      instructor: 'Dr. Maya Putri',
      schedule: 'Tue, Thu 10:00-11:30',
      totalSeats: 30,
      availableSeats: 5,
      description: 'Desain dan implementasi sistem basis data, SQL, dan normalisasi.'
    },
    {
      id: 'BUS101',
      name: 'Entrepreneurship Basics',
      credits: 2,
      category: 'Business',
      instructor: 'Dr. Anton Wijaya',
      schedule: 'Thu 10:00-12:00',
      totalSeats: 45,
      availableSeats: 20,
      description: 'Konsep dasar kewirausahaan, strategi bisnis, dan model bisnis modern.'
    },
    {
      id: 'PHY202',
      name: 'Modern Physics',
      credits: 4,
      category: 'Physics',
      instructor: 'Prof. Dewi Kartika',
      schedule: 'Mon, Wed 14:00-15:30',
      totalSeats: 35,
      availableSeats: 12,
      description: 'Pengenalan fisika modern termasuk relativitas dan mekanika kuantum.'
    },
    {
      id: 'HUM101',
      name: 'Introduction to Philosophy',
      credits: 2,
      category: 'Humanities',
      instructor: 'Dr. Indra Wijaya',
      schedule: 'Fri 15:00-17:00',
      totalSeats: 50,
      availableSeats: 25,
      description: 'Eksplorasi pemikiran filsafat dasar dari berbagai tradisi filosofis.'
    },
  ]);
  
  // Get unique categories for the filter
  const categories = ['all', ...new Set(courses.map(course => course.category))];
  
  // Filtered courses based on search term and filters
  const filteredCourses = courses.filter(course => {
    // Search term filter
    const matchesSearch = 
      course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    
    // Credit filter
    let matchesCredits = true;
    if (creditFilter === '1-2') {
      matchesCredits = course.credits >= 1 && course.credits <= 2;
    } else if (creditFilter === '3-4') {
      matchesCredits = course.credits >= 3 && course.credits <= 4;
    } else if (creditFilter === '5+') {
      matchesCredits = course.credits >= 5;
    }
    
    return matchesSearch && matchesCategory && matchesCredits;
  });
  
  // Simulate loading data from an API
  useEffect(() => {
    console.log('Loading courses data...');
    // setCourses(data from API)
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header studentName="Budi Santoso" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Katalog Mata Kuliah</h1>
          <Link 
            href="/enroll" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
          >
            Lihat Daftar Pilihan Saya
          </Link>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari berdasarkan nama, kode, dosen, atau deskripsi..."
              className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <span className="text-gray-500">Kategori:</span>
            <select 
              className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Semua Kategori' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <FaLayerGroup className="text-gray-500" />
            <span className="text-gray-500">SKS:</span>
            <select 
              className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={creditFilter}
              onChange={(e) => setCreditFilter(e.target.value)}
            >
              <option value="all">Semua SKS</option>
              <option value="1-2">1-2 SKS</option>
              <option value="3-4">3-4 SKS</option>
              <option value="5+">5+ SKS</option>
            </select>
          </div>
        </div>
        
        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <div className="p-4 bg-blue-50 border-b border-blue-100">
                <h2 className="font-semibold text-lg text-blue-800">{course.name}</h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <span className="text-sm">{course.id}</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm">{course.credits} SKS</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm">{course.category}</span>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start">
                    <FaUserTie className="text-gray-400 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">{course.instructor}</span>
                  </div>
                  
                  <div className="flex items-start">
                    <FaCalendarAlt className="text-gray-400 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">{course.schedule}</span>
                  </div>
                  
                  <div className="flex items-start">
                    <FaChair className="text-gray-400 mt-1 mr-2" />
                    <span className="text-sm text-gray-600">
                      {course.availableSeats} kursi tersedia (dari {course.totalSeats})
                      {course.availableSeats <= 5 && (
                        <span className="text-red-500 ml-2 font-medium">Hampir penuh!</span>
                      )}
                    </span>
                  </div>
                </div>
                
                <Link 
                  href={`/enroll?course=${course.id}`}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg transition"
                >
                  Daftar Sekarang
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {filteredCourses.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 mb-2">Tidak ada mata kuliah yang sesuai dengan kriteria pencarian Anda.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setCreditFilter('all');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Reset Filter
            </button>
          </div>
        )}
      </main>
      
      <footer className="bg-blue-900 text-white py-4 text-center mt-12">
        <p>© 2025 CompassCampus - Course Registration System</p>
      </footer>
    </div>
  );
} 