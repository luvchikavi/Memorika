"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Calendar,
  Plus,
  Minus,
  Edit3,
  X,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TaskStatus = "pending" | "in_progress" | "completed";
type TaskPriority = "low" | "medium" | "high";

interface SubTask {
  id: string;
  name: string;
  completed: boolean;
}

interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  notes: string;
  progress: number; // 0-100
  startDate?: string;
  dueDate?: string;
  priority: TaskPriority;
  category?: string;
  subTasks: SubTask[];
  description?: string;
}

interface Phase {
  id: string;
  name: string;
  nameHe: string;
  startDate?: string;
  endDate?: string;
  tasks: Task[];
}

// Task categories for grouping
const taskCategories = [
  { id: "strategy", name: "אסטרטגיה", color: "bg-purple-100 text-purple-700" },
  { id: "design", name: "עיצוב", color: "bg-pink-100 text-pink-700" },
  { id: "development", name: "פיתוח", color: "bg-blue-100 text-blue-700" },
  { id: "marketing", name: "שיווק", color: "bg-green-100 text-green-700" },
  { id: "testing", name: "בדיקות", color: "bg-orange-100 text-orange-700" },
  { id: "content", name: "תוכן", color: "bg-teal-100 text-teal-700" },
];

// Helper to create task with defaults
const createTask = (
  id: string,
  name: string,
  status: TaskStatus,
  notes: string,
  extras?: Partial<Task>
): Task => ({
  id,
  name,
  status,
  notes,
  progress: status === "completed" ? 100 : status === "in_progress" ? 50 : 0,
  priority: "medium",
  subTasks: [],
  ...extras,
});

