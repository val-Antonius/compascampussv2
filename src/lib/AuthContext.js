'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Cek apakah user sudah login pada saat halaman dimuat
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    
    setLoading(false);
  }, []);
  
  // Login
  const login = async (username, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Login gagal');
      }
      
      // Simpan user dan token ke state dan localStorage
      setUser(data.data.user);
      setToken(data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      localStorage.setItem('token', data.data.token);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Terjadi kesalahan saat login'
      };
    }
  };
  
  // Register
  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Registrasi gagal');
      }
      
      return { success: true, data: data.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Terjadi kesalahan saat registrasi'
      };
    }
  };
  
  // Logout
  const logout = () => {
    // Hapus user dan token dari state dan localStorage
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };
  
  // API call dengan authorization
  const authFetch = async (url, options = {}) => {
    if (!token) {
      throw new Error('Tidak ada token autentikasi');
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      // Jika token tidak valid (401), logout
      if (response.status === 401) {
        logout();
        throw new Error('Sesi telah berakhir, silakan login kembali');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  // Cek apakah user adalah admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      register, 
      logout, 
      authFetch,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 