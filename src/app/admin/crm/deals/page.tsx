"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  Calendar,
  ChevronDown,
  GripVertical,
  X,
  Plus,
  Package,
  Banknote,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

// Types
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  type: string;
}

interface Product {
  id: string;
  name: string;
  nameHe: string | null;
  price: number;
  currency: string;
}

interface Deal {
  id: string;
  contactId: string;
  contact: Contact;
  productId: string;
  product: Product;
  status: string;
  amount: number;
  currency: string;
  discount: number;
  finalAmount: number;
  paymentMethod: string | null;
  paymentRef: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
}

// Kanban columns configuration
const columns = [
  { id: "pending", title: "ממתין לתשלום", color: "bg-yellow-500", lightColor: "bg-yellow-50" },
  { id: "partially_paid", title: "שולם חלקית", color: "bg-orange-500", lightColor: "bg-orange-50" },
  { id: "paid", title: "שולם", color: "bg-green-500", lightColor: "bg-green-50" },
  { id: "refunded", title: "הוחזר", color: "bg-purple-500", lightColor: "bg-purple-50" },
  { id: "cancelled", title: "בוטל", color: "bg-gray-500", lightColor: "bg-gray-50" },
];

// Payment method labels
const paymentMethodLabels: Record<string, string> = {
  credit_card: "כרטיס אשראי",
  credit: "כרטיס אשראי",
  bank_transfer: "העברה בנקאית",
  cash: "מזומן",
  bit: "ביט",
  paybox: "PayBox",
  paypal: "PayPal",
};

