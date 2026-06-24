'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/auth.store';
import api from '@/src/lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const { access_token } = response.data;
      setToken(access_token);
              router.push('/logs');
            } catch (err) {
              setError('Invalid username or password.');
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-md"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Cloud Log Access
        </h1>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none"
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:outline-none"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
                {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}