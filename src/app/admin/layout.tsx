"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  Users,
  ListTodo,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  Palette,
  UserCircle,
  Workflow,
  MessageCircle,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "סקירה כללית", href: "/admin", icon: LayoutDashboard },
  { name: "CRM", href: "/admin/crm", icon: UserCircle },
  { name: "Sales Flow", href: "/admin/sales", icon: Workflow },
  { name: "תשלומים", href: "/admin/payments", icon: CreditCard },
  { name: "תקשורת", href: "/admin/messaging", icon: MessageCircle },
  { name: "משימות", href: "/admin/tasks", icon: ListTodo },
  { name: "מסמכים אסטרטגיים", href: "/admin/documents", icon: FileText },
  { name: "עיצוב ומותג", href: "/admin/design", icon: Palette },
  { name: "קורסים", href: "/admin/courses", icon: BookOpen },
  { name: "הזמנות", href: "/admin/orders", icon: ShoppingCart },
  { name: "משתמשים", href: "/admin/users", icon: Users },
  { name: "הגדרות", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-cream-dark">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-72 bg-navy transform transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-24 items-center justify-between px-6 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-3">
              <Image
                src="/brand/logo-transparent.png"
                alt="Memorika"
                width={60}
                height={60}
                className="object-contain"
              />
              <div>
                <span className="text-xl font-bold text-white block">Memorika</span>
                <span className="text-xs bg-teal-light/20 text-teal-light px-2 py-0.5 rounded">
                  Admin
                </span>
              </div>
            </Link>
            <button
              className="lg:hidden text-white/70 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-teal text-white"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-white font-bold">
                KM
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">קרן מלניאק</p>
                <p className="text-xs text-white/50">Super Admin</p>
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <Link href="/" className="flex-1">
                <Button variant="ghost" size="sm" className="w-full text-white/70 hover:text-white hover:bg-white/10">
                  <ChevronLeft className="h-4 w-4" />
                  לאתר
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pr-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-white border-b border-blush px-4 lg:px-8">
          <button
            className="lg:hidden text-navy"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-navy">
              {navigation.find((item) => item.href === pathname)?.name || "Admin"}
            </h1>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
