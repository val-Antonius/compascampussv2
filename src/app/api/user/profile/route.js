import { NextResponse } from 'next/server';
import { query, getOne } from '@/lib/db';
import { authMiddleware, hashPassword } from '@/lib/auth';

// GET /api/user/profile - mendapatkan profil pengguna yang login
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
    
    // Ambil data user dari database
    const user = await getOne(
      'SELECT id, username, fullname, email, role, student_id, semester, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile - mengupdate profil pengguna
export async function PUT(request) {
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
    
    // Parse request body
    const updateData = await request.json();
    
    // Tidak boleh update role atau student_id
    delete updateData.role;
    delete updateData.student_id;
    
    // Jika ada update password, hash password
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }
    
    // Jika tidak ada data yang diupdate
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada data yang diupdate' },
        { status: 400 }
      );
    }
    
    // Update di database
    const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateData), userId];
    
    const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
    const result = await query(sql, values);
    
    if (result.affectedRows > 0) {
      // Ambil data terupdate
      const updatedUser = await getOne(
        'SELECT id, username, fullname, email, role, student_id, semester, created_at, updated_at FROM users WHERE id = ?',
        [userId]
      );
      
      return NextResponse.json({
        success: true,
        message: 'Profil berhasil diupdate',
        data: updatedUser
      });
    }
    
    return NextResponse.json(
      { success: false, message: 'Gagal mengupdate profil' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
} 