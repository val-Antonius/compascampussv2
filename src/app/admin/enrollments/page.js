'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { FaFilter, FaSearch, FaCheck, FaTimes, FaDownload, FaCalendarAlt } from 'react-icons/fa';

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([
    { 
      id: 1, 
      studentName: 'Budi Santoso', 
      studentId: 'STD2024001',
      courseName: 'Introduction to Programming',
      courseId: 'CS101',
      enrollmentDate: '2025-04-10', 
      status: 'pending',
      semester: '2025/1'
    },
    { 
      id: 2, 
      studentName: 'Dewi Lestari', 
      studentId: 'STD2024005',
      courseName: 'Advanced Calculus',
      courseId: 'MTH201',
      enrollmentDate: '2025-04-09', 
      status: 'active',
      semester: '2025/1'
    },
    { 
      id: 3, 
      studentName: 'Rudi Hartono', 
      studentId: 'STD2024010',
      courseName: 'Technical Writing',
      courseId: 'ENG102',
      enrollmentDate: '2025-04-07', 
      status: 'pending',
      semester: '2025/1'
    },
    { 
      id: 4, 
      studentName: 'Siti Rahayu', 
      studentId: 'STD2024018',
      courseName: 'Database Systems',
      courseId: 'CS303',
      enrollmentDate: '2025-04-05', 
      status: 'rejected',
      semester: '2025/1'
    },
    { 
      id: 5, 
      studentName: 'Anwar Pratama', 
      studentId: 'STD2024025',
      courseName: 'Data Structures and Algorithms',
      courseId: 'CS202',
      enrollmentDate: '2025-04-03', 
      status: 'active',
      semester: '2025/1'
    },
    { 
      id: 6, 
      studentName: 'Nina Sari', 
      studentId: 'STD2024022',
      courseName: 'Introduction to Programming',
      courseId: 'CS101',
      enrollmentDate: '2025-04-01', 
      status: 'active',
      semester: '2025/1'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('2025/1');
  
  // Get status badge styling
  const getStatusClass = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  
  // Filtered enrollments
  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = 
      enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.courseId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch && enrollment.semester === selectedSemester;
    return matchesSearch && enrollment.status === selectedFilter && enrollment.semester === selectedSemester;
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  // Handle semester change
  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
  };
  
  // Approve enrollment
  const approveEnrollment = (id) => {
    setEnrollments(enrollments.map(enrollment => 
      enrollment.id === id ? { ...enrollment, status: 'active' } : enrollment
    ));
  };
  
  // Reject enrollment
  const rejectEnrollment = (id) => {
    setEnrollments(enrollments.map(enrollment => 
      enrollment.id === id ? { ...enrollment, status: 'rejected' } : enrollment
    ));
  };
  
  // Simulate loading data from an API
  useEffect(() => {
    // This would be a fetch call to your actual API in production
    console.log('Loading enrollments data...');
    // setEnrollments(data from API)
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Pendaftaran Mahasiswa</h1>
          
          <div className="flex space-x-2">
            <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center">
              <FaDownload className="mr-2" />
              Export Data
            </button>
          </div>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari berdasarkan nama mahasiswa, ID, nama mata kuliah, atau kode mata kuliah..."
              className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <span className="text-gray-500">Status:</span>
            <select 
              className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">Semua Enrollment</option>
              <option value="active">Aktif</option>
              <option value="pending">Menunggu</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-gray-500" />
            <span className="text-gray-500">Semester:</span>
            <select 
              className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedSemester}
              onChange={(e) => handleSemesterChange(e.target.value)}
            >
              <option value="2025/1">2025/1 (Saat ini)</option>
              <option value="2024/2">2024/2</option>
              <option value="2024/1">2024/1</option>
            </select>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
            <h3 className="text-sm text-gray-500 mb-1">Total Enrollment</h3>
            <p className="text-2xl font-bold">{enrollments.filter(e => e.semester === selectedSemester).length}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-sm text-gray-500 mb-1">Aktif</h3>
            <p className="text-2xl font-bold">{enrollments.filter(e => e.status === 'active' && e.semester === selectedSemester).length}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-amber-500">
            <h3 className="text-sm text-gray-500 mb-1">Menunggu</h3>
            <p className="text-2xl font-bold">{enrollments.filter(e => e.status === 'pending' && e.semester === selectedSemester).length}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-600">
            <h3 className="text-sm text-gray-500 mb-1">Ditolak</h3>
            <p className="text-2xl font-bold">{enrollments.filter(e => e.status === 'rejected' && e.semester === selectedSemester).length}</p>
          </div>
        </div>
        
        {/* Enrollment Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mahasiswa
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mata Kuliah
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Enrollment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-start flex-col">
                        <div className="text-sm font-medium text-gray-900">{enrollment.studentName}</div>
                        <div className="text-sm text-gray-500">{enrollment.studentId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-start flex-col">
                        <div className="text-sm font-medium text-gray-900">{enrollment.courseName}</div>
                        <div className="text-sm text-gray-500">{enrollment.courseId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(enrollment.enrollmentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(enrollment.status)}`}>
                        {enrollment.status === 'active' && 'Aktif'}
                        {enrollment.status === 'pending' && 'Menunggu'}
                        {enrollment.status === 'rejected' && 'Ditolak'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        {enrollment.status === 'pending' && (
                          <>
                            <button 
                              className="text-green-600 hover:text-green-900 flex items-center"
                              onClick={() => approveEnrollment(enrollment.id)}
                            >
                              <FaCheck className="mr-1" />
                              Setujui
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900 flex items-center"
                              onClick={() => rejectEnrollment(enrollment.id)}
                            >
                              <FaTimes className="mr-1" />
                              Tolak
                            </button>
                          </>
                        )}
                        {enrollment.status === 'active' && (
                          <button 
                            className="text-red-600 hover:text-red-900 flex items-center"
                            onClick={() => rejectEnrollment(enrollment.id)}
                          >
                            <FaTimes className="mr-1" />
                            Cabut
                          </button>
                        )}
                        {enrollment.status === 'rejected' && (
                          <button 
                            className="text-green-600 hover:text-green-900 flex items-center"
                            onClick={() => approveEnrollment(enrollment.id)}
                          >
                            <FaCheck className="mr-1" />
                            Setujui
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredEnrollments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada enrollment yang cocok dengan kriteria pencarian.
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-red-800 text-white py-4 text-center mt-12">
        <p>© 2025 CompassCampus - Panel Administrator</p>
      </footer>
    </div>
  );
} 