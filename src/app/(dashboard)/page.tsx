import { requireAuth } from "@/lib/auth/helpers";
import { Users, UserCheck, Calendar, FileText, CheckSquare, ArrowRightLeft } from "lucide-react";

export default async function DashboardPage() {
  const session = await requireAuth();

  // Placeholder stats – will be replaced with real queries
  const stats = [
    { name: "Total Members", value: "—", icon: Users, color: "bg-blue-500" },
    { name: "Active Members", value: "—", icon: UserCheck, color: "bg-emerald-500" },
    { name: "Upcoming Meetings", value: "—", icon: Calendar, color: "bg-violet-500" },
    { name: "Minutes Pending", value: "—", icon: FileText, color: "bg-amber-500" },
    { name: "Open Action Items", value: "—", icon: CheckSquare, color: "bg-rose-500" },
    { name: "Pending Transfers", value: "—", icon: ArrowRightLeft, color: "bg-cyan-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Welcome back, {session.user.name}. Here is an overview of membership and secretariat activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Recent Membership Changes
          </h2>
          <p className="text-sm text-slate-500">
            No recent changes to display. Data will appear once members are added.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Upcoming Meetings
          </h2>
          <p className="text-sm text-slate-500">
            No upcoming meetings scheduled.
          </p>
        </div>
      </div>
    </div>
  );
}
