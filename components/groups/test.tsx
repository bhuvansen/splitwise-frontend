"use client"

import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { Expense, GroupMember } from "@/lib/serverCall/groupDetailsPageCalls"

type SplitMode = "EQUAL" | "PERCENTAGE" | "EXACT"

export default function ExpenseDetailsModal({
  groupId,
  expense,
  members,
  onClose,
}: {
  groupId: string
  expense: Expense
  members: GroupMember[]
  onClose: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [mode, setMode] = useState<SplitMode>("EXACT")

  const [description, setDescription] = useState(expense.description)
  const [amount, setAmount] = useState(expense.amount)

  /** Canonical source of truth */
  const [splitAmounts, setSplitAmounts] = useState<Record<string, number>>({})

  /** Derived percentages (only for UI) */
  const percentages = useMemo(() => {
    const result: Record<string, number> = {}
    members.forEach((m) => {
      result[m.user.id] = amount
        ? Math.round((splitAmounts[m.user.id] / amount) * 100)
        : 0
    })
    return result
  }, [splitAmounts, amount, members])

  /** Initialize from backend splits */
  useEffect(() => {
    const map: Record<string, number> = {}
    expense.splits.forEach((s) => {
      map[s.userId] = s.shareAmount
    })
    setSplitAmounts(map)
  }, [expense])

  /* ---------------- MODE HANDLERS ---------------- */

  const switchToEqual = () => {
    const perPerson = Math.floor(amount / members.length)
    const updated: Record<string, number> = {}

    members.forEach((m, idx) => {
      updated[m.user.id] =
        idx === 0
          ? amount - perPerson * (members.length - 1)
          : perPerson
    })

    setSplitAmounts(updated)
    setMode("EQUAL")
  }

  const switchToPercentage = () => {
    const updated: Record<string, number> = {}
    members.forEach((m) => {
      const pct = percentages[m.user.id] || 0
      updated[m.user.id] = Math.round((pct / 100) * amount)
    })
    setSplitAmounts(updated)
    setMode("PERCENTAGE")
  }

  const switchToExact = () => {
    setMode("EXACT")
  }

  /* ---------------- UPDATE HANDLERS ---------------- */

  const updateExact = (userId: string, value: number) => {
    setSplitAmounts((prev) => ({
      ...prev,
      [userId]: value,
    }))
  }

  const updatePercentage = (userId: string, pct: number) => {
    const newAmount = Math.round((pct / 100) * amount)
    updateExact(userId, newAmount)
  }

  const totalSplit = Object.values(splitAmounts).reduce((a, b) => a + b, 0)
  const isInvalid = totalSplit !== amount

  /* ---------------- SAVE ---------------- */

  const saveExpense = async () => {
    if (isInvalid) return

    await axios.put(`/api/groups/${groupId}/expenses/${expense.expenseId}`, {
      description,
      amount,
      paidByUserId: expense.paidByUserId,
      splits: Object.entries(splitAmounts).map(([userId, amt]) => ({
        userId,
        shareAmount: amt,
      })),
    })

    onClose()
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded p-6 w-full max-w-md space-y-4">

        <h2 className="text-lg font-semibold">
          {isEditing ? "Edit Expense" : "Expense Details"}
        </h2>

        {/* Description */}
        <input
          disabled={!isEditing}
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Amount */}
        <input
          disabled={!isEditing}
          type="number"
          className="w-full border p-2 rounded"
          value={amount}
          onChange={(e) => setAmount(+e.target.value)}
        />

        {/* Split Mode */}
        {isEditing && (
          <div className="flex gap-2 text-sm">
            <button onClick={switchToEqual} className="border px-2 py-1 rounded">
              Equal
            </button>
            <button onClick={switchToPercentage} className="border px-2 py-1 rounded">
              %
            </button>
            <button onClick={switchToExact} className="border px-2 py-1 rounded">
              Exact
            </button>
          </div>
        )}

        {/* Splits */}
        <div className="space-y-2 border-t pt-3">
          {members.map((m) => (
            <div key={m.user.id} className="flex justify-between items-center">
              <span>{m.user.name}</span>

              {mode === "PERCENTAGE" ? (
                <input
                  disabled={!isEditing}
                  type="number"
                  className="w-20 border p-1 text-right"
                  value={percentages[m.user.id] || 0}
                  onChange={(e) =>
                    updatePercentage(m.user.id, +e.target.value)
                  }
                />
              ) : (
                <input
                  disabled={!isEditing}
                  type="number"
                  className="w-20 border p-1 text-right"
                  value={splitAmounts[m.user.id] || 0}
                  onChange={(e) =>
                    updateExact(m.user.id, +e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>

        {isInvalid && (
          <p className="text-sm text-red-600">
            Split total must equal ₹{amount}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <button onClick={saveExpense} disabled={isInvalid} className="border px-4 py-2 rounded">
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className="border px-4 py-2 rounded">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="border px-4 py-2 rounded">
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
  )
}
