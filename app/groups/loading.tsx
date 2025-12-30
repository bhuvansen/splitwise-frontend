export default function GroupsLoading() {
  return (
    <div className="px-6 pt-12 max-w-3xl animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="h-8 w-32 bg-gray-200 rounded" />
      </div>

      {/* Group list */}
      <ul className="space-y-3">
        {[1, 2, 3].map((i) => (
          <li key={i}>
            <div className="rounded bg-gray-300  p-4">
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
