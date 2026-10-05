"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  Building2,
  FileText,
  Calendar,
  ScrollText,
  CheckSquare,
  Mail,
  FolderOpen,
  BarChart3,
  Settings,
  Church,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    name: "Membership",
    href: "/membership/members",
    icon: Users,
    children: [
      { name: "Members", href: "/membership/members" },
      { name: "Families", href: "/membership/families" },
      { name: "Baptisms", href: "/membership/baptisms" },
      { name: "Transfers", href: "/membership/transfers" },
      { name: "History", href: "/membership/history" },
    ],
  },
  {
    name: "Departments",
    href: "/departments",
    icon: Building2,
    children: [
      { name: "All Departments", href: "/departments" },
      { name: "Leadership", href: "/leadership" },
    ],
  },
  {
    name: "Secretariat",
    href: "/secretariat/meetings",
    icon: FileText,
    children: [
      { name: "Meetings", href: "/secretariat/meetings" },
      { name: "Minutes", href: "/secretariat/minutes" },
      { name: "Resolutions", href: "/secretariat/resolutions" },
      { name: "Action Items", href: "/secretariat/action-items" },
      { name: "Correspondence", href: "/secretariat/correspondence" },
      { name: "Documents", href: "/secretariat/documents" },
    ],
  },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    roles?: string[];
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <Church className="h-7 w-7 text-blue-600" />
        <span className="text-lg font-semibold text-slate-900 truncate">
          Church System
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.children && item.children.some((c) => pathname.startsWith(c.href)));

          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>

              {item.children && isActive && (
                <div className="ml-8 mt-1 space-y-0.5">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block rounded-md px-3 py-1.5 text-sm transition-colors",
                        pathname === child.href
                          ? "text-blue-700 font-medium"
                          : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="text-sm font-medium text-slate-900 truncate">
          {user.name}
        </div>
        <div className="text-xs text-slate-500 truncate">{user.email}</div>
        {user.roles && user.roles.length > 0 && (
          <div className="mt-1 text-xs text-blue-600">
            {user.roles.join(", ")}
          </div>
        )}
      </div>
    </aside>
  );
}
