"use client"

import { useState } from "react"
import { createSettlement } from "@/lib/serverCall/groupDetailsPageCalls"
import { toast } from "sonner"
import { SettleUpModalType } from "@/utils/types"



export default function SettleUpModal({
    groupId,
    balances,
    pairwiseBalances,
    members,
    currentUserId,
    onClose,
    onSettled,
}: SettleUpModalType) {
    const myBalance = balances[currentUserId]
    const creditors = members.filter((m) => pairwiseBalances[m.user.id] < 0)

    const [toUserId, setToUserId] = useState<string>(creditors[0]?.user.id || "")
    const [amount, setAmount] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)

    const [loading, setLoading] = useState(false)

    const amountOwed = pairwiseBalances[toUserId]

    const maxAmount = amountOwed < 0 ? Math.abs(amountOwed) : 0

    const handleSubmit = async () => {
        if (pairwiseBalances[toUserId] >= 0) {
            toast.error("You do not owe this user")
            return
        }

        try {
            setLoading(true)
            await createSettlement(groupId, { fromUserId: currentUserId, toUserId, amount })
            toast.success("Settlement done successfully")

            onSettled()
            onClose()
        } catch (err: any) {
            toast.error(err.message)

            alert("Failed to settle")
        } finally {
            setLoading(false)
        }
    }

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setAmount(Number(value))

        const numericValue = Number(value)

        if (!value || numericValue <= 0) {
            setError("Enter a valid amount")
            return
        }

        if (numericValue > maxAmount) {
            setError(`You only owe ₹${maxAmount}`)
            return
        }

        setError(null)
    }

    const isSettleDisabled = !amount || !!error || amount <= 0 || amount > maxAmount

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">Settle up</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm">Pay to</label>
                        <select
                            className="w-full border rounded p-2"
                            value={toUserId}
                            onChange={(e) => setToUserId(e.target.value)}
                        >
                            {creditors.map((m) => (
                                <option key={m.user.id} value={m.user.id}>
                                    {m.user.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm">Amount</label>
                        <>
                            <input
                                min={1}
                                max={maxAmount}
                                value={amount}
                                onChange={handleAmountChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder={`Max ₹${maxAmount}`}
                            />
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button className="px-4 py-2 border rounded" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className={`px-4 py-2 rounded text-white ${
                            isSettleDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                        }`}
                        disabled={isSettleDisabled}
                        onClick={handleSubmit}
                    >
                        {loading ? "Settling..." : "Settle"}
                    </button>
                </div>
            </div>
        </div>
    )
}
