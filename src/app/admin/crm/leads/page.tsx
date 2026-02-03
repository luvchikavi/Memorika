"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MoreVertical,
  User,
  Calendar,
  MessageSquare,
  ChevronDown,
  GripVertical,
  X,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  type: string;
}

interface Lead {
  id: string;
  contactId: string;
  contact: Contact;
  status: string;
  score: number;
  source: string | null;
  campaign: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Kanban columns configuration
const columns = [
  { id: "new", title: "חדש", color: "bg-blue-500", lightColor: "bg-blue-50" },
  { id: "contacted", title: "נוצר קשר", color: "bg-yellow-500", lightColor: "bg-yellow-50" },
  { id: "in_talks", title: "בשיחות", color: "bg-purple-500", lightColor: "bg-purple-50" },
  { id: "hot", title: "חם", color: "bg-red-500", lightColor: "bg-red-50" },
  { id: "cold", title: "קר", color: "bg-gray-400", lightColor: "bg-gray-50" },
  { id: "converted", title: "הומר ללקוח", color: "bg-green-500", lightColor: "bg-green-50" },
  { id: "lost", title: "אבוד", color: "bg-gray-600", lightColor: "bg-gray-100" },
];

// Type config for contact badges
const typeConfig: Record<string, { label: string; color: string }> = {
  alumni: { label: "בוגר", color: "text-purple-600 bg-purple-100" },
  interested: { label: "מתעניין", color: "text-pink-600 bg-pink-100" },
  followers: { label: "עוקב", color: "text-blue-600 bg-blue-100" },
  patients: { label: "מטופל", color: "text-green-600 bg-green-100" },
  other: { label: "אחר", color: "text-gray-600 bg-gray-100" },
};

export default function LeadsKanbanPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [collapsedColumns, setCollapsedColumns] = useState<string[]>(["lost"]);

