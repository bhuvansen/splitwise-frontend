"use client";

import { Expense } from "@/lib/serverCall/groupDetailsPageCalls";
import { GroupMember } from "@/lib/serverCall/groupDetailsPageCalls";

export default function ExpenseDetailsModal({
  expense,
  members,
  onClose,
}: {
  expense: Expense;
  members: GroupMember[];
  onClose: () => void;
}) {
  const payer = members.find(
    (m) => m.user.id === expense.paidByUserId
  )?.user.name;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Expense Details</h2>

        <div>
          <p className="font-medium">{expense.description}</p>
          <p className="text-sm text-gray-500">
            Paid by {payer}
          </p>
          <p className="font-semibold mt-1">
            ₹{expense.amount}
          </p>
        </div>

        <div className="border-t pt-3 space-y-2">
          <p className="text-sm font-medium">Split</p>

          {expense.splits.map((split) => {
            const name = members.find(
              (m) => m.user.id === split.userId
            )?.user.name;

            return (
              <div
                key={split.userId}
                className="flex justify-between text-sm"
              >
                <span>{name}</span>
                <span>₹{split.shareAmount}</span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
