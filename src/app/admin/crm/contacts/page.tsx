"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Tag,
  X,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface ContactTag {
  id: string;
  name: string;
  color: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  city: string | null;
  source: string | null;
  status: string;
  type: string;
  notes: string | null;
  createdAt: string;
  tags: ContactTag[];
}

// Status configuration
const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "פעיל", color: "text-green-700", bg: "bg-green-100" },
  inactive: { label: "לא פעיל", color: "text-gray-600", bg: "bg-gray-100" },
  vip: { label: "VIP", color: "text-purple-700", bg: "bg-purple-100" },
  blocked: { label: "חסום", color: "text-red-700", bg: "bg-red-100" },
};

// Source options
const sourceOptions = [
  { value: "facebook", label: "פייסבוק" },
  { value: "google", label: "גוגל" },
  { value: "instagram", label: "אינסטגרם" },
  { value: "referral", label: "המלצה" },
  { value: "event", label: "אירוע/הרצאה" },
  { value: "landing_page", label: "דף נחיתה" },
  { value: "organic", label: "אורגני" },
  { value: "other", label: "אחר" },
];

// Type options
const typeOptions = [
  { value: "alumni", label: "בוגרים" },
  { value: "interested", label: "מתעניינים" },
  { value: "followers", label: "עוקבים" },
  { value: "patients", label: "מטופלים (קליניקה)" },
  { value: "other", label: "אחר" },
];

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  alumni: { label: "בוגרים", color: "text-purple-700", bg: "bg-purple-100" },
  interested: { label: "מתעניינים", color: "text-pink-700", bg: "bg-pink-100" },
  followers: { label: "עוקבים", color: "text-blue-700", bg: "bg-blue-100" },
  patients: { label: "מטופלים", color: "text-green-700", bg: "bg-green-100" },
  other: { label: "אחר", color: "text-gray-600", bg: "bg-gray-100" },
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    source: "",
    status: "active",
    types: ["other"] as string[],
    notes: "",
  });

  // Fetch contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/crm/contacts");
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse contact types (handles both old single type and new JSON array)
  const getContactTypes = (type: string): string[] => {
    if (!type) return ["other"];
    try {
      const parsed = JSON.parse(type);
      return Array.isArray(parsed) ? parsed : [type];
    } catch {
      return [type];
    }
  };

  // Helper to get type labels for display
  const getTypeLabels = (type: string): string => {
    const types = getContactTypes(type);
    return types.map((t) => typeConfig[t]?.label || t).join(", ");
  };

  // Filter contacts
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      searchQuery === "" ||
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.phone && contact.phone.includes(searchQuery));

    const matchesStatus =
      statusFilter === "all" || contact.status === statusFilter;

    const contactTypes = getContactTypes(contact.type);
    const matchesType =
      typeFilter === "all" || contactTypes.includes(typeFilter);

    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingContact
      ? `/api/crm/contacts/${editingContact.id}`
      : "/api/crm/contacts";
    const method = editingContact ? "PUT" : "POST";

    // Convert types array to JSON string
    const submitData = {
      ...formData,
      type: JSON.stringify(formData.types),
    };
    delete (submitData as any).types;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        fetchContacts();
        closeModal();
      }
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק איש קשר זה?")) return;

    try {
      const res = await fetch(`/api/crm/contacts/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchContacts();
        setSelectedContact(null);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  // Handle inline type toggle (add/remove type)
  const handleTypeToggle = async (contactId: string, typeToToggle: string) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return;

    const currentTypes = getContactTypes(contact.type);
    let newTypes: string[];

    if (currentTypes.includes(typeToToggle)) {
      // Remove type (but keep at least one)
      newTypes = currentTypes.filter((t) => t !== typeToToggle);
      if (newTypes.length === 0) newTypes = ["other"];
    } else {
      // Add type
      newTypes = [...currentTypes.filter((t) => t !== "other"), typeToToggle];
    }

    const newTypeJson = JSON.stringify(newTypes);

    try {
      const res = await fetch(`/api/crm/contacts/${contactId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: newTypeJson }),
      });

      if (res.ok) {
        // Update local state immediately for better UX
        setContacts((prev) =>
          prev.map((c) => (c.id === contactId ? { ...c, type: newTypeJson } : c))
        );
      }
    } catch (error) {
      console.error("Error updating type:", error);
    }
  };

  // State for type dropdown
  const [openTypeDropdown, setOpenTypeDropdown] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openTypeDropdown && !(e.target as Element).closest('.type-dropdown-container')) {
        setOpenTypeDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openTypeDropdown]);

  // Modal helpers
  const openAddModal = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      source: "",
      status: "active",
      types: ["other"],
      notes: "",
    });
    setEditingContact(null);
    setShowAddModal(true);
  };

  const openEditModal = (contact: Contact) => {
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone || "",
      city: contact.city || "",
      source: contact.source || "",
      status: contact.status,
      types: getContactTypes(contact.type),
      notes: contact.notes || "",
    });
    setEditingContact(contact);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingContact(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      source: "",
      status: "active",
      types: ["other"],
      notes: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy">אנשי קשר</h2>
          <p className="text-navy/60">
            {filteredContacts.length} אנשי קשר{" "}
            {searchQuery && `(מסונן מתוך ${contacts.length})`}
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="h-4 w-4 ml-2" />
          הוסף איש קשר
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40" />
              <Input
                placeholder="חיפוש לפי שם, אימייל או טלפון..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-navy/60 self-center">סטטוס:</span>
              <Button
                variant={statusFilter === "all" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                הכל
              </Button>
              {Object.entries(statusConfig).map(([key, config]) => (
                <Button
                  key={key}
                  variant={statusFilter === key ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(key)}
                >
                  {config.label}
                </Button>
              ))}
            </div>
          </div>
          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm text-navy/60 self-center">סוג:</span>
            <Button
              variant={typeFilter === "all" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setTypeFilter("all")}
            >
              הכל
            </Button>
            {typeOptions.map((type) => (
              <Button
                key={type.value}
                variant={typeFilter === type.value ? "secondary" : "outline"}
                size="sm"
                onClick={() => setTypeFilter(type.value)}
                className={typeFilter === type.value ? typeConfig[type.value]?.bg : ""}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
            </div>
          ) : paginatedContacts.length === 0 ? (
            <div className="text-center py-12 text-navy/50">
              <p className="text-lg mb-2">אין אנשי קשר</p>
              <p className="text-sm">
                {searchQuery
                  ? "נסה לשנות את החיפוש"
                  : "לחץ על 'הוסף איש קשר' או ייבא מ-Excel"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-blush bg-cream/50">
                      <th className="text-right p-4 text-sm font-medium text-navy/70">שם</th>
                      <th className="text-right p-4 text-sm font-medium text-navy/70">אימייל</th>
                      <th className="text-right p-4 text-sm font-medium text-navy/70">טלפון</th>
                      <th className="text-right p-4 text-sm font-medium text-navy/70">סוג</th>
                      <th className="text-right p-4 text-sm font-medium text-navy/70">מקור</th>
                      <th className="text-right p-4 text-sm font-medium text-navy/70">סטטוס</th>
                      <th className="text-right p-4 text-sm font-medium text-navy/70">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedContacts.map((contact) => {
                      const status = statusConfig[contact.status] || statusConfig.active;
                      return (
                        <tr
                          key={contact.id}
                          className="border-b border-blush/50 hover:bg-cream/30 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center text-teal font-medium">
                                {contact.firstName[0]}{contact.lastName[0]}
                              </div>
                              <div>
                                <p className="font-medium text-navy">
                                  {contact.firstName} {contact.lastName}
                                </p>
                                {contact.city && (
                                  <p className="text-xs text-navy/50 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {contact.city}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-sm text-navy hover:text-teal flex items-center gap-1"
                            >
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </a>
                          </td>
                          <td className="p-4">
                            {contact.phone ? (
                              <a
                                href={`tel:${contact.phone}`}
                                className="text-sm text-navy hover:text-teal flex items-center gap-1"
                              >
                                <Phone className="h-3 w-3" />
                                {contact.phone}
                              </a>
                            ) : (
                              <span className="text-sm text-navy/40">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="relative type-dropdown-container">
                              <button
                                onClick={() => setOpenTypeDropdown(openTypeDropdown === contact.id ? null : contact.id)}
                                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white cursor-pointer hover:border-teal focus:outline-none focus:ring-2 focus:ring-teal min-w-[100px] text-right"
                              >
                                {getTypeLabels(contact.type)}
                              </button>
                              {openTypeDropdown === contact.id && (
                                <div className="absolute z-20 top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[150px]">
                                  {typeOptions.map((opt) => {
                                    const contactTypes = getContactTypes(contact.type);
                                    const isSelected = contactTypes.includes(opt.value);
                                    return (
                                      <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleTypeToggle(contact.id, opt.value)}
                                        className={cn(
                                          "w-full px-3 py-2 text-right text-sm flex items-center justify-between hover:bg-gray-50",
                                          isSelected && "bg-teal/10"
                                        )}
                                      >
                                        <span>{opt.label}</span>
                                        {isSelected && (
                                          <span className="text-teal text-lg">✓</span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-navy/70">
                              {sourceOptions.find((s) => s.value === contact.source)?.label ||
                                contact.source ||
                                "-"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={cn(
                                "text-xs px-2 py-1 rounded-full",
                                status.bg,
                                status.color
                              )}
                            >
                              {status.label}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedContact(contact)}
                                className="p-1 text-navy/50 hover:text-navy transition-colors"
                                title="צפה"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(contact)}
                                className="p-1 text-navy/50 hover:text-navy transition-colors"
                                title="ערוך"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(contact.id)}
                                className="p-1 text-navy/50 hover:text-red-500 transition-colors"
                                title="מחק"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-blush">
                  <p className="text-sm text-navy/60">
                    מציג {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, filteredContacts.length)} מתוך{" "}
                    {filteredContacts.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-navy">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-blush">
              <h3 className="text-lg font-bold text-navy">
                {editingContact ? "עריכת איש קשר" : "הוספת איש קשר"}
              </h3>
              <button onClick={closeModal}>
                <X className="w-5 h-5 text-navy/50 hover:text-navy" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="שם פרטי"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
                <Input
                  label="שם משפחה"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>

              <Input
                label="אימייל"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />

              <Input
                label="טלפון"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              <Input
                label="עיר"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />

              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  סוג (ניתן לבחור מספר סוגים)
                </label>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map((opt) => {
                    const isSelected = formData.types.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          let newTypes: string[];
                          if (isSelected) {
                            newTypes = formData.types.filter((t) => t !== opt.value);
                            if (newTypes.length === 0) newTypes = ["other"];
                          } else {
                            newTypes = [...formData.types.filter((t) => t !== "other"), opt.value];
                          }
                          setFormData({ ...formData, types: newTypes });
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm border transition-colors",
                          isSelected
                            ? "bg-teal text-white border-teal"
                            : "bg-white text-navy/70 border-gray-200 hover:border-teal"
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                {formData.types.length > 0 && formData.types[0] !== "other" && (
                  <p className="text-xs text-teal mt-2">
                    נבחרו: {formData.types.map((t) => typeConfig[t]?.label || t).join(", ")}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  מקור
                </label>
                <select
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="">בחר מקור</option>
                  {sourceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  סטטוס
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">
                  הערות
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  ביטול
                </Button>
                <Button type="submit">
                  {editingContact ? "עדכן" : "הוסף"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Detail Sidebar */}
      {selectedContact && (
        <div className="fixed inset-y-0 left-0 z-50 w-96 bg-white shadow-xl border-r border-blush">
          <div className="flex items-center justify-between p-4 border-b border-blush">
            <h3 className="text-lg font-bold text-navy">פרטי איש קשר</h3>
            <button onClick={() => setSelectedContact(null)}>
              <X className="w-5 h-5 text-navy/50 hover:text-navy" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Contact Info */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-teal/20 flex items-center justify-center text-teal text-2xl font-bold mx-auto mb-3">
                {selectedContact.firstName[0]}{selectedContact.lastName[0]}
              </div>
              <h4 className="text-xl font-bold text-navy">
                {selectedContact.firstName} {selectedContact.lastName}
              </h4>
              <span
                className={cn(
                  "inline-block text-xs px-2 py-1 rounded-full mt-2",
                  statusConfig[selectedContact.status]?.bg,
                  statusConfig[selectedContact.status]?.color
                )}
              >
                {statusConfig[selectedContact.status]?.label}
              </span>
              <div className="flex flex-wrap justify-center gap-1 mt-2">
                {getContactTypes(selectedContact.type).map((t) => (
                  <span
                    key={t}
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      typeConfig[t]?.bg || "bg-gray-100",
                      typeConfig[t]?.color || "text-gray-600"
                    )}
                  >
                    {typeConfig[t]?.label || t}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                <Mail className="h-5 w-5 text-navy/50" />
                <div>
                  <p className="text-xs text-navy/50">אימייל</p>
                  <a href={`mailto:${selectedContact.email}`} className="text-sm text-navy hover:text-teal">
                    {selectedContact.email}
                  </a>
                </div>
              </div>

              {selectedContact.phone && (
                <div className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                  <Phone className="h-5 w-5 text-navy/50" />
                  <div>
                    <p className="text-xs text-navy/50">טלפון</p>
                    <a href={`tel:${selectedContact.phone}`} className="text-sm text-navy hover:text-teal">
                      {selectedContact.phone}
                    </a>
                  </div>
                </div>
              )}

              {selectedContact.city && (
                <div className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                  <MapPin className="h-5 w-5 text-navy/50" />
                  <div>
                    <p className="text-xs text-navy/50">עיר</p>
                    <p className="text-sm text-navy">{selectedContact.city}</p>
                  </div>
                </div>
              )}

              {selectedContact.source && (
                <div className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                  <Tag className="h-5 w-5 text-navy/50" />
                  <div>
                    <p className="text-xs text-navy/50">מקור</p>
                    <p className="text-sm text-navy">
                      {sourceOptions.find((s) => s.value === selectedContact.source)?.label ||
                        selectedContact.source}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            {selectedContact.notes && (
              <div>
                <h5 className="text-sm font-medium text-navy mb-2">הערות</h5>
                <p className="text-sm text-navy/70 bg-cream rounded-lg p-3">
                  {selectedContact.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => {
                  openEditModal(selectedContact);
                  setSelectedContact(null);
                }}
              >
                <Edit className="h-4 w-4 ml-2" />
                ערוך
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => handleDelete(selectedContact.id)}
              >
                <Trash2 className="h-4 w-4 ml-2" />
                מחק
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
