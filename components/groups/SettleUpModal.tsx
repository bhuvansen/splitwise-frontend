"use client"

import { useState } from "react"
import { createSettlement } from "@/lib/serverCall/groupDetailsPageCalls"
import { Member } from "./GroupDetailsClient"
import { toast } from "sonner"

type Props = {
    groupId: string
    balances: Record<string, number>
    pairwiseBalances: Record<string, number>
    members: Member[]
    currentUserId: string
    onClose: () => void
    onSettled: () => void
}

export default function SettleUpModal({
    groupId,
    balances,
    pairwiseBalances,
    members,
    currentUserId,
    onClose,
    onSettled,
}: Props) {
    const myBalance = balances[currentUserId]
    const creditors = members.filter((m) => pairwiseBalances[m.user.id] < 0)

    const [toUserId, setToUserId] = useState<string>(creditors[0]?.user.id || "")
    const [amount, setAmount] = useState<number>(0)
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
                                className="w-full border rounded p-2"
                                value={amount}
                                max={maxAmount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                            <p className="text-xs text-gray-500">Max: ₹{maxAmount}</p>
                        </>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button className="px-4 py-2 border rounded" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        disabled={loading || amount <= 0}
                        className="px-4 py-2 bg-green-600 text-white rounded"
                        onClick={handleSubmit}
                    >
                        {loading ? "Settling..." : "Settle"}
                    </button>
                </div>
            </div>
        </div>
    )
}
