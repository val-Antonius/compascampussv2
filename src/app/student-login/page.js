'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentLoginPage() {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Implementasi login akan ditambahkan nanti
      console.log('Login mahasiswa:', { nim, password });
      
      // Simulasi login berhasil dan redirect ke dashboard mahasiswa
      // setTimeout(() => {
      //   router.push('/student/dashboard');
      // }, 1500);
    } catch (err) {
      setError('Terjadi kesalahan saat login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-800">Portal Mahasiswa</h1>
          <p className="text-gray-600 mt-2">Compass Campus - Sistem Akademik Terpadu</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="nim">
              Nomor Induk Mahasiswa (NIM)
            </label>
            <input
              id="nim"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan NIM Anda"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
          
          <div className="mt-6 flex justify-between text-sm">
            <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800">
              Lupa password?
            </Link>
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              Kembali ke Login Utama
            </Link>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>© 2025 Compass Campus. All rights reserved.</p>
          <p className="mt-1">Membutuhkan bantuan? Hubungi admin kampus.</p>
        </div>
      </div>
    </div>
  );
} 