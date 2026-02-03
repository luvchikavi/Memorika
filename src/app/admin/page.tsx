"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  CreditCard,
  Target,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Flame,
  Snowflake,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Bell,
  ShoppingBag,
  BarChart3,
  PieChart,
  Package,
  Zap,
} from "lucide-react";

interface ProductStat {
  id: string;
  name: string;
  category: string | null;
  price: number;
  newLeadsThisWeek: number;
  totalDeals: number;
  paidDeals: number;
  pendingDeals: number;
  totalRevenue: number;
  conversionRate: number;
}

interface DashboardData {
  stats: {
    totalContacts: number;
    newContactsThisMonth: number;
    contactGrowthRate: number;
    totalRevenue: number;
    thisMonthRevenue: number;
    mrr: number;
    activeSubscriptions: number;
    conversionRate: number;
  };
  funnelStats: {
    totalLeads: number;
    newLeads: number;
    hotLeads: number;
    convertedLeads: number;
    conversionRate: number;
  };
  productStats: ProductStat[];
  topProductsByLeads: ProductStat[];
  topProductsByRevenue: ProductStat[];
  revenueByCategory: Record<string, number>;
  leadsByCategory: Record<string, number>;
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
  }>;
}

const categoryLabels: Record<string, string> = {
  course: "קורסים",
  ebook: "ספרים דיגיטליים",
  coaching: "אימון אישי",
  bundle: "חבילות",
  null: "אחר",
  undefined: "אחר",
};

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">בוקר טוב, קרן! ☀️</h2>
              <p className="text-white/80">
                {totalPriorityTasks > 0 ? (
                  <>
                    יש לך <span className="font-bold text-gold">{totalPriorityTasks}</span> משימות דחופות
                    {totalAlerts > 0 && (
                      <> ו-<span className="font-bold text-gold">{totalAlerts}</span> התראות</>
                    )}
                  </>
                ) : (
                  "אין משימות דחופות להיום - יום מצוין למכירות!"
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

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="הכנסות כוללות"
          value={`₪${data.stats.totalRevenue.toLocaleString()}`}
          subtitle={`₪${data.stats.thisMonthRevenue.toLocaleString()} החודש`}
          icon={DollarSign}
          color="bg-green-500/10 text-green-600"
        />
        <StatCard
          title="אנשי קשר"
          value={data.stats.totalContacts.toString()}
          change={data.stats.contactGrowthRate}
          compareText="מהחודש שעבר"
          icon={Users}
          color="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          title="שיעור המרה"
          value={`${data.stats.conversionRate}%`}
          subtitle={`${data.funnelStats.convertedLeads} מתוך ${data.funnelStats.totalLeads} לידים`}
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
        {/* Left Column - Products & Sales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sales Funnel */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-teal" />
                משפך מכירות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <FunnelStep
                  label="סה״כ לידים"
                  value={data.funnelStats.totalLeads}
                  color="bg-blue-100 text-blue-700"
                />
                <FunnelStep
                  label="לידים חדשים"
                  value={data.funnelStats.newLeads}
                  subtext="השבוע"
                  color="bg-purple-100 text-purple-700"
                />
                <FunnelStep
                  label="לידים חמים"
                  value={data.funnelStats.hotLeads}
                  color="bg-orange-100 text-orange-700"
                />
                <FunnelStep
                  label="הומרו"
                  value={data.funnelStats.convertedLeads}
                  subtext={`${data.funnelStats.conversionRate}%`}
                  color="bg-green-100 text-green-700"
                />
              </div>
            </CardContent>
          </Card>

          {/* Top Products by Interest */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-gold-dark" />
                מוצרים מובילים לפי עניין השבוע
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.topProductsByLeads.length > 0 ? (
                <div className="space-y-3">
                  {data.topProductsByLeads.map((product, index) => (
                    <ProductRow
                      key={product.id}
                      rank={index + 1}
                      product={product}
                      metric="leads"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-navy/50 py-4">אין נתונים להצגה</p>
              )}
            </CardContent>
          </Card>

          {/* Top Products by Revenue */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
                מוצרים מובילים לפי הכנסות
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.topProductsByRevenue.filter(p => p.totalRevenue > 0).length > 0 ? (
                <div className="space-y-3">
                  {data.topProductsByRevenue
                    .filter(p => p.totalRevenue > 0)
                    .map((product, index) => (
                      <ProductRow
                        key={product.id}
                        rank={index + 1}
                        product={product}
                        metric="revenue"
                      />
                    ))}
                </div>
              ) : (
                <p className="text-center text-navy/50 py-4">אין הכנסות עדיין</p>
              )}
            </CardContent>
          </Card>

          {/* Priority Tasks */}
          {totalPriorityTasks > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-gold-dark" />
                  משימות דחופות
                  <span className="mr-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                    {totalPriorityTasks}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Interest by Category */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <PieChart className="w-5 h-5 text-purple-600" />
                עניין לפי קטגוריה
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(data.leadsByCategory).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(data.leadsByCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, count]) => (
                      <CategoryBar
                        key={category}
                        label={categoryLabels[category] || category}
                        value={count}
                        total={Object.values(data.leadsByCategory).reduce((a, b) => a + b, 0)}
                        color="bg-purple-500"
                      />
                    ))}
                </div>
              ) : (
                <p className="text-center text-navy/50 py-4">אין נתונים השבוע</p>
              )}
            </CardContent>
          </Card>

          {/* Revenue by Category */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingBag className="w-5 h-5 text-green-600" />
                הכנסות לפי קטגוריה
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(data.revenueByCategory).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(data.revenueByCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, amount]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm text-navy">
                          {categoryLabels[category] || category}
                        </span>
                        <span className="font-medium text-navy">
                          ₪{amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center text-navy/50 py-4">אין הכנסות עדיין</p>
              )}
            </CardContent>
          </Card>

          {/* Alerts */}
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
                  המלצות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.suggestions.slice(0, 4).map((suggestion, index) => (
                    <SuggestionCard key={index} suggestion={suggestion} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">גישה מהירה</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <QuickLink href="/admin/crm/contacts" icon={Users} label="אנשי קשר" />
                <QuickLink href="/admin/crm/leads" icon={Target} label="לידים" />
                <QuickLink href="/admin/sales/products" icon={Package} label="מוצרים" />
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
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-navy/60 mb-1">{title}</p>
            <p className="text-lg sm:text-xl font-bold text-navy">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                <ChangeIndicator value={change} size="sm" />
                {compareText && <span className="text-xs text-navy/50">{compareText}</span>}
              </div>
            )}
            {subtitle && <p className="text-xs text-navy/50 mt-1">{subtitle}</p>}
          </div>
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Change Indicator
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

// Funnel Step
function FunnelStep({
  label,
  value,
  subtext,
  color,
}: {
  label: string;
  value: number;
  subtext?: string;
  color: string;
}) {
  return (
    <div className={`text-center p-3 rounded-lg ${color}`}>
      <p className="text-lg sm:text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium mt-1">{label}</p>
      {subtext && <p className="text-xs opacity-70">{subtext}</p>}
    </div>
  );
}

// Product Row
function ProductRow({
  rank,
  product,
  metric,
}: {
  rank: number;
  product: ProductStat;
  metric: "leads" | "revenue";
}) {
  return (
    <div className="flex items-center gap-3 p-2 sm:p-3 rounded-lg bg-cream/50 hover:bg-cream transition-colors">
      <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center text-sm font-bold text-teal">
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-navy truncate">{product.name}</p>
        <p className="text-xs text-navy/50">
          {categoryLabels[product.category || "null"]} • ₪{product.price.toLocaleString()}
        </p>
      </div>
      <div className="text-left">
        {metric === "leads" ? (
          <>
            <p className="text-sm font-bold text-navy">{product.newLeadsThisWeek}</p>
            <p className="text-xs text-navy/50">לידים חדשים</p>
          </>
        ) : (
          <>
            <p className="text-sm font-bold text-green-600">₪{product.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-navy/50">{product.paidDeals} מכירות</p>
          </>
        )}
      </div>
    </div>
  );
}

// Category Bar
function CategoryBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-navy">{label}</span>
        <span className="font-medium text-navy">{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Priority Section
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

// Alert Item
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

// Suggestion Card
function SuggestionCard({
  suggestion,
}: {
  suggestion: {
    type: string;
    priority: string;
    title: string;
    description: string;
  };
}) {
  const typeColors = {
    opportunity: "border-r-green-500 bg-green-50",
    action: "border-r-red-500 bg-red-50",
    insight: "border-r-blue-500 bg-blue-50",
    warning: "border-r-yellow-500 bg-yellow-50",
  };

  return (
    <div
      className={`p-3 rounded-lg border-r-4 ${
        typeColors[suggestion.type as keyof typeof typeColors] || "border-r-gray-300 bg-gray-50"
      }`}
    >
      <p className="text-sm font-medium text-navy mb-1">{suggestion.title}</p>
      <p className="text-xs text-navy/60">{suggestion.description}</p>
    </div>
  );
}

// Quick Link
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
