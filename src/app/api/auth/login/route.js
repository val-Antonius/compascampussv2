import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

// POST /api/auth/login
export async function POST(request) {
  try {
    // Parse request body
    const { username, password } = await request.json();
    
    // Validasi data
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username dan password harus diisi' },
        { status: 400 }
      );
    }
    
    // Autentikasi user
    const result = await authenticateUser(username, password);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }
    
    // Return user data dan token
    return NextResponse.json({
      success: true,
      data: {
        user: result.user,
        token: result.token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
} 