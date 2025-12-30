import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function getGroups() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Not authenticated");
  }

  const token = (session as any).accessToken;
  console.log("token::", token)
  const res = await fetch(`${BACKEND_URL}/groups`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  console.log("res::", res)
  if (!res.ok) {
    throw new Error("Failed to fetch groups");
  }

  return res.json();
}
