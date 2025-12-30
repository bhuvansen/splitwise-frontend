import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export type Group = {
  id: string;
  name: string;
};

export async function getGroupPageProps(): Promise<{
  groups: Group[];
}> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Not authenticated");
  }

  const token = (session as any).accessToken;
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/groups`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch groups");
  }

  const groups = await res.json();

  return { groups };
}
