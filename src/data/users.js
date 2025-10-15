// Mock data untuk Auth Service

export const users = [
  {
    id: 'STD2024001',
    name: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    password: 'password123', // Dalam produksi asli password tidak disimpan plaintext
    role: 'student',
    semester: 3,
    enrolledCredits: 12,
    maxCredits: 24,
    activeCourses: 4,
    pendingApprovals: 2,
    upcomingDeadlines: 1,
  },
  {
    id: 'STD2024005',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@example.com',
    password: 'password123',
    role: 'student',
    semester: 4,
    enrolledCredits: 15,
    maxCredits: 24,
    activeCourses: 5,
    pendingApprovals: 0,
    upcomingDeadlines: 2,
  },
  {
    id: 'ADM2024001',
    name: 'Ahmad Suryanto',
    email: 'ahmad.suryanto@example.com',
    password: 'admin123',
    role: 'admin',
  }
];

// Fungsi untuk mencari user berdasarkan credentials (email dan password)
export function findUserByCredentials(email, password) {
  return users.find(user => user.email === email && user.password === password);
}

// Fungsi untuk mencari user berdasarkan ID
export function findUserById(id) {
  return users.find(user => user.id === id);
}