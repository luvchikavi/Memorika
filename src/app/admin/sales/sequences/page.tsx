"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Plus,
  Play,
  Pause,
  Edit,
  Trash2,
  X,
  Clock,
  Send,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  delayDays: number;
  delayHours: number;
  order: number;
  isActive: boolean;
}

interface EmailSequence {
  id: string;
  name: string;
  description: string | null;
  trigger: string;
  isActive: boolean;
  emails: EmailTemplate[];
  createdAt: string;
}

// Trigger options
const triggerOptions = [
  { value: "lead_created", label: "ליד חדש נוצר", description: "כשמישהו נרשם או משאיר פרטים" },
  { value: "lead_magnet", label: "הורדת Lead Magnet", description: "כשמישהו מוריד תוכן חינמי" },
  { value: "cart_abandoned", label: "עגלה נטושה", description: "כשמישהו עוזב עגלת קניות" },
  { value: "purchase_complete", label: "רכישה הושלמה", description: "אחרי רכישה מוצלחת" },
  { value: "course_started", label: "התחלת קורס", description: "כשמישהו מתחיל קורס" },
  { value: "manual", label: "ידני", description: "הפעלה ידנית בלבד" },
];

// Pre-built sequence templates
const sequenceTemplates = [
  {
    name: "Welcome Sequence",
    description: "סדרת מיילים לקבלת פנים ללידים חדשים",
    trigger: "lead_created",
    emails: [
      { name: "ברוכים הבאים", subject: "ברוכים הבאים למשפחת Memorika! 🎉", delayDays: 0, delayHours: 0 },
      { name: "הכירי אותי", subject: "הסיפור שלי - ואיך זה קשור אלייך", delayDays: 1, delayHours: 0 },
      { name: "טיפ ראשון", subject: "טיפ זיכרון שישנה לך את החיים", delayDays: 3, delayHours: 0 },
      { name: "הזמנה לפעולה", subject: "מוכנה לצעד הבא?", delayDays: 5, delayHours: 0 },
    ],
  },
  {
    name: "Cart Abandonment",
    description: "שחזור עגלות נטושות",
    trigger: "cart_abandoned",
    emails: [
      { name: "שכחת משהו?", subject: "שכחת משהו בעגלה? 🛒", delayDays: 0, delayHours: 1 },
      { name: "עדיין מחכה", subject: "העגלה שלך עדיין מחכה לך", delayDays: 1, delayHours: 0 },
      { name: "הנחה מיוחדת", subject: "מתנה קטנה בשבילך - 10% הנחה ⭐", delayDays: 3, delayHours: 0 },
    ],
  },
  {
    name: "Post-Purchase",
    description: "מיילים אחרי רכישה",
    trigger: "purchase_complete",
    emails: [
      { name: "תודה על הרכישה", subject: "תודה! הנה מה שצריך לדעת 💜", delayDays: 0, delayHours: 0 },
      { name: "איך היה?", subject: "איך עובר לך עד עכשיו?", delayDays: 7, delayHours: 0 },
      { name: "בקשת ביקורת", subject: "אשמח לשמוע את דעתך!", delayDays: 14, delayHours: 0 },
    ],
  },
];

