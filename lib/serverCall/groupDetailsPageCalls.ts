import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import axios from "axios";

export type GroupMember = {
    id: string
    user: {
        id: string
        email: string
        name: string
    }
}

export async function getGroupDetailsPageProps(groupId: string) {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("Not authenticated")

    const token = (session as any).accessToken
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/${groupId}/members`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    })

    if (!res.ok) {
        throw new Error("Failed to load members")
    }

    const members = await res.json()

    return { members }
}

export type Expense = {
    id: string
    description: string
    amount: number
    paidBy: {
        id: string
        name: string
    }
}

export async function getGroupExpenses(groupId: string) {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("Not authenticated")

    const token = (session as any).accessToken

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/${groupId}/expenses`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    })

    if (!res.ok) {
        throw new Error("Failed to fetch expenses")
    }

    return res.json()
}


export async function createExpense(payload: {
  groupId: string;
  description: string;
  amount: number;
  paidByUserId: string;
  splits: Record<string, number>;
}) {
  const res = await axios.post("/api/expenses", payload);
  return res.data;
}
