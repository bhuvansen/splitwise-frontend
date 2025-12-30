import DashboardCard from "@/components/DashboardCard";

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        Dashboard
      </h1>

      <div className="grid gap-4">
        <DashboardCard
          title="Your Groups"
          description="View and manage your expense groups"
          href="/groups"
        />

        <DashboardCard
          title="Create Group"
          description="Start a new group and add friends"
          href="/groups/create"
        />
      </div>
    </div>
  );
}
