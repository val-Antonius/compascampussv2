import { NextResponse } from 'next/server';
import { query, getOne } from '@/lib/db';
import { authMiddleware } from '@/lib/auth';

// GET /api/notifications - mendapatkan notifikasi untuk user yang login
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
    
    // Ambil parameter pencarian
    const { searchParams } = new URL(request.url);
    const isRead = searchParams.get('is_read');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Query dasar
    let sql = 'SELECT * FROM notifications WHERE user_id = ?';
    let params = [userId];
    
    // Filter berdasarkan status dibaca
    if (isRead !== null) {
      sql += ' AND is_read = ?';
      params.push(isRead === 'true' ? 1 : 0);
    }
    
    // Urutkan dan batasi jumlah
    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);
    
    // Ambil data dari database
    const notifications = await query(sql, params);
    
    // Hitung total notifikasi yang belum dibaca
    const unreadCount = await getOne(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
      [userId]
    );
    
    return NextResponse.json({
      success: true,
      data: notifications,
      meta: { unreadCount: unreadCount.count }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications - menandai notifikasi sebagai telah dibaca
export async function PATCH(request) {
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
    const { id, all = false } = await request.json();
    
    let result;
    
    if (all) {
      // Tandai semua notifikasi sebagai dibaca
      result = await query(
        'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
        [userId]
      );
    } else if (id) {
      // Tandai satu notifikasi sebagai dibaca
      result = await query(
        'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
        [id, userId]
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Parameter id atau all harus disediakan' },
        { status: 400 }
      );
    }
    
    if (result.affectedRows > 0) {
      return NextResponse.json({
        success: true,
        message: all ? 'Semua notifikasi ditandai dibaca' : 'Notifikasi ditandai dibaca'
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Tidak ada notifikasi yang diubah'
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications - menghapus notifikasi
export async function DELETE(request) {
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
    const { id, all = false } = await request.json();
    
    let result;
    
    if (all) {
      // Hapus semua notifikasi
      result = await query(
        'DELETE FROM notifications WHERE user_id = ?',
        [userId]
      );
    } else if (id) {
      // Hapus satu notifikasi
      result = await query(
        'DELETE FROM notifications WHERE id = ? AND user_id = ?',
        [id, userId]
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Parameter id atau all harus disediakan' },
        { status: 400 }
      );
    }
    
    if (result.affectedRows > 0) {
      return NextResponse.json({
        success: true,
        message: all ? 'Semua notifikasi dihapus' : 'Notifikasi dihapus'
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Tidak ada notifikasi yang dihapus'
    });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
} 