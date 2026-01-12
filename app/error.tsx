"use client";


export default function GroupsError({
}: {
  error: Error & { digest?: string };
}) {
 

  return (
    <div className="px-6 pt-12 max-w-3xl">
      <h1 className="text-2xl font-semibold text-red-600 mb-4">
        Something went wrong
      </h1>

      <p className="text-gray-600 mb-6">
        We couldn’t load your account right now. Please try to login again or try again after sometime
      </p>

   
    </div>
  );
}