// Initial tasks data from TASKS.md
const initialPhases: Phase[] = [
  {
    id: "1",
    name: "Phase 1",
    nameHe: "מיתוג וזהות",
    startDate: "2025-01-15",
    endDate: "2025-02-15",
    tasks: [
      createTask("1.1.1", "הגדרת ערכי מותג", "pending", "", {
        category: "strategy",
        description: "הגדרת הערכים המרכזיים של המותג",
        subTasks: [
          { id: "1.1.1.1", name: "מחקר שוק", completed: false },
          { id: "1.1.1.2", name: "הגדרת חזון", completed: false },
          { id: "1.1.1.3", name: "הגדרת משימה", completed: false },
        ]
      }),
      createTask("1.1.2", "הגדרת קהל יעד מפורט", "pending", "", { category: "strategy" }),
      createTask("1.1.3", "ניתוח מתחרים", "pending", "", { category: "strategy" }),
      createTask("1.1.4", "הגדרת USP (מה מייחד את השיטה)", "pending", "", { category: "strategy" }),
      createTask("1.1.5", "הגדרת Tone of Voice", "pending", "", { category: "content" }),
      createTask("1.1.6", "כתיבת Brand Story", "pending", "", { category: "content" }),
      createTask("1.2.1", "בחירת פלטת צבעים", "pending", "", { category: "design" }),
      createTask("1.2.2", "בחירת פונטים (עברית + אנגלית)", "pending", "", { category: "design" }),
      createTask("1.2.3", "עיצוב לוגו - טיוטות", "pending", "", { category: "design" }),
      createTask("1.2.4", "עיצוב לוגו - גרסה סופית", "pending", "", { category: "design" }),
      createTask("1.2.5", "יצירת וריאציות לוגו", "pending", "", { category: "design" }),
      createTask("1.2.6", "הגדרת סגנון תמונות", "pending", "", { category: "design" }),
      createTask("1.3.1", "יצירת מסמך Brand Guidelines", "pending", "", { category: "design" }),
      createTask("1.3.2", "הכנת קבצי לוגו בפורמטים שונים", "pending", "", { category: "design" }),
    ],
  },
  {
    id: "2",
    name: "Phase 2",
    nameHe: "תשתית טכנית",
    startDate: "2025-02-01",
    endDate: "2025-03-01",
    tasks: [
      createTask("2.1.1", "רכישת דומיין", "pending", "", { category: "development" }),
      createTask("2.1.2", "הקמת חשבון Vercel", "pending", "", { category: "development" }),
      createTask("2.1.3", "הקמת חשבון Supabase", "pending", "", { category: "development" }),
      createTask("2.1.4", "הקמת repository ב-GitHub", "pending", "", { category: "development" }),
      createTask("2.2.1", "אתחול פרויקט Next.js", "completed", "הושלם", {
        category: "development",
        progress: 100,
        subTasks: [
          { id: "2.2.1.1", name: "התקנת dependencies", completed: true },
          { id: "2.2.1.2", name: "הגדרת TypeScript", completed: true },
          { id: "2.2.1.3", name: "הגדרת Tailwind", completed: true },
        ]
      }),
      createTask("2.2.2", "הגדרת Database Schema", "pending", "", { category: "development" }),
      createTask("2.2.3", "הגדרת מערכת Authentication", "pending", "", { category: "development" }),
      createTask("2.2.4", "יצירת API endpoints", "pending", "", { category: "development" }),
      createTask("2.2.5", "אינטגרציה עם ספק תשלומים", "pending", "", { category: "development" }),
    ],
  },
  {
    id: "3",
    name: "Phase 3",
    nameHe: "פיתוח האתר",
    startDate: "2025-02-15",
    endDate: "2025-04-15",
    tasks: [
      createTask("3.1.1", "עיצוב ופיתוח Header/Navigation", "completed", "", { category: "development", progress: 100 }),
      createTask("3.1.2", "עיצוב ופיתוח Footer", "completed", "", { category: "development", progress: 100 }),
      createTask("3.1.3", "עיצוב ופיתוח Landing Page", "completed", "", { category: "development", progress: 100 }),
      createTask("3.1.4", "עיצוב ופיתוח About Page", "pending", "", { category: "development" }),
      createTask("3.1.5", "עיצוב ופיתוח Contact Page", "pending", "", { category: "development" }),
      createTask("3.2.1", "עיצוב ופיתוח Courses List", "pending", "", { category: "development" }),
      createTask("3.2.2", "עיצוב ופיתוח Course Detail Page", "pending", "", { category: "development" }),
      createTask("3.2.3", "עיצוב ופיתוח Cart", "pending", "", { category: "development" }),
      createTask("3.2.4", "עיצוב ופיתוח Checkout", "pending", "", { category: "development" }),
      createTask("3.2.5", "עיצוב ופיתוח Thank You Page", "pending", "", { category: "development" }),
      createTask("3.3.1", "עיצוב Admin Layout", "completed", "", { category: "development", progress: 100 }),
      createTask("3.3.2", "Dashboard Overview", "completed", "", { category: "development", progress: 100 }),
      createTask("3.3.3", "ניהול קורסים", "pending", "", { category: "development" }),
      createTask("3.3.4", "ניהול הזמנות", "pending", "", { category: "development" }),
      createTask("3.3.5", "ניהול משתמשים", "pending", "", { category: "development" }),
      createTask("3.3.6", "Task Tracker (Super User)", "completed", "", { category: "development", progress: 100 }),
      createTask("3.3.7", "דוחות ואנליטיקס", "pending", "", { category: "development" }),
    ],
  },
  {
    id: "4",
    name: "Phase 4",
    nameHe: "שיווק",
    startDate: "2025-03-15",
    endDate: "2025-05-01",
    tasks: [
      createTask("4.1.1", "כתיבת Go-to-Market Strategy", "completed", "נכתב מסמך GTM", { category: "marketing", progress: 100 }),
      createTask("4.1.2", "הגדרת Marketing Funnel", "pending", "", { category: "marketing" }),
      createTask("4.1.3", "כתיבת Content Calendar", "pending", "", { category: "marketing" }),
      createTask("4.2.1", "פתיחת עמוד פייסבוק עסקי", "pending", "", { category: "marketing" }),
      createTask("4.2.2", "פתיחת חשבון אינסטגרם", "pending", "", { category: "marketing" }),
      createTask("4.2.3", "פתיחת ערוץ יוטיוב", "pending", "", { category: "marketing" }),
      createTask("4.2.4", "פתיחת חשבון לינקדאין", "pending", "", { category: "marketing" }),
      createTask("4.2.5", "הגדרת Google Business Profile", "pending", "", { category: "marketing" }),
      createTask("4.3.1", "בחירת פלטפורמת דיוור", "pending", "", { category: "marketing" }),
      createTask("4.3.2", "עיצוב תבנית מייל", "pending", "", { category: "design" }),
      createTask("4.3.3", "כתיבת Welcome Sequence", "pending", "", { category: "content" }),
      createTask("4.3.4", "יצירת Lead Magnet", "pending", "", { category: "content" }),
    ],
  },
  {
    id: "5",
    name: "Phase 5",
    nameHe: "השקה",
    startDate: "2025-04-15",
    endDate: "2025-05-15",
    tasks: [
      createTask("5.1.1", "בדיקות QA מלאות", "pending", "", { category: "testing" }),
      createTask("5.1.2", "בדיקות תשלום", "pending", "", { category: "testing" }),
      createTask("5.1.3", "בדיקות מובייל", "pending", "", { category: "testing" }),
      createTask("5.1.4", "בדיקות SEO", "pending", "", { category: "testing" }),
      createTask("5.1.5", "הכנת תוכן להשקה", "pending", "", { category: "content" }),
      createTask("5.2.1", "השקה רכה", "pending", "", { category: "marketing" }),
      createTask("5.2.2", "איסוף פידבק", "pending", "", { category: "testing" }),
      createTask("5.2.3", "תיקונים ושיפורים", "pending", "", { category: "development" }),
      createTask("5.2.4", "השקה רשמית", "pending", "", { category: "marketing" }),
    ],
  },
];

