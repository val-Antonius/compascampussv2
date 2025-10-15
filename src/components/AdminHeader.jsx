'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaBell, 
  FaBook, 
  FaClipboardList, 
  FaHome, 
  FaSignOutAlt, 
  FaCog 
} from 'react-icons/fa';

export default function AdminHeader({ adminName = 'Admin' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New enrollment request from Budi Santoso', date: '5 mins ago', isRead: false },
    { id: 2, message: 'Course CS202 is at maximum capacity', date: '30 mins ago', isRead: false },
    { id: 3, message: 'System maintenance scheduled for tonight', date: '1 day ago', isRead: true },
  ]);

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  return (
    <header className="bg-red-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and site name */}
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex items-center">
              <span className="text-xl font-bold">CompassCampus <span className="text-amber-400">Admin</span></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/admin/dashboard" className="flex items-center space-x-1 hover:text-red-200 transition">
              <FaHome className="mr-1" />
              <span>Dashboard</span>
            </Link>
            <Link href="/admin/courses" className="flex items-center space-x-1 hover:text-red-200 transition">
              <FaBook className="mr-1" />
              <span>Kelola Mata Kuliah</span>
            </Link>
            <Link href="/admin/enrollments" className="flex items-center space-x-1 hover:text-red-200 transition">
              <FaClipboardList className="mr-1" />
              <span>Enrollment</span>
            </Link>
          </nav>

          {/* Right Section - Profile & Notifications */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                className="p-1 rounded-full text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={toggleNotifications}
                aria-label="Notifications"
              >
                <FaBell className="text-xl" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-900 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-md shadow-lg py-1 z-10">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold">Notifikasi</h3>
                    <button className="text-sm text-red-600 hover:text-red-800">
                      Tandai semua terbaca
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.isRead ? 'bg-red-50' : ''}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <p className="text-sm mb-1">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.date}</p>
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
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="User profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center text-white">
                  <FaUser className="text-sm" />
                </div>
                <span className="hidden md:inline-block text-sm">{adminName}</span>
              </button>
              
              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link href="/admin/profile" className="block px-4 py-2 text-gray-800 hover:bg-red-50">
                    <FaUser className="inline mr-2 text-red-600" />
                    Profil Admin
                  </Link>
                  <Link href="/admin/settings" className="block px-4 py-2 text-gray-800 hover:bg-red-50">
                    <FaCog className="inline mr-2 text-red-600" />
                    Pengaturan Sistem
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link href="/login" className="block px-4 py-2 text-gray-800 hover:bg-red-50">
                    <FaSignOutAlt className="inline mr-2 text-red-600" />
                    Keluar
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-white hover:bg-red-700 focus:outline-none"
              aria-label="Mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 md:hidden border-t border-red-700 pt-4">
            <nav className="flex flex-col space-y-3">
              <Link href="/admin/dashboard" className="hover:bg-red-700 px-3 py-2 rounded flex items-center">
                <FaHome className="mr-2" />
                Dashboard
              </Link>
              <Link href="/admin/courses" className="hover:bg-red-700 px-3 py-2 rounded flex items-center">
                <FaBook className="mr-2" />
                Kelola Mata Kuliah
              </Link>
              <Link href="/admin/enrollments" className="hover:bg-red-700 px-3 py-2 rounded flex items-center">
                <FaClipboardList className="mr-2" />
                Enrollment
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 