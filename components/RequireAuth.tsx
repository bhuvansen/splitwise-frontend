"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
