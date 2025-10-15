// Alias untuk user service (mempertahankan desain consumer-provider)
import { findUserById } from './users';

// Fungsi untuk mendapatkan data mahasiswa berdasarkan ID
export function getStudentById(id) {
  const user = findUserById(id);
  if (user && user.role === 'student') {
    return user;
  }
  return null;
} 