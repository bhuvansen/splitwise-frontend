"use client"

import { DeleteMemberModalType } from "@/utils/types"
import { useState } from "react"

export default function DeleteMemberModal({ onClose, deleteMemberHandler }: DeleteMemberModalType) {
    const [deleting, setDeleting] = useState(false)

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-sm p-6 space-y-4">
                <h2 className="text-lg font-medium">Delete confirmation</h2>
                <p>Are you sure you want to remove this member?</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm border rounded hover:bg-gray-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            setDeleting(true)
                            deleteMemberHandler()
                        }}
                        disabled={deleting}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-gray-800 cursor-pointer"
                    >
                        {deleting ? "Removing..." : "Remove"}
                    </button>
                </div>
            </div>
        </div>
    )
}