const statusConfig = {
  pending: {
    label: "ממתין",
    icon: Circle,
    color: "text-navy/40",
    bg: "bg-blush",
  },
  in_progress: {
    label: "בתהליך",
    icon: Clock,
    color: "text-gold-dark",
    bg: "bg-gold/20",
  },
  completed: {
    label: "הושלם",
    icon: CheckCircle,
    color: "text-sage",
    bg: "bg-sage/20",
  },
};

const priorityConfig = {
  low: { label: "נמוכה", color: "text-gray-500", bg: "bg-gray-100" },
  medium: { label: "בינונית", color: "text-yellow-600", bg: "bg-yellow-100" },
  high: { label: "גבוהה", color: "text-red-600", bg: "bg-red-100" },
};

// Format date for display
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("he-IL", { day: "numeric", month: "short" });
};

export default function TasksPage() {
  const [phases, setPhases] = useState<Phase[]>(initialPhases);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [expandedPhases, setExpandedPhases] = useState<string[]>(["1", "2", "3"]);
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list");
  const [editingTask, setEditingTask] = useState<{ phaseId: string; task: Task } | null>(null);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseId)
        ? prev.filter((id) => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const toggleTaskExpand = (taskId: string) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const cycleStatus = (phaseId: string, taskId: string) => {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map((task) => {
            if (task.id !== taskId) return task;
            const statusOrder: TaskStatus[] = ["pending", "in_progress", "completed"];
            const currentIndex = statusOrder.indexOf(task.status);
            const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
            const newProgress = nextStatus === "completed" ? 100 : nextStatus === "in_progress" ? 50 : 0;
            return { ...task, status: nextStatus, progress: newProgress };
          }),
        };
      })
    );
  };

  const updateTaskProgress = (phaseId: string, taskId: string, progress: number) => {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map((task) => {
            if (task.id !== taskId) return task;
            const newStatus: TaskStatus = progress === 100 ? "completed" : progress > 0 ? "in_progress" : "pending";
            return { ...task, progress, status: newStatus };
          }),
        };
      })
    );
  };

  const updateTask = (phaseId: string, taskId: string, updates: Partial<Task>) => {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map((task) => {
            if (task.id !== taskId) return task;
            return { ...task, ...updates };
          }),
        };
      })
    );
  };

  const toggleSubTask = (phaseId: string, taskId: string, subTaskId: string) => {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map((task) => {
            if (task.id !== taskId) return task;
            const newSubTasks = task.subTasks.map((st) =>
              st.id === subTaskId ? { ...st, completed: !st.completed } : st
            );
            const completedCount = newSubTasks.filter((st) => st.completed).length;
            const progress = newSubTasks.length > 0 ? Math.round((completedCount / newSubTasks.length) * 100) : task.progress;
            const newStatus: TaskStatus = progress === 100 ? "completed" : progress > 0 ? "in_progress" : "pending";
            return { ...task, subTasks: newSubTasks, progress, status: newStatus };
          }),
        };
      })
    );
  };

  const addSubTask = (phaseId: string, taskId: string, name: string) => {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map((task) => {
            if (task.id !== taskId) return task;
            const newSubTask: SubTask = {
              id: `${taskId}.${task.subTasks.length + 1}`,
              name,
              completed: false,
            };
            return { ...task, subTasks: [...task.subTasks, newSubTask] };
          }),
        };
      })
    );
  };

  const getStats = () => {
    const allTasks = phases.flatMap((p) => p.tasks);
    const totalProgress = allTasks.reduce((sum, t) => sum + t.progress, 0);
    return {
      total: allTasks.length,
      completed: allTasks.filter((t) => t.status === "completed").length,
      inProgress: allTasks.filter((t) => t.status === "in_progress").length,
      pending: allTasks.filter((t) => t.status === "pending").length,
      avgProgress: Math.round(totalProgress / allTasks.length),
    };
  };

  const stats = getStats();
  const progressPercent = stats.avgProgress;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">מעקב משימות</h1>
          <p className="text-navy/60">עקבי אחרי ההתקדמות של כל שלבי הפרויקט</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex gap-1 border border-blush rounded-lg p-1">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              רשימה
            </Button>
            <Button
              variant={viewMode === "timeline" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("timeline")}
            >
              <Calendar className="w-4 h-4 ml-1" />
              ציר זמן
            </Button>
          </div>
          {/* Filter Buttons */}
          <Button
            variant={filter === "all" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            הכל ({stats.total})
          </Button>
          <Button
            variant={filter === "pending" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
          >
            ממתין ({stats.pending})
          </Button>
          <Button
            variant={filter === "in_progress" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilter("in_progress")}
          >
            בתהליך ({stats.inProgress})
          </Button>
          <Button
            variant={filter === "completed" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            הושלם ({stats.completed})
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-navy">התקדמות כללית</span>
                <span className="text-navy/70">{stats.completed}/{stats.total} משימות הושלמו</span>
              </div>
              <div className="h-4 bg-cream rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-teal to-sage rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="text-4xl font-bold text-teal">
              {progressPercent}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      {viewMode === "timeline" && (
        <Card>
          <CardHeader>
            <CardTitle>ציר זמן הפרויקט</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {phases.map((phase) => {
                const phaseProgress = Math.round(
                  phase.tasks.reduce((sum, t) => sum + t.progress, 0) / phase.tasks.length
                );
                return (
                  <div key={phase.id} className="relative">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-32 text-sm font-medium text-navy">
                        {phase.name}: {phase.nameHe}
                      </div>
                      <div className="text-xs text-navy/60">
                        {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-8 bg-cream rounded-lg overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-l from-teal to-sage rounded-lg transition-all duration-500 flex items-center justify-end px-2"
                          style={{ width: `${phaseProgress}%` }}
                        >
                          {phaseProgress > 15 && (
                            <span className="text-xs font-bold text-white">{phaseProgress}%</span>
                          )}
                        </div>
                        {phaseProgress <= 15 && (
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-navy/60">
                            {phaseProgress}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Phases - List View */}
      <div className="space-y-4">
        {phases.map((phase) => {
          const phaseTasks =
            filter === "all"
              ? phase.tasks
              : phase.tasks.filter((t) => t.status === filter);

          if (phaseTasks.length === 0) return null;

          const phaseProgress = Math.round(
            phase.tasks.reduce((sum, t) => sum + t.progress, 0) / phase.tasks.length
          );

          return (
            <Card key={phase.id}>
              <CardHeader
                className="cursor-pointer hover:bg-cream/50 transition-colors"
                onClick={() => togglePhase(phase.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CardTitle className="text-lg">
                      {phase.name}: {phase.nameHe}
                    </CardTitle>
                    <span className="text-sm text-navy/60">
                      {phaseProgress}% הושלם
                    </span>
                    {phase.startDate && phase.endDate && (
                      <span className="text-xs text-navy/40 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                      </span>
                    )}
                  </div>
                  {expandedPhases.includes(phase.id) ? (
                    <ChevronUp className="w-5 h-5 text-navy/40" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-navy/40" />
                  )}
                </div>
                {/* Mini progress bar */}
                <div className="h-1.5 bg-cream rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-teal rounded-full transition-all duration-300"
                    style={{ width: `${phaseProgress}%` }}
                  />
                </div>
              </CardHeader>

              {expandedPhases.includes(phase.id) && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {phaseTasks.map((task) => {
                      const config = statusConfig[task.status];
                      const StatusIcon = config.icon;
                      const isExpanded = expandedTasks.includes(task.id);
                      const category = taskCategories.find((c) => c.id === task.category);
                      const hasSubTasks = task.subTasks.length > 0;

                      return (
                        <div
                          key={task.id}
                          className="border border-blush/50 rounded-lg overflow-hidden"
                        >
                          {/* Task Main Row */}
                          <div className="flex items-center gap-3 p-3 hover:bg-cream/50 transition-colors group">
                            <button
                              onClick={() => cycleStatus(phase.id, task.id)}
                              className="shrink-0"
                            >
                              <StatusIcon
                                className={cn("w-5 h-5 transition-colors", config.color)}
                              />
                            </button>
                            <span className="text-xs font-mono text-navy/40 w-12">
                              {task.id}
                            </span>

                            {/* Expand button for subtasks */}
                            {hasSubTasks && (
                              <button
                                onClick={() => toggleTaskExpand(task.id)}
                                className="shrink-0"
                              >
                                {isExpanded ? (
                                  <Minus className="w-4 h-4 text-navy/40" />
                                ) : (
                                  <Plus className="w-4 h-4 text-navy/40" />
                                )}
                              </button>
                            )}

                            <div className="flex-1 min-w-0">
                              <span
                                className={cn(
                                  "text-sm block",
                                  task.status === "completed" && "line-through text-navy/50"
                                )}
                              >
                                {task.name}
                              </span>
                              {task.description && (
                                <span className="text-xs text-navy/50 block truncate">
                                  {task.description}
                                </span>
                              )}
                            </div>

                            {/* Category Badge */}
                            {category && (
                              <span className={cn("text-xs px-2 py-0.5 rounded-full", category.color)}>
                                {category.name}
                              </span>
                            )}

                            {/* Progress */}
                            <div className="flex items-center gap-2 w-32">
                              <div className="flex-1 h-2 bg-cream rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-teal rounded-full transition-all duration-300"
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-navy/60 w-8 text-left">
                                {task.progress}%
                              </span>
                            </div>

                            {/* Edit Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTask({ phaseId: phase.id, task });
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            >
                              <Edit3 className="w-4 h-4 text-navy/40 hover:text-navy" />
                            </button>

                            <span
                              className={cn(
                                "text-xs px-2 py-1 rounded-full shrink-0",
                                config.bg,
                                config.color
                              )}
                            >
                              {config.label}
                            </span>
                          </div>

                          {/* Expanded Section - SubTasks & Progress Slider */}
                          {isExpanded && (
                            <div className="border-t border-blush/50 bg-cream/30 p-4 space-y-4">
                              {/* Progress Slider */}
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-navy/70 w-20">התקדמות:</span>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={task.progress}
                                  onChange={(e) =>
                                    updateTaskProgress(phase.id, task.id, parseInt(e.target.value))
                                  }
                                  className="flex-1 h-2 bg-cream rounded-full appearance-none cursor-pointer
                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                                    [&::-webkit-slider-thumb]:bg-teal [&::-webkit-slider-thumb]:cursor-pointer"
                                />
                                <span className="text-sm font-bold text-navy w-12 text-left">
                                  {task.progress}%
                                </span>
                              </div>

                              {/* SubTasks */}
                              {hasSubTasks && (
                                <div className="space-y-2">
                                  <span className="text-sm font-medium text-navy/70">משימות משנה:</span>
                                  {task.subTasks.map((subTask) => (
                                    <div
                                      key={subTask.id}
                                      className="flex items-center gap-3 pr-6"
                                    >
                                      <button
                                        onClick={() => toggleSubTask(phase.id, task.id, subTask.id)}
                                        className="shrink-0"
                                      >
                                        {subTask.completed ? (
                                          <CheckCircle className="w-4 h-4 text-sage" />
                                        ) : (
                                          <Circle className="w-4 h-4 text-navy/30" />
                                        )}
                                      </button>
                                      <span
                                        className={cn(
                                          "text-sm",
                                          subTask.completed && "line-through text-navy/50"
                                        )}
                                      >
                                        {subTask.name}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Dates */}
                              {(task.startDate || task.dueDate) && (
                                <div className="flex items-center gap-4 text-sm text-navy/60">
                                  {task.startDate && (
                                    <span>התחלה: {formatDate(task.startDate)}</span>
                                  )}
                                  {task.dueDate && (
                                    <span>יעד: {formatDate(task.dueDate)}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-blush">
              <h3 className="text-lg font-bold text-navy">עריכת משימה</h3>
              <button onClick={() => setEditingTask(null)}>
                <X className="w-5 h-5 text-navy/50 hover:text-navy" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Task Name */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">שם המשימה</label>
                <input
                  type="text"
                  value={editingTask.task.name}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      task: { ...editingTask.task, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">תיאור</label>
                <textarea
                  value={editingTask.task.description || ""}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      task: { ...editingTask.task, description: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal resize-none"
                />
              </div>

              {/* Progress */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  התקדמות: {editingTask.task.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editingTask.task.progress}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      task: { ...editingTask.task, progress: parseInt(e.target.value) },
                    })
                  }
                  className="w-full h-2 bg-cream rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-teal [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">תאריך התחלה</label>
                  <input
                    type="date"
                    value={editingTask.task.startDate || ""}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        task: { ...editingTask.task, startDate: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">תאריך יעד</label>
                  <input
                    type="date"
                    value={editingTask.task.dueDate || ""}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        task: { ...editingTask.task, dueDate: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">קטגוריה</label>
                <select
                  value={editingTask.task.category || ""}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      task: { ...editingTask.task, category: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="">ללא קטגוריה</option>
                  {taskCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">עדיפות</label>
                <select
                  value={editingTask.task.priority}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      task: { ...editingTask.task, priority: e.target.value as TaskPriority },
                    })
                  }
                  className="w-full px-3 py-2 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="low">נמוכה</option>
                  <option value="medium">בינונית</option>
                  <option value="high">גבוהה</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">הערות</label>
                <textarea
                  value={editingTask.task.notes}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      task: { ...editingTask.task, notes: e.target.value },
                    })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal resize-none"
                />
              </div>

              {/* SubTasks Management */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">משימות משנה</label>
                <div className="space-y-2 mb-2">
                  {editingTask.task.subTasks.map((subTask, idx) => (
                    <div key={subTask.id} className="flex items-center gap-2">
                      <span className="flex-1 text-sm text-navy/70">{subTask.name}</span>
                      <button
                        onClick={() => {
                          const newSubTasks = editingTask.task.subTasks.filter(
                            (_, i) => i !== idx
                          );
                          setEditingTask({
                            ...editingTask,
                            task: { ...editingTask.task, subTasks: newSubTasks },
                          });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="הוסף משימת משנה..."
                    id="new-subtask-input"
                    className="flex-1 px-3 py-2 border border-blush rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const input = e.target as HTMLInputElement;
                        if (input.value.trim()) {
                          const newSubTask: SubTask = {
                            id: `${editingTask.task.id}.${editingTask.task.subTasks.length + 1}`,
                            name: input.value.trim(),
                            completed: false,
                          };
                          setEditingTask({
                            ...editingTask,
                            task: {
                              ...editingTask.task,
                              subTasks: [...editingTask.task.subTasks, newSubTask],
                            },
                          });
                          input.value = "";
                        }
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      const input = document.getElementById("new-subtask-input") as HTMLInputElement;
                      if (input && input.value.trim()) {
                        const newSubTask: SubTask = {
                          id: `${editingTask.task.id}.${editingTask.task.subTasks.length + 1}`,
                          name: input.value.trim(),
                          completed: false,
                        };
                        setEditingTask({
                          ...editingTask,
                          task: {
                            ...editingTask.task,
                            subTasks: [...editingTask.task.subTasks, newSubTask],
                          },
                        });
                        input.value = "";
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 p-4 border-t border-blush">
              <Button variant="outline" onClick={() => setEditingTask(null)}>
                ביטול
              </Button>
              <Button
                onClick={() => {
                  updateTask(editingTask.phaseId, editingTask.task.id, editingTask.task);
                  setEditingTask(null);
                }}
              >
                <Save className="w-4 h-4 ml-1" />
                שמור
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
