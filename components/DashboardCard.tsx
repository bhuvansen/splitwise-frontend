import Link from "next/link";

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
}

export default function DashboardCard({
  title,
  description,
  href,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="
        block
        rounded-lg
        border
        border-gray-200
        p-5
        transition
        hover:border-gray-300
        hover:bg-gray-50
      "
    >
      <h3 className="text-base font-medium text-gray-900">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </Link>
  );
}
