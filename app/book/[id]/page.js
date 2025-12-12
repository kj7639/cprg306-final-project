'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../_utils/auth-context';
import { useParams } from 'next/navigation';

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  setDoc,
} from 'firebase/firestore';

import { db } from '../../_utils/firebase';

export default function BookDetailsPage() {
  const { user, logOut } = useAuth() || {};
  const params = useParams();
  const bookId = params.id;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');

  // Fetch book from Google Books
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

  // Ensure parent document exists and listen to reviews
  useEffect(() => {
    if (!bookId) return;

    const setupAndListen = async () => {
      // Ensure parent doc exists
      const parentRef = doc(db, 'reviews', String(bookId));
      await setDoc(parentRef, { exists: true }, { merge: true });

      // Listen to subcollection
      const q = query(
        collection(db, 'reviews', String(bookId), 'reviewDocs'),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const revs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(revs);
      });

      return unsubscribe;
    };

    const unsubscribePromise = setupAndListen();

    return () => {
      unsubscribePromise.then(unsub => unsub && unsub());
    };
  }, [bookId]);

  // Add review to Firestore
  const handleAddReview = async () => {
    if (!reviewText.trim() || !user) return;

    try {
      await addDoc(collection(db, 'reviews', String(bookId), 'reviewDocs'), {
        user: user.displayName || user.email,
        text: reviewText.trim(),
        timestamp: Timestamp.now(),
      });
      setReviewText('');
    } catch (err) {
      console.error('Error adding review', err);
    }
  };

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

      <p className="text-gray-600 mb-2">
        <strong>Authors:</strong> {(info.authors || []).join(', ')}
      </p>

      {info.publishedDate && (
        <p className="text-gray-600 mb-2">
          <strong>Published:</strong> {info.publishedDate}
        </p>
      )}

      {info.publisher && (
        <p className="text-gray-600 mb-2">
          <strong>Publisher:</strong> {info.publisher}
        </p>
      )}

      {info.description && <p className="mt-4">{info.description}</p>}

      {info.categories && (
        <p className="mt-2 text-gray-600">
          <strong>Categories:</strong> {info.categories.join(', ')}
        </p>
      )}

      {info.pageCount && (
        <p className="mt-2 text-gray-600">
          <strong>Pages:</strong> {info.pageCount}
        </p>
      )}

      {/* Review Section */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Reviews</h2>

        {user ? (
          <div className="mb-4">
            <textarea
              className="w-full border p-2 rounded mb-2"
              rows={3}
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button
              onClick={handleAddReview}
              className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
            >
              Add Review
            </button>
          </div>
        ) : (
          <p className="text-gray-600">Sign in to add a review.</p>
        )}

        <div>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="border-b py-2">
                <p className="text-sm font-medium">{r.user}</p>
                <p>{r.text}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
