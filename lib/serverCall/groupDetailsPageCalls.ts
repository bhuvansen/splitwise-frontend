import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import axios from "axios"

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

export type ExpenseSplit = {
    userId: string
    shareAmount: number
}

export type Expense = {
    expenseId: string
    description: string
    amount: number
    paidByUserId: string
    createdAt: string // Instant → string in JSON
    splits: ExpenseSplit[]
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
    groupId: string
    description: string
    amount: number
    paidByUserId: string
    splits: Record<string, number>
}) {
    const res = await axios.post("/api/expenses", payload)
    return res.data
}

export async function getSettlements(groupId: string) {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("Not authenticated")

    const token = (session as any).accessToken

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/${groupId}/settlements`, {
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

export async function createSettlement(
    groupId: string,
    payload: {
        fromUserId: string
        toUserId: string
        amount: number
    }
) {
    try {
        await axios.post(`/api/groups/${groupId}/settlements`, payload)
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong")
    }
}

export async function updateExpense(
    expenseId: string,
    payload: {
        amount: number
        description: string
        paidByUserId: string
        splits: { userId: string; shareAmount: number }[]
    }
) {
    try {
        const res = await axios.put(`/api/expenses/${expenseId}`, payload)
        return res.data
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong")
    }
}


export async function deleteExpense(expenseId: string) {
    try {
        await axios.delete(`/api/expenses/${expenseId}`)
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong")
    }   
}

export async function deleteMemberFromGroup(groupId: string, memberId: string) {
    try {
        await axios.delete(`/api/groups/${groupId}/members/${memberId}`)
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong")
    }   
}
