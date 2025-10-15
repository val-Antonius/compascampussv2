'use client';

import { 
  FaPlus, 
  FaClipboardList, 
  FaCalendarAlt,
  FaChartBar,
  FaCog
} from 'react-icons/fa';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminQuickActionsPanel() {
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    department: '',
    credits: 3,
    instructor: '',
    capacity: 30,
    semester: '2025/1',
  });

  // Daftar departemen (biasanya ini akan diambil dari API)
  const departments = ['Ilmu Komputer', 'Matematika', 'Bahasa Inggris', 'Bisnis', 'Teknik'];

  // Fungsi untuk membuka modal tambah mata kuliah
  const openAddEditModal = () => {
    setFormData({
      id: '',
      name: '',
      department: '',
      credits: 3,
      instructor: '',
      capacity: 30,
      semester: '2025/1',
    });
    setShowAddEditModal(true);
  };

  // Menghandle perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'credits' || name === 'capacity' ? parseInt(value, 10) : value,
    });
  };

  // Menyimpan mata kuliah baru
  const saveCourse = (e) => {
    e.preventDefault();
    // Di implementasi nyata, ini akan mengirim data ke server
    console.log('Mata kuliah baru:', formData);
    setShowAddEditModal(false);
    // Tampilkan pesan sukses
    alert('Mata kuliah berhasil ditambahkan!');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Aksi Administrator</h2>
      
      {/* Primary Actions */}
      <div className="space-y-3 mb-6">
        <button
          onClick={openAddEditModal}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition flex items-center justify-center"
        >
          <FaPlus className="mr-2" />
          Tambah Mata Kuliah Baru
        </button>
        
        <Link href="/admin/enrollments" className="w-full bg-red-100 hover:bg-red-200 text-red-600 border border-red-300 py-3 px-4 rounded-lg transition flex items-center justify-center">
          <FaClipboardList className="mr-2" />
          Kelola Enrollment
        </Link>
      </div>
      
      {/* Help Section */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-800 mb-2">Dukungan Admin</h3>
        <p className="text-sm text-gray-600 mb-3">
          Butuh bantuan dengan sistem administrasi?
        </p>
        <button className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 py-2 px-4 rounded transition text-sm">
          Hubungi IT Support
        </button>
      </div>

      {/* Add Course Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              Tambah Mata Kuliah Baru
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
                  Buat Mata Kuliah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 