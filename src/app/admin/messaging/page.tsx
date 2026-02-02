"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  MessageCircle,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

// Platform icons
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

interface SocialSettings {
  platform: string;
  isActive: boolean;
}

interface Message {
  id: string;
  platform: string;
  status: string;
  sentAt: string;
  contact?: {
    firstName: string;
    lastName: string;
  };
}

export default function MessagingOverview() {
  const [settings, setSettings] = useState<SocialSettings[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, messagesRes] = await Promise.all([
        fetch("/api/social/settings"),
        fetch("/api/social/messages?limit=10"),
      ]);

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
      }

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setRecentMessages(messagesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "whatsapp":
        return <WhatsAppIcon className="h-6 w-6" />;
      case "instagram":
        return <InstagramIcon className="h-6 w-6" />;
      case "facebook":
        return <FacebookIcon className="h-6 w-6" />;
      default:
        return <MessageCircle className="h-6 w-6" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "whatsapp":
        return "bg-green-500";
      case "instagram":
        return "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500";
      case "facebook":
        return "bg-blue-600";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "read":
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const isActive = (platform: string) => {
    return settings.find((s) => s.platform === platform)?.isActive || false;
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
        <h2 className="text-2xl font-bold text-navy">תקשורת</h2>
        <p className="text-navy/60">נהל את התקשורת עם הלקוחות דרך WhatsApp, Instagram ו-Facebook</p>
      </div>

      {/* Platform Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/messaging/whatsapp">
          <Card className={`hover:shadow-md transition-shadow cursor-pointer ${!isActive("whatsapp") ? "opacity-60" : ""}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${getPlatformColor("whatsapp")} text-white`}>
                  <WhatsAppIcon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-navy text-lg">WhatsApp</h3>
                  <p className="text-sm text-navy/60">תקשורת ישירה עם לקוחות</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${isActive("whatsapp") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {isActive("whatsapp") ? "פעיל" : "לא מוגדר"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/messaging/instagram">
          <Card className={`hover:shadow-md transition-shadow cursor-pointer ${!isActive("instagram") ? "opacity-60" : ""}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${getPlatformColor("instagram")} text-white`}>
                  <InstagramIcon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-navy text-lg">Instagram</h3>
                  <p className="text-sm text-navy/60">קמפיינים ופרסומים</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${isActive("instagram") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {isActive("instagram") ? "פעיל" : "לא מוגדר"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/messaging/facebook">
          <Card className={`hover:shadow-md transition-shadow cursor-pointer ${!isActive("facebook") ? "opacity-60" : ""}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${getPlatformColor("facebook")} text-white`}>
                  <FacebookIcon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-navy text-lg">Facebook</h3>
                  <p className="text-sm text-navy/60">קמפיינים ופרסומים</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${isActive("facebook") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {isActive("facebook") ? "פעיל" : "לא מוגדר"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Send className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">{recentMessages.length}</p>
                <p className="text-sm text-navy/60">הודעות נשלחו</p>
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
                  {recentMessages.filter((m) => m.status === "delivered" || m.status === "read").length}
                </p>
                <p className="text-sm text-navy/60">נמסרו</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">
                  {recentMessages.filter((m) => m.status === "read").length}
                </p>
                <p className="text-sm text-navy/60">נקראו</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">
                  {recentMessages.filter((m) => m.status === "failed").length}
                </p>
                <p className="text-sm text-navy/60">נכשלו</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle>הודעות אחרונות</CardTitle>
        </CardHeader>
        <CardContent>
          {recentMessages.length === 0 ? (
            <div className="text-center py-8 text-navy/50">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>אין הודעות עדיין</p>
              <p className="text-sm">התחל לשלוח הודעות דרך WhatsApp</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-center gap-4 p-3 bg-cream/50 rounded-lg"
                >
                  <div className={`p-2 rounded-lg ${getPlatformColor(message.platform)} text-white`}>
                    {getPlatformIcon(message.platform)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-navy">
                      {message.contact
                        ? `${message.contact.firstName} ${message.contact.lastName}`
                        : "לקוח לא ידוע"}
                    </p>
                    <p className="text-sm text-navy/60">
                      {new Date(message.sentAt).toLocaleString("he-IL")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(message.status)}
                    <span className="text-sm text-navy/60">
                      {message.status === "sent" && "נשלח"}
                      {message.status === "delivered" && "נמסר"}
                      {message.status === "read" && "נקרא"}
                      {message.status === "failed" && "נכשל"}
                      {message.status === "pending" && "ממתין"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
