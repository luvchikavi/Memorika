"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  Search,
  Plus,
  X,
  Eye,
  Check,
  Clock,
  Pause,
  Play,
  Loader2,
  CreditCard,
  Calendar,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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
  paidAmount: number;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface PaymentPlan {
  id: string;
  dealId: string;
  deal: Deal;
  contactId: string;
  contact: Contact;
  totalAmount: number;
  currency: string;
  numberOfPayments: number;
  paymentFrequency: string;
  startDate: string;
  nextPaymentDate: string | null;
  paidAmount: number;
  paidInstallments: number;
  status: string;
  paymentMethod: string | null;
  payments: Payment[];
  createdAt: string;
  completedAt: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  active: { label: "פעיל", color: "bg-green-100 text-green-700", icon: Play },
  completed: { label: "הושלם", color: "bg-blue-100 text-blue-700", icon: Check },
  cancelled: { label: "בוטל", color: "bg-red-100 text-red-700", icon: X },
  paused: { label: "מושהה", color: "bg-yellow-100 text-yellow-700", icon: Pause },
};

const frequencyLabels: Record<string, string> = {
  weekly: "שבועי",
  biweekly: "דו-שבועי",
  monthly: "חודשי",
};

export default function PaymentPlansPage() {
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("active");
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [recordingPayment, setRecordingPayment] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    dealId: "",
    numberOfPayments: "3",
    paymentFrequency: "monthly",
    startDate: new Date().toISOString().split("T")[0],
    paymentMethod: "",
  });

  // Payment form state
  const [paymentFormData, setPaymentFormData] = useState({
    amount: "",
    notes: "",
  });

  useEffect(() => {
    fetchPlans();
    fetchDealsForPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/payments/plans");
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDealsForPlans = async () => {
    try {
      const res = await fetch("/api/crm/deals");
      if (res.ok) {
        const data = await res.json();
        // Filter deals that are pending or partially paid and don't have an active plan
        const eligibleDeals = data.filter(
          (d: any) =>
            (d.status === "pending" || d.status === "partially_paid") &&
            d.finalAmount > (d.paidAmount || 0)
        );
        setDeals(eligibleDeals);
      }
    } catch (error) {
      console.error("Error fetching deals:", error);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const deal = deals.find((d) => d.id === formData.dealId);
      if (!deal) return;

      const res = await fetch("/api/payments/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealId: formData.dealId,
          contactId: deal.contactId,
          totalAmount: deal.finalAmount - (deal.paidAmount || 0),
          numberOfPayments: parseInt(formData.numberOfPayments),
          paymentFrequency: formData.paymentFrequency,
          startDate: formData.startDate,
          paymentMethod: formData.paymentMethod || null,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        resetForm();
        fetchPlans();
        fetchDealsForPlans();
      }
    } catch (error) {
      console.error("Error creating plan:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setRecordingPayment(true);

    try {
      const res = await fetch(`/api/payments/plans/${selectedPlan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: paymentFormData.amount ? parseFloat(paymentFormData.amount) : undefined,
          notes: paymentFormData.notes || undefined,
        }),
      });

      if (res.ok) {
        setShowPaymentModal(false);
        setPaymentFormData({ amount: "", notes: "" });
        fetchPlans();

        // Update selected plan
        const updated = await res.json();
        setSelectedPlan(updated.plan);
      }
    } catch (error) {
      console.error("Error recording payment:", error);
    } finally {
      setRecordingPayment(false);
    }
  };

  const handleUpdateStatus = async (planId: string, status: string) => {
    try {
      const res = await fetch(`/api/payments/plans/${planId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchPlans();
        if (selectedPlan?.id === planId) {
          const updated = await res.json();
          setSelectedPlan(updated);
        }
      }
    } catch (error) {
      console.error("Error updating plan status:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      dealId: "",
      numberOfPayments: "3",
      paymentFrequency: "monthly",
      startDate: new Date().toISOString().split("T")[0],
      paymentMethod: "",
    });
  };

  // Calculate installment amount
  const getInstallmentAmount = (plan: PaymentPlan) => {
    return plan.totalAmount / plan.numberOfPayments;
  };

  // Filter plans
  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      !searchQuery ||
      plan.contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.contact.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || plan.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalExpected = plans
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + (p.totalAmount - p.paidAmount), 0);

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
          <h2 className="text-xl font-bold text-navy">תוכניות תשלום</h2>
          <p className="text-navy/60">
            {plans.filter((p) => p.status === "active").length} תוכניות פעילות | צפי:{" "}
            {formatPrice(totalExpected)}
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          disabled={deals.length === 0}
        >
          <Plus className="h-4 w-4 ml-2" />
          תוכנית חדשה
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
                placeholder="חיפוש לפי שם או אימייל..."
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

      {/* Plans Table */}
      <Card>
        <CardContent className="p-0">
          {filteredPlans.length === 0 ? (
            <div className="text-center py-12 text-navy/50">
              <CalendarCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>אין תוכניות תשלום להצגה</p>
              {deals.length > 0 && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  צור תוכנית ראשונה
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-cream/50 border-b border-blush">
                    <th className="text-right p-4 text-sm font-medium text-navy">לקוח</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">מוצר</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">סה״כ</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">התקדמות</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">תשלום הבא</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">סטטוס</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlans.map((plan) => {
                    const statusInfo = statusConfig[plan.status] || statusConfig.active;
                    const StatusIcon = statusInfo.icon;
                    const progress = (plan.paidInstallments / plan.numberOfPayments) * 100;

                    return (
                      <tr
                        key={plan.id}
                        className="border-b border-blush/50 hover:bg-cream/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs font-medium">
                              {plan.contact.firstName[0]}
                              {plan.contact.lastName?.[0] || ""}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-navy">
                                {plan.contact.firstName} {plan.contact.lastName}
                              </p>
                              <p className="text-xs text-navy/50">{plan.contact.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-navy">
                            {plan.deal.product.nameHe || plan.deal.product.name}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>
                            <span className="font-bold text-navy">
                              {formatPrice(plan.totalAmount)}
                            </span>
                            <span className="text-xs text-navy/50 block">
                              {plan.numberOfPayments} תשלומים x{" "}
                              {formatPrice(getInstallmentAmount(plan))}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-teal transition-all"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-navy/60 whitespace-nowrap">
                                {plan.paidInstallments}/{plan.numberOfPayments}
                              </span>
                            </div>
                            <span className="text-xs text-navy/50">
                              {formatPrice(plan.paidAmount)} / {formatPrice(plan.totalAmount)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          {plan.nextPaymentDate && plan.status === "active" ? (
                            <div className="flex items-center gap-2 text-sm text-navy">
                              <Calendar className="h-4 w-4 text-navy/50" />
                              {new Date(plan.nextPaymentDate).toLocaleDateString("he-IL")}
                            </div>
                          ) : (
                            <span className="text-xs text-navy/40">-</span>
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedPlan(plan)}
                              className="p-2 text-navy/50 hover:text-navy hover:bg-cream rounded-lg transition-colors"
                              title="צפייה בפרטים"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {plan.status === "active" && (
                              <button
                                onClick={() => {
                                  setSelectedPlan(plan);
                                  setPaymentFormData({
                                    amount: getInstallmentAmount(plan).toFixed(2),
                                    notes: "",
                                  });
                                  setShowPaymentModal(true);
                                }}
                                className="p-2 text-navy/50 hover:text-teal hover:bg-teal/10 rounded-lg transition-colors"
                                title="רשום תשלום"
                              >
                                <CreditCard className="h-4 w-4" />
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

      {/* Plan Detail Sidebar */}
      {selectedPlan && !showPaymentModal && (
        <div className="fixed inset-y-0 left-0 z-50 w-96 bg-white shadow-xl border-r border-blush overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-blush">
            <h3 className="text-lg font-bold text-navy">פרטי תוכנית</h3>
            <button onClick={() => setSelectedPlan(null)}>
              <X className="w-5 h-5 text-navy/50 hover:text-navy" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Progress */}
            <div className="text-center py-4 bg-cream rounded-lg">
              <p className="text-sm text-navy/60">התקדמות</p>
              <p className="text-3xl font-bold text-navy">
                {selectedPlan.paidInstallments}/{selectedPlan.numberOfPayments}
              </p>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-3 mx-auto max-w-[200px]">
                <div
                  className="h-full bg-teal transition-all"
                  style={{
                    width: `${(selectedPlan.paidInstallments / selectedPlan.numberOfPayments) * 100}%`,
                  }}
                />
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-3",
                  statusConfig[selectedPlan.status]?.color
                )}
              >
                {statusConfig[selectedPlan.status]?.label}
              </span>
            </div>

            {/* Customer */}
            <div>
              <h5 className="font-medium text-navy mb-2">לקוח</h5>
              <div className="bg-cream rounded-lg p-4">
                <p className="font-medium text-navy">
                  {selectedPlan.contact.firstName} {selectedPlan.contact.lastName}
                </p>
                <p className="text-sm text-navy/60">{selectedPlan.contact.email}</p>
              </div>
            </div>

            {/* Product */}
            <div>
              <h5 className="font-medium text-navy mb-2">מוצר</h5>
              <div className="bg-cream rounded-lg p-4">
                <p className="font-medium text-navy">
                  {selectedPlan.deal.product.nameHe || selectedPlan.deal.product.name}
                </p>
              </div>
            </div>

            {/* Amounts */}
            <div>
              <h5 className="font-medium text-navy mb-2">פרטי תשלום</h5>
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-cream rounded-lg">
                  <span className="text-navy/60">סה״כ</span>
                  <span className="font-bold text-navy">
                    {formatPrice(selectedPlan.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-cream rounded-lg">
                  <span className="text-navy/60">שולם</span>
                  <span className="text-green-600">
                    {formatPrice(selectedPlan.paidAmount)}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-cream rounded-lg">
                  <span className="text-navy/60">נותר</span>
                  <span className="text-navy">
                    {formatPrice(selectedPlan.totalAmount - selectedPlan.paidAmount)}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-cream rounded-lg">
                  <span className="text-navy/60">גובה תשלום</span>
                  <span className="text-navy">
                    {formatPrice(getInstallmentAmount(selectedPlan))}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-cream rounded-lg">
                  <span className="text-navy/60">תדירות</span>
                  <span className="text-navy">
                    {frequencyLabels[selectedPlan.paymentFrequency] ||
                      selectedPlan.paymentFrequency}
                  </span>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h5 className="font-medium text-navy mb-2">תאריכים</h5>
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-cream rounded-lg">
                  <span className="text-navy/60">התחלה</span>
                  <span className="text-navy">
                    {new Date(selectedPlan.startDate).toLocaleDateString("he-IL")}
                  </span>
                </div>
                {selectedPlan.nextPaymentDate && selectedPlan.status === "active" && (
                  <div className="flex justify-between p-3 bg-teal/10 rounded-lg">
                    <span className="text-teal">תשלום הבא</span>
                    <span className="font-medium text-teal">
                      {new Date(selectedPlan.nextPaymentDate).toLocaleDateString("he-IL")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment History */}
            {selectedPlan.payments.length > 0 && (
              <div>
                <h5 className="font-medium text-navy mb-2">היסטוריית תשלומים</h5>
                <div className="space-y-2">
                  {selectedPlan.payments.map((payment, index) => (
                    <div
                      key={payment.id}
                      className="flex justify-between items-center p-3 bg-cream rounded-lg"
                    >
                      <div>
                        <p className="text-sm text-navy">
                          תשלום {selectedPlan.payments.length - index}
                        </p>
                        <p className="text-xs text-navy/50">
                          {new Date(payment.createdAt).toLocaleDateString("he-IL")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-navy">
                          {formatPrice(payment.amount)}
                        </span>
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {selectedPlan.status === "active" && (
              <div className="space-y-2 pt-4 border-t border-blush">
                <Button
                  onClick={() => {
                    setPaymentFormData({
                      amount: getInstallmentAmount(selectedPlan).toFixed(2),
                      notes: "",
                    });
                    setShowPaymentModal(true);
                  }}
                  className="w-full"
                >
                  <CreditCard className="h-4 w-4 ml-2" />
                  רשום תשלום
                </Button>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdateStatus(selectedPlan.id, "paused")}
                    variant="outline"
                    className="flex-1"
                  >
                    <Pause className="h-4 w-4 ml-2" />
                    השהה
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(selectedPlan.id, "cancelled")}
                    variant="ghost"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 ml-2" />
                    בטל
                  </Button>
                </div>
              </div>
            )}

            {selectedPlan.status === "paused" && (
              <div className="pt-4 border-t border-blush">
                <Button
                  onClick={() => handleUpdateStatus(selectedPlan.id, "active")}
                  className="w-full"
                >
                  <Play className="h-4 w-4 ml-2" />
                  הפעל מחדש
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-navy/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-blush">
              <h3 className="text-lg font-bold text-navy">יצירת תוכנית תשלום</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5 text-navy/50 hover:text-navy" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="p-4 space-y-4">
              {/* Deal Select */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  בחר עסקה *
                </label>
                <select
                  value={formData.dealId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, dealId: e.target.value }))
                  }
                  required
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="">בחר עסקה</option>
                  {deals.map((deal) => (
                    <option key={deal.id} value={deal.id}>
                      {deal.contact.firstName} {deal.contact.lastName} -{" "}
                      {deal.product.nameHe || deal.product.name} ({formatPrice(deal.finalAmount - (deal.paidAmount || 0))})
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Payments */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  מספר תשלומים *
                </label>
                <select
                  value={formData.numberOfPayments}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, numberOfPayments: e.target.value }))
                  }
                  required
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                    <option key={n} value={n}>
                      {n} תשלומים
                    </option>
                  ))}
                </select>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  תדירות
                </label>
                <select
                  value={formData.paymentFrequency}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, paymentFrequency: e.target.value }))
                  }
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="weekly">שבועי</option>
                  <option value="biweekly">דו-שבועי</option>
                  <option value="monthly">חודשי</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  תאריך התחלה
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </div>

              {/* Installment Preview */}
              {formData.dealId && (
                <div className="bg-cream rounded-lg p-4">
                  <p className="text-sm text-navy/60">גובה כל תשלום:</p>
                  <p className="text-xl font-bold text-navy">
                    {formatPrice(
                      (deals.find((d) => d.id === formData.dealId)?.finalAmount -
                        (deals.find((d) => d.id === formData.dealId)?.paidAmount || 0)) /
                        parseInt(formData.numberOfPayments)
                    )}
                  </p>
                </div>
              )}

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={creating || !formData.dealId}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      יוצר...
                    </>
                  ) : (
                    "צור תוכנית"
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

      {/* Record Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-navy/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-blush">
              <h3 className="text-lg font-bold text-navy">רישום תשלום</h3>
              <button onClick={() => setShowPaymentModal(false)}>
                <X className="w-5 h-5 text-navy/50 hover:text-navy" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-4 space-y-4">
              <div className="bg-cream rounded-lg p-4">
                <p className="text-sm text-navy/60">
                  תשלום {selectedPlan.paidInstallments + 1} מתוך{" "}
                  {selectedPlan.numberOfPayments}
                </p>
                <p className="font-medium text-navy">
                  {selectedPlan.contact.firstName} {selectedPlan.contact.lastName}
                </p>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  סכום
                </label>
                <input
                  type="number"
                  value={paymentFormData.amount}
                  onChange={(e) =>
                    setPaymentFormData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  min="0"
                  step="0.01"
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                />
                <p className="text-xs text-navy/50 mt-1">
                  גובה תשלום רגיל: {formatPrice(getInstallmentAmount(selectedPlan))}
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  הערות
                </label>
                <textarea
                  value={paymentFormData.notes}
                  onChange={(e) =>
                    setPaymentFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows={2}
                  className="w-full px-4 py-3 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={recordingPayment}
                >
                  {recordingPayment ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      רושם...
                    </>
                  ) : (
                    "רשום תשלום"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPaymentModal(false)}
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
