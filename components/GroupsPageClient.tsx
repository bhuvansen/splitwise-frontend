"use client"

import { useState } from "react"
import Link from "next/link"
import CreateGroupModal from "@/components/CreateGroupModal"
import { useRouter } from "next/navigation"
import DeleteModal from "./DeleteModal"

export type Group = {
    id: string
    name: string
}

export default function GroupsPageClient({ groups }: { groups: Group[] }) {
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [groupId, setGroupId] = useState<string>("")
    const router = useRouter()

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

            {groups.length > 0 ? (
                <ul className="space-y-3">
                    {groups.map((group) => (
                        <li key={group.id} className="flex items-center justify-between border rounded p-4">
                            <Link href={`/groups/${group.id}`} className=" hover:bg-gray-50">
                                {group.name}
                            </Link>
                            <button
                                onClick={() => {
                                    setGroupId(group.id)
                                    setShowDeleteModal(true)
                                }}
                                className="text-sm text-red-600 hover:bg-gray-50"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">You are not part of any groups yet.</p>
            )}
            <button onClick={() => router.push("/")} className="border mt-4 px-4 py-2 rounded">
                Back
            </button>
            {showModal && <CreateGroupModal onClose={() => setShowModal(false)} onCreated={() => router.refresh()} />}
            {showDeleteModal && (
                <DeleteModal
                    onClose={() => setShowDeleteModal(false)}
                    onDeleted={() => {
                        router.refresh()
                        setShowDeleteModal(false)
                    }}
                    groupId={groupId}
                />
            )}
        </div>
    )
}
