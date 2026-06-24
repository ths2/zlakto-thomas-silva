'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/auth.store';
import api from '@/src/lib/api';

interface LogFile {
  key: string;
  lastModified: string;
  size: number;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/logs');
        setLogs(response.data);
      } catch (err) {
        setError('Failed to fetch logs. Please try again later.');
        console.error('Failed to fetch logs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleDownload = async (key: string) => {
    try {
      const response = await api.get(`/logs/download/${encodeURIComponent(key)}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', key);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Could not download file.');
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between pb-4 border-b">
          <h1 className="text-3xl font-bold text-gray-800">Cloud Logs</h1>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </header>

        <main className="mt-8">
          {isLoading ? (
            <p className="text-center text-gray-600">Loading logs...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="overflow-x-auto rounded-lg bg-white shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      File
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Last Modified
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {logs.map((log) => (
                    <tr key={log.key}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{log.key}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{formatBytes(log.size)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(log.lastModified).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => handleDownload(log.key)}
                          className="rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}