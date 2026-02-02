"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GitBranch,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ShoppingCart,
  Mail,
  Users,
  ArrowDown,
  CheckCircle2,
  Clock,
  BarChart3,
  Layers,
  ExternalLink,
  Copy,
} from "lucide-react";

// Sample funnel templates
const funnelTemplates = [
  {
    id: "lead-magnet",
    name: "משפך ליד מגנט",
    description: "דף נחיתה → תוכן חינמי → סדרת מיילים → מכירה",
    steps: [
      { type: "landing", label: "דף נחיתה", icon: Eye },
      { type: "lead-magnet", label: "ליד מגנט", icon: Mail },
      { type: "email-sequence", label: "סדרת מיילים", icon: Mail },
      { type: "sales-page", label: "דף מכירה", icon: ShoppingCart },
    ],
    color: "bg-blue-500",
  },
  {
    id: "webinar",
    name: "משפך וובינר",
    description: "הרשמה לוובינר → תזכורות → וובינר → הצעה",
    steps: [
      { type: "registration", label: "הרשמה", icon: Users },
      { type: "reminders", label: "תזכורות", icon: Clock },
      { type: "webinar", label: "וובינר", icon: Eye },
      { type: "offer", label: "הצעה", icon: ShoppingCart },
    ],
    color: "bg-purple-500",
  },
  {
    id: "direct-sale",
    name: "משפך מכירה ישירה",
    description: "מודעה → דף מכירה → עגלה → תשלום",
    steps: [
      { type: "ad", label: "מודעה", icon: Eye },
      { type: "sales-page", label: "דף מכירה", icon: BarChart3 },
      { type: "cart", label: "עגלה", icon: ShoppingCart },
      { type: "checkout", label: "תשלום", icon: CheckCircle2 },
    ],
    color: "bg-green-500",
  },
];

interface Funnel {
  id: string;
  name: string;
  description: string;
  template: string;
  isActive: boolean;
  stats: {
    visitors: number;
    leads: number;
    sales: number;
    revenue: number;
  };
  createdAt: string;
}

