"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Search,
  Plus,
  X,
  Eye,
  Download,
  Send,
  Check,
  Clock,
  Mail,
  Loader2,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

interface Payment {
  id: string;
  amount: number;
  paymentMethod: string;
  transactionId: string | null;
}

interface Invoice {
  id: string;
  paymentId: string;
  payment: Payment;
  contactId: string;
  contact: Contact;
  invoiceNumber: string;
  type: string;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  issueDate: string;
  dueDate: string | null;
  customerName: string;
  customerEmail: string;
  status: string;
  pdfUrl: string | null;
  sentAt: string | null;
  createdAt: string;
}

const typeLabels: Record<string, string> = {
  invoice: "חשבונית",
  receipt: "קבלה",
  tax_invoice: "חשבונית מס",
};

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  draft: { label: "טיוטה", color: "bg-gray-100 text-gray-700", icon: FileText },
  issued: { label: "הופקה", color: "bg-blue-100 text-blue-700", icon: Check },
  sent: { label: "נשלחה", color: "bg-green-100 text-green-700", icon: Mail },
  paid: { label: "שולמה", color: "bg-green-100 text-green-700", icon: Check },
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    paymentId: "",
    type: "tax_invoice",
  });

  useEffect(() => {
    fetchInvoices();
    fetchPaymentsWithoutInvoice();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/payments/invoices");
      if (res.ok) {
        const data = await res.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentsWithoutInvoice = async () => {
    try {
      const res = await fetch("/api/payments?status=completed");
      if (res.ok) {
        const data = await res.json();
        // Filter payments that don't have an invoice
        const paymentsWithoutInvoice = data.filter((p: any) => !p.invoice);
        setPayments(paymentsWithoutInvoice);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/payments/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: formData.paymentId,
          type: formData.type,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setFormData({ paymentId: "", type: "tax_invoice" });
        fetchInvoices();
        fetchPaymentsWithoutInvoice();
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleSendInvoice = async (invoiceId: string) => {
    setSending(invoiceId);

    try {
      const res = await fetch(`/api/payments/invoices/${invoiceId}/send`, {
        method: "POST",
      });

      if (res.ok) {
        fetchInvoices();
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
    } finally {
      setSending(null);
    }
  };

  const handleViewPDF = (invoiceId: string) => {
    window.open(`/api/payments/invoices/${invoiceId}/pdf`, "_blank");
  };

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      !searchQuery ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = !typeFilter || invoice.type === typeFilter;

    return matchesSearch && matchesType;
  });

  // Calculate totals
  const totalIssued = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-navy">חשבוניות וקבלות</h2>
          <p className="text-navy/60">
            {invoices.length} מסמכים | סה״כ: {formatPrice(totalIssued)}
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          disabled={payments.length === 0}
        >
          <Plus className="h-4 w-4 ml-2" />
          הפקת חשבונית
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
                placeholder="חיפוש לפי שם, אימייל או מספר חשבונית..."
                className="w-full h-11 pr-10 pl-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setTypeFilter(null)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  !typeFilter
                    ? "bg-teal text-white"
                    : "bg-cream text-navy/70 hover:text-navy"
                )}
              >
                הכל
              </button>
              {Object.entries(typeLabels).map(([type, label]) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(typeFilter === type ? null : type)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    typeFilter === type
                      ? "bg-teal text-white"
                      : "bg-cream text-navy/70 hover:text-navy"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardContent className="p-0">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12 text-navy/50">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>אין חשבוניות להצגה</p>
              {payments.length > 0 && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  הפק חשבונית ראשונה
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-cream/50 border-b border-blush">
                    <th className="text-right p-2 sm:p-4 text-sm font-medium text-navy">מספר</th>
                    <th className="text-right p-2 sm:p-4 text-sm font-medium text-navy hidden sm:table-cell">סוג</th>
                    <th className="text-right p-2 sm:p-4 text-sm font-medium text-navy">לקוח</th>
                    <th className="text-right p-2 sm:p-4 text-sm font-medium text-navy">סכום</th>
                    <th className="text-right p-2 sm:p-4 text-sm font-medium text-navy hidden sm:table-cell">תאריך</th>
                    <th className="text-right p-2 sm:p-4 text-sm font-medium text-navy">סטטוס</th>
                    <th className="text-right p-2 sm:p-4 text-sm font-medium text-navy">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => {
                    const statusInfo = statusConfig[invoice.status] || statusConfig.draft;
                    const StatusIcon = statusInfo.icon;

                    return (
                      <tr
                        key={invoice.id}
                        className="border-b border-blush/50 hover:bg-cream/30 transition-colors"
                      >
                        <td className="p-2 sm:p-4">
                          <span className="font-mono text-sm text-navy">
                            {invoice.invoiceNumber}
                          </span>
                        </td>
                        <td className="p-2 sm:p-4 hidden sm:table-cell">
                          <span className="text-sm text-navy">
                            {typeLabels[invoice.type] || invoice.type}
                          </span>
                        </td>
                        <td className="p-2 sm:p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs font-medium">
                              {invoice.contact.firstName[0]}
                              {invoice.contact.lastName?.[0] || ""}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-navy">
                                {invoice.customerName}
                              </p>
                              <p className="text-xs text-navy/50">{invoice.customerEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 sm:p-4">
                          <div>
                            <span className="font-bold text-navy">
                              {formatPrice(invoice.totalAmount)}
                            </span>
                            <span className="text-xs text-navy/50 block">
                              כולל מע״מ {invoice.vatRate}%
                            </span>
                          </div>
                        </td>
                        <td className="p-2 sm:p-4 hidden sm:table-cell">
                          <span className="text-sm text-navy">
                            {new Date(invoice.issueDate).toLocaleDateString("he-IL")}
                          </span>
                        </td>
                        <td className="p-2 sm:p-4">
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
                        <td className="p-2 sm:p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedInvoice(invoice)}
                              className="p-2 text-navy/50 hover:text-navy hover:bg-cream rounded-lg transition-colors"
                              title="צפייה בפרטים"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleViewPDF(invoice.id)}
                              className="p-2 text-navy/50 hover:text-navy hover:bg-cream rounded-lg transition-colors"
                              title="צפייה/הורדה"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            {invoice.status !== "sent" && (
                              <button
                                onClick={() => handleSendInvoice(invoice.id)}
                                disabled={sending === invoice.id}
                                className="p-2 text-navy/50 hover:text-teal hover:bg-teal/10 rounded-lg transition-colors disabled:opacity-50"
                                title="שלח במייל"
                              >
                                {sending === invoice.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4" />
                                )}
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

      {/* Invoice Detail Sidebar */}
      {selectedInvoice && (
        <div className="fixed inset-y-0 left-0 z-50 w-full sm:w-96 bg-white shadow-xl border-r border-blush overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-blush">
            <h3 className="text-lg font-bold text-navy">פרטי חשבונית</h3>
            <button onClick={() => setSelectedInvoice(null)}>
              <X className="w-5 h-5 text-navy/50 hover:text-navy" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Invoice Header */}
            <div className="text-center py-4 bg-cream rounded-lg">
              <p className="text-sm text-navy/60">
                {typeLabels[selectedInvoice.type]}
              </p>
              <p className="text-xl font-bold text-navy font-mono">
                {selectedInvoice.invoiceNumber}
              </p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-2",
                  statusConfig[selectedInvoice.status]?.color
                )}
              >
                {statusConfig[selectedInvoice.status]?.label}
              </span>
            </div>

            {/* Customer */}
            <div>
              <h5 className="font-medium text-navy mb-2">לקוח</h5>
              <div className="bg-cream rounded-lg p-4">
                <p className="font-medium text-navy">{selectedInvoice.customerName}</p>
                <p className="text-sm text-navy/60">{selectedInvoice.customerEmail}</p>
              </div>
            </div>

            {/* Amounts */}
            <div>
              <h5 className="font-medium text-navy mb-2">סכומים</h5>
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-cream rounded-lg">
                  <span className="text-navy/60">סכום לפני מע״מ</span>
                  <span className="text-navy">{formatPrice(selectedInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between p-3 bg-cream rounded-lg">
                  <span className="text-navy/60">מע״מ ({selectedInvoice.vatRate}%)</span>
                  <span className="text-navy">{formatPrice(selectedInvoice.vatAmount)}</span>
                </div>
                <div className="flex justify-between p-3 bg-teal/10 rounded-lg">
                  <span className="font-medium text-navy">סה״כ</span>
                  <span className="font-bold text-lg text-navy">
                    {formatPrice(selectedInvoice.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h5 className="font-medium text-navy mb-2">תאריכים</h5>
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-cream rounded-lg">
                  <span className="text-navy/60">תאריך הפקה</span>
                  <span className="text-navy">
                    {new Date(selectedInvoice.issueDate).toLocaleDateString("he-IL")}
                  </span>
                </div>
                {selectedInvoice.dueDate && (
                  <div className="flex justify-between p-3 bg-cream rounded-lg">
                    <span className="text-navy/60">לתשלום עד</span>
                    <span className="text-navy">
                      {new Date(selectedInvoice.dueDate).toLocaleDateString("he-IL")}
                    </span>
                  </div>
                )}
                {selectedInvoice.sentAt && (
                  <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600">נשלחה בתאריך</span>
                    <span className="text-green-700">
                      {new Date(selectedInvoice.sentAt).toLocaleDateString("he-IL")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-blush">
              <Button
                onClick={() => handleViewPDF(selectedInvoice.id)}
                className="w-full"
              >
                <Download className="h-4 w-4 ml-2" />
                צפייה והורדה
              </Button>
              {selectedInvoice.status !== "sent" && (
                <Button
                  onClick={() => handleSendInvoice(selectedInvoice.id)}
                  disabled={sending === selectedInvoice.id}
                  variant="outline"
                  className="w-full"
                >
                  {sending === selectedInvoice.id ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      שולח...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 ml-2" />
                      שלח במייל
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-navy/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-blush">
              <h3 className="text-lg font-bold text-navy">הפקת חשבונית</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5 text-navy/50 hover:text-navy" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-4 space-y-4">
              {/* Payment Select */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  בחר תשלום *
                </label>
                <select
                  value={formData.paymentId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, paymentId: e.target.value }))
                  }
                  required
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="">בחר תשלום</option>
                  {payments.map((payment) => (
                    <option key={payment.id} value={payment.id}>
                      {payment.contact.firstName} {payment.contact.lastName} -{" "}
                      {formatPrice(payment.amount)} -{" "}
                      {new Date(payment.createdAt).toLocaleDateString("he-IL")}
                    </option>
                  ))}
                </select>
                {payments.length === 0 && (
                  <p className="text-xs text-navy/50 mt-1">
                    אין תשלומים ללא חשבונית
                  </p>
                )}
              </div>

              {/* Type Select */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  סוג מסמך
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="tax_invoice">חשבונית מס</option>
                  <option value="invoice">חשבונית</option>
                  <option value="receipt">קבלה</option>
                </select>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={creating || !formData.paymentId}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      מפיק...
                    </>
                  ) : (
                    "הפק חשבונית"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
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
