'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from './firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

const AuthContext = createContext({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  googleSignIn: async () => {},
  logOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function signUp(email, password) {
    if (!auth) throw new Error('Firebase auth not initialized');
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function signIn(email, password) {
    if (!auth) throw new Error('Firebase auth not initialized');
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function googleSignIn() {
    if (!auth) throw new Error('Firebase auth not initialized');
    return signInWithPopup(auth, googleProvider);
  }

  async function logOut() {
    if (!auth) throw new Error('Firebase auth not initialized');
    return signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
