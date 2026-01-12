"use client"

import { useState } from "react"
import Link from "next/link"
import CreateGroupModal from "@/components/CreateGroupModal"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deleteGroup } from "@/lib/serverCall/groupPageCalls"
export type Group = {
    id: string
    name: string
}

export default function GroupsPageClient({ groups }: { groups: Group[] }) {
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()

    async function deleteGroupHandler(groupId: string) {
        try {
            await deleteGroup(groupId)

            toast.success("Group deleted")
            router.refresh()
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    return (
        <div className="px-6 pt-12 max-w-3xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Your Groups</h1>

                <button
                    onClick={() => setShowModal(true)}
                    className="text-sm border px-4 py-2 rounded hover:bg-gray-100"
                >
                    + Create Group
                </button>
            </div>

            <ul className="space-y-3">
                {groups.map((group) => (
                    <li key={group.id} className="flex items-center justify-between border rounded p-4">
                        <Link href={`/groups/${group.id}`} className=" hover:bg-gray-50">
                            {group.name}
                        </Link>
                        <button
                            onClick={() => deleteGroupHandler(group.id)}
                            className="text-sm text-red-600 hover:bg-gray-50"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <button onClick={() => router.push("/")} className="border mt-4 px-4 py-2 rounded">
                Back
            </button>
            {showModal && <CreateGroupModal onClose={() => setShowModal(false)} onCreated={() => router.refresh()} />}
        </div>
    )
}
