'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../_utils/auth-context';

export default function SignUpPage() {
  const { signUp } = useAuth() || {};
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      router.push('/');
    } catch (err) {
      console.error('Sign up error', err);
      setError('Sign up failed — try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <header className="w-full border-b py-4 px-6 flex items-center justify-between">
        <div>
          <Link href="/" className="font-bold text-lg">
            Booksio
          </Link>
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create an account</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="px-3 py-2 border rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="px-3 py-2 border rounded"
            placeholder="Password (6+ chars)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="px-3 py-2 rounded bg-cyan-200" type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </button>

          {error && <p className="text-red-600">{error}</p>}
        </form>

        <p className="mt-4 text-sm">
          Already have an account? <Link href="/signin" className="text-cyan-600">Sign in</Link>
        </p>
      </main>
    </div>
  );
}
