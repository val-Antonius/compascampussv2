import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { connectToDB } from '@/lib/database';
import { ObjectId } from 'mongodb';

/**
 * Menangani permintaan PATCH untuk mengubah status enrollment
 * 
 * @param {Request} request - Request object
 * @param {Object} params - Parameter URL yang berisi ID enrollment
 * @returns {NextResponse} - Response dengan status perubahan
 */
export async function PATCH(request, { params }) {
  try {
    // Cek autentikasi user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    // Hanya admin yang dapat mengubah status enrollment
    if (session.user.role !== 'admin') {
      return NextResponse.json({ 
        message: 'Forbidden: Membutuhkan hak akses admin' 
      }, { status: 403 });
    }

    const enrollmentId = params.id;
    
    // Validasi ID enrollment
    if (!ObjectId.isValid(enrollmentId)) {
      return NextResponse.json({ 
        message: 'ID enrollment tidak valid' 
      }, { status: 400 });
    }

    // Ambil data dari request body
    const data = await request.json();
    const { status } = data;

    // Validasi status
    const validStatus = ['approved', 'rejected', 'pending'];
    if (!status || !validStatus.includes(status)) {
      return NextResponse.json({ 
        message: 'Status tidak valid. Status harus salah satu dari: approved, rejected, atau pending' 
      }, { status: 400 });
    }

    // Koneksi ke database
    const { db } = await connectToDB();
    
    // Cari enrollment berdasarkan ID
    const enrollment = await db.collection('enrollments').findOne({
      _id: new ObjectId(enrollmentId)
    });

    // Cek apakah enrollment ditemukan
    if (!enrollment) {
      return NextResponse.json({ 
        message: 'Enrollment tidak ditemukan' 
      }, { status: 404 });
    }

    // Update status enrollment
    const result = await db.collection('enrollments').updateOne(
      { _id: new ObjectId(enrollmentId) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        } 
      }
    );

    // Cek hasil update
    if (result.modifiedCount === 0) {
      return NextResponse.json({ 
        message: 'Gagal mengubah status enrollment' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: `Status enrollment berhasil diubah menjadi ${status}`,
      id: enrollmentId,
      status: status
    });
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    return NextResponse.json({ 
      message: 'Terjadi kesalahan saat mengubah status enrollment' 
    }, { status: 500 });
  }
} 