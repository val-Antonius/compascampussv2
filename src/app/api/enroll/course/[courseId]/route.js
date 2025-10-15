import { NextResponse } from 'next/server';
import { getEnrollmentsByCourseId } from '@/data/enrollments';
import { findUserById } from '@/data/users';

// GET /api/enroll/course/:courseId - Mendapatkan pendaftaran berdasarkan ID mata kuliah
export async function GET(request, { params }) {
  try {
    const courseId = params.courseId;
    
    // Dapatkan pendaftaran untuk mata kuliah
    const enrollments = getEnrollmentsByCourseId(courseId);
    
    // Jika tidak ada pendaftaran
    if (enrollments.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Belum ada pendaftaran untuk mata kuliah ini',
        data: []
      });
    }
    
    // Tambahkan informasi mahasiswa (tanpa password)
    const enrichedEnrollments = enrollments.map(enrollment => {
      const student = findUserById(enrollment.studentId);
      return {
        ...enrollment,
        student: student ? {
          id: student.id,
          name: student.name,
          email: student.email,
          semester: student.semester
        } : null
      };
    });
    
    return NextResponse.json({
      success: true,
      data: enrichedEnrollments
    });
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' }, 
      { status: 500 }
    );
  }
} 