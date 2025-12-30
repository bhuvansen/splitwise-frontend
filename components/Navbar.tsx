"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="navbar">
      <Link href="/" className="logo">
        Splitwise
      </Link>

      {status === "authenticated" && (
        <div className="nav-right">
          <span className="user-name">{session.user?.name}</span>
          <button onClick={() => signOut()} className="logout-btn">
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
