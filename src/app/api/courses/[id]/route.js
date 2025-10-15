import { NextResponse } from 'next/server';
import { query, getOne } from '@/lib/db';
import { authMiddleware } from '@/lib/auth';

// GET /api/courses/[id] - mendapatkan detail mata kuliah
export async function GET(request, { params }) {
  try {
    const courseId = params.id;
    
    // Ambil data dari database
    const course = await getOne('SELECT * FROM courses WHERE id = ?', [courseId]);
    
    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Mata kuliah tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[id] - mengupdate mata kuliah (hanya admin)
export async function PUT(request, { params }) {
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
    
    const courseId = params.id;
    
    // Cek apakah mata kuliah ada
    const existingCourse = await getOne('SELECT * FROM courses WHERE id = ?', [courseId]);
    
    if (!existingCourse) {
      return NextResponse.json(
        { success: false, message: 'Mata kuliah tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Parse request body
    const updateData = await request.json();
    
    // Validasi data
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada data yang diupdate' },
        { status: 400 }
      );
    }
    
    // ID tidak bisa diubah
    delete updateData.id;
    
    // Update di database
    const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateData), courseId];
    
    const sql = `UPDATE courses SET ${setClause} WHERE id = ?`;
    const result = await query(sql, values);
    
    if (result.affectedRows > 0) {
      // Ambil data terupdate
      const updatedCourse = await getOne('SELECT * FROM courses WHERE id = ?', [courseId]);
      
      return NextResponse.json({
        success: true,
        message: 'Mata kuliah berhasil diupdate',
        data: updatedCourse
      });
    }
    
    return NextResponse.json(
      { success: false, message: 'Gagal mengupdate mata kuliah' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - menghapus mata kuliah (hanya admin)
export async function DELETE(request, { params }) {
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
    
    const courseId = params.id;
    
    // Cek apakah mata kuliah ada
    const existingCourse = await getOne('SELECT * FROM courses WHERE id = ?', [courseId]);
    
    if (!existingCourse) {
      return NextResponse.json(
        { success: false, message: 'Mata kuliah tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Periksa apakah ada enrollment aktif
    const activeEnrollments = await getOne(
      'SELECT COUNT(*) AS total FROM enrollments WHERE course_id = ? AND status IN ("approved", "pending")',
      [courseId]
    );
    
    if (activeEnrollments && activeEnrollments.total > 0) {
      return NextResponse.json(
        { success: false, message: 'Tidak dapat menghapus mata kuliah dengan enrollment aktif' },
        { status: 400 }
      );
    }
    
    // Hapus dari database
    const result = await query('DELETE FROM courses WHERE id = ?', [courseId]);
    
    if (result.affectedRows > 0) {
      return NextResponse.json({
        success: true,
        message: 'Mata kuliah berhasil dihapus'
      });
    }
    
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus mata kuliah' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
} 