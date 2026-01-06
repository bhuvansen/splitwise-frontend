"use client";

import { useEffect } from "react";

export default function GroupsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
 

  return (
    <div className="px-6 pt-12 max-w-3xl">
      <h1 className="text-2xl font-semibold text-red-600 mb-4">
        Something went wrong
      </h1>

      <p className="text-gray-600 mb-6">
        We couldn’t load your groups right now.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          Retry
        </button>

        <a
          href="/"
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
