"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AddExpenseModal from "./AddExpenseModal"
import ExpenseDetailsModal from "./ExpenseDetailsModal"
import { Expense, ExpenseSectionType } from "@/utils/types"

export default function ExpenseSection({ groupId, members, expenses, currentUserId }: ExpenseSectionType) {
    const [showAddExpense, setShowAddExpense] = useState(false)
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
    const router = useRouter()
    return (
        <>
            <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Expenses</h2>

                    <button
                        className={`${
                            members.length < 2
                                ? "border px-4 py-2 rounded !cursor-not-allowed opacity-50"
                                : "text-sm border px-4 py-2 rounded hover:bg-gray-100"
                        }`}
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
                    onSave={() => router.refresh()}
                />
            )}
        </>
    )
}
