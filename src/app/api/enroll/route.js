import { NextResponse } from 'next/server';
import { query, getOne } from '@/lib/db';
import { authMiddleware } from '@/lib/auth';

// GET /api/enroll - mendapatkan daftar enrollment untuk user yang login
export async function GET(request) {
  try {
    // Periksa autentikasi
    const authResult = await authMiddleware(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }
    
    const userId = authResult.user.id;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // Query dasar
    let sql = `
      SELECT 
        e.*, 
        c.name as course_name, 
        c.credits, 
        c.instructor, 
        c.schedule 
      FROM 
        enrollments e 
      JOIN 
        courses c ON e.course_id = c.id 
      WHERE 
        e.user_id = ?
    `;
    
    let params = [userId];
    
    // Filter berdasarkan status jika ada
    if (status) {
      sql += ' AND e.status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY e.enrollment_date DESC';
    
    // Ambil data dari database
    const enrollments = await query(sql, params);
    
    return NextResponse.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// POST /api/enroll - membuat enrollment baru
export async function POST(request) {
  try {
    // Periksa autentikasi
    const authResult = await authMiddleware(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }
    
    // Hanya mahasiswa yang bisa melakukan enrollment
    if (authResult.user.role !== 'student') {
      return NextResponse.json(
        { success: false, message: 'Hanya mahasiswa yang dapat mendaftar mata kuliah' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const { course_id } = await request.json();
    
    if (!course_id) {
      return NextResponse.json(
        { success: false, message: 'ID mata kuliah harus disediakan' },
        { status: 400 }
      );
    }
    
    const userId = authResult.user.id;
    
    // Cek apakah mata kuliah ada dan aktif
    const course = await getOne(
      'SELECT * FROM courses WHERE id = ? AND status = "active"',
      [course_id]
    );
    
    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Mata kuliah tidak ditemukan atau tidak aktif' },
        { status: 404 }
      );
    }
    
    // Cek apakah masih ada kursi
    if (course.available_seats <= 0) {
      return NextResponse.json(
        { success: false, message: 'Mata kuliah sudah penuh' },
        { status: 400 }
      );
    }
    
    // Cek apakah sudah terdaftar
    const existingEnrollment = await getOne(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, course_id]
    );
    
    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, message: 'Anda sudah terdaftar pada mata kuliah ini' },
        { status: 400 }
      );
    }
    
    // Transaksi untuk membuat enrollment dan mengurangi kursi tersedia
    const connection = await getOne('START TRANSACTION');
    
    try {
      // Buat enrollment
      const enrollmentResult = await query(
        'INSERT INTO enrollments (user_id, course_id, status) VALUES (?, ?, "pending")',
        [userId, course_id]
      );
      
      // Kurangi kursi tersedia
      await query(
        'UPDATE courses SET available_seats = available_seats - 1 WHERE id = ?',
        [course_id]
      );
      
      // Commit transaksi
      await query('COMMIT');
      
      // Tambahkan notifikasi
      await query(
        'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, "enrollment")',
        [userId, `Anda telah mendaftar untuk mata kuliah ${course.name} (${course_id}). Menunggu persetujuan.`]
      );
      
      // Ambil data enrollment yang baru dibuat
      const newEnrollment = await getOne(
        'SELECT e.*, c.name as course_name FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.id = ?',
        [enrollmentResult.insertId]
      );
      
      return NextResponse.json({
        success: true,
        message: 'Enrollment berhasil dibuat',
        data: newEnrollment
      });
    } catch (error) {
      // Rollback jika terjadi kesalahan
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
} 