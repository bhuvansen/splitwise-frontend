"use client";

import { signOut, useSession } from "next-auth/react";

export default function UserMenu() {
  const { data } = useSession();

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">
        {data?.user?.email}
      </span>

      <button
        onClick={() => signOut()}
        className="text-sm text-red-600"
      >
        Logout
      </button>
    </div>
  );
}
