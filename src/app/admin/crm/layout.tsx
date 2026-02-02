"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Target, Handshake, BarChart3, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const crmNavigation = [
  { name: "סקירה", href: "/admin/crm", icon: BarChart3 },
  { name: "אנשי קשר", href: "/admin/crm/contacts", icon: Users },
  { name: "לידים", href: "/admin/crm/leads", icon: Target },
  { name: "עסקאות", href: "/admin/crm/deals", icon: Handshake },
];

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* CRM Sub-navigation */}
      <div className="flex items-center justify-between">
        <nav className="flex gap-1 bg-white rounded-lg p-1 border border-blush">
          {crmNavigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/crm" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-teal text-white"
                    : "text-navy/70 hover:text-navy hover:bg-cream"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/admin/crm/import"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy/90 transition-colors"
        >
          <Upload className="h-4 w-4" />
          ייבוא מ-Excel
        </Link>
      </div>

      {/* Page content */}
      {children}
    </div>
  );
}
