"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  CreditCard,
  Target,
  AlertTriangle,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  UserPlus,
  DollarSign,
  Flame,
  Snowflake,
  Calendar,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Bell,
  Activity,
} from "lucide-react";

interface DashboardData {
  stats: {
    totalContacts: number;
    newLeadsThisWeek: number;
    todayRevenue: number;
    yesterdayRevenue: number;
    monthlyRevenue: number;
    lastMonthRevenue: number;
    mrr: number;
    conversionRate: number;
    activeSubscriptions: number;
  };
  priorityTasks: {
    followUps: any[];
    overduePayments: any[];
    hotLeads: any[];
    expiringPlans: any[];
  };
  alerts: {
    coldLeads: any[];
    stuckDeals: any[];
    failedPayments: any[];
    coldLeadsCount: number;
    stuckDealsCount: number;
    failedPaymentsCount: number;
  };
  suggestions: Array<{
    type: string;
    priority: string;
    title: string;
    description: string;
    action?: string;
  }>;
  activityFeed: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    icon: string;
    color: string;
  }>;
}

export default function SmartDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const response = await fetch("/api/dashboard");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // Refresh every 5 minutes
    const interval = setInterval(fetchDashboard, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-teal animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-navy/60">שגיאה בטעינת הנתונים</p>
        <button onClick={handleRefresh} className="mt-4 text-teal hover:text-teal-dark">
          נסי שוב
        </button>
      </div>
    );
  }

  const revenueChange = data.stats.yesterdayRevenue > 0
    ? ((data.stats.todayRevenue - data.stats.yesterdayRevenue) / data.stats.yesterdayRevenue) * 100
    : 0;

  const monthlyChange = data.stats.lastMonthRevenue > 0
    ? ((data.stats.monthlyRevenue - data.stats.lastMonthRevenue) / data.stats.lastMonthRevenue) * 100
    : 0;

  const totalPriorityTasks =
    data.priorityTasks.followUps.length +
    data.priorityTasks.overduePayments.length +
    data.priorityTasks.hotLeads.length;

  const totalAlerts =
    data.alerts.coldLeadsCount +
    data.alerts.stuckDealsCount +
    data.alerts.failedPaymentsCount;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-l from-teal to-teal-dark rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">בוקר טוב, קרן! ☀️</h2>
              <p className="text-white/80">
                יש לך{" "}
                <span className="font-bold text-gold">{totalPriorityTasks}</span> משימות
                דחופות היום
                {totalAlerts > 0 && (
                  <>
                    {" "}ו-<span className="font-bold text-gold">{totalAlerts}</span> התראות
                    לטיפול
                  </>
                )}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="הכנסות היום"
          value={`₪${data.stats.todayRevenue.toLocaleString()}`}
          change={revenueChange}
          compareText="מאתמול"
          icon={DollarSign}
          color="bg-green-500/10 text-green-600"
        />
        <StatCard
          title="לידים חדשים השבוע"
          value={data.stats.newLeadsThisWeek.toString()}
          icon={UserPlus}
          color="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          title="שיעור המרה"
          value={`${data.stats.conversionRate}%`}
          icon={Target}
          color="bg-purple-500/10 text-purple-600"
        />
        <StatCard
          title="MRR"
          value={`₪${data.stats.mrr.toLocaleString()}`}
          subtitle={`${data.stats.activeSubscriptions} מנויים פעילים`}
          icon={TrendingUp}
          color="bg-teal/10 text-teal"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Priority Tasks - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Tasks Today */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-gold-dark" />
                משימות דחופות להיום
                {totalPriorityTasks > 0 && (
                  <span className="mr-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                    {totalPriorityTasks}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Hot Leads */}
              {data.priorityTasks.hotLeads.length > 0 && (
                <PrioritySection
                  title="לידים חמים"
                  icon={<Flame className="w-4 h-4 text-orange-500" />}
                  items={data.priorityTasks.hotLeads.map((lead) => ({
                    id: lead.id,
                    title: `${lead.contact.firstName} ${lead.contact.lastName}`,
                    subtitle: lead.product?.name || lead.contact.email,
                    link: `/admin/crm/leads`,
                  }))}
                  color="border-orange-200 bg-orange-50"
                />
              )}

              {/* Follow-ups Due */}
              {data.priorityTasks.followUps.length > 0 && (
                <PrioritySection
                  title="פולואפים להיום"
                  icon={<Phone className="w-4 h-4 text-blue-500" />}
                  items={data.priorityTasks.followUps.map((lead) => ({
                    id: lead.id,
                    title: `${lead.contact.firstName} ${lead.contact.lastName}`,
                    subtitle: lead.contact.phone || lead.contact.email,
                    link: `/admin/crm/leads`,
                  }))}
                  color="border-blue-200 bg-blue-50"
                />
              )}

              {/* Overdue Payments */}
              {data.priorityTasks.overduePayments.length > 0 && (
                <PrioritySection
                  title="תשלומים באיחור"
                  icon={<CreditCard className="w-4 h-4 text-red-500" />}
                  items={data.priorityTasks.overduePayments.map((plan) => ({
                    id: plan.id,
                    title: `${plan.contact.firstName} ${plan.contact.lastName}`,
                    subtitle: `₪${(plan.totalAmount / plan.numberOfPayments).toFixed(0)} - תשלום ${plan.paidInstallments + 1}/${plan.numberOfPayments}`,
                    link: `/admin/payments/plans`,
                  }))}
                  color="border-red-200 bg-red-50"
                />
              )}

              {totalPriorityTasks === 0 && (
                <div className="text-center py-8 text-navy/50">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <p>אין משימות דחופות להיום! 🎉</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Smart Alerts */}
          {totalAlerts > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="w-5 h-5 text-red-500" />
                  התראות
                  <span className="mr-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                    {totalAlerts}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.alerts.coldLeadsCount > 0 && (
                  <AlertItem
                    icon={<Snowflake className="w-4 h-4" />}
                    title={`${data.alerts.coldLeadsCount} לידים מתקררים`}
                    description="לא היו פעילים מעל שבוע"
                    link="/admin/crm/leads"
                    color="text-blue-500 bg-blue-50"
                  />
                )}
                {data.alerts.stuckDealsCount > 0 && (
                  <AlertItem
                    icon={<Clock className="w-4 h-4" />}
                    title={`${data.alerts.stuckDealsCount} עסקאות תקועות`}
                    description="ממתינות מעל שבועיים"
                    link="/admin/crm/deals"
                    color="text-yellow-600 bg-yellow-50"
                  />
                )}
                {data.alerts.failedPaymentsCount > 0 && (
                  <AlertItem
                    icon={<XCircle className="w-4 h-4" />}
                    title={`${data.alerts.failedPaymentsCount} תשלומים נכשלו`}
                    description="יש לפנות ללקוחות"
                    link="/admin/payments/transactions"
                    color="text-red-500 bg-red-50"
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* AI Suggestions */}
          {data.suggestions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-gold-dark" />
                  המלצות חכמות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {data.suggestions.map((suggestion, index) => (
                    <SuggestionCard key={index} suggestion={suggestion} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Monthly Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-teal" />
                סיכום חודשי
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-cream">
                <div>
                  <p className="text-sm text-navy/60">הכנסות החודש</p>
                  <p className="text-xl font-bold text-navy">
                    ₪{data.stats.monthlyRevenue.toLocaleString()}
                  </p>
                </div>
                <ChangeIndicator value={monthlyChange} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-cream">
                <div>
                  <p className="text-sm text-navy/60">סה״כ אנשי קשר</p>
                  <p className="text-xl font-bold text-navy">{data.stats.totalContacts}</p>
                </div>
                <Users className="w-8 h-8 text-teal/30" />
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-sage" />
                פעילות אחרונה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {data.activityFeed.length > 0 ? (
                  data.activityFeed.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))
                ) : (
                  <p className="text-center text-navy/50 py-4">אין פעילות אחרונה</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">גישה מהירה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <QuickLink href="/admin/crm/contacts" icon={Users} label="אנשי קשר" />
                <QuickLink href="/admin/crm/leads" icon={Target} label="לידים" />
                <QuickLink href="/admin/crm/deals" icon={DollarSign} label="עסקאות" />
                <QuickLink href="/admin/payments" icon={CreditCard} label="תשלומים" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  change,
  compareText,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change?: number;
  compareText?: string;
  subtitle?: string;
  icon: any;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-navy/60 mb-1">{title}</p>
            <p className="text-xl font-bold text-navy">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                <ChangeIndicator value={change} size="sm" />
                {compareText && <span className="text-xs text-navy/50">{compareText}</span>}
              </div>
            )}
            {subtitle && <p className="text-xs text-navy/50 mt-1">{subtitle}</p>}
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Change Indicator Component
function ChangeIndicator({ value, size = "md" }: { value: number; size?: "sm" | "md" }) {
  const isPositive = value >= 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
  const colorClass = isPositive ? "text-green-600" : "text-red-500";
  const sizeClass = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span className={`flex items-center ${colorClass} ${sizeClass} font-medium`}>
      <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      {Math.abs(value).toFixed(0)}%
    </span>
  );
}

// Priority Section Component
function PrioritySection({
  title,
  icon,
  items,
  color,
}: {
  title: string;
  icon: React.ReactNode;
  items: Array<{ id: string; title: string; subtitle: string; link: string }>;
  color: string;
}) {
  return (
    <div className={`rounded-lg border p-3 ${color}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-navy">{title}</span>
        <span className="text-xs text-navy/50">({items.length})</span>
      </div>
      <div className="space-y-2">
        {items.slice(0, 3).map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className="flex items-center justify-between p-2 rounded bg-white/60 hover:bg-white transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-navy">{item.title}</p>
              <p className="text-xs text-navy/50">{item.subtitle}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-navy/30" />
          </Link>
        ))}
        {items.length > 3 && (
          <Link href={items[0].link} className="text-xs text-teal hover:text-teal-dark">
            + עוד {items.length - 3}
          </Link>
        )}
      </div>
    </div>
  );
}

// Alert Item Component
function AlertItem({
  icon,
  title,
  description,
  link,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  color: string;
}) {
  return (
    <Link
      href={link}
      className={`flex items-center gap-3 p-3 rounded-lg ${color} hover:opacity-80 transition-opacity`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-navy">{title}</p>
        <p className="text-xs text-navy/60">{description}</p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-navy/30 flex-shrink-0" />
    </Link>
  );
}

// Suggestion Card Component
function SuggestionCard({
  suggestion,
}: {
  suggestion: {
    type: string;
    priority: string;
    title: string;
    description: string;
    action?: string;
  };
}) {
  const priorityColors = {
    high: "border-r-red-500",
    medium: "border-r-yellow-500",
    low: "border-r-green-500",
  };

  return (
    <div
      className={`p-3 rounded-lg bg-cream border-r-4 ${
        priorityColors[suggestion.priority as keyof typeof priorityColors] || "border-r-gray-300"
      }`}
    >
      <p className="text-sm font-medium text-navy mb-1">{suggestion.title}</p>
      <p className="text-xs text-navy/60">{suggestion.description}</p>
    </div>
  );
}

// Activity Item Component
function ActivityItem({
  activity,
}: {
  activity: {
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    icon: string;
    color: string;
  };
}) {
  const IconComponent = {
    "credit-card": CreditCard,
    "user-plus": UserPlus,
    user: Users,
  }[activity.icon] || Activity;

  const colorClass = {
    "text-green-500": "bg-green-100 text-green-600",
    "text-blue-500": "bg-blue-100 text-blue-600",
    "text-teal-500": "bg-teal/10 text-teal",
  }[activity.color] || "bg-gray-100 text-gray-600";

  const timeAgo = formatTimeAgo(new Date(activity.timestamp));

  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
        <IconComponent className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-navy">{activity.title}</p>
        <p className="text-xs text-navy/60 truncate">{activity.description}</p>
        <p className="text-xs text-navy/40 mt-1">{timeAgo}</p>
      </div>
    </div>
  );
}

// Quick Link Component
function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-cream hover:bg-teal/10 transition-colors group"
    >
      <Icon className="w-5 h-5 text-teal group-hover:text-teal-dark" />
      <span className="text-xs font-medium text-navy">{label}</span>
    </Link>
  );
}

// Format time ago helper
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "עכשיו";
  if (minutes < 60) return `לפני ${minutes} דקות`;
  if (hours < 24) return `לפני ${hours} שעות`;
  if (days < 7) return `לפני ${days} ימים`;
  return date.toLocaleDateString("he-IL");
}
