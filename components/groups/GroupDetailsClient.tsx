"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import AddMemberModal from "./member/AddMemberModal"
import { deleteMemberFromGroup } from "@/lib/serverCall/groupDetailsPageCalls"
import Link from "next/link"
import { toast } from "sonner"
import DeleteMemberModal from "./member/DeleteMemberModal"
import ExpenseSection from "./expense/ExpenseSection"
import SettleUpModal from "./balanceAndSettle/SettleUpModal"
import UserBalanceSection from "./balanceAndSettle/UserBalanceSection"
import { GroupDetailsClientType } from "@/utils/types"

export default function GroupDetailsClient({
    groupId,
    members,
    expenses,
    settlements,
    currentEmailId,
}: GroupDetailsClientType) {
    const [showAdd, setShowAdd] = useState(false)
    const [showSettleModal, setShowSettleModal] = useState(false)
    const [showRemove, setShowRemove] = useState(false)
    const [memberUserId, setMemberUserId] = useState<string>("")
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

    const deleteHanlder = async () => {
        if (balances[memberUserId] !== 0) {
            toast.error("Cannot delete member, as the member is not settled up yet.")
            setShowRemove(false)
        } else {
            try {
                await deleteMemberFromGroup(groupId, memberUserId)
                router.refresh()
                toast.success("Member deleted successfully.")
                setShowRemove(false)
            } catch (error) {
                toast.error("Failed to delete member.")
                setShowRemove(false)
            }
        }
    }

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
                    <li key={member.id} className="flex flex-row justify-between">
                        <span className="font-medium">{member.user.name || "Unnamed"}</span>
                        {members.length > 1 && (
                            <button
                                className="text-sm text-red-600"
                                onClick={() => {
                                    setShowRemove(true)
                                    setMemberUserId(member.user.id)
                                }}
                            >
                                Remove
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            <UserBalanceSection pairwiseBalances={pairwiseBalances} members={members} currentUserId={currentUserId} />

            <button
                className={`px-4 py-2 rounded text-white ${
                    hasOutstandingPayments ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 !cursor-not-allowed"
                }`}
                disabled={!hasOutstandingPayments}
                onClick={() => setShowSettleModal(true)}
            >
                Settle up
            </button>

            <ExpenseSection groupId={groupId} members={members} expenses={expenses} currentUserId={currentUserId} />

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

            {showAdd && (
                <AddMemberModal groupId={groupId} onClose={() => setShowAdd(false)} onAdded={() => router.refresh()} />
            )}
            {showRemove && (
                <DeleteMemberModal onClose={() => setShowRemove(false)} deleteMemberHandler={deleteHanlder} />
            )}
            <Link href="/groups" className="text-sm text-gray-500 hover:font-bold mb-6 inline-block">
                ← Back to Groups
            </Link>
        </div>
    )
}
