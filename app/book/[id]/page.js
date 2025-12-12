'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../_utils/auth-context';
import { useParams, useRouter } from 'next/navigation';

export default function BookDetailsPage() {
  const { user, logOut } = useAuth() || {};
  const params = useParams();
  const bookId = params.id;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchBook() {
    setLoading(true);
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
      const data = await res.json();
      setBook(data);
    } catch (err) {
      console.error('Failed to fetch book', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  if (loading) return <p className="p-6">Loading book details…</p>;
  if (!book) return <p className="p-6">Book not found.</p>;

  const info = book.volumeInfo || {};
  const thumb = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '';

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="w-full border-b py-4 px-6 flex items-center justify-between">
        <div>
          <Link href="/" className="font-bold text-lg">
            Back
          </Link>
        </div>
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
      <h1 className="text-3xl font-bold mb-4">{info.title}</h1>
      {thumb && <img src={thumb} alt={info.title} className="w-64 h-auto mb-4" />}
      <p className="text-gray-600 mb-2"><strong>Authors:</strong> {(info.authors || []).join(', ')}</p>
      {info.publishedDate && <p className="text-gray-600 mb-2"><strong>Published:</strong> {info.publishedDate}</p>}
      {info.publisher && <p className="text-gray-600 mb-2"><strong>Publisher:</strong> {info.publisher}</p>}
      {info.description && <p className="mt-4">{info.description}</p>}
      {info.categories && <p className="mt-2 text-gray-600"><strong>Categories:</strong> {info.categories.join(', ')}</p>}
      {info.pageCount && <p className="mt-2 text-gray-600"><strong>Pages:</strong> {info.pageCount}</p>}
    </div>
  );
}
