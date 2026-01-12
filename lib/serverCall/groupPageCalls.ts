import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type Group = {
  id: string;
  name: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function getGroupPageProps(): Promise<{
  groups: Group[];
}> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Not authenticated");
  }

  const token = (session as any).accessToken;

  const res = await fetch(`${BACKEND_URL}/groups`, {
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

export async function createGroup(name: string): Promise<Group> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Not authenticated");
  }

  const token = (session as any).accessToken;

  const res = await fetch(`${BACKEND_URL}/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error("Failed to create group");
  }

  return res.json();
}


export async function deleteGroup(groupId: string): Promise<void> {
  try{
   const res = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete group");
      }
  }catch(err:any){
    throw new Error(err.message || "Something went wrong");
  }
}