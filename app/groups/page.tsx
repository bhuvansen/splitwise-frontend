// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import CreateGroupModal from "@/components/CreateGroupModal";

// const mockGroups = [
//   { id: 1, name: "Goa Trip" },
//   { id: 2, name: "Flat Expenses" },
// ];

// export default function GroupsPage() {
//   const [showModal, setShowModal] = useState(false);

//   return (
//     <div className="px-6 pt-12 max-w-3xl">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-semibold">Your Groups</h1>

//         <button
//           onClick={() => setShowModal(true)}
//           className="text-sm border px-4 py-2 rounded hover:bg-gray-100"
//         >
//           + Create Group
//         </button>
//       </div>

//       <ul className="space-y-3">
//         {mockGroups.map((group) => (
//           <li key={group.id}>
//             <Link
//               href={`/groups/${group.id}`}
//               className="block border rounded p-4 hover:bg-gray-50"
//             >
//               {group.name}
//             </Link>
//           </li>
//         ))}
//       </ul>

//       {showModal && (
//         <CreateGroupModal
//           onClose={() => setShowModal(false)}
//         />
//       )}
//     </div>
//   );
// }
import GroupsPageClient from "@/components/GroupsPageClient";
import { getGroupPageProps } from "@/lib/serverCall/getGroupPageProps";

export default async function GroupsPage() {
  const { groups } = await getGroupPageProps();

  return <GroupsPageClient groups={groups} />;
}
