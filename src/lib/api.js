// Utilitas untuk mengakses API

// Fungsi untuk mengambil semua mata kuliah
export async function getCourses(category = null, status = 'active') {
  let url = '/api/courses';
  const params = new URLSearchParams();
  
  if (category) {
    params.append('category', category);
  }
  
  if (status) {
    params.append('status', status);
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Gagal mengambil mata kuliah');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

// Fungsi untuk mengambil detail mata kuliah
export async function getCourseById(courseId) {
  try {
    const response = await fetch(`/api/courses/${courseId}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Gagal mengambil detail mata kuliah');
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching course ${courseId}:`, error);
    throw error;
  }
}

/**
 * Mengambil semua enrollment milik user yang sedang login
 * @param {Function} authFetch - Fungsi fetch terotentikasi dari AuthContext
 * @param {string|null} status - Filter berdasarkan status ('pending', 'approved', 'rejected') atau null untuk semua
 * @returns {Promise<Array>} - Array berisi enrollment user
 */
export async function getUserEnrollments(authFetch, status = null) {
  try {
    const url = status 
      ? `/api/enrollments?status=${status}`
      : '/api/enrollments';
    
    const response = await authFetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Gagal mengambil data enrollment');
    }
    
    const data = await response.json();
    return data.enrollments;
  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    throw error;
  }
}

// Fungsi untuk mendaftar mata kuliah
export async function enrollCourse(authFetch, courseId) {
  try {
    const data = await authFetch('/api/enroll', {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId }),
    });
    
    if (!data.success) {
      throw new Error(data.message || 'Gagal mendaftar mata kuliah');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error enrolling course:', error);
    throw error;
  }
}

/**
 * Membatalkan enrollment yang sedang pending
 * @param {Function} authFetch - Fungsi fetch terotentikasi dari AuthContext
 * @param {string} enrollmentId - ID enrollment yang akan dibatalkan
 * @returns {Promise<Object>} - Respons dari API
 */
export async function cancelEnrollment(authFetch, enrollmentId) {
  try {
    const response = await authFetch(`/api/enrollments/${enrollmentId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Gagal membatalkan enrollment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error cancelling enrollment:', error);
    throw error;
  }
}

// Fungsi untuk mengambil notifikasi
export async function getNotifications(authFetch, limit = 10, isRead = null) {
  try {
    let url = `/api/notifications?limit=${limit}`;
    if (isRead !== null) {
      url += `&is_read=${isRead}`;
    }
    
    const data = await authFetch(url);
    
    if (!data.success) {
      throw new Error(data.message || 'Gagal mengambil notifikasi');
    }
    
    return {
      notifications: data.data,
      unreadCount: data.meta?.unreadCount || 0
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

// Fungsi untuk menandai notifikasi sebagai dibaca
export async function markNotificationAsRead(authFetch, notificationId = null, all = false) {
  try {
    const data = await authFetch('/api/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ id: notificationId, all }),
    });
    
    if (!data.success) {
      throw new Error(data.message || 'Gagal menandai notifikasi sebagai dibaca');
    }
    
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

// Admin: Fungsi untuk mengambil semua enrollment
export async function getAllEnrollments(authFetch, status = null) {
  try {
    let url = '/api/admin/enrollments';
    if (status) {
      url += `?status=${status}`;
    }
    
    const data = await authFetch(url);
    
    if (!data.success) {
      throw new Error(data.message || 'Gagal mengambil data enrollment');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching all enrollments:', error);
    throw error;
  }
}

// Admin: Fungsi untuk mengupdate status enrollment
export async function updateEnrollmentStatus(authFetch, enrollmentId, status, remarks = '') {
  try {
    const data = await authFetch(`/api/enroll/${enrollmentId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, remarks }),
    });
    
    if (!data.success) {
      throw new Error(data.message || 'Gagal mengupdate status enrollment');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    throw error;
  }
} 