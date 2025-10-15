import { SignJWT, jwtVerify } from 'jose';
import { getOne } from './db';
import bcrypt from 'bcryptjs';

// Secret key untuk JWT
const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'compasscampus_secret_key_123456'
);

/**
 * Autentikasi user berdasarkan username dan password
 */
export async function authenticateUser(username, password) {
  try {
    // Cari user berdasarkan username
    const user = await getOne(
      'SELECT id, username, password, fullname, email, role, student_id, semester FROM users WHERE username = ?',
      [username]
    );

    // Jika user tidak ditemukan
    if (!user) {
      return { success: false, message: 'Username atau password salah' };
    }

    // Bandingkan password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { success: false, message: 'Username atau password salah' };
    }

    // Buat token
    const token = await generateToken(user);

    // Hapus password dari objek user sebelum dikembalikan
    delete user.password;

    return {
      success: true,
      user,
      token
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'Terjadi kesalahan pada server' };
  }
}

/**
 * Generate token JWT
 */
export async function generateToken(user) {
  try {
    // Token akan berlaku selama 24 jam
    const expiresIn = 60 * 60 * 24;
    
    const token = await new SignJWT({
      id: user.id,
      username: user.username,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
      .sign(secretKey);
    
    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    throw error;
  }
}

/**
 * Verifikasi token JWT
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return { success: true, payload };
  } catch (error) {
    return { success: false, message: 'Token tidak valid' };
  }
}

/**
 * Middleware untuk mengecek autentikasi
 */
export async function authMiddleware(req) {
  // Dapatkan token dari header Authorization
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      success: false,
      message: 'Token tidak ditemukan',
      status: 401
    };
  }
  
  // Extract token
  const token = authHeader.split(' ')[1];
  
  // Verifikasi token
  const { success, payload, message } = await verifyToken(token);
  
  if (!success) {
    return {
      success: false,
      message: message || 'Token tidak valid',
      status: 401
    };
  }
  
  return {
    success: true,
    user: payload
  };
}

/**
 * Hash password
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export default {
  authenticateUser,
  generateToken,
  verifyToken,
  authMiddleware,
  hashPassword
}; 