export default function DealsKanbanPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [collapsedColumns, setCollapsedColumns] = useState<string[]>(["cancelled"]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    contactId: "",
    productId: "",
    amount: "",
    discount: "0",
    paymentMethod: "",
    notes: "",
  });

  // Fetch data
  useEffect(() => {
    fetchDeals();
    fetchContacts();
    fetchProducts();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await fetch("/api/crm/deals");
      if (res.ok) {
        const data = await res.json();
        setDeals(data);
      }
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/crm/contacts");
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/sales/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.filter((p: Product & { isActive: boolean }) => p.isActive));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Update deal status
  const updateDealStatus = async (dealId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/crm/deals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: dealId, status: newStatus }),
      });

      if (res.ok) {
        const updatedDeal = await res.json();
        setDeals((prev) =>
          prev.map((d) => (d.id === dealId ? updatedDeal : d))
        );
      }
    } catch (error) {
      console.error("Error updating deal:", error);
    }
  };

  // Create deal
  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/crm/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: formData.contactId,
          productId: formData.productId,
          amount: parseFloat(formData.amount),
          discount: parseFloat(formData.discount) || 0,
          paymentMethod: formData.paymentMethod || null,
          notes: formData.notes || null,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        resetForm();
        fetchDeals();
      }
    } catch (error) {
      console.error("Error creating deal:", error);
    }
  };

  // Update deal
  const handleUpdateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeal) return;

    try {
      const res = await fetch(`/api/crm/deals/${editingDeal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: formData.contactId,
          productId: formData.productId,
          amount: parseFloat(formData.amount),
          discount: parseFloat(formData.discount) || 0,
          paymentMethod: formData.paymentMethod || null,
          notes: formData.notes || null,
        }),
      });

      if (res.ok) {
        setEditingDeal(null);
        resetForm();
        fetchDeals();
      }
    } catch (error) {
      console.error("Error updating deal:", error);
    }
  };

  // Delete deal
  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק עסקה זו?")) return;

    try {
      const res = await fetch(`/api/crm/deals/${dealId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSelectedDeal(null);
        fetchDeals();
      }
    } catch (error) {
      console.error("Error deleting deal:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      contactId: "",
      productId: "",
      amount: "",
      discount: "0",
      paymentMethod: "",
      notes: "",
    });
  };

  // Open edit modal
  const openEditModal = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      contactId: deal.contactId,
      productId: deal.productId,
      amount: deal.amount.toString(),
      discount: deal.discount.toString(),
      paymentMethod: deal.paymentMethod || "",
      notes: deal.notes || "",
    });
  };

  // Handle product selection - auto-fill price
  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setFormData((prev) => ({
      ...prev,
      productId,
      amount: product ? product.price.toString() : prev.amount,
    }));
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    setDraggedDeal(deal);
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

    if (draggedDeal && draggedDeal.status !== columnId) {
      // Optimistic update
      setDeals((prev) =>
        prev.map((d) =>
          d.id === draggedDeal.id ? { ...d, status: columnId } : d
        )
      );
      // Update server
      updateDealStatus(draggedDeal.id, columnId);
    }
    setDraggedDeal(null);
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
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

  // Get deals by status
  const getDealsByStatus = (status: string) => {
    return deals.filter((deal) => deal.status === status);
  };

  // Calculate totals
  const getTotalByStatus = (status: string) => {
    return deals
      .filter((d) => d.status === status)
      .reduce((sum, d) => sum + d.finalAmount, 0);
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
          <h2 className="text-xl font-bold text-navy">לוח עסקאות</h2>
          <p className="text-navy/60">
            {deals.length} עסקאות | סה״כ: {formatPrice(getTotalByStatus("paid"))} שולם
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 ml-2" />
          עסקה חדשה
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnDeals = getDealsByStatus(column.id);
          const isCollapsed = collapsedColumns.includes(column.id);
          const isDragOver = dragOverColumn === column.id;
          const columnTotal = getTotalByStatus(column.id);

          return (
            <div
              key={column.id}
              className={cn(
                "flex-shrink-0 transition-all duration-200",
                isCollapsed ? "w-12" : "w-80"
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
                    <span className="text-xs text-navy/60">{columnDeals.length}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", column.color)} />
                      <span className="font-medium text-navy">{column.title}</span>
                      <span className="text-sm text-navy/60 bg-white/50 px-2 py-0.5 rounded-full">
                        {columnDeals.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-navy/60">{formatPrice(columnTotal)}</span>
                      <ChevronDown className="w-4 h-4 text-navy/40" />
                    </div>
                  </>
                )}
              </div>

              {/* Column Body */}
              {!isCollapsed && (
                <div
                  className={cn(
                    "bg-cream/50 rounded-b-lg p-2 min-h-[500px] space-y-2 transition-colors",
                    isDragOver && "bg-teal/10"
                  )}
                >
                  {columnDeals.length === 0 ? (
                    <div className="text-center py-8 text-navy/40">
                      <p className="text-sm">אין עסקאות</p>
                      <p className="text-xs">גרור עסקאות לכאן</p>
                    </div>
                  ) : (
                    columnDeals.map((deal) => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedDeal(deal)}
                        isDragging={draggedDeal?.id === deal.id}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Deal Detail Sidebar */}
      {selectedDeal && (
        <DealDetailSidebar
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
          onStatusChange={(newStatus) => {
            updateDealStatus(selectedDeal.id, newStatus);
            setSelectedDeal({ ...selectedDeal, status: newStatus });
          }}
          onEdit={() => {
            openEditModal(selectedDeal);
            setSelectedDeal(null);
          }}
          onDelete={() => handleDeleteDeal(selectedDeal.id)}
        />
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingDeal) && (
        <div className="fixed inset-0 z-50 bg-navy/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-blush">
              <h3 className="text-lg font-bold text-navy">
                {editingDeal ? "עריכת עסקה" : "עסקה חדשה"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingDeal(null);
                  resetForm();
                }}
              >
                <X className="w-5 h-5 text-navy/50 hover:text-navy" />
              </button>
            </div>

            <form
              onSubmit={editingDeal ? handleUpdateDeal : handleCreateDeal}
              className="p-4 space-y-4"
            >
              {/* Contact Select */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  איש קשר *
                </label>
                <select
                  value={formData.contactId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, contactId: e.target.value }))
                  }
                  required
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="">בחר איש קשר</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName} ({contact.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Select */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  מוצר *
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  required
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="">בחר מוצר</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.nameHe || product.name} ({formatPrice(product.price)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount & Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">
                    סכום *
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, amount: e.target.value }))
                    }
                    required
                    min="0"
                    step="0.01"
                    className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">
                    הנחה
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, discount: e.target.value }))
                    }
                    min="0"
                    step="0.01"
                    className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
              </div>

              {/* Final Amount Display */}
              {formData.amount && (
                <div className="bg-cream rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-navy/60">סכום סופי:</span>
                    <span className="text-lg font-bold text-navy">
                      {formatPrice(
                        parseFloat(formData.amount) -
                          (parseFloat(formData.discount) || 0)
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  אמצעי תשלום
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentMethod: e.target.value,
                    }))
                  }
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="">לא נבחר</option>
                  <option value="credit_card">כרטיס אשראי</option>
                  <option value="bank_transfer">העברה בנקאית</option>
                  <option value="bit">ביט</option>
                  <option value="paybox">PayBox</option>
                  <option value="cash">מזומן</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  הערות
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1">
                  {editingDeal ? "עדכן" : "צור עסקה"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDeal(null);
                    resetForm();
                  }}
                >
                  ביטול
                </Button>
              </div>
            </form>
          </div>
        </div>
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

