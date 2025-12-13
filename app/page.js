'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from './_utils/auth-context';

import Searchbar from './components/searchbar';

export default function HomePage() {
  const { user, logOut } = useAuth() || {};
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simple initial load: fetch a small list of popular/fiction books
  async function fetchTopBooks() {
    setLoading(true);
    try {
      const res = await fetch(
        'https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=12'
      );
      const data = await res.json();
      setBooks(data.items || []);
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTopBooks();
  }, []);

  return (
    <div>
      <header className="w-full border-b py-4 px-6 flex items-center justify-between">
        <div>
          <Link href="/" className="font-bold text-lg">
            Booksio
          </Link>
        </div>
        <Searchbar/>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <p className="text-sm text-gray-600">Hello, {user.displayName || user.email}</p>
              <button
                onClick={async () => {
                  try {
                    await logOut();
                  } catch (err) {
                    console.error('Logout error', err);
                  }
                }}
                className="text-sm text-cyan-600 hover:underline"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
            <Link href="/signin" className="text-sm text-cyan-600 hover:underline">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm text-cyan-600 hover:underline">
              Sign Up
            </Link>
            </>
          )}
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Discover books</h1>
          <div>
            {user ? (
              <p className="text-sm text-gray-600">Signed in as {user.displayName || user.email}</p>
            ) : (
              <p className="text-sm text-gray-600">Sign in to write reviews</p>
            )}
          </div>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-3">Top picks</h2>
          {loading ? (
            <p>Loading books…</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {books.map((b) => {
                const info = b.volumeInfo || {};
                const thumb = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '';
                return (
                  <article key={b.id} className="border p-3 rounded">
                    {thumb ? (
                      <img src={thumb} alt={info.title} className="w-full h-40 object-cover mb-2" />
                    ) : (
                      <div className="w-full h-40 bg-gray-100 mb-2 flex items-center justify-center">No image</div>
                    )}
                    <h3 className="font-medium">{info.title}</h3>
                    <p className="text-sm text-gray-600">{(info.authors || []).join(', ')}</p>
                    <div className="mt-2">
                      {/* placeholder link to future book detail page */}
                      <Link href={`/book/${b.id}`} className="text-sm text-cyan-600 hover:underline">
                        View details
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
