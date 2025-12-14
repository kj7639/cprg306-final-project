"use client"

import Link from "next/link";

import Searchbar from "./searchbar";
import { useAuth } from '../_utils/auth-context';

export default function Header(){
      const { user, logOut } = useAuth() || {};
    

    return (
        <header className="w-full border-b py-4 px-6 flex items-center justify-between">
                <div>
                  <Link href="../" className="font-bold text-lg">
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
                    <Link href="../signin" className="text-sm text-cyan-600 hover:underline">
                      Sign In
                    </Link>
                    <Link href="../signup" className="text-sm text-cyan-600 hover:underline">
                      Sign Up
                    </Link>
                    </>
                  )}
                </div>
              </header>
    )
}