"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Search,
  CheckCircle2,
  Users,
  FileText,
  Filter,
  X,
  AlertCircle,
} from "lucide-react";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  type: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  content: string;
  platform: string;
}

interface Settings {
  isActive: boolean;
  phoneNumberId: string | null;
  accessToken: string | null;
}

const typeLabels: Record<string, string> = {
  alumni: "בוגרים",
  interested: "מתעניינים",
  followers: "עוקבים",
  patients: "מטופלים",
  other: "אחר",
};

export default function WhatsAppPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Selection state
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Results state
  const [sendResult, setSendResult] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contactsRes, templatesRes, settingsRes] = await Promise.all([
        fetch("/api/crm/contacts"),
        fetch("/api/social/templates"),
        fetch("/api/social/settings"),
      ]);

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        // Filter only contacts with phone numbers
        setContacts(contactsData.filter((c: Contact) => c.phone));
      }

      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        setTemplates(templatesData.filter((t: Template) => t.platform === "whatsapp" || t.platform === "all"));
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        const whatsappSettings = settingsData.find((s: any) => s.platform === "whatsapp");
        setSettings(whatsappSettings || null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      !searchQuery ||
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.phone && contact.phone.includes(searchQuery));

    const matchesType = typeFilter === "all" || contact.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const toggleContact = (contactId: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContacts(newSelected);
  };

  const selectAll = () => {
    if (selectedContacts.size === filteredContacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredContacts.map((c) => c.id)));
    }
  };

  const selectByType = (type: string) => {
    const contactsOfType = contacts.filter((c) => c.type === type);
    setSelectedContacts(new Set(contactsOfType.map((c) => c.id)));
  };

  const handleSend = async () => {
    if (selectedContacts.size === 0) {
      alert("בחר לפחות איש קשר אחד");
      return;
    }

    if (!customMessage && !selectedTemplate) {
      alert("הזן הודעה או בחר תבנית");
      return;
    }

    setSending(true);
    setSendResult(null);

    try {
      const res = await fetch("/api/social/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactIds: Array.from(selectedContacts),
          templateId: selectedTemplate,
          customMessage: customMessage,
        }),
      });

      const result = await res.json();
      setSendResult(result);

      if (result.success) {
        // Clear selection after successful send
        setSelectedContacts(new Set());
        setCustomMessage("");
        setSelectedTemplate(null);
      }
    } catch (error) {
      console.error("Error sending messages:", error);
      setSendResult({ error: "שגיאה בשליחת ההודעות" });
    } finally {
      setSending(false);
    }
  };

  const getMessagePreview = () => {
    if (customMessage) return customMessage;
    if (selectedTemplate) {
      const template = templates.find((t) => t.id === selectedTemplate);
      return template?.content || "";
    }
    return "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
      </div>
    );
  }

  if (!settings?.isActive) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-lg font-bold text-navy mb-2">WhatsApp לא מוגדר</h3>
            <p className="text-navy/60 mb-4">
              יש להגדיר את פרטי ה-WhatsApp Business API לפני שליחת הודעות
            </p>
            <Button onClick={() => window.location.href = "/admin/messaging/settings"}>
              הגדר עכשיו
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 sm:p-3 bg-green-500 rounded-lg text-white">
          <WhatsAppIcon className="h-6 w-6 sm:h-8 sm:w-8" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-navy">WhatsApp</h2>
          <p className="text-navy/60">שלח הודעות ללקוחות דרך WhatsApp</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Selection */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  בחר אנשי קשר ({selectedContacts.size} נבחרו)
                </span>
                <Button variant="outline" size="sm" onClick={selectAll}>
                  {selectedContacts.size === filteredContacts.length ? "בטל בחירה" : "בחר הכל"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter */}
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40" />
                  <Input
                    placeholder="חיפוש..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-blush rounded-lg"
                >
                  <option value="all">כל הסוגים</option>
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Select by Type */}
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm text-navy/60 self-center">בחירה מהירה:</span>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <Button
                    key={value}
                    variant="outline"
                    size="sm"
                    onClick={() => selectByType(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              {/* Contacts List */}
              <div className="max-h-64 sm:max-h-96 overflow-y-auto border rounded-lg divide-y">
                {filteredContacts.length === 0 ? (
                  <div className="p-8 text-center text-navy/50">
                    אין אנשי קשר עם מספר טלפון
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
                    <label
                      key={contact.id}
                      className={`flex items-center gap-3 p-2 sm:p-3 cursor-pointer hover:bg-cream/50 ${
                        selectedContacts.has(contact.id) ? "bg-teal/10" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedContacts.has(contact.id)}
                        onChange={() => toggleContact(contact.id)}
                        className="w-5 h-5 rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-navy">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <p className="text-sm text-navy/60">{contact.phone}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-navy/60">
                        {typeLabels[contact.type] || contact.type}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Composition */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                תוכן ההודעה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template Selection */}
              {templates.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    בחר תבנית (אופציונלי)
                  </label>
                  <select
                    value={selectedTemplate || ""}
                    onChange={(e) => {
                      setSelectedTemplate(e.target.value || null);
                      if (e.target.value) {
                        const template = templates.find((t) => t.id === e.target.value);
                        setCustomMessage(template?.content || "");
                      }
                    }}
                    className="w-full px-3 py-2 border border-blush rounded-lg"
                  >
                    <option value="">ללא תבנית</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom Message */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  הודעה
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-blush rounded-lg resize-none"
                  placeholder="כתוב את ההודעה כאן...

משתנים זמינים:
{{firstName}} - שם פרטי
{{lastName}} - שם משפחה
{{fullName}} - שם מלא"
                />
              </div>

              {/* Preview */}
              {getMessagePreview() && (
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    תצוגה מקדימה
                  </label>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm whitespace-pre-wrap">
                    {getMessagePreview()}
                  </div>
                </div>
              )}

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={sending || selectedContacts.size === 0 || (!customMessage && !selectedTemplate)}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    שולח...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    שלח ל-{selectedContacts.size} אנשי קשר
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Send Result */}
          {sendResult && (
            <Card className={sendResult.error ? "border-red-300" : "border-green-300"}>
              <CardContent className="p-4">
                {sendResult.error ? (
                  <div className="flex items-center gap-2 text-red-600">
                    <X className="h-5 w-5" />
                    <span>{sendResult.error}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>נשלחו {sendResult.sent} הודעות</span>
                    </div>
                    {sendResult.failed > 0 && (
                      <div className="text-sm text-red-600">
                        {sendResult.failed} הודעות נכשלו
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
