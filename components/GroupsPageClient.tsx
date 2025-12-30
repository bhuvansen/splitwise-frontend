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
          <li key={group.id}>
            <Link
              href={`/groups/${group.id}`}
              className="block border rounded p-4 hover:bg-gray-50"
            >
              {group.name}
            </Link>
          </li>
        ))}
      </ul>

      {showModal && (
        <CreateGroupModal onClose={() => setShowModal(false)} onCreated = {()=>router.refresh()} />
      )}
    </div>
  );
}
