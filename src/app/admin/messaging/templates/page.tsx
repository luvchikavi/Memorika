"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  MessageCircle,
  Tag,
  Users,
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  platform: string;
  category: string;
  content: string;
  mediaUrl: string | null;
  targetAudience: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: {
    sentMessages: number;
  };
}

const audienceOptions = [
  { value: "alumni", label: "בוגרים" },
  { value: "interested", label: "מתעניינים" },
  { value: "followers", label: "עוקבים" },
  { value: "patients", label: "מטופלים (קליניקה)" },
  { value: "other", label: "אחר" },
];

const platforms = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "all", label: "כל הפלטפורמות" },
];

const categories = [
  { value: "welcome", label: "ברוכים הבאים" },
  { value: "reminder", label: "תזכורת" },
  { value: "promotion", label: "מבצע" },
  { value: "payment", label: "תשלום" },
  { value: "course_info", label: "מידע על קורס" },
  { value: "follow_up", label: "מעקב" },
  { value: "custom", label: "מותאם אישית" },
];

const categoryColors: Record<string, string> = {
  welcome: "bg-green-100 text-green-700",
  reminder: "bg-yellow-100 text-yellow-700",
  promotion: "bg-purple-100 text-purple-700",
  payment: "bg-blue-100 text-blue-700",
  course_info: "bg-teal-100 text-teal-700",
  follow_up: "bg-orange-100 text-orange-700",
  custom: "bg-gray-100 text-gray-700",
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    platform: "whatsapp",
    category: "custom",
    content: "",
    mediaUrl: "",
    targetAudience: [] as string[],
    isActive: true,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/social/templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingTemplate
        ? `/api/social/templates/${editingTemplate.id}`
        : "/api/social/templates";
      const method = editingTemplate ? "PUT" : "POST";

      // Serialize targetAudience as JSON string
      const submitData = {
        ...formData,
        targetAudience: formData.targetAudience.length > 0
          ? JSON.stringify(formData.targetAudience)
          : null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        fetchTemplates();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      platform: template.platform,
      category: template.category,
      content: template.content,
      mediaUrl: template.mediaUrl || "",
      targetAudience: template.targetAudience ? JSON.parse(template.targetAudience) : [],
      isActive: template.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את התבנית?")) return;

    try {
      const res = await fetch(`/api/social/templates/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTemplate(null);
    setFormData({
      name: "",
      platform: "whatsapp",
      category: "custom",
      content: "",
      mediaUrl: "",
      targetAudience: [],
      isActive: true,
    });
  };

  const toggleAudience = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(value)
        ? prev.targetAudience.filter((v) => v !== value)
        : [...prev.targetAudience, value],
    }));
  };

  const getAudienceLabels = (targetAudience: string | null) => {
    if (!targetAudience) return "כולם";
    try {
      const parsed = JSON.parse(targetAudience) as string[];
      if (parsed.length === 0) return "כולם";
      return parsed.map((v) => audienceOptions.find((a) => a.value === v)?.label || v).join(", ");
    } catch {
      return "כולם";
    }
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
          <h2 className="text-2xl font-bold text-navy">תבניות הודעות</h2>
          <p className="text-navy/60">צור תבניות הודעות לשימוש חוזר</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-teal hover:bg-teal-dark"
        >
          <Plus className="h-4 w-4 ml-2" />
          תבנית חדשה
        </Button>
      </div>

      {/* Available Placeholders Info */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-navy/70">
            <strong>משתנים זמינים:</strong>{" "}
            <code className="bg-gray-100 px-1 rounded">{"{{firstName}}"}</code> - שם פרטי,{" "}
            <code className="bg-gray-100 px-1 rounded">{"{{lastName}}"}</code> - שם משפחה,{" "}
            <code className="bg-gray-100 px-1 rounded">{"{{fullName}}"}</code> - שם מלא,{" "}
            <code className="bg-gray-100 px-1 rounded">{"{{email}}"}</code> - אימייל,{" "}
            <code className="bg-gray-100 px-1 rounded">{"{{phone}}"}</code> - טלפון
          </p>
        </CardContent>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-navy/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingTemplate ? "עריכת תבנית" : "תבנית חדשה"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">
                    שם התבנית *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="לדוגמא: תזכורת לקורס"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1">
                      פלטפורמה
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) =>
                        setFormData({ ...formData, platform: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-blush rounded-lg"
                    >
                      {platforms.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1">
                      קטגוריה
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-blush rounded-lg"
                    >
                      {categories.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    <Users className="h-4 w-4 inline ml-1" />
                    קהל יעד
                  </label>
                  <p className="text-xs text-navy/60 mb-2">
                    בחר את סוגי אנשי הקשר שיקבלו הודעות מתבנית זו. השאר ריק לכולם.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {audienceOptions.map((audience) => (
                      <button
                        key={audience.value}
                        type="button"
                        onClick={() => toggleAudience(audience.value)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          formData.targetAudience.includes(audience.value)
                            ? "bg-teal text-white border-teal"
                            : "bg-white text-navy/70 border-gray-200 hover:border-teal"
                        }`}
                      >
                        {audience.label}
                      </button>
                    ))}
                  </div>
                  {formData.targetAudience.length > 0 && (
                    <p className="text-xs text-teal mt-2">
                      נבחרו: {formData.targetAudience.map((v) => audienceOptions.find((a) => a.value === v)?.label).join(", ")}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-1">
                    תוכן ההודעה *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={6}
                    className="w-full px-3 py-2 border border-blush rounded-lg resize-none"
                    placeholder="שלום {{firstName}},

זוהי תזכורת לקורס שלך..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-1">
                    קישור למדיה (אופציונלי)
                  </label>
                  <Input
                    value={formData.mediaUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, mediaUrl: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span>תבנית פעילה</span>
                </label>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-teal hover:bg-teal-dark">
                    {editingTemplate ? "שמור שינויים" : "צור תבנית"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    ביטול
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-navy/30" />
            <p className="text-navy/60 mb-4">אין תבניות עדיין</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-teal hover:bg-teal-dark"
            >
              <Plus className="h-4 w-4 ml-2" />
              צור תבנית ראשונה
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`${!template.isActive ? "opacity-60" : ""}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        categoryColors[template.category] || categoryColors.custom
                      }`}
                    >
                      {categories.find((c) => c.value === template.category)?.label ||
                        template.category}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                      {platforms.find((p) => p.value === template.platform)?.label ||
                        template.platform}
                    </span>
                  </div>
                  {!template.isActive && (
                    <span className="text-xs text-red-500">לא פעיל</span>
                  )}
                </div>

                <h3 className="font-bold text-navy mb-2">{template.name}</h3>

                {/* Target Audience */}
                <div className="flex items-center gap-1 text-xs text-navy/60 mb-2">
                  <Users className="h-3 w-3" />
                  <span>קהל יעד: {getAudienceLabels(template.targetAudience)}</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-navy/70 whitespace-pre-wrap line-clamp-4">
                  {template.content}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-navy/50">
                    {template._count?.sentMessages || 0} הודעות נשלחו
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(template)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
