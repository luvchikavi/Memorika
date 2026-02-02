import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  ShoppingCart,
  TrendingUp,
  ListTodo,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

// Dashboard stats - will be dynamic later
const stats = [
  {
    name: "סה״כ נרשמים",
    value: "0",
    change: "+0%",
    icon: Users,
    color: "bg-teal/10 text-teal",
  },
  {
    name: "קורסים פעילים",
    value: "0",
    change: "",
    icon: BookOpen,
    color: "bg-gold/10 text-gold-dark",
  },
  {
    name: "הזמנות החודש",
    value: "0",
    change: "+0%",
    icon: ShoppingCart,
    color: "bg-sage/10 text-sage",
  },
  {
    name: "הכנסות החודש",
    value: "₪0",
    change: "+0%",
    icon: TrendingUp,
    color: "bg-navy/10 text-navy",
  },
];

// Task summary - will be dynamic later
const taskSummary = {
  total: 61,
  completed: 0,
  inProgress: 0,
  pending: 61,
};

const recentTasks = [
  { id: "1.1.1", name: "הגדרת ערכי מותג", status: "pending", phase: "Phase 1" },
  { id: "1.1.2", name: "הגדרת קהל יעד מפורט", status: "pending", phase: "Phase 1" },
  { id: "1.2.1", name: "בחירת פלטת צבעים", status: "pending", phase: "Phase 1" },
  { id: "1.2.3", name: "עיצוב לוגו - טיוטות", status: "pending", phase: "Phase 1" },
  { id: "2.1.1", name: "רכישת דומיין", status: "pending", phase: "Phase 2" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-l from-teal to-teal-dark rounded-2xl p-6 lg:p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">שלום קרן! 👋</h2>
        <p className="text-white/80">
          ברוכה הבאה לממשק הניהול של Memorika. כאן תוכלי לעקוב אחרי ההתקדמות של הפרויקט.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy/60">{stat.name}</p>
                  <p className="text-2xl font-bold text-navy mt-1">{stat.value}</p>
                  {stat.change && (
                    <p className="text-xs text-sage mt-1">{stat.change}</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Progress & Recent Tasks */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Task Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-teal" />
              התקדמות משימות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-navy/70">התקדמות כללית</span>
                  <span className="font-medium text-navy">
                    {taskSummary.completed}/{taskSummary.total} ({Math.round((taskSummary.completed / taskSummary.total) * 100)}%)
                  </span>
                </div>
                <div className="h-3 bg-cream rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal rounded-full transition-all duration-500"
                    style={{ width: `${(taskSummary.completed / taskSummary.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Status breakdown */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blush">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-sage/10 flex items-center justify-center mb-2">
                    <CheckCircle className="w-5 h-5 text-sage" />
                  </div>
                  <p className="text-2xl font-bold text-navy">{taskSummary.completed}</p>
                  <p className="text-xs text-navy/60">הושלמו</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-gold-dark" />
                  </div>
                  <p className="text-2xl font-bold text-navy">{taskSummary.inProgress}</p>
                  <p className="text-xs text-navy/60">בתהליך</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-blush flex items-center justify-center mb-2">
                    <AlertCircle className="w-5 h-5 text-navy/50" />
                  </div>
                  <p className="text-2xl font-bold text-navy">{taskSummary.pending}</p>
                  <p className="text-xs text-navy/60">ממתינות</p>
                </div>
              </div>

              <Link
                href="/admin/tasks"
                className="block text-center text-sm text-teal hover:text-teal-dark font-medium pt-4"
              >
                צפייה בכל המשימות ←
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold-dark" />
              משימות קרובות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-cream/50 hover:bg-cream transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-blush flex items-center justify-center text-xs font-medium text-navy/70">
                    {task.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy truncate">{task.name}</p>
                    <p className="text-xs text-navy/50">{task.phase}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-blush text-navy/60">
                    ממתין
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/admin/tasks"
              className="block text-center text-sm text-teal hover:text-teal-dark font-medium pt-4"
            >
              צפייה בכל המשימות ←
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>גישה מהירה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/tasks"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-cream hover:bg-teal/10 transition-colors group"
            >
              <ListTodo className="w-8 h-8 text-teal" />
              <span className="text-sm font-medium text-navy group-hover:text-teal">משימות</span>
            </Link>
            <Link
              href="/admin/documents"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-cream hover:bg-gold/10 transition-colors group"
            >
              <BookOpen className="w-8 h-8 text-gold-dark" />
              <span className="text-sm font-medium text-navy group-hover:text-gold-dark">מסמכים</span>
            </Link>
            <Link
              href="/admin/courses"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-cream hover:bg-sage/10 transition-colors group"
            >
              <BookOpen className="w-8 h-8 text-sage" />
              <span className="text-sm font-medium text-navy group-hover:text-sage">קורסים</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-cream hover:bg-navy/10 transition-colors group"
            >
              <ShoppingCart className="w-8 h-8 text-navy" />
              <span className="text-sm font-medium text-navy">הזמנות</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
