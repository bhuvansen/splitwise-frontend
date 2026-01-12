"use client"

import { useState } from "react"

interface Props {
    onClose: () => void
    onCreated: () => void;
}

export default function CreateGroupModal({ onClose, onCreated }: Props) {
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleCreate() {
        if (!name.trim()) return

        setLoading(true)
        try {
            await fetch("/api/groups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            })
            setLoading(false)
            onCreated()
            onClose()
        } catch (e) {
            setLoading(false)
            alert("Failed to create group")
        } 
    }

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-sm p-6 space-y-4">
                <h2 className="text-lg font-medium">Create Group</h2>

                <input
                    type="text"
                    placeholder="Group name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm border rounded hover:bg-gray-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 cursor-pointer"
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    )
}
