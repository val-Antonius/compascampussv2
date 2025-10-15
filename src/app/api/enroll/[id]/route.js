import { NextResponse } from 'next/server';
import { query, getOne } from '@/lib/db';
import { authMiddleware } from '@/lib/auth';

// GET /api/enroll/[id] - mendapatkan detail enrollment
export async function GET(request, { params }) {
  try {
    // Periksa autentikasi
    const authResult = await authMiddleware(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }
    
    const enrollmentId = params.id;
    
    // Query berbeda berdasarkan role
    let sql = '';
    let queryParams = [];
    
    if (authResult.user.role === 'admin') {
      // Admin dapat melihat semua enrollment
      sql = `
        SELECT 
          e.*,
          c.name as course_name,
          c.credits,
          c.instructor,
          c.schedule,
          u.fullname as student_name,
          u.student_id,
          u.email as student_email
        FROM 
          enrollments e
        JOIN 
          courses c ON e.course_id = c.id
        JOIN 
          users u ON e.user_id = u.id
        WHERE 
          e.id = ?
      `;
      queryParams = [enrollmentId];
    } else {
      // Student hanya bisa melihat enrollment miliknya
      sql = `
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
          e.id = ? AND e.user_id = ?
      `;
      queryParams = [enrollmentId, authResult.user.id];
    }
    
    // Ambil data dari database
    const enrollment = await getOne(sql, queryParams);
    
    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: 'Enrollment tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// PUT /api/enroll/[id] - update status enrollment (approve/reject/complete)
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
    
    // Hanya admin yang bisa mengupdate status enrollment
    if (authResult.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak' },
        { status: 403 }
      );
    }
    
    const enrollmentId = params.id;
    
    // Parse request body
    const { status, remarks } = await request.json();
    
    // Validasi status
    if (!status || !['approved', 'rejected', 'completed'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Status tidak valid' },
        { status: 400 }
      );
    }
    
    // Cek apakah enrollment ada
    const enrollment = await getOne(
      'SELECT e.*, c.name as course_name, u.id as student_id FROM enrollments e JOIN courses c ON e.course_id = c.id JOIN users u ON e.user_id = u.id WHERE e.id = ?',
      [enrollmentId]
    );
    
    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: 'Enrollment tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Perbarui status
    const updateData = { status };
    if (remarks) updateData.remarks = remarks;
    
    // Jika status completed, tambahkan completed_date
    if (status === 'completed') {
      updateData.completed_date = new Date();
    }
    
    // Update di database
    const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateData), enrollmentId];
    
    const sql = `UPDATE enrollments SET ${setClause} WHERE id = ?`;
    const result = await query(sql, values);
    
    if (result.affectedRows > 0) {
      // Jika enrollment ditolak, kembalikan kursi
      if (status === 'rejected') {
        await query(
          'UPDATE courses SET available_seats = available_seats + 1 WHERE id = ?',
          [enrollment.course_id]
        );
      }
      
      // Tambahkan notifikasi untuk mahasiswa
      let notificationMessage = '';
      
      if (status === 'approved') {
        notificationMessage = `Enrollment Anda untuk mata kuliah ${enrollment.course_name} telah disetujui.`;
      } else if (status === 'rejected') {
        notificationMessage = `Enrollment Anda untuk mata kuliah ${enrollment.course_name} ditolak. ${remarks ? 'Alasan: ' + remarks : ''}`;
      } else if (status === 'completed') {
        notificationMessage = `Anda telah menyelesaikan mata kuliah ${enrollment.course_name}.`;
      }
      
      await query(
        'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, "enrollment_update")',
        [enrollment.student_id, notificationMessage]
      );
      
      // Ambil data terupdate
      const updatedEnrollment = await getOne(
        'SELECT e.*, c.name as course_name FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.id = ?',
        [enrollmentId]
      );
      
      return NextResponse.json({
        success: true,
        message: `Status enrollment berhasil diubah menjadi ${status}`,
        data: updatedEnrollment
      });
    }
    
    return NextResponse.json(
      { success: false, message: 'Gagal mengupdate enrollment' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// DELETE /api/enroll/[id] - membatalkan enrollment (hanya untuk status pending)
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
    
    const enrollmentId = params.id;
    
    // Cek apakah enrollment ada
    let enrollment;
    
    if (authResult.user.role === 'admin') {
      // Admin dapat menghapus enrollment apapun
      enrollment = await getOne('SELECT * FROM enrollments WHERE id = ?', [enrollmentId]);
    } else {
      // Student hanya bisa menghapus enrollment miliknya dan status pending
      enrollment = await getOne(
        'SELECT * FROM enrollments WHERE id = ? AND user_id = ? AND status = "pending"',
        [enrollmentId, authResult.user.id]
      );
    }
    
    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: 'Enrollment tidak ditemukan atau tidak dapat dibatalkan' },
        { status: 404 }
      );
    }
    
    // Transaksi untuk menghapus enrollment dan mengembalikan kursi
    const connection = await getOne('START TRANSACTION');
    
    try {
      // Hapus enrollment
      const result = await query('DELETE FROM enrollments WHERE id = ?', [enrollmentId]);
      
      if (result.affectedRows > 0) {
        // Kembalikan kursi yang tersedia
        await query(
          'UPDATE courses SET available_seats = available_seats + 1 WHERE id = ?',
          [enrollment.course_id]
        );
        
        // Commit transaksi
        await query('COMMIT');
        
        return NextResponse.json({
          success: true,
          message: 'Enrollment berhasil dibatalkan'
        });
      }
      
      await query('ROLLBACK');
      return NextResponse.json(
        { success: false, message: 'Gagal membatalkan enrollment' },
        { status: 500 }
      );
    } catch (error) {
      // Rollback jika terjadi kesalahan
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error canceling enrollment:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
} 