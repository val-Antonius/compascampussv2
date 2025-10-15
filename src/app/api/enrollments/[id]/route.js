import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectToDB } from '@/lib/database';
import { ObjectId } from 'mongodb';

/**
 * Mendapatkan detail enrollment berdasarkan ID
 * 
 * @param {Request} request - Request object
 * @param {Object} context - Context object dengan params
 * @returns {NextResponse} - Response dengan detail enrollment
 */
export async function GET(request, { params }) {
  try {
    // Cek autentikasi user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    // Validasi ID
    const { id } = params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ 
        message: 'ID enrollment tidak valid' 
      }, { status: 400 });
    }

    // Koneksi ke database
    const { db } = await connectToDB();

    // Cari enrollment dengan data terkait course dan user
    const enrollment = await db.collection('enrollments').aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: 'courses',
          localField: 'courseId',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          _id: 1,
          status: 1,
          requestDate: 1,
          approvalDate: 1,
          'course._id': 1,
          'course.title': 1,
          'course.description': 1,
          'course.category': 1,
          'user._id': 1,
          'user.name': 1,
          'user.email': 1
        }
      },
      {
        $unwind: {
          path: '$course',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray();

    if (!enrollment || enrollment.length === 0) {
      return NextResponse.json({ 
        message: 'Enrollment tidak ditemukan' 
      }, { status: 404 });
    }

    // Cek izin: admin dapat melihat semua enrollment,
    // pengguna biasa hanya enrollment miliknya
    if (session.user.role !== 'admin' && 
        enrollment[0].user._id.toString() !== session.user.id) {
      return NextResponse.json({ 
        message: 'Forbidden - Anda tidak memiliki izin untuk melihat enrollment ini' 
      }, { status: 403 });
    }

    return NextResponse.json(enrollment[0]);
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    return NextResponse.json({ 
      message: 'Terjadi kesalahan saat mengambil data enrollment' 
    }, { status: 500 });
  }
}

/**
 * Memperbarui status enrollment
 * 
 * @param {Request} request - Request object
 * @param {Object} context - Context object dengan params
 * @returns {NextResponse} - Response dengan hasil pembaruan
 */
export async function PUT(request, { params }) {
  try {
    // Cek autentikasi user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    // Hanya admin yang dapat memperbarui status enrollment
    if (session.user.role !== 'admin') {
      return NextResponse.json({ 
        message: 'Forbidden - Hanya admin yang dapat memperbarui status enrollment' 
      }, { status: 403 });
    }

    // Validasi ID
    const { id } = params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ 
        message: 'ID enrollment tidak valid' 
      }, { status: 400 });
    }

    // Parse request body
    const data = await request.json();
    const { status } = data;

    // Validasi status
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ 
        message: 'Status tidak valid. Status harus berupa: pending, approved, atau rejected' 
      }, { status: 400 });
    }

    // Koneksi ke database
    const { db } = await connectToDB();

    // Cari enrollment yang akan diperbarui
    const enrollment = await db.collection('enrollments').findOne({
      _id: new ObjectId(id)
    });

    if (!enrollment) {
      return NextResponse.json({ 
        message: 'Enrollment tidak ditemukan' 
      }, { status: 404 });
    }

    // Siapkan data pembaruan
    const updateData = {
      status,
      updatedAt: new Date()
    };

    // Jika status berubah menjadi approved, tambahkan tanggal approval
    if (status === 'approved' && enrollment.status !== 'approved') {
      updateData.approvalDate = new Date();
      
      // Jika disetujui, tambahkan ke courseParticipants
      await db.collection('courseParticipants').insertOne({
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        enrollmentId: enrollment._id,
        joinDate: new Date(),
        status: 'active',
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Pembaruan enrollment
    const result = await db.collection('enrollments').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        message: 'Gagal memperbarui enrollment' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: `Enrollment berhasil diperbarui ke status ${status}`,
      success: true
    });
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return NextResponse.json({ 
      message: 'Terjadi kesalahan saat memperbarui enrollment' 
    }, { status: 500 });
  }
}

/**
 * Menghapus/membatalkan enrollment
 * 
 * @param {Request} request - Request object
 * @param {Object} context - Context object dengan params
 * @returns {NextResponse} - Response dengan status penghapusan
 */
export async function DELETE(request, { params }) {
  try {
    // Cek autentikasi user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    // Validasi ID
    const { id } = params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ 
        message: 'ID enrollment tidak valid' 
      }, { status: 400 });
    }

    // Koneksi ke database
    const { db } = await connectToDB();

    // Cek apakah enrollment ada
    const enrollment = await db.collection('enrollments').findOne({
      _id: new ObjectId(id)
    });

    if (!enrollment) {
      return NextResponse.json({ 
        message: 'Enrollment tidak ditemukan' 
      }, { status: 404 });
    }

    // Cek izin: admin dapat menghapus enrollment apa saja,
    // sedangkan pengguna biasa hanya bisa menghapus enrollment miliknya sendiri
    if (session.user.role !== 'admin' && 
        enrollment.userId.toString() !== session.user.id) {
      return NextResponse.json({ 
        message: 'Forbidden - Anda tidak memiliki izin untuk menghapus enrollment ini' 
      }, { status: 403 });
    }

    // Hapus enrollment
    const result = await db.collection('enrollments').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        message: 'Gagal menghapus enrollment' 
      }, { status: 500 });
    }

    // Hapus juga dari daftar peserta kursus jika ada
    await db.collection('courseParticipants').deleteOne({
      enrollmentId: new ObjectId(id)
    });

    return NextResponse.json({
      message: 'Enrollment berhasil dihapus',
      id
    });
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    return NextResponse.json({ 
      message: 'Terjadi kesalahan saat menghapus enrollment' 
    }, { status: 500 });
  }
} 