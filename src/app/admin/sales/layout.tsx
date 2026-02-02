"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Mail, Package, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

const salesNavigation = [
  { name: "סקירה", href: "/admin/sales", icon: BarChart3 },
  { name: "סדרות מיילים", href: "/admin/sales/sequences", icon: Mail },
  { name: "מוצרים וקורסים", href: "/admin/sales/products", icon: Package },
  { name: "משפכי מכירה", href: "/admin/sales/funnels", icon: GitBranch },
];

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* Sales Sub-navigation */}
      <div className="flex items-center justify-between">
        <nav className="flex gap-1 bg-white rounded-lg p-1 border border-blush">
          {salesNavigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/sales" && pathname.startsWith(item.href));
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
      </div>

      {/* Page content */}
      {children}
    </div>
  );
}
