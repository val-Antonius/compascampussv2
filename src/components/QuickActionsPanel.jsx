'use client';

import { useState, useEffect } from 'react';
import { 
    FaSearch, 
    FaFileAlt, 
    FaRegTimesCircle,
    FaCalendarAlt,
    FaChartBar,
    FaGraduationCap
  } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { getUserEnrollments } from '@/lib/api';

export default function QuickActionsPanel() {
  const router = useRouter();
  const { authFetch } = useAuth();
  
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchEnrollments();
  }, []);
  
  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      // Mendapatkan hanya enrollment yang pending
      const enrollments = await getUserEnrollments(authFetch, 'pending');
      setPendingEnrollments(enrollments || []);
    } catch (error) {
      console.error('Error fetching pending enrollments:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Aksi Cepat</h2>
      
      {/* Primary Actions */}
      <div className="space-y-3 mb-6">
        <Link href="/course-catalog" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition flex items-center justify-center">
          <FaSearch className="mr-2" />
          Enroll Mata Kuliah Baru
        </Link>
      </div>
      
      {/* Continue Enrollment (if there's a draft) */}
      {pendingEnrollments.length > 0 && (
        <div className="mt-6 bg-red-50 rounded-lg p-4">
          <h3 className="font-medium text-red-800 mb-2">Enrollment Menunggu Persetujuan</h3>
          <p className="text-sm text-red-600 mb-3">
            Anda memiliki {pendingEnrollments.length} mata kuliah yang menunggu persetujuan.
          </p>
          <Link href="/enrollment-history?status=pending" className="w-full bg-white text-red-600 border border-red-300 hover:bg-red-100 py-2 px-4 rounded transition text-sm flex items-center justify-center">
            Lihat Enrollment Tertunda
          </Link>
        </div>
      )}
      
      {/* Help Section */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-800 mb-2">Butuh Bantuan?</h3>
        <p className="text-sm text-gray-600 mb-3">
          Hubungi penasehat akademik untuk bantuan enrollment.
        </p>
        <button className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 py-2 px-4 rounded transition text-sm">
          Jadwalkan Konsultasi
        </button>
      </div>
      
      {/* Academic tools */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-gray-600 font-medium mb-4">Alat Akademik</h3>
        
        <ul className="space-y-2">
          <li>
            <Link href="/academic-calendar" className="w-full text-left py-2 px-3 rounded hover:bg-gray-100 transition flex items-center text-gray-700">
              <FaCalendarAlt className="mr-3 text-gray-500" />
              Kalender Akademik
            </Link>
          </li>
          <li>
            <Link href="/grade-calculator" className="w-full text-left py-2 px-3 rounded hover:bg-gray-100 transition flex items-center text-gray-700">
              <FaChartBar className="mr-3 text-gray-500" />
              Kalkulator Nilai
            </Link>
          </li>
          <li>
            <Link href="/graduation-requirements" className="w-full text-left py-2 px-3 rounded hover:bg-gray-100 transition flex items-center text-gray-700">
              <FaGraduationCap className="mr-3 text-gray-500" />
              Persyaratan Kelulusan
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}