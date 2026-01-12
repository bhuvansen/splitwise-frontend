"use client"

import { deleteGroup } from "@/lib/serverCall/groupPageCalls"
import { useState } from "react"
import { toast } from "sonner"

interface Props {
    onClose: () => void
    onDeleted: () => void
    groupId: string
}

export default function DeleteModal({ onClose, onDeleted, groupId }: Props) {
    const [deleting, setDeleting] = useState(false)
    const deleteGroupHandler = async (groupId: string) => {
        setDeleting(true)
        try {
            await deleteGroup(groupId)

            toast.success("Group deleted")
            onDeleted()
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-sm p-6 space-y-4">
                <h2 className="text-lg font-medium">Delete confirmation</h2>
                <p>Are you sure you want to delete this group? This action cannot be undone.</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm border rounded hover:bg-gray-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => deleteGroupHandler(groupId)}
                        disabled={deleting}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-gray-800 cursor-pointer"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    )
}
