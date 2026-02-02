"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  DollarSign,
  Calendar,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PaymentStats {
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  activeSubscriptions: number;
  activePlans: number;
}

export default function PaymentsDashboardPage() {
  const [stats, setStats] = useState<PaymentStats>({
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    totalRevenue: 0,
    thisMonthRevenue: 0,
    activeSubscriptions: 0,
    activePlans: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // In production, this would call an API endpoint
      // For now, we'll use placeholder data
      setStats({
        totalPayments: 0,
        completedPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
        totalRevenue: 0,
        thisMonthRevenue: 0,
        activeSubscriptions: 0,
        activePlans: 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "סה״כ הכנסות",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "הכנסות החודש",
      value: formatPrice(stats.thisMonthRevenue),
      icon: Calendar,
      color: "text-teal",
      bgColor: "bg-teal/10",
    },
    {
      title: "תשלומים שהושלמו",
      value: stats.completedPayments.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "תשלומים ממתינים",
      value: stats.pendingPayments.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "תשלומים שנכשלו",
      value: stats.failedPayments.toString(),
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "מנויים פעילים",
      value: stats.activeSubscriptions.toString(),
      icon: RefreshCw,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "תוכניות תשלום פעילות",
      value: stats.activePlans.toString(),
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "סה״כ עסקאות",
      value: stats.totalPayments.toString(),
      icon: TrendingUp,
      color: "text-navy",
      bgColor: "bg-navy/10",
    },
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
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-navy">דשבורד תשלומים</h2>
        <p className="text-navy/60">סקירה כללית של מערכת התשלומים</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-navy/60">{stat.title}</p>
                  <p className="text-2xl font-bold text-navy">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>פעולות מהירות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/payments/settings"
              className="flex flex-col items-center gap-2 p-4 bg-cream rounded-lg hover:bg-cream/70 transition-colors"
            >
              <CreditCard className="h-8 w-8 text-teal" />
              <span className="text-sm text-navy">הגדרת שערי תשלום</span>
            </a>
            <a
              href="/admin/payments/transactions"
              className="flex flex-col items-center gap-2 p-4 bg-cream rounded-lg hover:bg-cream/70 transition-colors"
            >
              <TrendingUp className="h-8 w-8 text-teal" />
              <span className="text-sm text-navy">צפייה בעסקאות</span>
            </a>
            <a
              href="/admin/payments/invoices"
              className="flex flex-col items-center gap-2 p-4 bg-cream rounded-lg hover:bg-cream/70 transition-colors"
            >
              <DollarSign className="h-8 w-8 text-teal" />
              <span className="text-sm text-navy">ניהול חשבוניות</span>
            </a>
            <a
              href="/admin/payments/subscriptions"
              className="flex flex-col items-center gap-2 p-4 bg-cream rounded-lg hover:bg-cream/70 transition-colors"
            >
              <RefreshCw className="h-8 w-8 text-teal" />
              <span className="text-sm text-navy">ניהול מנויים</span>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <Card className="border-teal/20 bg-teal/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-teal/10">
              <CreditCard className="h-6 w-6 text-teal" />
            </div>
            <div>
              <h3 className="font-medium text-navy">התחלת עבודה</h3>
              <p className="text-sm text-navy/60 mt-1">
                כדי להתחיל לקבל תשלומים, יש להגדיר לפחות שער תשלום אחד בדף ההגדרות.
                התמיכה כוללת שערים ישראליים כמו טרנזילה, CardCom, PayPlus, Morning, ביט ו-PayBox.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
