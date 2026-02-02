"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

interface PlatformSettings {
  id: string;
  platform: string;
  isActive: boolean;
  phoneNumberId: string | null;
  businessAccountId: string | null;
  accessToken: string | null;
  pageId: string | null;
  instagramId: string | null;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});

  // Form state for each platform
  const [formData, setFormData] = useState<Record<string, Partial<PlatformSettings>>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/social/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        // Initialize form data
        const initialFormData: Record<string, Partial<PlatformSettings>> = {};
        data.forEach((s: PlatformSettings) => {
          initialFormData[s.platform] = { ...s };
        });
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (platform: string) => {
    setSaving(platform);
    try {
      const res = await fetch("/api/social/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          ...formData[platform],
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSettings((prev) =>
          prev.map((s) => (s.platform === platform ? updated : s))
        );
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(null);
    }
  };

  const updateFormData = (platform: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }));
  };

  const toggleShowToken = (platform: string) => {
    setShowTokens((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  const isConfigured = (platform: string) => {
    const s = settings.find((s) => s.platform === platform);
    if (!s) return false;

    if (platform === "whatsapp") {
      return !!(s.phoneNumberId && s.accessToken);
    }
    if (platform === "facebook") {
      return !!(s.pageId && s.accessToken);
    }
    if (platform === "instagram") {
      return !!(s.instagramId && s.accessToken);
    }
    return false;
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
        <h2 className="text-2xl font-bold text-navy">הגדרות תקשורת</h2>
        <p className="text-navy/60">הגדר את חיבורי הרשתות החברתיות</p>
      </div>

      {/* WhatsApp Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg text-white">
                <WhatsAppIcon className="h-6 w-6" />
              </div>
              WhatsApp Business API
            </span>
            <span className={`text-sm px-3 py-1 rounded-full ${
              isConfigured("whatsapp")
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {isConfigured("whatsapp") ? "מוגדר" : "לא מוגדר"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-medium text-blue-800 mb-2">איך להגדיר WhatsApp Business API:</p>
            <ol className="list-decimal list-inside text-blue-700 space-y-1">
              <li>היכנס ל-<a href="https://developers.facebook.com" target="_blank" className="underline">Meta for Developers</a></li>
              <li>צור אפליקציה חדשה מסוג Business</li>
              <li>הוסף את מוצר WhatsApp לאפליקציה</li>
              <li>העתק את Phone Number ID ו-Access Token</li>
            </ol>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.whatsapp?.isActive || false}
                onChange={(e) => updateFormData("whatsapp", "isActive", e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span>פעיל</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                Phone Number ID
              </label>
              <Input
                value={formData.whatsapp?.phoneNumberId || ""}
                onChange={(e) => updateFormData("whatsapp", "phoneNumberId", e.target.value)}
                placeholder="123456789..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                Business Account ID
              </label>
              <Input
                value={formData.whatsapp?.businessAccountId || ""}
                onChange={(e) => updateFormData("whatsapp", "businessAccountId", e.target.value)}
                placeholder="123456789..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">
              Access Token
            </label>
            <div className="relative">
              <Input
                type={showTokens.whatsapp ? "text" : "password"}
                value={formData.whatsapp?.accessToken || ""}
                onChange={(e) => updateFormData("whatsapp", "accessToken", e.target.value)}
                placeholder="EAAxxxxxxxx..."
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => toggleShowToken("whatsapp")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/50 hover:text-navy"
              >
                {showTokens.whatsapp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            onClick={() => handleSave("whatsapp")}
            disabled={saving === "whatsapp"}
            className="bg-green-500 hover:bg-green-600"
          >
            {saving === "whatsapp" ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                שומר...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                שמור הגדרות WhatsApp
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Facebook Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <FacebookIcon className="h-6 w-6" />
              </div>
              Facebook Page
            </span>
            <span className={`text-sm px-3 py-1 rounded-full ${
              isConfigured("facebook")
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {isConfigured("facebook") ? "מוגדר" : "לא מוגדר"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.facebook?.isActive || false}
                onChange={(e) => updateFormData("facebook", "isActive", e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span>פעיל</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                Page ID
              </label>
              <Input
                value={formData.facebook?.pageId || ""}
                onChange={(e) => updateFormData("facebook", "pageId", e.target.value)}
                placeholder="123456789..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                Access Token
              </label>
              <div className="relative">
                <Input
                  type={showTokens.facebook ? "text" : "password"}
                  value={formData.facebook?.accessToken || ""}
                  onChange={(e) => updateFormData("facebook", "accessToken", e.target.value)}
                  placeholder="EAAxxxxxxxx..."
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleShowToken("facebook")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/50 hover:text-navy"
                >
                  {showTokens.facebook ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button
            onClick={() => handleSave("facebook")}
            disabled={saving === "facebook"}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saving === "facebook" ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                שומר...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                שמור הגדרות Facebook
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Instagram Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg text-white">
                <InstagramIcon className="h-6 w-6" />
              </div>
              Instagram Business
            </span>
            <span className={`text-sm px-3 py-1 rounded-full ${
              isConfigured("instagram")
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {isConfigured("instagram") ? "מוגדר" : "לא מוגדר"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm">
            <p className="text-purple-700">
              Instagram Business API משתמש באותו Access Token של Facebook.
              ודא שחשבון האינסטגרם מחובר לדף הפייסבוק שלך.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.instagram?.isActive || false}
                onChange={(e) => updateFormData("instagram", "isActive", e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span>פעיל</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                Instagram Business Account ID
              </label>
              <Input
                value={formData.instagram?.instagramId || ""}
                onChange={(e) => updateFormData("instagram", "instagramId", e.target.value)}
                placeholder="123456789..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                Access Token
              </label>
              <div className="relative">
                <Input
                  type={showTokens.instagram ? "text" : "password"}
                  value={formData.instagram?.accessToken || ""}
                  onChange={(e) => updateFormData("instagram", "accessToken", e.target.value)}
                  placeholder="EAAxxxxxxxx..."
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleShowToken("instagram")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/50 hover:text-navy"
                >
                  {showTokens.instagram ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button
            onClick={() => handleSave("instagram")}
            disabled={saving === "instagram"}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90"
          >
            {saving === "instagram" ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                שומר...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                שמור הגדרות Instagram
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
