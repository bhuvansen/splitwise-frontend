"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function AddMemberModal({
  groupId,
  onClose,
  onAdded,
}: {
  groupId: string;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function addMember() {
    try {
      setLoading(true);

      const res = await fetch(`/api/groups/${groupId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      toast.success("Member added");
      onAdded();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded p-6 w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold">Add Member</h2>

        <input
          type="email"
          placeholder="User email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={addMember}
            disabled={loading}
            className="text-sm px-4 py-2 border rounded bg-black text-white"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
