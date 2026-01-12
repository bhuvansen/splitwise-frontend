import DashboardCard from "@/components/DashboardCard"
import { getOverallBalances } from "@/lib/serverCall/dashboardCalls"

export default async function HomePage() {
  const balances = await getOverallBalances()

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        Dashboard
      </h1>

      <div className="grid gap-4 mb-8">
        <DashboardCard
          title="Your Groups"
          description="Create, view and manage your expense groups"
          href="/groups"
        />
      </div>

      <div className="border rounded p-5">
        <h2 className="font-semibold mb-3">Overall Status</h2>

        {balances.length === 0 ? (
          <p className="text-sm text-gray-500">
            You are fully settled 🎉
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {balances.map(b => (
              <li key={b.userId} className="flex justify-between">
                <span>
                  {b.amount < 0
                    ? `You owe ${b.userName}`
                    : `${b.userName} owes you`}
                </span>

                <span
                  className={
                    b.amount < 0 ? "text-red-600" : "text-green-600"
                  }
                >
                  ₹{Math.abs(b.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
