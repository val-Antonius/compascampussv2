import { NextResponse } from 'next/server';
import { getEnrollmentsByStudentId } from '@/data/enrollments';
import { getCourseById } from '@/data/courses';

// GET /api/enroll/student/:studentId - Mendapatkan pendaftaran berdasarkan ID mahasiswa
export async function GET(request, { params }) {
  try {
    const studentId = params.studentId;
    
    // Dapatkan pendaftaran mahasiswa
    const enrollments = getEnrollmentsByStudentId(studentId);
    
    // Jika tidak ada pendaftaran
    if (enrollments.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Belum ada pendaftaran untuk mahasiswa ini',
        data: []
      });
    }
    
    // Tambahkan informasi mata kuliah
    const enrichedEnrollments = enrollments.map(enrollment => {
      const course = getCourseById(enrollment.courseId);
      return {
        ...enrollment,
        course: course ? {
          id: course.id,
          name: course.name,
          credits: course.credits,
          instructor: course.instructor,
          schedule: course.schedule
        } : null
      };
    });
    
    return NextResponse.json({
      success: true,
      data: enrichedEnrollments
    });
  } catch (error) {
    console.error('Error fetching student enrollments:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' }, 
      { status: 500 }
    );
  }
} 