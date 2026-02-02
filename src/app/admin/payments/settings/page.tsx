"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Check,
  X,
  Loader2,
  Settings,
  Star,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Gateway configurations
const gateways = [
  {
    id: "tranzila",
    name: "Tranzila",
    nameHe: "טרנזילה",
    description: "שער תשלום ישראלי מוביל לכרטיסי אשראי",
    logo: "🏦",
    fields: [
      { key: "terminalId", label: "Terminal Name", placeholder: "your_terminal", type: "text" },
      { key: "apiKey", label: "API Key (אופציונלי)", placeholder: "", type: "password" },
    ],
  },
  {
    id: "cardcom",
    name: "CardCom",
    nameHe: "קארדקום",
    description: "סליקה וחשבוניות אונליין",
    logo: "💳",
    fields: [
      { key: "terminalId", label: "Terminal Number", placeholder: "1000", type: "text" },
      { key: "apiKey", label: "API Key", placeholder: "", type: "password" },
      { key: "apiSecret", label: "API Password", placeholder: "", type: "password" },
    ],
  },
  {
    id: "payplus",
    name: "PayPlus",
    nameHe: "פייפלוס",
    description: "פתרון תשלומים מתקדם עם חשבוניות",
    logo: "✨",
    fields: [
      { key: "apiKey", label: "API Key", placeholder: "", type: "password" },
      { key: "apiSecret", label: "Secret Key", placeholder: "", type: "password" },
      { key: "terminalId", label: "Terminal UID", placeholder: "", type: "text" },
    ],
  },
  {
    id: "morning",
    name: "Morning",
    nameHe: "מורנינג (Greeninvoice)",
    description: "הפקת חשבוניות וקבלות דיגיטליות",
    logo: "🌅",
    fields: [
      { key: "apiKey", label: "API ID", placeholder: "", type: "text" },
      { key: "apiSecret", label: "API Secret", placeholder: "", type: "password" },
    ],
  },
  {
    id: "bit",
    name: "Bit",
    nameHe: "ביט",
    description: "תשלומים מיידיים באפליקציית ביט",
    logo: "📱",
    fields: [
      { key: "apiKey", label: "Business ID", placeholder: "", type: "text" },
      { key: "apiSecret", label: "API Secret", placeholder: "", type: "password" },
    ],
  },
  {
    id: "paybox",
    name: "PayBox",
    nameHe: "פייבוקס",
    description: "תשלומים דיגיטליים ב-QR",
    logo: "📲",
    fields: [
      { key: "apiKey", label: "Business ID", placeholder: "", type: "text" },
      { key: "apiSecret", label: "API Key", placeholder: "", type: "password" },
    ],
  },
];

