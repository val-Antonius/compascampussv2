import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { connectToDB } from '@/lib/db';
// import { ObjectId } from 'mongodb';

// Secret key untuk JWT
const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'compasscampus_secret_key_123456'
);

/**
 * Verifikasi JWT token dari Authorization header
 */
async function verifyToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Mendapatkan semua enrollment dengan paginasi, pencarian, dan filter
 * 
 * @param {Request} request - Request object
 * @returns {NextResponse} - Response dengan daftar enrollment
 */
export async function GET(request) {
  try {
    // Cek autentikasi user
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    // Ambil query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const userId = searchParams.get('userId') || '';
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Validasi parameter
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json({ 
        message: 'Parameter paginasi tidak valid' 
      }, { status: 400 });
    }

    // Hitung offset
    const skip = (page - 1) * limit;

    // Buat filter query
    const query = {};

    // Filter berdasarkan status jika ada
    if (status) {
      query.status = status;
    }

    // Filter berdasarkan user ID jika ada dan format valid
    if (userId && ObjectId.isValid(userId)) {
      query.userId = new ObjectId(userId);
    }

    // Jika bukan admin, batasi hanya melihat enrollment milik sendiri
    if (user.role !== 'admin') {
      query.userId = new ObjectId(user.id);
    }

    // Buat search query jika ada
    if (search) {
      query.$or = [
        { 'courseTitle': { $regex: search, $options: 'i' } },
        { 'userName': { $regex: search, $options: 'i' } }
      ];
    }

    // Koneksi ke database
    const { db } = await connectToDB();

    // Pipeline untuk aggregate
    const pipeline = [
      { $match: query },
      // Lookup untuk data user
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      // Lookup untuk data course
      {
        $lookup: {
          from: 'courses',
          localField: 'courseId',
          foreignField: '_id',
          as: 'courseDetails'
        }
      },
      // Unwind arrays hasil lookup
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$courseDetails', preserveNullAndEmptyArrays: true } },
      // Proyeksi field yang diperlukan
      {
        $project: {
          _id: 1,
          status: 1,
          price: 1,
          createdAt: 1,
          updatedAt: 1,
          userId: 1,
          courseId: 1,
          paymentMethod: 1,
          paymentProof: 1,
          'userDetails.name': 1,
          'userDetails.email': 1,
          'courseDetails.title': 1,
          'courseDetails.imageUrl': 1,
          'courseDetails.price': 1
        }
      },
      // Tambahkan field tampilan
      {
        $addFields: {
          userName: '$userDetails.name',
          userEmail: '$userDetails.email',
          courseTitle: '$courseDetails.title',
          courseImage: '$courseDetails.imageUrl'
        }
      }
    ];

    // Tambahkan pencarian jika ada
    if (search) {
      pipeline.unshift({
        $match: {
          $or: [
            { 'userDetails.name': { $regex: search, $options: 'i' } },
            { 'userDetails.email': { $regex: search, $options: 'i' } },
            { 'courseDetails.title': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Hitung total untuk pagination
    const totalEnrollments = await db.collection('enrollments')
      .aggregate([...pipeline, { $count: 'total' }])
      .toArray();

    const total = totalEnrollments.length > 0 ? totalEnrollments[0].total : 0;

    // Tambahkan sorting dan pagination
    pipeline.push(
      { $sort: { [sort]: order === 'asc' ? 1 : -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    // Ambil data enrollment
    const enrollments = await db.collection('enrollments')
      .aggregate(pipeline)
      .toArray();

    return NextResponse.json({
      data: enrollments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error retrieving enrollments:', error);
    return NextResponse.json({ 
      message: 'Terjadi kesalahan saat mengambil data enrollment' 
    }, { status: 500 });
  }
}

/**
 * Membuat enrollment baru
 * 
 * @param {Request} request - Request object
 * @returns {NextResponse} - Response dengan detail enrollment yang dibuat
 */
export async function POST(request) {
  try {
    // Cek autentikasi user
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { courseId, paymentMethod } = body;

    // Validasi input
    if (!courseId || !paymentMethod) {
      return NextResponse.json({ 
        message: 'ID kursus dan metode pembayaran diperlukan' 
      }, { status: 400 });
    }

    // Validasi ID kursus
    if (!ObjectId.isValid(courseId)) {
      return NextResponse.json({ 
        message: 'ID kursus tidak valid' 
      }, { status: 400 });
    }

    // Validasi metode pembayaran
    const validPaymentMethods = ['transfer', 'cash', 'credit_card'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json({ 
        message: 'Metode pembayaran tidak valid' 
      }, { status: 400 });
    }

    // Koneksi ke database
    const { db } = await connectToDB();

    // Cek apakah kursus ada
    const course = await db.collection('courses').findOne({
      _id: new ObjectId(courseId)
    });

    if (!course) {
      return NextResponse.json({ 
        message: 'Kursus tidak ditemukan' 
      }, { status: 404 });
    }

    // Cek apakah user sudah mendaftar kursus ini
    const existingEnrollment = await db.collection('enrollments').findOne({
      userId: new ObjectId(user.id),
      courseId: new ObjectId(courseId),
      status: { $in: ['pending', 'approved'] }
    });

    if (existingEnrollment) {
      return NextResponse.json({ 
        message: 'Anda sudah terdaftar pada kursus ini' 
      }, { status: 409 });
    }

    // Data enrollment baru
    const newEnrollment = {
      userId: new ObjectId(user.id),
      courseId: new ObjectId(courseId),
      status: 'pending',
      price: course.price,
      paymentMethod,
      paymentProof: body.paymentProof || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Simpan ke database
    const result = await db.collection('enrollments').insertOne(newEnrollment);

    if (!result.insertedId) {
      return NextResponse.json({ 
        message: 'Gagal membuat enrollment' 
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Enrollment berhasil dibuat',
      data: {
        ...newEnrollment,
        _id: result.insertedId
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json({ 
      message: 'Terjadi kesalahan saat membuat enrollment' 
    }, { status: 500 });
  }
} 