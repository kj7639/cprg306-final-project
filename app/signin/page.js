'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../_utils/auth-context';

export default function SignInPage() {
  const { signIn, googleSignIn } = useAuth() || {};
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      router.push('/'); // send to home after login
    } catch (err) {
      console.error('Sign in error', err);
      setError('Sign in failed — check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      await googleSignIn();
      router.push('/');
    } catch (err) {
      console.error('Google sign-in error', err);
      setError('Google sign-in failed.');
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
        <h1 className="text-2xl font-bold mb-4">Sign in</h1>

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
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="px-3 py-2 rounded bg-cyan-200" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

        {/* couldn't get google sign-in to work properly, so I just removed the button. */}
          {/* <button
            type="button"
            onClick={handleGoogle}
            className="px-3 py-2 rounded border"
            disabled={loading}
          >
            {loading ? 'Processing…' : 'Sign in with Google'}
          </button> */}

          {error && <p className="text-red-600">{error}</p>}
        </form>

        <p className="mt-4 text-sm">
          Don't have an account? <Link href="/signup" className="text-cyan-600">Sign up</Link>
        </p>
      </main>
    </div>
  );
}
