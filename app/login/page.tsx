"use client";

// import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function LoginPage() {

  // const { status } = useSession();
  // const router = useRouter();

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     router.replace("/groups");
  //   }
  // }, [status, router]);

  // if (status === "loading") {
  //   return null; // or spinner
  // }

  // return (
  //   <div className="login-container">
  //     <div className="login-card">
  //       <h1 className="login-title">Sign in to Splitwise</h1>

  //       <button
  //         onClick={() => signIn("google")}
  //         className="google-btn"
  //       >
  //         Continue with Google
  //       </button>
  //     </div>
  //   </div>
  // );
// }



import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/groups");
    }
  }, [status, router]);

  if (status === "loading") {
    return null; // or spinner
  }

  return (
  <div className="min-h-screen px-6 pt-12">
  <div>
    <h1 className="text-3xl font-bold mb-6">
      Sign in to Splitwise
    </h1>

    <button
      onClick={() => signIn("google")}
      className="px-6 py-2 border rounded hover:bg-gray-100"
    >
      Continue with Google
    </button>
  </div>
</div>

  );
}

