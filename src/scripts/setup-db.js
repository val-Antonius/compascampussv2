require('dotenv').config();
const { createTables, seedDummyData } = require('../lib/schema').default;
const { hashPassword } = require('../lib/auth').default;
const { insert, query } = require('../lib/db');

async function setup() {
  console.log('Membuat tabel database...');
  const result = await createTables();
  
  if (!result.success) {
    console.error('Gagal membuat tabel:', result.error);
    process.exit(1);
  }
  
  console.log('Tabel berhasil dibuat.');
  
  // Cek apakah sudah ada admin
  const adminExists = await query('SELECT * FROM users WHERE role = ?', ['admin']);
  
  if (adminExists.length === 0) {
    console.log('Membuat user admin default...');
    
    const adminPassword = await hashPassword('admin123');
    
    await insert('users', {
      username: 'admin',
      password: adminPassword,
      fullname: 'Admin Sistem',
      email: 'admin@compasscampus.com',
      role: 'admin'
    });
    
    console.log('User admin default berhasil dibuat.');
    console.log('Username: admin');
    console.log('Password: admin123');
  }
  
  // Cek apakah ada data awal mata kuliah
  const coursesExist = await query('SELECT * FROM courses LIMIT 1');
  
  if (coursesExist.length === 0) {
    console.log('Menambahkan data mata kuliah awal...');
    
    // Array mata kuliah awal
    const initialCourses = [
      {
        id: 'CS101',
        name: 'Introduction to Programming',
        credits: 3,
        category: 'Computer Science',
        instructor: 'Dr. Surya Wijaya',
        schedule: 'Mon, Wed 10:00-11:30',
        total_seats: 40,
        available_seats: 15,
        description: 'Pengenalan dasar tentang konsep pemrograman menggunakan bahasa Python.',
        status: 'active'
      },
      {
        id: 'MTH201',
        name: 'Advanced Calculus',
        credits: 4,
        category: 'Mathematics',
        instructor: 'Dr. Lisa Anggraini',
        schedule: 'Tue, Thu 13:00-14:30',
        total_seats: 30,
        available_seats: 8,
        description: 'Kalkulus tingkat lanjut termasuk turunan parsial dan integral multivariabel.',
        status: 'active'
      },
      {
        id: 'ENG102',
        name: 'Technical Writing',
        credits: 2,
        category: 'English',
        instructor: 'Prof. Hadi Susanto',
        schedule: 'Fri 14:00-16:00',
        total_seats: 35,
        available_seats: 15,
        description: 'Teknik penulisan teknis untuk laporan, proposal, dan dokumentasi ilmiah.',
        status: 'active'
      },
      {
        id: 'CS202',
        name: 'Data Structures and Algorithms',
        credits: 4,
        category: 'Computer Science',
        instructor: 'Dr. Ahmad Rahman',
        schedule: 'Mon, Wed 08:00-09:30',
        total_seats: 40,
        available_seats: 2,
        description: 'Pemahaman fundamental tentang struktur data dan algoritma dasar.',
        status: 'active'
      }
    ];
    
    for (const course of initialCourses) {
      await insert('courses', course);
    }
    
    console.log(`${initialCourses.length} mata kuliah awal berhasil ditambahkan.`);
  }
  
  console.log('Setup database selesai.');
  process.exit(0);
}

setup().catch(error => {
  console.error('Error setup database:', error);
  process.exit(1);
}); 