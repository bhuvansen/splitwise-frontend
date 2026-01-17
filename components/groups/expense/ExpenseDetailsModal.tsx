"use client"

import { deleteExpense,  updateExpense } from "@/lib/serverCall/groupDetailsPageCalls"
import { ExpenseDetailsModalType, SplitMode } from "@/utils/types"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ExpenseDetailsModal({
    expense,
    members,
    onClose,
    onSave,
}:ExpenseDetailsModalType) {
    const [isEditing, setIsEditing] = useState(false)
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")
    const [paidBy, setPaidBy] = useState(members[0]?.user.id)
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [splitMode, setSplitMode] = useState<SplitMode>("EQUAL")
    const [splits, setSplits] = useState<Record<string, number>>({})
    const payer = members.find((m) => m.user.id === expense.paidByUserId)?.user.name

    useEffect(() => {
        if (isEditing) {
            if (splitMode !== "EQUAL") return

            const total = Number(amount)
            if (!total || members.length === 0) return

            const perPerson = Number((total / members.length).toFixed(2))

            const next: Record<string, number> = {}
            members.forEach((m) => {
                next[m.user.id] = perPerson
            })

            setSplits(next)
        }
    }, [amount, splitMode, members])

    const enterEditMode = () => {
        setIsEditing(true)

        setDescription(expense.description)
        setAmount(String(expense.amount))
        setPaidBy(expense.paidByUserId)

        // build exact split map from expense
        const nextSplits: Record<string, number> = {}
        expense.splits.forEach((s) => {
            nextSplits[s.userId] = s.shareAmount
        })
        setSplits(nextSplits)

        // infer split mode
        const total = expense.amount
        const equalShare = Number((total / members.length).toFixed(2))

        const isEqual = expense.splits.every((s) => Number(s.shareAmount.toFixed(2)) === equalShare)

        if (isEqual) {
            setSplitMode("EQUAL")
        } else {
            // default to EXACT for safety (percentage cannot be inferred reliably)
            setSplitMode("EXACT")
        }
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const payload = {
                amount: Number(amount),
                description,
                paidByUserId: paidBy,
                splits: Object.entries(splits).map(([userId, shareAmount]) => ({
                    userId,
                    shareAmount,
                })),
            }

            await updateExpense(expense.expenseId, payload)
            toast.success("Expense updated")
            onSave()
            onClose()
            setIsEditing(false)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add expense")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setDeleteLoading(true)
        try {
            await deleteExpense(expense.expenseId)
            toast.success("Expense deleted")
            onSave()
            onClose()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete expense")
        } finally {
            setDeleteLoading(false)
        }
    }
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded p-6 w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold">Expense Details</h2>
                {!isEditing ? (
                    <div>
                        <div>
                            <p className="font-medium">{expense.description}</p>
                            <p className="text-sm text-gray-500">Paid by {payer}</p>
                            <p className="font-semibold mt-1">₹{expense.amount}</p>
                        </div>

                        <div className="border-t pt-3 space-y-2">
                            <p className="text-sm font-medium">Split</p>

                            {expense.splits.map((split) => {
                                const name =
                                    members.find((m) => m.user.id === split.userId)?.user.name || "Unknown user"

                                return (
                                    <div key={split.userId} className="flex justify-between text-sm">
                                        <span>{name}</span>
                                        <span>₹{split.shareAmount}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <input
                            placeholder="Description"
                            className="w-full border p-2 rounded"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <input
                            placeholder="Amount"
                            type="number"
                            className="w-full border p-2 rounded"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />

                        <select
                            className="w-full border p-2 rounded"
                            value={paidBy}
                            onChange={(e) => setPaidBy(e.target.value)}
                        >
                            {members.map((member) => (
                                <option key={member.user.id} value={member.user.id}>
                                    Paid by {member.user.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex gap-2 text-sm">
                            {(["EQUAL", "PERCENT", "EXACT"] as SplitMode[]).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setSplitMode(mode)}
                                    className={`px-3 py-1 border rounded ${splitMode === mode ? "bg-gray-100" : ""}`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-2">
                            {members.map((member) => (
                                <div key={member.user.id} className="flex items-center justify-between">
                                    <span>{member.user.name}</span>

                                    {splitMode === "EQUAL" && (
                                        <span className="text-sm text-gray-500">₹{splits[member.user.id] ?? 0}</span>
                                    )}

                                    {splitMode === "PERCENT" && (
                                        <input
                                            type="number"
                                            placeholder="%"
                                            className="w-20 border rounded px-2 py-1 text-sm"
                                            onChange={(e) => {
                                                const percent = Number(e.target.value)
                                                setSplits((prev) => ({
                                                    ...prev,
                                                    [member.user.id]: Number(
                                                        ((Number(amount) * percent) / 100).toFixed(2),
                                                    ),
                                                }))
                                            }}
                                        />
                                    )}

                                    {splitMode === "EXACT" && (
                                        <input
                                            type="number"
                                            placeholder="₹"
                                            className="w-20 border rounded px-2 py-1 text-sm"
                                            value={splits[member.user.id] ?? ""}
                                            onChange={(e) =>
                                                setSplits((prev) => ({
                                                    ...prev,
                                                    [member.user.id]: Number(e.target.value),
                                                }))
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex justify-between">
                    <div>
                        <button className="border px-4 py-2 bg-red-600 text-white rounded" onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                    <div className="flex justify-end gap-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="border px-4 py-2 bg-black text-white rounded"
                                    disabled={loading}
                                >
                                    {!loading ? "Save" : "Saving..."}
                                </button>
                                <button onClick={() => setIsEditing(false)} className="border px-4 py-2 rounded">
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={enterEditMode}
                                    className="border px-4 py-2 bg-black text-white rounded"
                                >
                                    Edit
                                </button>
                                <button onClick={onClose} className="border px-4 py-2 rounded">
                                    Close
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