  // Fetch leads
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/crm/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update lead status
  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/crm/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });

      if (res.ok) {
        const updatedLead = await res.json();
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? updatedLead : l))
        );
      }
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (draggedLead && draggedLead.status !== columnId) {
      // Optimistic update
      setLeads((prev) =>
        prev.map((l) =>
          l.id === draggedLead.id ? { ...l, status: columnId } : l
        )
      );
      // Update server
      updateLeadStatus(draggedLead.id, columnId);
    }
    setDraggedLead(null);
  };

  const handleDragEnd = () => {
    setDraggedLead(null);
    setDragOverColumn(null);
  };

  // Toggle column collapse
  const toggleColumn = (columnId: string) => {
    setCollapsedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  // Get leads by status
  const getLeadsByStatus = (status: string) => {
    return leads.filter((lead) => lead.status === status);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("he-IL", { day: "numeric", month: "short" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">לוח לידים</h2>
          <p className="text-navy/60">{leads.length} לידים במערכת</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnLeads = getLeadsByStatus(column.id);
          const isCollapsed = collapsedColumns.includes(column.id);
          const isDragOver = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              className={cn(
                "flex-shrink-0 transition-all duration-200",
                isCollapsed ? "w-12" : "w-64 sm:w-72"
              )}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div
                className={cn(
                  "rounded-t-lg p-3 flex items-center justify-between cursor-pointer",
                  column.lightColor,
                  isDragOver && "ring-2 ring-teal"
                )}
                onClick={() => toggleColumn(column.id)}
              >
                {isCollapsed ? (
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div className={cn("w-3 h-3 rounded-full", column.color)} />
                    <span className="text-xs font-medium text-navy writing-vertical">
                      {column.title}
                    </span>
                    <span className="text-xs text-navy/60">{columnLeads.length}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", column.color)} />
                      <span className="font-medium text-navy">{column.title}</span>
                      <span className="text-sm text-navy/60 bg-white/50 px-2 py-0.5 rounded-full">
                        {columnLeads.length}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-navy/40" />
                  </>
                )}
              </div>

              {/* Column Body */}
              {!isCollapsed && (
                <div
                  className={cn(
                    "bg-cream/50 rounded-b-lg p-2 min-h-[300px] sm:min-h-[500px] space-y-2 transition-colors",
                    isDragOver && "bg-teal/10"
                  )}
                >
                  {columnLeads.length === 0 ? (
                    <div className="text-center py-8 text-navy/40">
                      <p className="text-sm">אין לידים</p>
                      <p className="text-xs">גרור לידים לכאן</p>
                    </div>
                  ) : (
                    columnLeads.map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedLead(lead)}
                        isDragging={draggedLead?.id === lead.id}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lead Detail Sidebar */}
      {selectedLead && (
        <LeadDetailSidebar
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={(newStatus) => {
            updateLeadStatus(selectedLead.id, newStatus);
            setSelectedLead({ ...selectedLead, status: newStatus });
          }}
        />
      )}

      <style jsx global>{`
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
}

// Lead Card Component
function LeadCard({
  lead,
  onDragStart,
  onDragEnd,
  onClick,
  isDragging,
}: {
  lead: Lead;
  onDragStart: (e: React.DragEvent, lead: Lead) => void;
  onDragEnd: () => void;
  onClick: () => void;
  isDragging: boolean;
}) {
  const contactType = typeConfig[lead.contact.type] || typeConfig.other;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        "bg-white rounded-lg p-2 sm:p-3 shadow-sm border border-blush/50 cursor-grab active:cursor-grabbing transition-all hover:shadow-md",
        isDragging && "opacity-50 rotate-2 scale-105"
      )}
    >
      {/* Drag Handle & Contact Info */}
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-navy/20 flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs font-medium flex-shrink-0">
              {lead.contact.firstName[0]}{lead.contact.lastName?.[0] || ""}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-navy text-sm truncate">
                {lead.contact.firstName} {lead.contact.lastName}
              </p>
              <span className={cn("text-xs px-1.5 py-0.5 rounded", contactType.color)}>
                {contactType.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="flex items-center gap-3 mt-3 text-navy/50">
        {lead.contact.email && (
          <a
            href={`mailto:${lead.contact.email}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-teal transition-colors"
            title={lead.contact.email}
          >
            <Mail className="w-4 h-4" />
          </a>
        )}
        {lead.contact.phone && (
          <a
            href={`tel:${lead.contact.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-teal transition-colors"
            title={lead.contact.phone}
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
        {lead.notes && (
          <span title={lead.notes}><MessageSquare className="w-4 h-4" /></span>
        )}
        <span className="text-xs mr-auto flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(lead.createdAt).toLocaleDateString("he-IL", { day: "numeric", month: "short" })}
        </span>
      </div>

      {/* Source */}
      {lead.source && (
        <div className="mt-2 text-xs text-navy/40 truncate">
          מקור: {lead.source}
        </div>
      )}
    </div>
  );
}

// Lead Detail Sidebar Component
function LeadDetailSidebar({
  lead,
  onClose,
  onStatusChange,
}: {
  lead: Lead;
  onClose: () => void;
  onStatusChange: (status: string) => void;
}) {
  const contactType = typeConfig[lead.contact.type] || typeConfig.other;
  const currentColumn = columns.find((c) => c.id === lead.status);

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-full sm:w-96 bg-white shadow-xl border-r border-blush overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-blush">
        <h3 className="text-lg font-bold text-navy">פרטי ליד</h3>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-navy/50 hover:text-navy" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Contact Info */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xl font-bold mx-auto mb-3">
            {lead.contact.firstName[0]}{lead.contact.lastName?.[0] || ""}
          </div>
          <h4 className="text-xl font-bold text-navy">
            {lead.contact.firstName} {lead.contact.lastName}
          </h4>
          <span className={cn("inline-block text-xs px-2 py-1 rounded mt-1", contactType.color)}>
            {contactType.label}
          </span>
        </div>

        {/* Status Selector */}
        <div>
          <label className="block text-sm font-medium text-navy mb-2">סטטוס</label>
          <select
            value={lead.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
          >
            {columns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>
        </div>

        {/* Current Status Badge */}
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", currentColumn?.color)} />
          <span className="text-sm text-navy">{currentColumn?.title}</span>
        </div>

        {/* Contact Details */}
        <div className="space-y-3">
          <h5 className="font-medium text-navy">פרטי קשר</h5>

          {lead.contact.email && (
            <a
              href={`mailto:${lead.contact.email}`}
              className="flex items-center gap-3 p-3 bg-cream rounded-lg hover:bg-cream/70 transition-colors"
            >
              <Mail className="h-5 w-5 text-navy/50" />
              <div>
                <p className="text-xs text-navy/50">אימייל</p>
                <p className="text-sm text-navy">{lead.contact.email}</p>
              </div>
            </a>
          )}

          {lead.contact.phone && (
            <a
              href={`tel:${lead.contact.phone}`}
              className="flex items-center gap-3 p-3 bg-cream rounded-lg hover:bg-cream/70 transition-colors"
            >
              <Phone className="h-5 w-5 text-navy/50" />
              <div>
                <p className="text-xs text-navy/50">טלפון</p>
                <p className="text-sm text-navy">{lead.contact.phone}</p>
              </div>
            </a>
          )}
        </div>

        {/* Lead Info */}
        <div className="space-y-3">
          <h5 className="font-medium text-navy">מידע על הליד</h5>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-cream rounded-lg">
              <p className="text-xs text-navy/50">מקור</p>
              <p className="text-sm text-navy">{lead.source || "-"}</p>
            </div>
            <div className="p-3 bg-cream rounded-lg">
              <p className="text-xs text-navy/50">קמפיין</p>
              <p className="text-sm text-navy">{lead.campaign || "-"}</p>
            </div>
            <div className="p-3 bg-cream rounded-lg">
              <p className="text-xs text-navy/50">נוצר</p>
              <p className="text-sm text-navy">
                {new Date(lead.createdAt).toLocaleDateString("he-IL")}
              </p>
            </div>
            <div className="p-3 bg-cream rounded-lg">
              <p className="text-xs text-navy/50">עודכן</p>
              <p className="text-sm text-navy">
                {new Date(lead.updatedAt).toLocaleDateString("he-IL")}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {lead.notes && (
          <div>
            <h5 className="font-medium text-navy mb-2">הערות</h5>
            <p className="text-sm text-navy/70 bg-cream rounded-lg p-3 whitespace-pre-wrap">
              {lead.notes}
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-2">
          <h5 className="font-medium text-navy">פעולות מהירות</h5>
          <div className="grid grid-cols-2 gap-2">
            {lead.contact.phone && (
              <a
                href={`tel:${lead.contact.phone}`}
                className="flex items-center justify-center gap-2 p-3 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm">התקשר</span>
              </a>
            )}
            {lead.contact.email && (
              <a
                href={`mailto:${lead.contact.email}`}
                className="flex items-center justify-center gap-2 p-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">שלח מייל</span>
              </a>
            )}
            {lead.contact.phone && (
              <a
                href={`https://wa.me/${lead.contact.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors col-span-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
