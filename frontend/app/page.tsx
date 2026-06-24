import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8 text-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-800">
          Welcome to Cloud Log Access
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Access and manage your cloud log files securely and efficiently.
        </p>
        <div className="mt-10">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 hover:bg-blue-700"
          >
            Access Panel
          </Link>
        </div>
      </div>
    </main>
  );
}