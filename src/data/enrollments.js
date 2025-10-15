// Mock data untuk Enrollment Service

import { getCourseById, updateCourseAvailability } from './courses';
import { getStudentById } from './students';

// Data pendaftaran menggunakan array dalam memori
export const enrollments = [
  { 
    id: 1, 
    studentId: 'STD2024001',
    courseId: 'CS101',
    enrollmentDate: '2025-04-10', 
    status: 'pending',
    semester: '2025/1'
  },
  { 
    id: 2, 
    studentId: 'STD2024005',
    courseId: 'MTH201',
    enrollmentDate: '2025-04-09', 
    status: 'active',
    semester: '2025/1'
  },
  { 
    id: 3, 
    studentId: 'STD2024001',
    courseId: 'ENG102',
    enrollmentDate: '2025-04-07', 
    status: 'pending',
    semester: '2025/1'
  },
  { 
    id: 4, 
    studentId: 'STD2024005',
    courseId: 'CS303',
    enrollmentDate: '2025-04-05', 
    status: 'rejected',
    semester: '2025/1'
  },
  { 
    id: 5, 
    studentId: 'STD2024001',
    courseId: 'CS202',
    enrollmentDate: '2025-04-03', 
    status: 'active',
    semester: '2025/1'
  },
  { 
    id: 6, 
    studentId: 'STD2024005',
    courseId: 'CS101',
    enrollmentDate: '2025-04-01', 
    status: 'active',
    semester: '2025/1'
  },
];

// Generasi ID untuk enrollment baru
let nextEnrollmentId = enrollments.length > 0 
  ? Math.max(...enrollments.map(e => e.id)) + 1 
  : 1;

// Fungsi untuk mendapatkan semua enrollment
export function getAllEnrollments() {
  return [...enrollments];
}

// Fungsi untuk mendapatkan enrollment berdasarkan semester
export function getEnrollmentsBySemester(semester) {
  return enrollments.filter(enrollment => enrollment.semester === semester);
}

// Fungsi untuk mendapatkan enrollment berdasarkan student ID
export function getEnrollmentsByStudentId(studentId) {
  return enrollments.filter(enrollment => enrollment.studentId === studentId);
}

// Fungsi untuk mendapatkan enrollment berdasarkan ID
export function getEnrollmentById(id) {
  return enrollments.find(enrollment => enrollment.id === id);
}

// Fungsi untuk membuat enrollment baru
export function createEnrollment(studentId, courseId, semester = '2025/1') {
  // Validasi keberadaan mahasiswa
  const student = getStudentById(studentId);
  if (!student) {
    return { success: false, message: 'Mahasiswa tidak ditemukan' };
  }
  
  // Validasi keberadaan mata kuliah
  const course = getCourseById(courseId);
  if (!course) {
    return { success: false, message: 'Mata kuliah tidak ditemukan' };
  }
  
  // Periksa apakah ada kursi yang tersedia
  if (course.availableSeats <= 0) {
    return { success: false, message: 'Mata kuliah sudah penuh' };
  }
  
  // Periksa apakah mahasiswa sudah terdaftar di mata kuliah ini
  const existingEnrollment = enrollments.find(
    e => e.studentId === studentId && e.courseId === courseId && e.semester === semester
  );
  
  if (existingEnrollment) {
    return { success: false, message: 'Mahasiswa sudah terdaftar pada mata kuliah ini' };
  }
  
  // Buat enrollment baru
  const newEnrollment = {
    id: nextEnrollmentId++,
    studentId,
    courseId,
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    semester
  };
  
  // Tambahkan enrollment baru
  enrollments.push(newEnrollment);
  
  // Kurangi jumlah kursi yang tersedia
  updateCourseAvailability(courseId, true);
  
  return { success: true, data: newEnrollment };
}

// Fungsi untuk mengupdate status enrollment
export function updateEnrollmentStatus(id, newStatus) {
  const index = enrollments.findIndex(e => e.id === parseInt(id));
  if (index === -1) {
    return { success: false, message: 'Enrollment tidak ditemukan' };
  }
  
  // Dapatkan enrollment sebelumnya
  const enrollment = enrollments[index];
  const oldStatus = enrollment.status;
  
  // Update status
  enrollment.status = newStatus;
  enrollments[index] = enrollment;
  
  // Jika status berubah dari active menjadi rejected atau sebaliknya
  // Update ketersediaan kursi
  if ((oldStatus === 'active' && newStatus === 'rejected') || 
      (oldStatus === 'rejected' && newStatus === 'active')) {
    updateCourseAvailability(enrollment.courseId, oldStatus === 'rejected');
  }
  
  return { success: true, data: enrollment };
}

// Fungsi untuk mendapatkan enrollment berdasarkan course ID
export function getEnrollmentsByCourseId(courseId) {
  return enrollments.filter(enrollment => enrollment.courseId === courseId);
} 