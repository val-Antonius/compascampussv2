'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('student');
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Compass Campus</h1>
          <p className="text-gray-600 mt-2">Sistem Akademik Terpadu</p>
        </div>
        
        {/* Tab untuk memilih jenis login */}
        <div className="flex border-b mb-6">
          <button
            className={`flex-1 py-3 font-medium ${
              activeTab === 'student'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('student')}
          >
            Mahasiswa
          </button>
          <button
            className={`flex-1 py-3 font-medium ${
              activeTab === 'admin'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('admin')}
          >
            Admin
          </button>
        </div>
        
        {/* Konten tab */}
        <div className="mt-6">
          <LoginForm isAdmin={activeTab === 'admin'} />
        </div>
      </div>
    </div>
  );
}

function LoginForm({ isAdmin }) {
  const router = useRouter();
  const { login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(username, password);
      
      if (!result.success) {
        setError(result.message || 'Login gagal. Silakan cek username dan password Anda.');
        return;
      }
      
      // Redirect ke halaman yang sesuai berdasarkan role
      if (isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Masukkan username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        className={`w-full ${isAdmin ? 'bg-red-800 hover:bg-red-900' : 'bg-red-600 hover:bg-red-700'} text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200`}
        disabled={loading}
      >
        {loading ? 'Memproses...' : isAdmin ? 'Masuk sebagai Admin' : 'Masuk sebagai Mahasiswa'}
      </button>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Belum memiliki akun?{' '}
          <Link href="/register" className="text-red-600 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
      
      <div className="mt-2 text-center text-sm">
        <Link href="/forgot-password" className="text-red-600 hover:underline">
          Lupa password?
        </Link>
      </div>
    </form>
  );
} 