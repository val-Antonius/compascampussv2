'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { FaCalendarAlt, FaUserTie, FaPlus, FaTimes, FaCheck, FaSearch } from 'react-icons/fa';

export default function EnrollCoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCourseId = searchParams.get('course');

  const [studentData, setStudentData] = useState({
    name: 'Budi Santoso',
    id: 'STD2024001',
    semester: 3,
  });

  const [selectedSemester, setSelectedSemester] = useState(3); // Default to student's current semester
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Dummy data for available courses
  const [availableCourses, setAvailableCourses] = useState([
    {
      id: 'CS202',
      name: 'Data Structures and Algorithms',
      credits: 4,
      schedule: 'Mon, Wed 10:00-11:30',
      instructor: 'Dr. Ahmad Rahman',
      semester: 3,
      availableSeats: 15,
      totalSeats: 40,
      description: 'Kursus ini mengajarkan konsep struktur data dan algoritma yang penting dalam pemrograman.'
    },
    {
      id: 'CS303',
      name: 'Database Systems',
      credits: 3,
      schedule: 'Tue, Thu 13:00-14:30',
      instructor: 'Dr. Maya Putri',
      semester: 3,
      availableSeats: 8,
      totalSeats: 30,
      description: 'Pengenalan sistem basis data, SQL, dan desain basis data.'
    },
    {
      id: 'CS304',
      name: 'Software Engineering',
      credits: 4,
      schedule: 'Wed, Fri 08:00-09:30',
      instructor: 'Prof. Rudi Hartono',
      semester: 3,
      availableSeats: 20,
      totalSeats: 45,
      description: 'Prinsip-prinsip rekayasa perangkat lunak, metodologi pengembangan, dan manajemen proyek.'
    },
    {
      id: 'MTH301',
      name: 'Discrete Mathematics',
      credits: 3,
      schedule: 'Mon, Wed 13:00-14:30',
      instructor: 'Dr. Nina Wati',
      semester: 3,
      availableSeats: 12,
      totalSeats: 35,
      description: 'Logika, teori himpunan, relasi, fungsi, dan matematika diskrit lainnya.'
    },
    {
      id: 'CS401',
      name: 'Computer Networks',
      credits: 3,
      schedule: 'Tue, Thu 10:00-11:30',
      instructor: 'Dr. Bambang Sutejo',
      semester: 4,
      availableSeats: 18,
      totalSeats: 40,
      description: 'Konsep jaringan komputer, protokol, dan teknologi komunikasi.'
    },
    {
      id: 'CS405',
      name: 'Artificial Intelligence',
      credits: 4,
      schedule: 'Mon, Wed 15:00-16:30',
      instructor: 'Prof. Lina Dewi',
      semester: 4,
      availableSeats: 10,
      totalSeats: 30,
      description: 'Pengantar kecerdasan buatan, algoritma pembelajaran mesin, dan aplikasinya.'
    },
  ]);

  // Filter courses based on selected semester and search term
  const filteredCourses = availableCourses.filter(course => {
    const matchesSemester = selectedSemester === 0 || course.semester === selectedSemester;
    const matchesSearch = 
      course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSemester && matchesSearch;
  });

  // Add a course to the selected list
  const addCourse = (course) => {
    if (!selectedCourses.some(c => c.id === course.id)) {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  // Remove a course from the selected list
  const removeCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter(course => course.id !== courseId));
  };

  // Enroll in selected courses
  const enrollInCourses = () => {
    // Here you would typically make an API call to enroll the student
    console.log('Enrolling in courses:', selectedCourses);
    alert('Enrollment berhasil untuk ' + selectedCourses.length + ' mata kuliah!');
    router.push('/my-courses');
  };

  // Calculate total credits of selected courses
  const totalSelectedCredits = selectedCourses.reduce((sum, course) => sum + course.credits, 0);

  // Add initial course to the list if provided in URL
  useEffect(() => {
    if (initialCourseId) {
      const course = availableCourses.find(c => c.id === initialCourseId);
      if (course && !selectedCourses.some(c => c.id === initialCourseId)) {
        setSelectedCourses([...selectedCourses, course]);
      }
    }
  }, [initialCourseId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header studentName={studentData.name} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Enrollment Mata Kuliah</h1>
        <p className="text-gray-600 mb-6">Pilih mata kuliah yang ingin Anda ambil pada semester ini.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Available courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Daftar Mata Kuliah</h2>
                
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Semester selector */}
                  <select
                    className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(Number(e.target.value))}
                  >
                    <option value={0}>Semua Semester</option>
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                    <option value={3}>Semester 3</option>
                    <option value={4}>Semester 4</option>
                    <option value={5}>Semester 5</option>
                    <option value={6}>Semester 6</option>
                    <option value={7}>Semester 7</option>
                    <option value={8}>Semester 8</option>
                  </select>
                  
                  {/* Search box */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Cari mata kuliah..."
                      className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* List of available courses */}
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map(course => (
                    <div key={course.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <h3 className="font-medium text-red-800">{course.name}</h3>
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
                              {course.id}
                            </span>
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                              {course.credits} SKS
                            </span>
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800">
                              Semester {course.semester}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-2">
                            <div className="flex items-center mr-4">
                              <FaUserTie className="mr-1 text-gray-400" />
                              {course.instructor}
                            </div>
                            <div className="flex items-center">
                              <FaCalendarAlt className="mr-1 text-gray-400" />
                              {course.schedule}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                          <p className="text-sm text-gray-500">
                            Ketersediaan: <span className="font-medium">{course.availableSeats}</span> dari <span className="font-medium">{course.totalSeats}</span> kursi
                          </p>
                        </div>
                        
                        <div className="ml-4 flex items-start">
                          <button
                            onClick={() => addCourse(course)}
                            disabled={selectedCourses.some(c => c.id === course.id)}
                            className={`p-2 rounded-full ${
                              selectedCourses.some(c => c.id === course.id)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                            title={selectedCourses.some(c => c.id === course.id) ? 'Sudah ditambahkan' : 'Tambahkan mata kuliah'}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    Tidak ada mata kuliah yang ditemukan untuk semester ini atau berdasarkan pencarian Anda.
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right column - Selected courses */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Mata Kuliah yang Dipilih</h2>
                <p className="text-sm text-gray-500 mt-1">Total: {totalSelectedCredits} SKS</p>
              </div>
              
              {/* List of selected courses */}
              <div className="divide-y divide-gray-200">
                {selectedCourses.length > 0 ? (
                  selectedCourses.map(course => (
                    <div key={course.id} className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{course.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span className="mr-2">{course.id}</span>
                            <span className="mr-2">•</span>
                            <span className="font-medium text-red-700">{course.credits} SKS</span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            <FaCalendarAlt className="inline mr-1 text-gray-400" />
                            {course.schedule}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => removeCourse(course.id)}
                          className="p-2 text-red-500 hover:text-red-700"
                          title="Hapus mata kuliah"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    Belum ada mata kuliah yang dipilih. Silakan pilih mata kuliah dari daftar di sebelah kiri.
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col gap-3">
                  <button
                    onClick={enrollInCourses}
                    disabled={selectedCourses.length === 0}
                    className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
                      selectedCourses.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    <FaCheck className="mr-2" />
                    Enroll Mata Kuliah
                  </button>
                  
                  <button
                    onClick={() => setSelectedCourses([])}
                    disabled={selectedCourses.length === 0}
                    className={`w-full py-2 px-4 rounded-md ${
                      selectedCourses.length === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-red-600 border border-red-300 hover:bg-red-50'
                    }`}
                  >
                    Batalkan Semua
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-red-800 text-white py-4 text-center mt-12">
        <p>© 2025 CompassCampus - Sistem Registrasi Mata Kuliah</p>
      </footer>
    </div>
  );
} 