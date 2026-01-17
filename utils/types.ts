import {} from "@/lib/serverCall/groupDetailsPageCalls"

export type SettleUpModalType = {
    groupId: string
    balances: Record<string, number>
    pairwiseBalances: Record<string, number>
    members: GroupMember[]
    currentUserId: string
    onClose: () => void
    onSettled: () => void
}
export type UserBalanceSectionType = {
    pairwiseBalances: Record<string, number>
    members: GroupMember[]
    currentUserId: string
}

export type ExpenseModalType = {
    groupId: string
    members: GroupMember[]
    onClose: () => void
    onCreated: () => void
}

export type ExpenseDetailsModalType = {
    expense: Expense
    members: GroupMember[]
    onClose: () => void
    onSave: () => void
}
export type ExpenseSectionType = {
    groupId: string
    members: GroupMember[]
    expenses: Expense[]
    currentUserId: string
}
export type GroupDetailsClientType = {
    groupId: string
    members: GroupMember[]
    expenses: Expense[]
    settlements: Settlement[]
    currentEmailId: string
}
export type Settlement = {
    fromUserId: string
    toUserId: string
    amount: number
}
export type ExpenseSplit = {
    userId: string
    shareAmount: number
}

export type Expense = {
    expenseId: string
    description: string
    amount: number
    paidByUserId: string
    createdAt: string
    splits: ExpenseSplit[]
}

export type GroupMember = {
    id: string
    user: {
        id: string
        email: string
        name: string
    }
}

export type AddMemberModalType = {
    groupId: string
    onClose: () => void
    onAdded: () => void
}
export type DeleteMemberModalType = {
    onClose: () => void
    deleteMemberHandler: () => void
}
export type SplitMode = "EQUAL" | "PERCENT" | "EXACT"