export default function SequencesPage() {
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSequence, setEditingSequence] = useState<EmailSequence | null>(null);
  const [expandedSequences, setExpandedSequences] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    trigger: "lead_created",
    isActive: true,
    emails: [] as Partial<EmailTemplate>[],
  });

  useEffect(() => {
    fetchSequences();
  }, []);

  const fetchSequences = async () => {
    try {
      const res = await fetch("/api/sales/sequences");
      if (res.ok) {
        const data = await res.json();
        setSequences(data);
      }
    } catch (error) {
      console.error("Error fetching sequences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/sales/sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchSequences();
        closeModal();
      }
    } catch (error) {
      console.error("Error creating sequence:", error);
    }
  };

  const toggleSequenceActive = async (sequenceId: string, isActive: boolean) => {
    // TODO: Implement API call to toggle sequence active status
    setSequences((prev) =>
      prev.map((s) => (s.id === sequenceId ? { ...s, isActive } : s))
    );
  };

  const useTemplate = (template: typeof sequenceTemplates[0]) => {
    setFormData({
      name: template.name,
      description: template.description,
      trigger: template.trigger,
      isActive: true,
      emails: template.emails.map((e, i) => ({
        ...e,
        body: "",
        order: i,
        isActive: true,
      })),
    });
    setShowCreateModal(true);
  };

  const addEmail = () => {
    setFormData((prev) => ({
      ...prev,
      emails: [
        ...prev.emails,
        {
          name: `מייל ${prev.emails.length + 1}`,
          subject: "",
          body: "",
          delayDays: prev.emails.length === 0 ? 0 : 1,
          delayHours: 0,
          order: prev.emails.length,
          isActive: true,
        },
      ],
    }));
  };

  const removeEmail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index),
    }));
  };

  const updateEmail = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      emails: prev.emails.map((e, i) =>
        i === index ? { ...e, [field]: value } : e
      ),
    }));
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingSequence(null);
    setFormData({
      name: "",
      description: "",
      trigger: "lead_created",
      isActive: true,
      emails: [],
    });
  };

  const toggleExpanded = (id: string) => {
    setExpandedSequences((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">סדרות מיילים</h2>
          <p className="text-navy/60">נהל אוטומציות מיילים לטיפוח לידים ולקוחות</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 ml-2" />
          סדרה חדשה
        </Button>
      </div>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">תבניות מוכנות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sequenceTemplates.map((template) => (
              <div
                key={template.name}
                className="p-4 border border-blush rounded-lg hover:border-teal hover:bg-teal/5 cursor-pointer transition-colors"
                onClick={() => useTemplate(template)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-teal" />
                  <h4 className="font-medium text-navy">{template.name}</h4>
                </div>
                <p className="text-sm text-navy/60 mb-2">{template.description}</p>
                <div className="flex items-center gap-2 text-xs text-navy/50">
                  <span>{template.emails.length} מיילים</span>
                  <span>•</span>
                  <span>{triggerOptions.find((t) => t.value === template.trigger)?.label}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sequences List */}
      <div className="space-y-4">
        {sequences.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-navy/30" />
              <h3 className="text-lg font-medium text-navy mb-2">אין סדרות מיילים</h3>
              <p className="text-navy/60 mb-4">צור סדרת מיילים ראשונה או השתמש בתבנית מוכנה</p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 ml-2" />
                צור סדרה חדשה
              </Button>
            </CardContent>
          </Card>
        ) : (
          sequences.map((sequence) => {
            const isExpanded = expandedSequences.includes(sequence.id);
            const triggerInfo = triggerOptions.find((t) => t.value === sequence.trigger);

            return (
              <Card key={sequence.id}>
                <CardHeader
                  className="cursor-pointer hover:bg-cream/50 transition-colors"
                  onClick={() => toggleExpanded(sequence.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          sequence.isActive ? "bg-green-100" : "bg-gray-100"
                        )}
                      >
                        <Mail
                          className={cn(
                            "h-5 w-5",
                            sequence.isActive ? "text-green-600" : "text-gray-400"
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-navy">{sequence.name}</h3>
                        <p className="text-sm text-navy/60">
                          {triggerInfo?.label} • {sequence.emails.length} מיילים
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSequenceActive(sequence.id, !sequence.isActive);
                        }}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          sequence.isActive
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        )}
                      >
                        {sequence.isActive ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-navy/40" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-navy/40" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="border-t border-blush pt-4">
                      {sequence.description && (
                        <p className="text-sm text-navy/70 mb-4">{sequence.description}</p>
                      )}

                      {/* Email Timeline */}
                      <div className="space-y-3">
                        {sequence.emails.map((email, index) => (
                          <div
                            key={email.id}
                            className="flex items-start gap-4 p-3 bg-cream/50 rounded-lg"
                          >
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white text-sm font-medium">
                                {index + 1}
                              </div>
                              {index < sequence.emails.length - 1 && (
                                <div className="w-0.5 h-full bg-teal/30 mt-1" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-navy">{email.name}</h4>
                                <div className="flex items-center gap-1 text-xs text-navy/50">
                                  <Clock className="h-3 w-3" />
                                  {email.delayDays > 0 && `${email.delayDays} ימים`}
                                  {email.delayHours > 0 && ` ${email.delayHours} שעות`}
                                  {email.delayDays === 0 && email.delayHours === 0 && "מיידי"}
                                </div>
                              </div>
                              <p className="text-sm text-navy/70 mt-1">{email.subject}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-blush">
              <h3 className="text-lg font-bold text-navy">
                {editingSequence ? "עריכת סדרה" : "יצירת סדרה חדשה"}
              </h3>
              <button onClick={closeModal}>
                <X className="w-5 h-5 text-navy/50 hover:text-navy" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Basic Info */}
              <Input
                label="שם הסדרה"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">תיאור</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">טריגר</label>
                <select
                  value={formData.trigger}
                  onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  {triggerOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} - {opt.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Emails */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-navy">מיילים בסדרה</label>
                  <Button type="button" size="sm" variant="outline" onClick={addEmail}>
                    <Plus className="h-4 w-4 ml-1" />
                    הוסף מייל
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.emails.map((email, index) => (
                    <div key={index} className="p-4 border border-blush rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-navy/30" />
                          <span className="font-medium text-navy">מייל {index + 1}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEmail(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <Input
                          label="שם פנימי"
                          value={email.name || ""}
                          onChange={(e) => updateEmail(index, "name", e.target.value)}
                          placeholder="למשל: מייל ברוכים הבאים"
                        />

                        <Input
                          label="נושא המייל"
                          value={email.subject || ""}
                          onChange={(e) => updateEmail(index, "subject", e.target.value)}
                          placeholder="הנושא שיופיע בתיבת הדואר"
                        />

                        <div>
                          <label className="block text-sm font-medium text-navy mb-1.5">
                            תוכן המייל
                          </label>
                          <textarea
                            value={email.body || ""}
                            onChange={(e) => updateEmail(index, "body", e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal resize-none text-sm"
                            placeholder="כתוב את תוכן המייל כאן..."
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-navy mb-1.5">
                              עיכוב (ימים)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={email.delayDays || 0}
                              onChange={(e) =>
                                updateEmail(index, "delayDays", parseInt(e.target.value) || 0)
                              }
                              className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-navy mb-1.5">
                              עיכוב (שעות)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="23"
                              value={email.delayHours || 0}
                              onChange={(e) =>
                                updateEmail(index, "delayHours", parseInt(e.target.value) || 0)
                              }
                              className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.emails.length === 0 && (
                    <div className="text-center py-8 text-navy/50 border-2 border-dashed border-blush rounded-lg">
                      <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>אין מיילים בסדרה</p>
                      <p className="text-sm">לחץ "הוסף מייל" כדי להתחיל</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-2 pt-4 border-t border-blush">
                <Button type="button" variant="outline" onClick={closeModal}>
                  ביטול
                </Button>
                <Button type="submit" disabled={formData.emails.length === 0}>
                  <Send className="h-4 w-4 ml-2" />
                  {editingSequence ? "עדכן" : "צור סדרה"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