export default function FunnelsPage() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [newFunnelName, setNewFunnelName] = useState("");

  // Mock data for demonstration
  useEffect(() => {
    setFunnels([
      {
        id: "1",
        name: "משפך קורס זיכרון מתקדם",
        description: "משפך ליד מגנט לקורס הזיכרון",
        template: "lead-magnet",
        isActive: true,
        stats: { visitors: 1250, leads: 180, sales: 12, revenue: 8400 },
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "וובינר טכניקות למידה",
        description: "משפך וובינר חינמי",
        template: "webinar",
        isActive: false,
        stats: { visitors: 450, leads: 95, sales: 5, revenue: 3500 },
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const handleCreateFunnel = () => {
    if (!selectedTemplate || !newFunnelName) return;

    const template = funnelTemplates.find((t) => t.id === selectedTemplate);
    const newFunnel: Funnel = {
      id: Date.now().toString(),
      name: newFunnelName,
      description: template?.description || "",
      template: selectedTemplate,
      isActive: true,
      stats: { visitors: 0, leads: 0, sales: 0, revenue: 0 },
      createdAt: new Date().toISOString(),
    };

    setFunnels([newFunnel, ...funnels]);
    setShowCreateModal(false);
    setSelectedTemplate(null);
    setNewFunnelName("");
  };

  const toggleFunnelStatus = (id: string) => {
    setFunnels((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f))
    );
  };

  const deleteFunnel = (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את המשפך?")) return;
    setFunnels((prev) => prev.filter((f) => f.id !== id));
  };

  const getTemplateInfo = (templateId: string) => {
    return funnelTemplates.find((t) => t.id === templateId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">משפכי מכירה</h2>
          <p className="text-navy/60">בנה ונהל משפכי מכירה אוטומטיים</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-teal hover:bg-teal-dark text-white"
        >
          <Plus className="h-4 w-4 ml-2" />
          צור משפך חדש
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GitBranch className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">{funnels.length}</p>
                <p className="text-sm text-navy/60">משפכים</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">
                  {funnels.filter((f) => f.isActive).length}
                </p>
                <p className="text-sm text-navy/60">פעילים</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">
                  {funnels.reduce((sum, f) => sum + f.stats.leads, 0)}
                </p>
                <p className="text-sm text-navy/60">לידים</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal/20 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-teal" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">
                  ₪{funnels.reduce((sum, f) => sum + f.stats.revenue, 0).toLocaleString()}
                </p>
                <p className="text-sm text-navy/60">הכנסות</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-navy/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>צור משפך מכירה חדש</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Funnel Name */}
              <div>
                <Label>שם המשפך *</Label>
                <Input
                  value={newFunnelName}
                  onChange={(e) => setNewFunnelName(e.target.value)}
                  placeholder="לדוגמא: משפך קורס זיכרון"
                />
              </div>

              {/* Template Selection */}
              <div>
                <Label className="mb-3 block">בחר תבנית</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {funnelTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedTemplate === template.id
                          ? "border-teal bg-teal/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`${template.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}
                      >
                        <Layers className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-bold text-navy mb-1">{template.name}</h4>
                      <p className="text-sm text-navy/60 mb-3">
                        {template.description}
                      </p>

                      {/* Steps Preview */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {template.steps.map((step, idx) => (
                          <div key={idx} className="flex items-center">
                            <div className="bg-gray-100 px-2 py-1 rounded text-xs text-navy/70 flex items-center gap-1">
                              <step.icon className="h-3 w-3" />
                              {step.label}
                            </div>
                            {idx < template.steps.length - 1 && (
                              <ArrowDown className="h-3 w-3 text-gray-300 mx-1 rotate-[-90deg]" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreateFunnel}
                  disabled={!selectedTemplate || !newFunnelName}
                  className="bg-teal hover:bg-teal-dark"
                >
                  צור משפך
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedTemplate(null);
                    setNewFunnelName("");
                  }}
                >
                  ביטול
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Funnels List */}
      {funnels.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <GitBranch className="h-12 w-12 mx-auto mb-4 text-navy/30" />
            <p className="text-navy/60 mb-4">
              אין משפכי מכירה עדיין. צור את המשפך הראשון!
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-teal hover:bg-teal-dark"
            >
              <Plus className="h-4 w-4 ml-2" />
              צור משפך חדש
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {funnels.map((funnel) => {
            const template = getTemplateInfo(funnel.template);

            return (
              <Card
                key={funnel.id}
                className={`${!funnel.isActive ? "opacity-60" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Funnel Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`${template?.color || "bg-gray-500"} w-10 h-10 rounded-lg flex items-center justify-center`}
                        >
                          <GitBranch className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-navy text-lg">
                            {funnel.name}
                          </h3>
                          <p className="text-sm text-navy/60">
                            {funnel.description}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            funnel.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {funnel.isActive ? "פעיל" : "לא פעיל"}
                        </span>
                      </div>

                      {/* Funnel Steps */}
                      {template && (
                        <div className="flex items-center gap-2 mt-3">
                          {template.steps.map((step, idx) => (
                            <div key={idx} className="flex items-center">
                              <div className="bg-gray-100 px-3 py-1.5 rounded flex items-center gap-1.5">
                                <step.icon className="h-4 w-4 text-navy/60" />
                                <span className="text-sm text-navy/70">
                                  {step.label}
                                </span>
                              </div>
                              {idx < template.steps.length - 1 && (
                                <ArrowDown className="h-4 w-4 text-gray-300 mx-1 rotate-[-90deg]" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 py-3 px-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-xl font-bold text-navy">
                          {funnel.stats.visitors.toLocaleString()}
                        </p>
                        <p className="text-xs text-navy/50">מבקרים</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-navy">
                          {funnel.stats.leads.toLocaleString()}
                        </p>
                        <p className="text-xs text-navy/50">לידים</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-navy">
                          {funnel.stats.sales}
                        </p>
                        <p className="text-xs text-navy/50">מכירות</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-teal">
                          ₪{funnel.stats.revenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-navy/50">הכנסות</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4 ml-1" />
                        ערוך
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFunnelStatus(funnel.id)}
                      >
                        {funnel.isActive ? "השבת" : "הפעל"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 ml-1" />
                        צפה
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 ml-1" />
                        שכפל
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteFunnel(funnel.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Template Library Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-teal" />
            ספריית תבניות משפכים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-navy/60 mb-4">
            בחר תבנית מוכנה להתחלה מהירה או בנה משפך מותאם אישית
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {funnelTemplates.map((template) => (
              <div
                key={template.id}
                className="border rounded-lg p-4 hover:border-teal transition-colors"
              >
                <div
                  className={`${template.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}
                >
                  <Layers className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-bold text-navy mb-1">{template.name}</h4>
                <p className="text-sm text-navy/60 mb-4">{template.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setShowCreateModal(true);
                  }}
                >
                  השתמש בתבנית
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
