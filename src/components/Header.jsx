'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaBook, 
  FaClipboardList,
  FaHistory,
  FaSignOutAlt,
  FaBell
} from 'react-icons/fa';
import { useAuth } from '@/lib/AuthContext';
import { getNotifications, markNotificationAsRead } from '@/lib/api';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  
  const { authFetch } = useAuth();
  
  // Fungsi untuk mengambil notifikasi dari server
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);
  
  const fetchNotifications = async () => {
    try {
      if (!user) return;
      
      const { notifications, unreadCount } = await getNotifications(authFetch);
      setNotifications(notifications);
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(authFetch, id);
      // Update notifikasi setelah menandai sebagai dibaca
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      await markNotificationAsRead(authFetch, null, true);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  if (!user) {
    return null; // Jangan tampilkan header jika user belum login
  }
  
  return (
    <header className="bg-red-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl tracking-tight">CompassCampus</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-red-200 transition">
              Dashboard
            </Link>
            <Link href="/my-courses" className="hover:text-red-200 transition">
              Mata Kuliah Saya
            </Link>
            <Link href="/course-catalog" className="hover:text-red-200 transition">
              Katalog Mata Kuliah
            </Link>
            <Link href="/enrollment-history" className="hover:text-red-200 transition">
              Riwayat Enrollment
            </Link>
          </nav>
          
          {/* Profile & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                className="p-1 rounded-full text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Notifications"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  if (isProfileMenuOpen) setIsProfileMenuOpen(false);
                }}
              >
                <FaBell className="text-xl" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-800 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                    {notificationCount > 0 && (
                      <button 
                        className="text-sm text-red-600 hover:text-red-800"
                        onClick={handleMarkAllAsRead}
                      >
                        Tandai semua terbaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.is_read ? 'bg-red-50' : ''}`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <p className="text-sm text-gray-800 mb-1">{notification.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">Tidak ada notifikasi</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* User Profile */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                  if (isNotificationsOpen) setIsNotificationsOpen(false);
                }}
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="User profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                  <FaUser className="text-sm" />
                </div>
                <span className="hidden md:inline-block text-sm">{user.fullname}</span>
              </button>
              
              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-red-50">
                    <FaUser className="inline mr-2 text-red-600" />
                    Profil Saya
                  </Link>
                  <Link href="/my-courses" className="block px-4 py-2 text-gray-800 hover:bg-red-50">
                    <FaBook className="inline mr-2 text-red-600" />
                    Mata Kuliah Saya
                  </Link>
                  <Link href="/enrollment-history" className="block px-4 py-2 text-gray-800 hover:bg-red-50">
                    <FaHistory className="inline mr-2 text-red-600" />
                    Riwayat Enrollment
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-red-50"
                  >
                    <FaSignOutAlt className="inline mr-2 text-red-600" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-white hover:bg-red-600 focus:outline-none"
              aria-label="Mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 md:hidden border-t border-red-600 pt-4">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="hover:bg-red-600 px-3 py-2 rounded">
                Dashboard
              </Link>
              <Link href="/my-courses" className="hover:bg-red-600 px-3 py-2 rounded">
                Mata Kuliah Saya
              </Link>
              <Link href="/course-catalog" className="hover:bg-red-600 px-3 py-2 rounded">
                Katalog Mata Kuliah
              </Link>
              <Link href="/enrollment-history" className="hover:bg-red-600 px-3 py-2 rounded">
                Riwayat Enrollment
              </Link>
              <button 
                onClick={handleLogout}
                className="text-left hover:bg-red-600 px-3 py-2 rounded"
              >
                Keluar
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}