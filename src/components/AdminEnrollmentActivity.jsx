'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaAngleDown, FaAngleUp, FaFilter } from 'react-icons/fa';

export default function AdminEnrollmentActivity({ enrollments = [] }) {
  const [filter, setFilter] = useState('all');
  const [expandedEnrollment, setExpandedEnrollment] = useState(null);
  
  // Function to render appropriate status badge
  const renderStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" />
            Disetujui
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <FaHourglassHalf className="mr-1" />
            Menunggu
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaTimesCircle className="mr-1" />
            Ditolak
          </span>
        );
      default:
        return null;
    }
  };
  
  // Filter enrollments
  const filteredEnrollments = enrollments.filter(enrollment => {
    if (filter === 'all') return true;
    return enrollment.status === filter;
  });
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  
  // Toggle enrollment details
  const toggleEnrollmentDetails = (id) => {
    if (expandedEnrollment === id) {
      setExpandedEnrollment(null);
    } else {
      setExpandedEnrollment(id);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 md:mb-0">Aktivitas Enrollment Terbaru</h2>
        
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600 flex items-center">
            <FaFilter className="mr-1" /> Filter:
          </span>
          <select 
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Semua</option>
            <option value="pending">Menunggu</option>
            <option value="active">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
      </div>
      
      {filteredEnrollments.length > 0 ? (
        <div className="space-y-4">
          {filteredEnrollments.map((enrollment) => (
            <div 
              key={enrollment.id} 
              className="border border-gray-200 rounded-md hover:shadow-sm transition-shadow"
            >
              <div 
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => toggleEnrollmentDetails(enrollment.id)}
              >
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <div className="font-medium text-gray-800 mb-1 sm:mb-0">{enrollment.studentName}</div>
                    <div className="text-sm text-gray-500">{enrollment.studentId}</div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600">
                    <div>
                      <span className="font-medium text-red-700">{enrollment.courseId}</span> - {enrollment.courseName}
                    </div>
                    <span className="hidden sm:inline mx-2">•</span>
                    <div>{formatDate(enrollment.enrollmentDate)}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {renderStatusBadge(enrollment.status)}
                  {expandedEnrollment === enrollment.id ? <FaAngleUp className="text-gray-400" /> : <FaAngleDown className="text-gray-400" />}
                </div>
              </div>
              
              {expandedEnrollment === enrollment.id && (
                <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-gray-50 rounded-b-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm text-gray-600 font-medium mb-2">Detail Mahasiswa</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li><span className="font-medium">Nama:</span> {enrollment.studentName}</li>
                        <li><span className="font-medium">ID:</span> {enrollment.studentId}</li>
                        <li><span className="font-medium">Program:</span> Informatika</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-600 font-medium mb-2">Detail Mata Kuliah</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li><span className="font-medium">Kode:</span> {enrollment.courseId}</li>
                        <li><span className="font-medium">Mata Kuliah:</span> {enrollment.courseName}</li>
                        <li><span className="font-medium">SKS:</span> 3</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4 space-x-2">
                    <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-50 text-sm">
                      Lihat Detail
                    </button>
                    {enrollment.status === 'pending' && (
                      <>
                        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm">
                          Tolak
                        </button>
                        <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm">
                          Setujui
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Tidak ada aktivitas enrollment yang sesuai dengan filter
        </div>
      )}
      
      <div className="mt-6 text-center">
        <Link 
          href="/admin/enrollments" 
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Lihat Semua Enrollment
        </Link>
      </div>
    </div>
  );
} 