interface GatewaySettings {
  id: string;
  gateway: string;
  isActive: boolean;
  isDefault: boolean;
  terminalId: string | null;
  apiKey: string | null;
  apiSecret: string | null;
  webhookSecret: string | null;
  settings: string | null;
  vatRate: number;
  invoicePrefix: string | null;
  receiptPrefix: string | null;
}

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<Record<string, GatewaySettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, { success: boolean; message: string }>>({});
  const [expandedGateway, setExpandedGateway] = useState<string | null>("tranzila");
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/payments/settings");
      if (res.ok) {
        const data: GatewaySettings[] = await res.json();
        const settingsMap: Record<string, GatewaySettings> = {};
        const formDataMap: Record<string, Record<string, string>> = {};

        data.forEach((s) => {
          settingsMap[s.gateway] = s;
          formDataMap[s.gateway] = {
            terminalId: s.terminalId || "",
            apiKey: s.apiKey || "",
            apiSecret: s.apiSecret || "",
            webhookSecret: s.webhookSecret || "",
            vatRate: s.vatRate?.toString() || "17",
            invoicePrefix: s.invoicePrefix || "",
            receiptPrefix: s.receiptPrefix || "",
          };
        });

        setSettings(settingsMap);
        setFormData(formDataMap);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (gatewayId: string) => {
    setSaving(gatewayId);
    try {
      const data = formData[gatewayId] || {};
      const res = await fetch("/api/payments/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gateway: gatewayId,
          isActive: settings[gatewayId]?.isActive ?? false,
          isDefault: settings[gatewayId]?.isDefault ?? false,
          terminalId: data.terminalId || null,
          apiKey: data.apiKey || null,
          apiSecret: data.apiSecret || null,
          webhookSecret: data.webhookSecret || null,
          vatRate: parseFloat(data.vatRate) || 17,
          invoicePrefix: data.invoicePrefix || null,
          receiptPrefix: data.receiptPrefix || null,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSettings((prev) => ({ ...prev, [gatewayId]: updated }));
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(null);
    }
  };

  const handleToggleActive = async (gatewayId: string, isActive: boolean) => {
    try {
      const res = await fetch("/api/payments/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gateway: gatewayId,
          isActive,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSettings((prev) => ({ ...prev, [gatewayId]: updated }));
      }
    } catch (error) {
      console.error("Error toggling gateway:", error);
    }
  };

  const handleSetDefault = async (gatewayId: string) => {
    try {
      const res = await fetch("/api/payments/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gateway: gatewayId,
          isDefault: true,
        }),
      });

      if (res.ok) {
        // Refresh all settings since we changed defaults
        fetchSettings();
      }
    } catch (error) {
      console.error("Error setting default:", error);
    }
  };

  const handleTestConnection = async (gatewayId: string) => {
    setTesting(gatewayId);
    setTestResult((prev) => ({ ...prev, [gatewayId]: { success: false, message: "" } }));

    try {
      const res = await fetch("/api/payments/settings/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gateway: gatewayId }),
      });

      const result = await res.json();
      setTestResult((prev) => ({
        ...prev,
        [gatewayId]: {
          success: result.success ?? false,
          message: result.message || result.error || "Unknown error",
        },
      }));
    } catch (error) {
      setTestResult((prev) => ({
        ...prev,
        [gatewayId]: { success: false, message: "Failed to test connection" },
      }));
    } finally {
      setTesting(null);
    }
  };

  const updateFormData = (gatewayId: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [gatewayId]: {
        ...(prev[gatewayId] || {}),
        [field]: value,
      },
    }));
  };

  const toggleSecretVisibility = (gatewayId: string, field: string) => {
    const key = `${gatewayId}-${field}`;
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
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
      <div>
        <h2 className="text-xl font-bold text-navy">הגדרות שערי תשלום</h2>
        <p className="text-navy/60">הגדר את שערי התשלום לקבלת תשלומים מלקוחות</p>
      </div>

      {/* Gateways List */}
      <div className="space-y-4">
        {gateways.map((gateway) => {
          const gatewaySettings = settings[gateway.id];
          const isExpanded = expandedGateway === gateway.id;
          const isActive = gatewaySettings?.isActive ?? false;
          const isDefault = gatewaySettings?.isDefault ?? false;
          const data = formData[gateway.id] || {};
          const test = testResult[gateway.id];

          return (
            <Card
              key={gateway.id}
              className={cn(
                "transition-all",
                isActive && "ring-2 ring-teal/50",
                isDefault && "ring-2 ring-gold"
              )}
            >
              {/* Gateway Header */}
              <CardHeader
                className="cursor-pointer"
                onClick={() => setExpandedGateway(isExpanded ? null : gateway.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{gateway.logo}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{gateway.name}</CardTitle>
                        <span className="text-sm text-navy/60">({gateway.nameHe})</span>
                        {isDefault && (
                          <span className="flex items-center gap-1 text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">
                            <Star className="h-3 w-3" />
                            ברירת מחדל
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-navy/60">{gateway.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Status Badge */}
                    <div
                      className={cn(
                        "flex items-center gap-1 px-3 py-1 rounded-full text-sm",
                        isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {isActive ? (
                        <>
                          <Check className="h-4 w-4" />
                          פעיל
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4" />
                          לא פעיל
                        </>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-navy/40" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-navy/40" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {/* Gateway Settings */}
              {isExpanded && (
                <CardContent className="border-t border-blush pt-6">
                  <div className="space-y-6">
                    {/* Credentials */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gateway.fields.map((field) => (
                        <div key={field.key}>
                          <label className="block text-sm font-medium text-navy mb-1">
                            {field.label}
                          </label>
                          <div className="relative">
                            <input
                              type={
                                field.type === "password" &&
                                !showSecrets[`${gateway.id}-${field.key}`]
                                  ? "password"
                                  : "text"
                              }
                              value={data[field.key] || ""}
                              onChange={(e) =>
                                updateFormData(gateway.id, field.key, e.target.value)
                              }
                              placeholder={field.placeholder}
                              className="w-full h-11 px-4 pr-10 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                            />
                            {field.type === "password" && (
                              <button
                                type="button"
                                onClick={() =>
                                  toggleSecretVisibility(gateway.id, field.key)
                                }
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy"
                              >
                                {showSecrets[`${gateway.id}-${field.key}`] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tax Settings */}
                    <div className="border-t border-blush pt-6">
                      <h4 className="font-medium text-navy mb-4">הגדרות מס וחשבוניות</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">
                            שיעור מע״מ (%)
                          </label>
                          <input
                            type="number"
                            value={data.vatRate || "17"}
                            onChange={(e) =>
                              updateFormData(gateway.id, "vatRate", e.target.value)
                            }
                            min="0"
                            max="100"
                            step="0.1"
                            className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">
                            קידומת חשבונית
                          </label>
                          <input
                            type="text"
                            value={data.invoicePrefix || ""}
                            onChange={(e) =>
                              updateFormData(gateway.id, "invoicePrefix", e.target.value)
                            }
                            placeholder="INV-"
                            className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-navy mb-1">
                            קידומת קבלה
                          </label>
                          <input
                            type="text"
                            value={data.receiptPrefix || ""}
                            onChange={(e) =>
                              updateFormData(gateway.id, "receiptPrefix", e.target.value)
                            }
                            placeholder="RCP-"
                            className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Test Result */}
                    {test && (
                      <div
                        className={cn(
                          "p-4 rounded-lg",
                          test.success
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {test.success ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <X className="h-5 w-5" />
                          )}
                          <span>{test.message}</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-blush">
                      <Button
                        onClick={() => handleSave(gateway.id)}
                        disabled={saving === gateway.id}
                      >
                        {saving === gateway.id ? (
                          <>
                            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                            שומר...
                          </>
                        ) : (
                          <>
                            <Settings className="h-4 w-4 ml-2" />
                            שמור הגדרות
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleTestConnection(gateway.id)}
                        disabled={testing === gateway.id}
                      >
                        {testing === gateway.id ? (
                          <>
                            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                            בודק...
                          </>
                        ) : (
                          "בדוק חיבור"
                        )}
                      </Button>

                      <div className="flex-1" />

                      {isActive && !isDefault && (
                        <Button
                          variant="ghost"
                          onClick={() => handleSetDefault(gateway.id)}
                          className="text-gold hover:text-gold/80"
                        >
                          <Star className="h-4 w-4 ml-2" />
                          הגדר כברירת מחדל
                        </Button>
                      )}

                      <Button
                        variant={isActive ? "ghost" : "secondary"}
                        onClick={() => handleToggleActive(gateway.id, !isActive)}
                        className={isActive ? "text-red-600 hover:text-red-700" : ""}
                      >
                        {isActive ? (
                          <>
                            <X className="h-4 w-4 ml-2" />
                            השבת
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 ml-2" />
                            הפעל
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Help Info */}
      <Card className="border-teal/20 bg-teal/5">
        <CardContent className="p-6">
          <h3 className="font-medium text-navy mb-2">מידע שימושי</h3>
          <ul className="text-sm text-navy/60 space-y-1 list-disc list-inside">
            <li>הפרטים מאובטחים ומוצפנים</li>
            <li>שער ברירת המחדל ישמש לכל התשלומים אלא אם יבחר אחרת</li>
            <li>ניתן להפעיל מספר שערים במקביל</li>
            <li>שיעור המע״מ הנוכחי בישראל הוא 17%</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
