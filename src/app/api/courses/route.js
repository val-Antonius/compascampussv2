import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authMiddleware } from '@/lib/auth';

// GET /api/courses
export async function GET(request) {
  try {
    // Parameter pencarian (opsional)
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'active';
    
    // Query dasar
    let sql = 'SELECT * FROM courses WHERE status = ?';
    let params = [status];
    
    // Tambah filter kategori jika ada
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    // Ambil data dari database
    const courses = await query(sql, params);
    
    // Return data courses
    return NextResponse.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Terjadi kesalahan pada server' 
      }, 
      { status: 500 }
    );
  }
}

// POST /api/courses - membuat mata kuliah baru (hanya admin)
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
    
    // Periksa role
    if (authResult.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const courseData = await request.json();
    
    // Validasi data
    if (!courseData.id || !courseData.name || !courseData.credits || !courseData.category || !courseData.instructor) {
      return NextResponse.json(
        { success: false, message: 'Data mata kuliah tidak lengkap' },
        { status: 400 }
      );
    }
    
    // Cek apakah course ID sudah digunakan
    const existingCourse = await query('SELECT id FROM courses WHERE id = ?', [courseData.id]);
    
    if (existingCourse.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Course ID sudah digunakan' },
        { status: 400 }
      );
    }
    
    // Set nilai default jika tidak ada
    if (!courseData.total_seats) courseData.total_seats = 30;
    if (!courseData.available_seats) courseData.available_seats = courseData.total_seats;
    if (!courseData.status) courseData.status = 'draft';
    
    // Simpan ke database
    const columns = Object.keys(courseData).join(', ');
    const placeholders = Object.keys(courseData).map(() => '?').join(', ');
    const values = Object.values(courseData);
    
    const sql = `INSERT INTO courses (${columns}) VALUES (${placeholders})`;
    const result = await query(sql, values);
    
    if (result.affectedRows > 0) {
      return NextResponse.json({
        success: true,
        message: 'Mata kuliah berhasil dibuat',
        data: { ...courseData, id: courseData.id }
      });
    }
    
    return NextResponse.json(
      { success: false, message: 'Gagal membuat mata kuliah' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
} 