'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
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
      console.log('Login admin:', { email, password });
      
      // Simulasi login berhasil dan redirect ke dashboard admin
      // setTimeout(() => {
      //   router.push('/admin/dashboard');
      // }, 1500);
    } catch (err) {
      setError('Terjadi kesalahan saat login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-white">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-gray-400 mt-2">Compass Campus Management System</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="email">
              Email Admin
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              placeholder="admin@campus.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md text-sm border border-red-700">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk ke Sistem Admin'}
          </button>
          
          <div className="mt-6 flex justify-between text-sm">
            <Link href="/forgot-password" className="text-indigo-400 hover:text-indigo-300">
              Lupa password?
            </Link>
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
              Kembali ke Login Utama
            </Link>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-xs text-gray-500">
          <p>© 2025 Compass Campus. All rights reserved.</p>
          <p className="mt-1">Hanya untuk pengguna yang berwenang.</p>
        </div>
      </div>
    </div>
  );
} 