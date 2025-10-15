'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { getUserEnrollments, cancelEnrollment } from '@/lib/api';
import Link from 'next/link';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf, 
  FaInfoCircle,
  FaChevronLeft
} from 'react-icons/fa';

export default function EnrollmentHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';
  const { user, isAuthenticated, authFetch } = useAuth();
  
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    fetchEnrollments();
  }, [isAuthenticated, statusFilter]);
  
  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserEnrollments(authFetch, statusFilter !== 'all' ? statusFilter : null);
      setEnrollments(data || []);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      setError('Gagal mengambil data enrollment. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelEnrollment = async (enrollmentId) => {
    try {
      setCancellingId(enrollmentId);
      await cancelEnrollment(authFetch, enrollmentId);
      
      // Update local state after cancellation
      setEnrollments(enrollments.filter(e => e.id !== enrollmentId));
      setSuccessMessage('Enrollment berhasil dibatalkan');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error cancelling enrollment:', err);
      setError('Gagal membatalkan enrollment. Silakan coba lagi nanti.');
      
      // Clear error message after 3 seconds
      setTimeout(() => setError(''), 3000);
    } finally {
      setCancellingId(null);
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="text-green-500" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500" />;
      case 'pending':
        return <FaHourglassHalf className="text-yellow-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Disetujui';
      case 'rejected':
        return 'Ditolak';
      case 'pending':
        return 'Menunggu Persetujuan';
      default:
        return 'Tidak Diketahui';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <FaChevronLeft className="mr-2" />
          Kembali ke Dashboard
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Riwayat Enrollment</h1>
      
      {/* Filter Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <Link 
            href="/enrollment-history" 
            className={`py-2 px-4 border-b-2 ${
              statusFilter === 'all' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Semua
          </Link>
          <Link 
            href="/enrollment-history?status=pending" 
            className={`py-2 px-4 border-b-2 ${
              statusFilter === 'pending' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Menunggu
          </Link>
          <Link 
            href="/enrollment-history?status=approved" 
            className={`py-2 px-4 border-b-2 ${
              statusFilter === 'approved' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Disetujui
          </Link>
          <Link 
            href="/enrollment-history?status=rejected" 
            className={`py-2 px-4 border-b-2 ${
              statusFilter === 'rejected' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ditolak
          </Link>
        </nav>
      </div>
      
      {/* Notifications */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* No enrollments message */}
          {enrollments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600">
                {statusFilter === 'all' 
                  ? 'Anda belum memiliki riwayat enrollment mata kuliah.' 
                  : `Tidak ada enrollment dengan status ${getStatusText(statusFilter).toLowerCase()}.`}
              </p>
              <Link 
                href="/course-catalog" 
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Cari Mata Kuliah
              </Link>
            </div>
          ) : (
            /* Enrollment List */
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mata Kuliah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Enrollment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKS
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {enrollment.course.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {enrollment.course.courseId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(enrollment.createdAt).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm">
                          <span className="mr-2">{getStatusIcon(enrollment.status)}</span>
                          {getStatusText(enrollment.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enrollment.course.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {enrollment.status === 'pending' && (
                          <button
                            onClick={() => handleCancelEnrollment(enrollment.id)}
                            disabled={cancellingId === enrollment.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            {cancellingId === enrollment.id ? 'Membatalkan...' : 'Batalkan'}
                          </button>
                        )}
                        {enrollment.status === 'rejected' && (
                          <Link
                            href={`/course-catalog/${enrollment.course.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Enroll Ulang
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
} 