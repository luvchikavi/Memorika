"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Search,
  Filter,
  Plus,
  X,
  Check,
  Clock,
  XCircle,
  RefreshCw,
  Eye,
  RotateCcw,
  Banknote,
  Building,
  Smartphone,
  Wallet,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

interface Product {
  id: string;
  name: string;
  nameHe: string | null;
}

interface Deal {
  id: string;
  product: Product;
  finalAmount: number;
}

interface Payment {
  id: string;
  dealId: string | null;
  contactId: string;
  contact: Contact;
  deal: Deal | null;
  amount: number;
  currency: string;
  paymentMethod: string;
  gateway: string | null;
  status: string;
  transactionId: string | null;
  authCode: string | null;
  last4Digits: string | null;
  cardBrand: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  notes: string | null;
  createdAt: string;
  completedAt: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "ממתין", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  processing: { label: "בעיבוד", color: "bg-blue-100 text-blue-700", icon: RefreshCw },
  completed: { label: "הושלם", color: "bg-green-100 text-green-700", icon: Check },
  failed: { label: "נכשל", color: "bg-red-100 text-red-700", icon: XCircle },
  refunded: { label: "הוחזר", color: "bg-purple-100 text-purple-700", icon: RotateCcw },
};

const paymentMethodConfig: Record<string, { label: string; icon: any }> = {
  credit_card: { label: "כרטיס אשראי", icon: CreditCard },
  bank_transfer: { label: "העברה בנקאית", icon: Building },
  bit: { label: "ביט", icon: Smartphone },
  paybox: { label: "PayBox", icon: Wallet },
  cash: { label: "מזומן", icon: Banknote },
};

