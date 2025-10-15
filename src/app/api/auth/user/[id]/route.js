import { NextResponse } from 'next/server';
import { findUserById } from '@/data/users';

// GET /api/auth/user/:id
export async function GET(request, { params }) {
  try {
    const userId = params.id;

    // Cari user berdasarkan ID
    const user = findUserById(userId);

    // Jika user tidak ditemukan
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User tidak ditemukan' 
        }, 
        { status: 404 }
      );
    }

    // Buat data response tanpa password
    const { password: _, ...userData } = user;

    // Return data user
    return NextResponse.json(
      { 
        success: true, 
        data: userData 
      }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Terjadi kesalahan pada server' 
      }, 
      { status: 500 }
    );
  }
} 