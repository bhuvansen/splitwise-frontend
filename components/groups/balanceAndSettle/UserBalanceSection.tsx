import { UserBalanceSectionType } from "@/utils/types"

export default function UserBalanceSection({
    pairwiseBalances,
    members,
    currentUserId,
}: UserBalanceSectionType) {
    return (
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
                                        {amount > 0 ? `${member.user.name} owes you` : `You owe ${member.user.name}`}
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
    )
}
