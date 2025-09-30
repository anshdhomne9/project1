'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.message || 'Login failed.');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-[var(--card-background)] backdrop-blur-lg rounded-2xl shadow-2xl border border-[var(--border-color)]">
        <div className="flex justify-center">
          <svg className="w-16 h-16 text-[var(--accent-primary)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-center text-[var(--text-primary)]">Welcome Back</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-[var(--text-secondary)]">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-[var(--text-primary)] bg-black/20 rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-[var(--text-secondary)]">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-[var(--text-primary)] bg-black/20 rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-[var(--accent-primary)] rounded-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[var(--accent-primary)] transition-transform duration-200 hover:scale-105">
            Login
          </button>
        </form>
        <p className="text-sm text-center text-[var(--text-secondary)]">
          Don't have an account? <Link href="/register" className="font-medium text-[var(--accent-primary)] hover:brightness-125 transition">Register here</Link>
        </p>
      </div>
    </div>
  );
}