// Deal Card Component
function DealCard({
  deal,
  onDragStart,
  onDragEnd,
  onClick,
  isDragging,
}: {
  deal: Deal;
  onDragStart: (e: React.DragEvent, deal: Deal) => void;
  onDragEnd: () => void;
  onClick: () => void;
  isDragging: boolean;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, deal)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        "bg-white rounded-lg p-3 shadow-sm border border-blush/50 cursor-grab active:cursor-grabbing transition-all hover:shadow-md",
        isDragging && "opacity-50 rotate-2 scale-105"
      )}
    >
      {/* Drag Handle & Contact Info */}
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-navy/20 flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs font-medium flex-shrink-0">
              {deal.contact.firstName[0]}
              {deal.contact.lastName?.[0] || ""}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-navy text-sm truncate">
                {deal.contact.firstName} {deal.contact.lastName}
              </p>
              <p className="text-xs text-navy/50 truncate">
                {deal.product.nameHe || deal.product.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-navy">
          <Banknote className="w-4 h-4 text-green-600" />
          <span className="font-bold">{formatPrice(deal.finalAmount)}</span>
          {deal.discount > 0 && (
            <span className="text-xs text-navy/40 line-through">
              {formatPrice(deal.amount)}
            </span>
          )}
        </div>
        {deal.paymentMethod && (
          <span className="text-xs text-navy/50 bg-cream px-2 py-0.5 rounded">
            {paymentMethodLabels[deal.paymentMethod] || deal.paymentMethod}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 mt-3 text-navy/50">
        {deal.contact.email && (
          <a
            href={`mailto:${deal.contact.email}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-teal transition-colors"
            title={deal.contact.email}
          >
            <Mail className="w-4 h-4" />
          </a>
        )}
        {deal.contact.phone && (
          <a
            href={`tel:${deal.contact.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-teal transition-colors"
            title={deal.contact.phone}
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
        {deal.notes && <MessageSquare className="w-4 h-4" title={deal.notes} />}
        <span className="text-xs mr-auto flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(deal.createdAt).toLocaleDateString("he-IL", {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>
    </div>
  );
}

// Deal Detail Sidebar Component
function DealDetailSidebar({
  deal,
  onClose,
  onStatusChange,
  onEdit,
  onDelete,
}: {
  deal: Deal;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const currentColumn = columns.find((c) => c.id === deal.status);

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-96 bg-white shadow-xl border-r border-blush overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-blush">
        <h3 className="text-lg font-bold text-navy">פרטי עסקה</h3>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-navy/50 hover:text-navy" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Contact Info */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xl font-bold mx-auto mb-3">
            {deal.contact.firstName[0]}
            {deal.contact.lastName?.[0] || ""}
          </div>
          <h4 className="text-xl font-bold text-navy">
            {deal.contact.firstName} {deal.contact.lastName}
          </h4>
          <p className="text-sm text-navy/60">{deal.contact.email}</p>
        </div>

        {/* Product Info */}
        <div className="bg-cream rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-teal" />
            <div>
              <p className="font-medium text-navy">
                {deal.product.nameHe || deal.product.name}
              </p>
              <p className="text-sm text-navy/60">מוצר</p>
            </div>
          </div>
        </div>

        {/* Amount Details */}
        <div className="space-y-2">
          <h5 className="font-medium text-navy">פרטי תשלום</h5>
          <div className="bg-cream rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-navy/60">סכום</span>
              <span className="text-navy">{formatPrice(deal.amount)}</span>
            </div>
            {deal.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>הנחה</span>
                <span>-{formatPrice(deal.discount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-blush">
              <span className="font-medium text-navy">סה״כ</span>
              <span className="font-bold text-lg text-navy">
                {formatPrice(deal.finalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Status Selector */}
        <div>
          <label className="block text-sm font-medium text-navy mb-2">סטטוס</label>
          <select
            value={deal.status}
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

        {/* Payment Method */}
        {deal.paymentMethod && (
          <div className="flex items-center gap-3 p-3 bg-cream rounded-lg">
            <CreditCard className="h-5 w-5 text-navy/50" />
            <div>
              <p className="text-xs text-navy/50">אמצעי תשלום</p>
              <p className="text-sm text-navy">
                {paymentMethodLabels[deal.paymentMethod] || deal.paymentMethod}
              </p>
            </div>
          </div>
        )}

        {/* Contact Details */}
        <div className="space-y-3">
          <h5 className="font-medium text-navy">פרטי קשר</h5>

          {deal.contact.email && (
            <a
              href={`mailto:${deal.contact.email}`}
              className="flex items-center gap-3 p-3 bg-cream rounded-lg hover:bg-cream/70 transition-colors"
            >
              <Mail className="h-5 w-5 text-navy/50" />
              <div>
                <p className="text-xs text-navy/50">אימייל</p>
                <p className="text-sm text-navy">{deal.contact.email}</p>
              </div>
            </a>
          )}

          {deal.contact.phone && (
            <a
              href={`tel:${deal.contact.phone}`}
              className="flex items-center gap-3 p-3 bg-cream rounded-lg hover:bg-cream/70 transition-colors"
            >
              <Phone className="h-5 w-5 text-navy/50" />
              <div>
                <p className="text-xs text-navy/50">טלפון</p>
                <p className="text-sm text-navy">{deal.contact.phone}</p>
              </div>
            </a>
          )}
        </div>

        {/* Deal Info */}
        <div className="space-y-3">
          <h5 className="font-medium text-navy">מידע על העסקה</h5>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-cream rounded-lg">
              <p className="text-xs text-navy/50">נוצר</p>
              <p className="text-sm text-navy">
                {new Date(deal.createdAt).toLocaleDateString("he-IL")}
              </p>
            </div>
            <div className="p-3 bg-cream rounded-lg">
              <p className="text-xs text-navy/50">עודכן</p>
              <p className="text-sm text-navy">
                {new Date(deal.updatedAt).toLocaleDateString("he-IL")}
              </p>
            </div>
            {deal.paidAt && (
              <div className="p-3 bg-green-50 rounded-lg col-span-2">
                <p className="text-xs text-green-600">שולם בתאריך</p>
                <p className="text-sm text-green-700 font-medium">
                  {new Date(deal.paidAt).toLocaleDateString("he-IL")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {deal.notes && (
          <div>
            <h5 className="font-medium text-navy mb-2">הערות</h5>
            <p className="text-sm text-navy/70 bg-cream rounded-lg p-3 whitespace-pre-wrap">
              {deal.notes}
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-2">
          <h5 className="font-medium text-navy">פעולות</h5>
          <div className="grid grid-cols-2 gap-2">
            {deal.contact.phone && (
              <a
                href={`tel:${deal.contact.phone}`}
                className="flex items-center justify-center gap-2 p-3 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm">התקשר</span>
              </a>
            )}
            {deal.contact.email && (
              <a
                href={`mailto:${deal.contact.email}`}
                className="flex items-center justify-center gap-2 p-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">שלח מייל</span>
              </a>
            )}
            {deal.contact.phone && (
              <a
                href={`https://wa.me/${deal.contact.phone.replace(/\D/g, "")}`}
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

        {/* Edit/Delete Actions */}
        <div className="flex gap-2 pt-4 border-t border-blush">
          <Button onClick={onEdit} variant="outline" className="flex-1">
            ערוך
          </Button>
          <Button
            onClick={onDelete}
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            מחק
          </Button>
        </div>
      </div>
    </div>
  );
}
