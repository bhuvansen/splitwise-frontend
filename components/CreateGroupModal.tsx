// "use client"

// import { useState } from "react"

// interface Props {
//     onClose: () => void
// }

// export default function CreateGroupModal({ onClose }: Props) {
//     const [name, setName] = useState("")

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()

//         console.log("Creating group:", name)
//         await fetch("/api/groups", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ name }),
//         })

//         onClose()
//     }

//     return (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg w-full max-w-md p-6">
//                 <h2 className="text-lg font-semibold mb-4">Create Group</h2>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label className="block text-sm mb-1">Group name</label>
//                         <input
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             className="w-full border rounded px-3 py-2"
//                             placeholder="e.g. Goa Trip"
//                             required
//                         />
//                     </div>

//                     <div className="flex justify-end gap-3">
//                         <button type="button" onClick={onClose} className="px-4 py-2 text-sm">
//                             Cancel
//                         </button>

//                         <button type="submit" className="px-4 py-2 border rounded hover:bg-gray-100 text-sm">
//                             Create
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }

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
