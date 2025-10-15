import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { insert, getOne } from '@/lib/db';

export async function POST(request) {
  try {
    // Parse request body
    const { username, password, fullname, email } = await request.json();
    
    // Validasi data
    if (!username || !password || !fullname || !email) {
      return NextResponse.json(
        { success: false, message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }
    
    // Cek apakah username sudah digunakan
    const existingUser = await getOne(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Username atau email sudah digunakan' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Tambahkan user baru
    const newUser = {
      username,
      password: hashedPassword,
      fullname,
      email,
      role: 'student', // Default role
      semester: 1 // Default semester
    };
    
    const result = await insert('users', newUser);
    
    // Generate student ID jika user berhasil dibuat
    if (result.insertId) {
      const studentId = `STD${new Date().getFullYear()}${result.insertId.toString().padStart(3, '0')}`;
      
      // Update user dengan student ID
      await getOne(
        'UPDATE users SET student_id = ? WHERE id = ?',
        [studentId, result.insertId]
      );
      
      // Return data user tanpa password
      return NextResponse.json({
        success: true,
        message: 'Registrasi berhasil',
        data: {
          id: result.insertId,
          username,
          fullname,
          email,
          role: 'student',
          student_id: studentId,
          semester: 1
        }
      });
    }
    
    return NextResponse.json(
      { success: false, message: 'Gagal membuat user' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
} 