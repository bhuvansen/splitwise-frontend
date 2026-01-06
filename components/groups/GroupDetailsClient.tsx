"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AddMemberModal from "./AddMemberModal"
import { Expense } from "@/lib/serverCall/groupDetailsPageCalls"
import Link from "next/link"
import AddExpenseModal from "./AddExpenseModal"

type Member = {
    id: string
    user: {
        id: string
        email: string
        name: string
    }
}

export default function GroupDetailsClient({
    groupId,
    members,
    expenses,
}: {
    groupId: string
    members: Member[]
    expenses: Expense[]
}) {
    const [showAdd, setShowAdd] = useState(false)
    const [showAddExpense, setShowAddExpense] = useState(false)

    const router = useRouter()

    return (
        <div className="px-6 pt-12 max-w-3xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Members</h1>

                <button onClick={() => setShowAdd(true)} className="text-sm border px-4 py-2 rounded hover:bg-gray-100">
                    + Add Member
                </button>
            </div>

            <ul className="space-y-3">
                {members.map((member) => (
                    <li key={member.id} className="border rounded p-4 flex flex-col">
                        <span className="font-medium">{member.user.name || "Unnamed"}</span>
                        <span className="text-sm text-gray-500">{member.user.email}</span>
                    </li>
                ))}
            </ul>
            {/* Expenses Section */}
            <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Expenses</h2>

                    <button className="text-sm border px-4 py-2 rounded hover:bg-gray-100" onClick={()=>setShowAddExpense(true)}>+ Add Expense</button>
                </div>

                {expenses.length === 0 ? (
                    <p className="text-sm text-gray-500">No expenses yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {expenses.map((e) => (
                            <li key={e.id} className="border rounded p-4 flex justify-between">
                                <div>
                                    <p className="font-medium">{e.description}</p>
                                    <p className="text-sm text-gray-500">Paid by {e.paidBy.name}</p>
                                </div>

                                <span className="font-semibold">₹{e.amount}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <Link href="/groups" className="text-sm text-gray-500 hover:font-bold mb-6 inline-block">
                ← Back to Groups
            </Link>
            {showAddExpense && (
            <AddExpenseModal
                groupId={groupId}
                members={members}
                onClose={() => setShowAddExpense(false)}
                onCreated={() => router.refresh()}
            />
            )}
            {showAdd && (
                <AddMemberModal groupId={groupId} onClose={() => setShowAdd(false)} onAdded={() => router.refresh()} />
            )}
        </div>
    )
}
