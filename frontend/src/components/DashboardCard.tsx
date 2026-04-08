interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export default function DashboardCard({
  title,
  value,
  subtitle,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151b2f] shadow-sm p-5 transition-colors">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
      {subtitle && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{subtitle}</p>
      )}
    </div>
  );
}