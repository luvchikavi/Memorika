"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Handshake, TrendingUp, ArrowUpRight, GraduationCap, Heart, Eye, Stethoscope, HelpCircle } from "lucide-react";
import Link from "next/link";

// Type configuration
const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
  alumni: { label: "בוגרים", icon: GraduationCap, color: "text-purple-600" },
  interested: { label: "מתעניינים", icon: Heart, color: "text-pink-600" },
  followers: { label: "עוקבים", icon: Eye, color: "text-blue-600" },
  patients: { label: "מטופלים (קליניקה)", icon: Stethoscope, color: "text-green-600" },
  other: { label: "אחר", icon: HelpCircle, color: "text-gray-600" },
};

// Lead status configuration
const leadStatusConfig: Record<string, { label: string; color: string }> = {
  new: { label: "חדש", color: "bg-blue-500" },
  contacted: { label: "ליצור קשר", color: "bg-yellow-500" },
  in_talks: { label: "בשיחות", color: "bg-purple-500" },
  hot: { label: "חם", color: "bg-red-500" },
  cold: { label: "קר", color: "bg-gray-400" },
  converted: { label: "הומר", color: "bg-green-500" },
  lost: { label: "אבוד", color: "bg-gray-600" },
};

interface CRMStats {
  contacts: {
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    recentWeek: number;
  };
  leads: {
    total: number;
    active: number;
    byStatus: Record<string, number>;
  };
  deals: {
    total: number;
    monthlyCount: number;
    totalRevenue: number;
    monthlyRevenue: number;
  };
}

export default function CRMDashboard() {
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/crm/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "אנשי קשר",
      value: stats?.contacts.total || 0,
      change: `+${stats?.contacts.recentWeek || 0} השבוע`,
      icon: Users,
      href: "/admin/crm/contacts",
    },
    {
      title: "לידים פעילים",
      value: stats?.leads.active || 0,
      change: `מתוך ${stats?.leads.total || 0} סה״כ`,
      icon: Target,
      href: "/admin/crm/leads",
    },
    {
      title: "עסקאות החודש",
      value: stats?.deals.monthlyCount || 0,
      change: `מתוך ${stats?.deals.total || 0} סה״כ`,
      icon: Handshake,
      href: "/admin/crm/deals",
    },
    {
      title: "הכנסות החודש",
      value: `₪${(stats?.deals.monthlyRevenue || 0).toLocaleString()}`,
      change: `סה״כ ₪${(stats?.deals.totalRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      href: "/admin/crm/deals",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-navy/60">{stat.title}</p>
                    <p className="text-3xl font-bold text-navy mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-sm text-navy/50">{stat.change}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-teal/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-teal" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">אנשי קשר לפי סוג</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(typeConfig).map(([key, config]) => {
                const count = stats?.contacts.byType[key] || 0;
                const total = stats?.contacts.total || 1;
                const percentage = Math.round((count / total) * 100);
                const Icon = config.icon;

                return (
                  <div key={key} className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${config.color}`} />
                    <span className="flex-1 text-sm text-navy">{config.label}</span>
                    <span className="text-sm font-medium text-navy">{count}</span>
                    <div className="w-16 h-2 bg-cream rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Leads by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">לידים לפי סטטוס</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(leadStatusConfig).map(([key, config]) => {
                const count = stats?.leads.byStatus[key] || 0;
                return (
                  <div key={key} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${config.color}`} />
                    <span className="flex-1 text-sm text-navy">{config.label}</span>
                    <span className="text-sm font-medium text-navy">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Contact Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">סטטוס אנשי קשר</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { key: "active", label: "פעיל", color: "bg-green-500" },
                { key: "inactive", label: "לא פעיל", color: "bg-gray-400" },
                { key: "vip", label: "VIP", color: "bg-purple-500" },
                { key: "blocked", label: "חסום", color: "bg-red-500" },
              ].map((item) => {
                const count = stats?.contacts.byStatus[item.key] || 0;
                return (
                  <div key={item.key} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="flex-1 text-sm text-navy">{item.label}</span>
                    <span className="text-sm font-medium text-navy">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">פעולות מהירות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/crm/contacts"
              className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-dashed border-blush hover:border-teal hover:bg-teal/5 transition-colors"
            >
              <div className="p-3 bg-teal/10 rounded-full">
                <Users className="h-6 w-6 text-teal" />
              </div>
              <div className="text-center">
                <p className="font-medium text-navy">נהל אנשי קשר</p>
                <p className="text-sm text-navy/60">{stats?.contacts.total || 0} אנשי קשר במערכת</p>
              </div>
            </Link>

            <Link
              href="/admin/crm/leads"
              className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-dashed border-blush hover:border-teal hover:bg-teal/5 transition-colors"
            >
              <div className="p-3 bg-teal/10 rounded-full">
                <Target className="h-6 w-6 text-teal" />
              </div>
              <div className="text-center">
                <p className="font-medium text-navy">נהל לידים</p>
                <p className="text-sm text-navy/60">{stats?.leads.active || 0} לידים פעילים</p>
              </div>
            </Link>

            <Link
              href="/admin/crm/deals"
              className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-dashed border-blush hover:border-teal hover:bg-teal/5 transition-colors"
            >
              <div className="p-3 bg-teal/10 rounded-full">
                <Handshake className="h-6 w-6 text-teal" />
              </div>
              <div className="text-center">
                <p className="font-medium text-navy">נהל עסקאות</p>
                <p className="text-sm text-navy/60">{stats?.deals.total || 0} עסקאות סגורות</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
