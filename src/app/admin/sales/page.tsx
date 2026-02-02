"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Users,
  Mail,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  MousePointer,
  UserPlus,
  Package,
} from "lucide-react";

// Funnel stages for visualization
const funnelStages = [
  { id: "visitors", label: "מבקרים", icon: Eye, color: "bg-blue-500" },
  { id: "leads", label: "לידים", icon: UserPlus, color: "bg-purple-500" },
  { id: "interested", label: "מתעניינים", icon: MousePointer, color: "bg-yellow-500" },
  { id: "cart", label: "עגלה", icon: ShoppingCart, color: "bg-orange-500" },
  { id: "purchase", label: "רכישה", icon: CreditCard, color: "bg-green-500" },
];

export default function SalesDashboard() {
  const [crmStats, setCrmStats] = useState<any>(null);
  const [salesStats, setSalesStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      const [crmRes, salesRes] = await Promise.all([
        fetch("/api/crm/stats"),
        fetch("/api/sales/stats"),
      ]);

      if (crmRes.ok) {
        const crmData = await crmRes.json();
        setCrmStats(crmData);
      }

      if (salesRes.ok) {
        const salesData = await salesRes.json();
        setSalesStats(salesData);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funnel data with real stats
  const funnelData = [
    { stage: "visitors", count: 5000, conversion: 100 },
    { stage: "leads", count: crmStats?.contacts?.total || 0, conversion: crmStats?.contacts?.total ? Math.round((crmStats.contacts.total / 5000) * 100) : 0 },
    { stage: "interested", count: crmStats?.leads?.active || 0, conversion: crmStats?.contacts?.total ? Math.round(((crmStats?.leads?.active || 0) / crmStats.contacts.total) * 100) : 0 },
    { stage: "cart", count: salesStats?.cart?.abandoned || 0, conversion: crmStats?.leads?.active ? Math.round(((salesStats?.cart?.abandoned || 0) / crmStats.leads.active) * 100) : 0 },
    { stage: "purchase", count: salesStats?.revenue?.deals || 0, conversion: salesStats?.cart?.abandoned ? Math.round(((salesStats?.revenue?.deals || 0) / (salesStats.cart.abandoned + salesStats.revenue.deals)) * 100) : 0 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-navy/60">סה״כ לידים</p>
                <p className="text-3xl font-bold text-navy">{crmStats?.contacts?.total || 0}</p>
                <p className="text-sm text-navy/50 mt-1">במערכת</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-navy/60">סדרות מיילים פעילות</p>
                <p className="text-3xl font-bold text-navy">{salesStats?.sequences?.active || 0}</p>
                <p className="text-sm text-navy/50 mt-1">{salesStats?.sequences?.emailTemplates || 0} תבניות</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-navy/60">עגלות נטושות</p>
                <p className="text-3xl font-bold text-navy">{salesStats?.cart?.abandoned || 0}</p>
                <p className="text-sm text-navy/50 mt-1">{salesStats?.cart?.recoveryRate || 0}% שוחזרו</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-navy/60">מכירות</p>
                <p className="text-3xl font-bold text-navy">₪{(salesStats?.revenue?.total || crmStats?.deals?.monthlyRevenue || 0).toLocaleString()}</p>
                <p className="text-sm text-navy/50 mt-1">{salesStats?.revenue?.deals || crmStats?.deals?.monthlyCount || 0} עסקאות</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-teal" />
            משפך מכירות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-4 h-64">
            {funnelData.map((data, index) => {
              const stage = funnelStages.find((s) => s.id === data.stage);
              const maxCount = Math.max(...funnelData.map((d) => d.count));
              const heightPercent = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
              const Icon = stage?.icon || Users;

              return (
                <div key={data.stage} className="flex-1 flex flex-col items-center">
                  {/* Bar */}
                  <div className="w-full flex flex-col items-center justify-end h-48">
                    <div
                      className={`w-full max-w-20 rounded-t-lg ${stage?.color} transition-all duration-500 flex items-end justify-center pb-2`}
                      style={{ height: `${Math.max(heightPercent, 10)}%` }}
                    >
                      <span className="text-white text-sm font-bold">
                        {data.count.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="mt-3 text-center">
                    <Icon className={`h-5 w-5 mx-auto mb-1 ${stage?.color.replace('bg-', 'text-').replace('-500', '-600')}`} />
                    <p className="text-sm font-medium text-navy">{stage?.label}</p>
                    {index > 0 && (
                      <p className="text-xs text-navy/50">
                        {data.conversion}% המרה
                      </p>
                    )}
                  </div>

                  {/* Arrow to next stage */}
                  {index < funnelData.length - 1 && (
                    <div className="absolute top-1/2 -translate-y-1/2 text-navy/20">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/sales/sequences">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-navy mb-2">סדרות מיילים</h3>
              <p className="text-sm text-navy/60">
                צור ונהל סדרות מיילים אוטומטיות לטיפוח לידים
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/sales/products">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-4 bg-purple-100 rounded-full mb-4">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-navy mb-2">מוצרים וקורסים</h3>
              <p className="text-sm text-navy/60">
                נהל את המוצרים, המחירים ודפי המכירה
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/sales/funnels">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="p-4 bg-green-100 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-navy mb-2">משפכי מכירה</h3>
              <p className="text-sm text-navy/60">
                בנה משפכי מכירה מותאמים אישית
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>פעילות אחרונה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-navy/50">
            <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>אין פעילות אחרונה</p>
            <p className="text-sm">הפעילות תופיע כאן כשתתחיל להשתמש במערכת</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