export default function TransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  // Form state for manual payment
  const [formData, setFormData] = useState({
    contactId: "",
    dealId: "",
    amount: "",
    paymentMethod: "cash",
    notes: "",
  });

  // Refund state
  const [refundData, setRefundData] = useState({
    amount: "",
    reason: "",
  });

  useEffect(() => {
    fetchPayments();
    fetchContacts();
    fetchDeals();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
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

  const fetchDeals = async () => {
    try {
      const res = await fetch("/api/crm/deals");
      if (res.ok) {
        const data = await res.json();
        setDeals(data.filter((d: any) => d.status !== "paid"));
      }
    } catch (error) {
      console.error("Error fetching deals:", error);
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: formData.contactId,
          dealId: formData.dealId || null,
          amount: parseFloat(formData.amount),
          paymentMethod: formData.paymentMethod,
          notes: formData.notes || null,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        resetForm();
        fetchPayments();
        fetchDeals();
      }
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;

    try {
      const res = await fetch(`/api/payments/${selectedPayment.id}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: refundData.amount ? parseFloat(refundData.amount) : undefined,
          reason: refundData.reason || undefined,
        }),
      });

      if (res.ok) {
        setShowRefundModal(false);
        setSelectedPayment(null);
        setRefundData({ amount: "", reason: "" });
        fetchPayments();
        fetchDeals();
      }
    } catch (error) {
      console.error("Error refunding payment:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      contactId: "",
      dealId: "",
      amount: "",
      paymentMethod: "cash",
      notes: "",
    });
  };

  const handleDealChange = (dealId: string) => {
    const deal = deals.find((d) => d.id === dealId);
    setFormData((prev) => ({
      ...prev,
      dealId,
      contactId: deal?.contactId || prev.contactId,
      amount: deal ? (deal.finalAmount - (deal.paidAmount || 0)).toString() : prev.amount,
    }));
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      !searchQuery ||
      payment.contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalCompleted = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

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
          <h2 className="text-xl font-bold text-navy">עסקאות תשלום</h2>
          <p className="text-navy/60">
            {payments.length} עסקאות | סה״כ: {formatPrice(totalCompleted)}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 ml-2" />
          רישום תשלום
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש לפי שם, אימייל או מספר עסקה..."
                className="w-full h-11 pr-10 pl-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter(null)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  !statusFilter
                    ? "bg-teal text-white"
                    : "bg-cream text-navy/70 hover:text-navy"
                )}
              >
                הכל
              </button>
              {Object.entries(statusConfig).map(([status, config]) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    statusFilter === status
                      ? "bg-teal text-white"
                      : "bg-cream text-navy/70 hover:text-navy"
                  )}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12 text-navy/50">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>אין עסקאות להצגה</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-cream/50 border-b border-blush">
                    <th className="text-right p-4 text-sm font-medium text-navy">תאריך</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">לקוח</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">סכום</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">אמצעי תשלום</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">סטטוס</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">מספר עסקה</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => {
                    const statusInfo = statusConfig[payment.status] || statusConfig.pending;
                    const methodInfo = paymentMethodConfig[payment.paymentMethod] || {
                      label: payment.paymentMethod,
                      icon: CreditCard,
                    };
                    const StatusIcon = statusInfo.icon;
                    const MethodIcon = methodInfo.icon;

                    return (
                      <tr
                        key={payment.id}
                        className="border-b border-blush/50 hover:bg-cream/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="text-sm text-navy">
                            {new Date(payment.createdAt).toLocaleDateString("he-IL")}
                          </div>
                          <div className="text-xs text-navy/50">
                            {new Date(payment.createdAt).toLocaleTimeString("he-IL", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs font-medium">
                              {payment.contact.firstName[0]}
                              {payment.contact.lastName?.[0] || ""}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-navy">
                                {payment.contact.firstName} {payment.contact.lastName}
                              </p>
                              <p className="text-xs text-navy/50">{payment.contact.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-navy">
                            {formatPrice(payment.amount)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-navy/70">
                            <MethodIcon className="h-4 w-4" />
                            <span>{methodInfo.label}</span>
                            {payment.last4Digits && (
                              <span className="text-xs text-navy/50">
                                ****{payment.last4Digits}
                              </span>
                            )}
                          </div>
                          {payment.gateway && (
                            <div className="text-xs text-navy/50">{payment.gateway}</div>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                              statusInfo.color
                            )}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="p-4">
                          {payment.transactionId ? (
                            <div className="text-xs text-navy/70 font-mono">
                              {payment.transactionId.length > 20
                                ? `${payment.transactionId.slice(0, 20)}...`
                                : payment.transactionId}
                            </div>
                          ) : (
                            <span className="text-xs text-navy/40">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedPayment(payment)}
                              className="p-2 text-navy/50 hover:text-navy hover:bg-cream rounded-lg transition-colors"
                              title="צפייה בפרטים"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {payment.status === "completed" && (
                              <button
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setRefundData({
                                    amount: payment.amount.toString(),
                                    reason: "",
                                  });
                                  setShowRefundModal(true);
                                }}
                                className="p-2 text-navy/50 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="החזר כספי"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Detail Sidebar */}
      {selectedPayment && !showRefundModal && (
        <div className="fixed inset-y-0 left-0 z-50 w-96 bg-white shadow-xl border-r border-blush overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-blush">
            <h3 className="text-lg font-bold text-navy">פרטי תשלום</h3>
            <button onClick={() => setSelectedPayment(null)}>
              <X className="w-5 h-5 text-navy/50 hover:text-navy" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Amount */}
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-navy">
                {formatPrice(selectedPayment.amount)}
              </p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-2",
                  statusConfig[selectedPayment.status]?.color
                )}
              >
                {statusConfig[selectedPayment.status]?.label}
              </span>
            </div>

            {/* Customer */}
            <div>
              <h5 className="font-medium text-navy mb-2">לקוח</h5>
              <div className="bg-cream rounded-lg p-4">
                <p className="font-medium text-navy">
                  {selectedPayment.contact.firstName} {selectedPayment.contact.lastName}
                </p>
                <p className="text-sm text-navy/60">{selectedPayment.contact.email}</p>
                {selectedPayment.contact.phone && (
                  <p className="text-sm text-navy/60">{selectedPayment.contact.phone}</p>
                )}
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h5 className="font-medium text-navy mb-2">פרטי תשלום</h5>
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-cream rounded-lg">
                  <span className="text-navy/60">אמצעי תשלום</span>
                  <span className="text-navy">
                    {paymentMethodConfig[selectedPayment.paymentMethod]?.label ||
                      selectedPayment.paymentMethod}
                  </span>
                </div>
                {selectedPayment.gateway && (
                  <div className="flex justify-between p-3 bg-cream rounded-lg">
                    <span className="text-navy/60">שער תשלום</span>
                    <span className="text-navy">{selectedPayment.gateway}</span>
                  </div>
                )}
                {selectedPayment.last4Digits && (
                  <div className="flex justify-between p-3 bg-cream rounded-lg">
                    <span className="text-navy/60">כרטיס</span>
                    <span className="text-navy font-mono">
                      {selectedPayment.cardBrand} ****{selectedPayment.last4Digits}
                    </span>
                  </div>
                )}
                {selectedPayment.transactionId && (
                  <div className="flex justify-between p-3 bg-cream rounded-lg">
                    <span className="text-navy/60">מספר עסקה</span>
                    <span className="text-navy font-mono text-xs">
                      {selectedPayment.transactionId}
                    </span>
                  </div>
                )}
                {selectedPayment.authCode && (
                  <div className="flex justify-between p-3 bg-cream rounded-lg">
                    <span className="text-navy/60">קוד אישור</span>
                    <span className="text-navy font-mono">{selectedPayment.authCode}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dates */}
            <div>
              <h5 className="font-medium text-navy mb-2">תאריכים</h5>
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-cream rounded-lg">
                  <span className="text-navy/60">נוצר</span>
                  <span className="text-navy">
                    {new Date(selectedPayment.createdAt).toLocaleString("he-IL")}
                  </span>
                </div>
                {selectedPayment.completedAt && (
                  <div className="flex justify-between p-3 bg-cream rounded-lg">
                    <span className="text-navy/60">הושלם</span>
                    <span className="text-navy">
                      {new Date(selectedPayment.completedAt).toLocaleString("he-IL")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Error */}
            {selectedPayment.errorMessage && (
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm font-medium text-red-700">שגיאה</p>
                <p className="text-sm text-red-600 mt-1">
                  {selectedPayment.errorMessage}
                </p>
                {selectedPayment.errorCode && (
                  <p className="text-xs text-red-500 mt-1">
                    קוד: {selectedPayment.errorCode}
                  </p>
                )}
              </div>
            )}

            {/* Notes */}
            {selectedPayment.notes && (
              <div>
                <h5 className="font-medium text-navy mb-2">הערות</h5>
                <p className="text-sm text-navy/70 bg-cream rounded-lg p-3 whitespace-pre-wrap">
                  {selectedPayment.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            {selectedPayment.status === "completed" && (
              <div className="pt-4 border-t border-blush">
                <Button
                  onClick={() => {
                    setRefundData({
                      amount: selectedPayment.amount.toString(),
                      reason: "",
                    });
                    setShowRefundModal(true);
                  }}
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  <RotateCcw className="h-4 w-4 ml-2" />
                  החזר כספי
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-blush">
              <h3 className="text-lg font-bold text-navy">רישום תשלום ידני</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-navy/50 hover:text-navy" />
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="p-4 space-y-4">
              {/* Deal Select (Optional) */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  עסקה (אופציונלי)
                </label>
                <select
                  value={formData.dealId}
                  onChange={(e) => handleDealChange(e.target.value)}
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="">ללא עסקה</option>
                  {deals.map((deal) => (
                    <option key={deal.id} value={deal.id}>
                      {deal.contact.firstName} {deal.contact.lastName} -{" "}
                      {deal.product.nameHe || deal.product.name} ({formatPrice(deal.finalAmount)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Select */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  לקוח *
                </label>
                <select
                  value={formData.contactId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, contactId: e.target.value }))
                  }
                  required
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="">בחר לקוח</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName} ({contact.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
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

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  אמצעי תשלום *
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))
                  }
                  required
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="cash">מזומן</option>
                  <option value="bank_transfer">העברה בנקאית</option>
                  <option value="bit">ביט</option>
                  <option value="paybox">PayBox</option>
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
                  רשום תשלום
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
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

      {/* Refund Modal */}
      {showRefundModal && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-navy/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-blush">
              <h3 className="text-lg font-bold text-navy">החזר כספי</h3>
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundData({ amount: "", reason: "" });
                }}
              >
                <X className="w-5 h-5 text-navy/50 hover:text-navy" />
              </button>
            </div>

            <form onSubmit={handleRefund} className="p-4 space-y-4">
              <div className="bg-cream rounded-lg p-4">
                <p className="text-sm text-navy/60">סכום התשלום המקורי</p>
                <p className="text-2xl font-bold text-navy">
                  {formatPrice(selectedPayment.amount)}
                </p>
              </div>

              {/* Refund Amount */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  סכום להחזר
                </label>
                <input
                  type="number"
                  value={refundData.amount}
                  onChange={(e) =>
                    setRefundData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  max={selectedPayment.amount}
                  min="0"
                  step="0.01"
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                />
                <p className="text-xs text-navy/50 mt-1">
                  השאר ריק להחזר מלא
                </p>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  סיבת ההחזר
                </label>
                <textarea
                  value={refundData.reason}
                  onChange={(e) =>
                    setRefundData((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  rows={3}
                  placeholder="למשל: ביקש לבטל, טעות בחיוב..."
                  className="w-full px-4 py-3 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <RotateCcw className="h-4 w-4 ml-2" />
                  בצע החזר
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRefundModal(false);
                    setRefundData({ amount: "", reason: "" });
                  }}
                >
                  ביטול
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
