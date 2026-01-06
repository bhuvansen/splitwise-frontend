"use client";

import { useState } from "react";
import Link from "next/link";
import CreateGroupModal from "@/components/CreateGroupModal";
import { useRouter } from "next/navigation";

export type Group = {
  id: string;
  name: string;
};

export default function GroupsPageClient({
  groups,
}: {
  groups: Group[];
}) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  async function deleteGroup(groupId: string) {
  const res = await fetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    alert("Failed to delete group");
    return;
  }

  router.refresh()
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
          <li key={group.id}
      className="flex items-center justify-between border rounded p-4"
          
          >
            <Link
              href={`/groups/${group.id}`}
              className=" hover:bg-gray-50"
            >
              {group.name}
            </Link>
            <button
        onClick={() => deleteGroup(group.id)}
        className="text-sm text-red-600 hover:bg-gray-50"
      >
        Delete
      </button>
          </li>
        ))}
      </ul>

      {showModal && (
        <CreateGroupModal onClose={() => setShowModal(false)} onCreated = {()=>router.refresh()} />
      )}
    </div>
  );
}
