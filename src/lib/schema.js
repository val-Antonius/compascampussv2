import db from './db';

// Query untuk membuat tabel users
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('student', 'admin', 'instructor') NOT NULL DEFAULT 'student',
  student_id VARCHAR(20) UNIQUE,
  semester INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
`;

// Query untuk membuat tabel courses
const createCoursesTable = `
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  credits INT NOT NULL,
  category VARCHAR(50) NOT NULL,
  instructor VARCHAR(100) NOT NULL,
  instructor_id INT,
  schedule VARCHAR(100),
  total_seats INT NOT NULL DEFAULT 30,
  available_seats INT NOT NULL DEFAULT 30,
  description TEXT,
  status ENUM('active', 'draft', 'archived') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL
)
`;

// Query untuk membuat tabel enrollments
const createEnrollmentsTable = `
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id VARCHAR(20) NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'completed') NOT NULL DEFAULT 'pending',
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_date TIMESTAMP NULL,
  grade VARCHAR(2) NULL,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY user_course_unique (user_id, course_id)
)
`;

// Query untuk membuat tabel notifications
const createNotificationsTable = `
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  type VARCHAR(20) NOT NULL DEFAULT 'info',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
`;

// Fungsi untuk membuat semua tabel
export async function createTables() {
  try {
    // Buat tabel secara berurutan (karena ada foreign key)
    await db.query(createUsersTable);
    console.log('Users table created or already exists');
    
    await db.query(createCoursesTable);
    console.log('Courses table created or already exists');
    
    await db.query(createEnrollmentsTable);
    console.log('Enrollments table created or already exists');
    
    await db.query(createNotificationsTable);
    console.log('Notifications table created or already exists');
    
    return { success: true, message: 'All tables created successfully' };
  } catch (error) {
    console.error('Error creating tables:', error);
    return { success: false, error };
  }
}

// Fungsi untuk seed data dummy (hanya digunakan dalam pengembangan)
export async function seedDummyData() {
  // Implementasi seed data di sini
}

export default { createTables, seedDummyData }; 