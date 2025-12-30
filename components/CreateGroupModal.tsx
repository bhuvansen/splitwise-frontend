"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
}

export default function CreateGroupModal({ onClose }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // later → backend call
    console.log("Creating group:", name);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          Create Group
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">
              Group name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Goa Trip"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 border rounded hover:bg-gray-100 text-sm"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
