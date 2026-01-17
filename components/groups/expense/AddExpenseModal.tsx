"use client"

import { createExpense } from "@/lib/serverCall/groupDetailsPageCalls"
import { ExpenseModalType, SplitMode } from "@/utils/types"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function AddExpenseModal({ groupId, members, onClose, onCreated }: ExpenseModalType) {
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")
    const [paidBy, setPaidBy] = useState(members[0]?.user.id)
    const [loading, setLoading] = useState(false)

    const [splitMode, setSplitMode] = useState<SplitMode>("EQUAL")
    const [splits, setSplits] = useState<Record<string, number>>({})

    useEffect(() => {
        if (splitMode !== "EQUAL") return

        const total = Number(amount)
        if (!total || members.length === 0) return

        const perPerson = Number((total / members.length).toFixed(2))

        const next: Record<string, number> = {}
        members.forEach((m) => {
            next[m.user.id] = perPerson
        })

        setSplits(next)
    }, [amount, splitMode, members])

    async function handleSubmit() {
        try {
            setLoading(true)

            const totalSplit = Object.values(splits).reduce((a, b) => a + b, 0)

            if (Number(totalSplit.toFixed(2)) !== Number(amount)) {
                toast.error("Split total must equal expense amount")
                return
            }

            await createExpense({
                groupId,
                description,
                amount: Number(amount),
                paidByUserId: paidBy!,
                splits,
            })

            toast.success("Expense added")
            onCreated()
            onClose()
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to add expense")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold">Add Expense</h2>

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
                                            [member.user.id]: Number(((Number(amount) * percent) / 100).toFixed(2)),
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

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 border rounded">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-black text-white rounded">
                        {loading ? "Adding..." : "Add"}
                    </button>
                </div>
            </div>
        </div>
    )
}
