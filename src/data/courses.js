// Mock data untuk Course Service

export const courses = [
  {
    id: 'CS101',
    name: 'Introduction to Programming',
    credits: 3,
    category: 'Computer Science',
    instructor: 'Dr. Surya Wijaya',
    schedule: 'Mon, Wed 10:00-11:30',
    totalSeats: 40,
    availableSeats: 15,
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
    totalSeats: 30,
    availableSeats: 8,
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
    totalSeats: 35,
    availableSeats: 15,
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
    totalSeats: 40,
    availableSeats: 2,
    description: 'Pemahaman fundamental tentang struktur data dan algoritma dasar.',
    status: 'active'
  },
  {
    id: 'CS303',
    name: 'Database Systems',
    credits: 3,
    category: 'Computer Science',
    instructor: 'Dr. Maya Putri',
    schedule: 'Tue, Thu 10:00-11:30',
    totalSeats: 30,
    availableSeats: 5,
    description: 'Desain dan implementasi sistem basis data, SQL, dan normalisasi.',
    status: 'active'
  },
  {
    id: 'CS304',
    name: 'Software Engineering',
    credits: 4,
    category: 'Computer Science',
    instructor: 'Prof. Rudi Hartono',
    schedule: 'Wed, Fri 08:00-09:30',
    totalSeats: 45,
    availableSeats: 20,
    description: 'Prinsip dan praktik pengembangan perangkat lunak, termasuk requirement engineering, design, testing, dan project management.',
    status: 'draft'
  },
  {
    id: 'BUS101',
    name: 'Entrepreneurship Basics',
    credits: 2,
    category: 'Business',
    instructor: 'Dr. Anton Wijaya',
    schedule: 'Thu 10:00-12:00',
    totalSeats: 45,
    availableSeats: 20,
    description: 'Konsep dasar kewirausahaan, strategi bisnis, dan model bisnis modern.',
    status: 'active'
  },
  {
    id: 'HUM101',
    name: 'Introduction to Philosophy',
    credits: 2,
    category: 'Humanities',
    instructor: 'Dr. Indra Wijaya',
    schedule: 'Fri 15:00-17:00',
    totalSeats: 50,
    availableSeats: 25,
    description: 'Eksplorasi pemikiran filsafat dasar dari berbagai tradisi filosofis.',
    status: 'active'
  },
];

// Fungsi untuk mendapatkan semua mata kuliah aktif
export function getActiveCourses() {
  return courses.filter(course => course.status === 'active');
}

// Fungsi untuk mendapatkan mata kuliah berdasarkan ID
export function getCourseById(id) {
  return courses.find(course => course.id === id);
}

// Fungsi untuk mengupdate ketersediaan kursi
export function updateCourseAvailability(courseId, decrease = true) {
  const course = courses.find(course => course.id === courseId);
  if (course) {
    if (decrease && course.availableSeats > 0) {
      course.availableSeats -= 1;
    } else if (!decrease) {
      course.availableSeats += 1;
    }
    return course;
  }
  return null;
} 