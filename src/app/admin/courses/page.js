'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaFilter, FaDownload } from 'react-icons/fa';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([
    { 
      id: 'CS101', 
      name: 'Pengantar Pemrograman', 
      department: 'Ilmu Komputer',
      credits: 3,
      instructor: 'Dr. Budi Santoso',
      enrollmentCount: 35,
      capacity: 40,
      semester: '2025/1',
      status: 'active'
    },
    { 
      id: 'MTH201', 
      name: 'Kalkulus Lanjut', 
      department: 'Matematika',
      credits: 4,
      instructor: 'Dr. Siti Rahayu',
      enrollmentCount: 28,
      capacity: 30,
      semester: '2025/1',
      status: 'active'
    },
    { 
      id: 'ENG102', 
      name: 'Penulisan Teknis', 
      department: 'Bahasa Inggris',
      credits: 2,
      instructor: 'Prof. Ahmad Wijaya',
      enrollmentCount: 15,
      capacity: 25,
      semester: '2025/1',
      status: 'active'
    },
    { 
      id: 'CS303', 
      name: 'Sistem Database', 
      department: 'Ilmu Komputer',
      credits: 4,
      instructor: 'Dr. Maya Purnama',
      enrollmentCount: 30,
      capacity: 30,
      semester: '2025/1',
      status: 'full'
    },
    { 
      id: 'BUS202', 
      name: 'Prinsip Manajemen', 
      department: 'Bisnis',
      credits: 3,
      instructor: 'Dr. Rudi Hartono',
      enrollmentCount: 45,
      capacity: 50,
      semester: '2025/1',
      status: 'active'
    },
    { 
      id: 'CS202', 
      name: 'Struktur Data dan Algoritma', 
      department: 'Ilmu Komputer',
      credits: 4,
      instructor: 'Dr. Dewi Lestari',
      enrollmentCount: 25,
      capacity: 35,
      semester: '2025/1',
      status: 'active'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('2025/1');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    department: '',
    credits: 3,
    instructor: '',
    capacity: 30,
    semester: '2025/1',
  });
  
  // Get status badge styling
  const getStatusClass = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'full':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get the list of departments
  const departments = [...new Set(courses.map(course => course.department))];
  
  // Filtered courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedDepartment === 'all') return matchesSearch && course.semester === selectedSemester;
    return matchesSearch && course.department === selectedDepartment && course.semester === selectedSemester;
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle department filter change
  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
  };

  // Handle semester change
  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
  };
  
  // Open delete confirmation modal
  const openDeleteModal = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };
  
  // Confirm course deletion
  const confirmDelete = () => {
    setCourses(courses.filter(course => course.id !== courseToDelete.id));
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };
  
  // Open add/edit course modal
  const openAddEditModal = (course = null) => {
    if (course) {
      setFormData({ ...course });
      setIsEditing(true);
    } else {
      setFormData({
        id: '',
        name: '',
        department: '',
        credits: 3,
        instructor: '',
        capacity: 30,
        semester: '2025/1',
      });
      setIsEditing(false);
    }
    setShowAddEditModal(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'credits' || name === 'capacity' ? parseInt(value, 10) : value,
    });
  };
  
  // Save course
  const saveCourse = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing course
      setCourses(courses.map(course => 
        course.id === formData.id ? { 
          ...formData, 
          enrollmentCount: course.enrollmentCount,
          status: course.status
        } : course
      ));
    } else {
      // Add new course
      setCourses([
        ...courses,
        { 
          ...formData, 
          enrollmentCount: 0,
          status: 'active'
        }
      ]);
    }
    
    setShowAddEditModal(false);
  };
  
  // Simulate loading data from an API
  useEffect(() => {
    // This would be a fetch call to your actual API in production
    console.log('Loading courses data...');
    // setCourses(data from API)
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Mata Kuliah</h1>
          
          <div className="flex space-x-2">
            <button 
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center"
              onClick={() => openAddEditModal()}
            >
              <FaPlus className="mr-2" />
              Tambah Mata Kuliah
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center">
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
              placeholder="Cari berdasarkan nama mata kuliah, kode, atau dosen..."
              className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <span className="text-gray-500">Departemen:</span>
            <select 
              className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedDepartment}
              onChange={(e) => handleDepartmentChange(e.target.value)}
            >
              <option value="all">Semua Departemen</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
            <h3 className="text-sm text-gray-500 mb-1">Total Mata Kuliah</h3>
            <p className="text-2xl font-bold">{courses.filter(c => c.semester === selectedSemester).length}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-sm text-gray-500 mb-1">Total SKS</h3>
            <p className="text-2xl font-bold">
              {courses
                .filter(c => c.semester === selectedSemester)
                .reduce((sum, course) => sum + course.credits, 0)}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-amber-500">
            <h3 className="text-sm text-gray-500 mb-1">Kapasitas Terisi</h3>
            <p className="text-2xl font-bold">
              {Math.round(
                (courses
                  .filter(c => c.semester === selectedSemester)
                  .reduce((sum, course) => sum + course.enrollmentCount, 0) /
                  courses
                    .filter(c => c.semester === selectedSemester)
                    .reduce((sum, course) => sum + course.capacity, 0)) * 100
              )}%
            </p>
          </div>
        </div>
        
        {/* Courses Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kode/Nama Mata Kuliah
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departemen
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKS
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dosen
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kapasitas
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
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-start flex-col">
                        <div className="text-sm font-medium text-gray-900">{course.name}</div>
                        <div className="text-sm text-gray-500">{course.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.credits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.enrollmentCount}/{course.capacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(course.status)}`}>
                        {course.status === 'active' && 'Aktif'}
                        {course.status === 'full' && 'Penuh'}
                        {course.status === 'draft' && 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                          className="text-amber-600 hover:text-amber-900 flex items-center"
                          onClick={() => openAddEditModal(course)}
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 flex items-center"
                          onClick={() => openDeleteModal(course)}
                        >
                          <FaTrash className="mr-1" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredCourses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Tidak ada mata kuliah yang cocok dengan kriteria pencarian.
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Penghapusan</h2>
            <p className="mb-6">
              Apakah Anda yakin ingin menghapus mata kuliah <span className="font-bold">{courseToDelete?.name}</span> ({courseToDelete?.id})?
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </button>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                onClick={confirmDelete}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add/Edit Course Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah Baru'}
            </h2>
            
            <form onSubmit={saveCourse}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id">
                  Kode Mata Kuliah
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.id}
                  onChange={handleInputChange}
                  required
                  disabled={isEditing}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Nama Mata Kuliah
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                  Departemen
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  list="department-list"
                />
                <datalist id="department-list">
                  {departments.map(dept => (
                    <option key={dept} value={dept} />
                  ))}
                </datalist>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="credits">
                  SKS
                </label>
                <input
                  type="number"
                  id="credits"
                  name="credits"
                  min="1"
                  max="6"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.credits}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instructor">
                  Dosen
                </label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">
                  Kapasitas
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  min="1"
                  max="200"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="semester">
                  Semester
                </label>
                <select
                  id="semester"
                  name="semester"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.semester}
                  onChange={handleInputChange}
                  required
                >
                  <option value="2025/1">2025/1 (Saat ini)</option>
                  <option value="2024/2">2024/2</option>
                  <option value="2024/1">2024/1</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                  onClick={() => setShowAddEditModal(false)}
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                >
                  {isEditing ? 'Simpan Perubahan' : 'Buat Mata Kuliah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <footer className="bg-red-800 text-white py-4 text-center mt-12">
        <p>© 2025 CompassCampus - Panel Administrator</p>
      </footer>
    </div>
  );
} 