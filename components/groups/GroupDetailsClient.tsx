"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import AddMemberModal from "./AddMemberModal"
import { Expense } from "@/lib/serverCall/groupDetailsPageCalls"
import Link from "next/link"
import AddExpenseModal from "./AddExpenseModal"
import ExpenseDetailsModal from "./ExpenseDetailsModal"
import SettleUpModal from "./SettleUpModal"

export type Member = {
    id: string
    user: {
        id: string
        email: string
        name: string
    }
}

type Settlement = {
    fromUserId: string
    toUserId: string
    amount: number
}

export default function GroupDetailsClient({
    groupId,
    members,
    expenses,
    settlements,
    currentEmailId,
}: {
    groupId: string
    members: Member[]
    expenses: Expense[]
    settlements: Settlement[]
    currentEmailId: string
}) {
    const [showAdd, setShowAdd] = useState(false)
    const [showAddExpense, setShowAddExpense] = useState(false)
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
    const [showSettleModal, setShowSettleModal] = useState(false)
    const router = useRouter()

    const currentUserId = members.find((m) => m.user.email === currentEmailId)?.user.id || ""

    const balances = useMemo(() => {
        const balanceMap: Record<string, number> = {}
        members.forEach((member) => {
            balanceMap[member.user.id] = 0
        })
        expenses.forEach((expense) => {
            const payer = expense.paidByUserId
            expense.splits.forEach((split) => {
                if (split.userId === payer) return

                // split user owes
                balanceMap[split.userId] -= split.shareAmount
                // payer should get
                balanceMap[payer] += split.shareAmount
            })
        })
        settlements.forEach((settlement) => {
            balanceMap[settlement.fromUserId] += settlement.amount
            balanceMap[settlement.toUserId] -= settlement.amount
        })

        return balanceMap
    }, [members, expenses, settlements])
    const pairwiseBalances = useMemo(() => {
        const map: Record<string, number> = {}

        members.forEach((member) => {
            if (member.user.id !== currentUserId) {
                map[member.user.id] = 0
            }
        })

        // Expenses
        expenses.forEach((expense) => {
            const payer = expense.paidByUserId

            expense.splits.forEach((split) => {
                if (split.userId === payer) return

                // Case 1: I paid, other owes me
                if (payer === currentUserId && split.userId !== currentUserId) {
                    map[split.userId] += split.shareAmount
                }

                // Case 2: Other paid, I owe them
                if (split.userId === currentUserId && payer !== currentUserId) {
                    map[payer] -= split.shareAmount
                }
            })
        })

        // Settlements
        settlements.forEach((s) => {
            // I paid someone
            if (s.fromUserId === currentUserId) {
                map[s.toUserId] += s.amount
            }

            // Someone paid me
            if (s.toUserId === currentUserId) {
                map[s.fromUserId] -= s.amount
            }
        })

        return map
    }, [members, expenses, settlements, currentUserId])
    const hasOutstandingPayments = Object.values(pairwiseBalances).some((amount) => amount < 0)
    return (
        <div className="px-6 pt-12 max-w-3xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Members</h1>

                <button onClick={() => setShowAdd(true)} className="text-sm border px-4 py-2 rounded hover:bg-gray-100">
                    + Add Member
                </button>
            </div>

            <ul className="border rounded p-4 space-y-3">
                {members.map((member) => (
                    <li key={member.id} className="flex flex-col">
                        <span className="font-medium">{member.user.name || "Unnamed"}</span>
                    </li>
                ))}
            </ul>

            <div className="border rounded p-4 mt-4 mb-4">
                <h2 className="font-semibold mb-3">Group Balance</h2>

                {Object.values(pairwiseBalances).every((v) => v === 0) ? (
                    <p className="text-sm text-gray-500">You are fully settled</p>
                ) : (
                    <ul className="space-y-2 text-sm">
                        {members
                            .filter((m) => m.user.id !== currentUserId)
                            .map((member) => {
                                const amount = pairwiseBalances[member.user.id]

                                if (amount === 0) return null

                                return (
                                    <li key={member.user.id} className="flex justify-between">
                                        <span>
                                            {amount > 0
                                                ? `${member.user.name} owes you`
                                                : `You owe ${member.user.name}`}
                                        </span>

                                        <span className={amount > 0 ? "text-green-600" : "text-red-600"}>
                                            ₹{Math.abs(amount)}
                                        </span>
                                    </li>
                                )
                            })}
                    </ul>
                )}
            </div>

            <button
                className={`px-4 py-2 rounded text-white ${
                    hasOutstandingPayments ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 !cursor-not-allowed"
                }`}
                disabled={!hasOutstandingPayments}
                onClick={() => setShowSettleModal(true)}
            >
                Settle up
            </button>

            {showSettleModal && (
                <SettleUpModal
                    groupId={groupId}
                    balances={balances}
                    pairwiseBalances={pairwiseBalances}
                    members={members}
                    currentUserId={currentUserId}
                    onClose={() => setShowSettleModal(false)}
                    onSettled={() => router.refresh()}
                />
            )}

            {/* Expenses Section */}
            <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Expenses</h2>

                    <button
                        className={`${members.length <2 ? "border px-4 py-2 rounded !cursor-not-allowed opacity-50" : "text-sm border px-4 py-2 rounded hover:bg-gray-100"}`}
                        onClick={() => setShowAddExpense(true)}
                        disabled={members.length === 0}
                    >
                        + Add Expense
                    </button>
                </div>

                {expenses.length === 0 ? (
                    <p className="text-sm text-gray-500">No expenses yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {expenses.map((expense) => {
                            const isPayer = expense.paidByUserId === currentUserId

                            let personalAmount: number | null = null
                            let label = ""

                            if (isPayer) {
                                // You paid → others owe you
                                personalAmount = expense.splits
                                    .filter((s) => s.userId !== currentUserId)
                                    .reduce((sum, s) => sum + s.shareAmount, 0)

                                label = "You get"
                            } else {
                                // You owe
                                const mySplit = expense.splits.find((s) => s.userId === currentUserId)

                                if (mySplit) {
                                    personalAmount = mySplit.shareAmount
                                    label = "You owe"
                                }
                            }

                            return (
                                <li
                                    key={expense.expenseId}
                                    className="border rounded p-4 cursor-pointer hover:bg-gray-50"
                                    onClick={() => setSelectedExpense(expense)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{expense.description}</p>

                                            {personalAmount !== null && (
                                                <p
                                                    className={`text-sm ${
                                                        label === "You owe" ? "text-red-600" : "text-green-600"
                                                    }`}
                                                >
                                                    {label} ₹{personalAmount}
                                                </p>
                                            )}
                                        </div>

                                        <span className="font-semibold">₹{expense.amount}</span>
                                    </div>
                                </li>
                            )
                        })}
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
            {selectedExpense && (
                <ExpenseDetailsModal
                    expense={selectedExpense}
                    members={members}
                    onClose={() => setSelectedExpense(null)}
                    // groupId={groupId}
                    onSave={() => router.refresh()}
                />
            )}

            {showAdd && (
                <AddMemberModal groupId={groupId} onClose={() => setShowAdd(false)} onAdded={() => router.refresh()} />
            )}
        </div>
    )
}
