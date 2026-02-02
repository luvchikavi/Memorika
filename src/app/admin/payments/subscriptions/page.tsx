"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Search,
  Plus,
  X,
  Eye,
  Check,
  Pause,
  Play,
  Loader2,
  CreditCard,
  Calendar,
  DollarSign,
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
  price: number;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface RecurringPayment {
  id: string;
  contactId: string;
  contact: Contact;
  productId: string | null;
  product: Product | null;
  name: string;
  amount: number;
  currency: string;
  billingCycle: string;
  startDate: string;
  nextBillingDate: string | null;
  status: string;
  paymentMethod: string;
  totalCharges: number;
  totalRevenue: number;
  payments: Payment[];
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  active: { label: "פעיל", color: "bg-green-100 text-green-700", icon: Play },
  paused: { label: "מושהה", color: "bg-yellow-100 text-yellow-700", icon: Pause },
  cancelled: { label: "בוטל", color: "bg-red-100 text-red-700", icon: X },
};

const billingCycleLabels: Record<string, string> = {
  weekly: "שבועי",
  monthly: "חודשי",
  quarterly: "רבעוני",
  yearly: "שנתי",
};

const paymentMethodLabels: Record<string, string> = {
  credit_card: "כרטיס אשראי",
  bank_transfer: "העברה בנקאית",
  bit: "ביט",
  paybox: "PayBox",
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<RecurringPayment[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("active");
  const [selectedSubscription, setSelectedSubscription] = useState<RecurringPayment | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [charging, setCharging] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    contactId: "",
    productId: "",
    name: "",
    amount: "",
    billingCycle: "monthly",
    startDate: new Date().toISOString().split("T")[0],
    paymentMethod: "credit_card",
  });

  useEffect(() => {
    fetchSubscriptions();
    fetchContacts();
    fetchProducts();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch("/api/payments/recurring");
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
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
        setProducts(data.filter((p: any) => p.isActive));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/payments/recurring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: formData.contactId,
          productId: formData.productId || null,
          name: formData.name,
          amount: parseFloat(formData.amount),
          billingCycle: formData.billingCycle,
          startDate: formData.startDate,
          paymentMethod: formData.paymentMethod,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        resetForm();
        fetchSubscriptions();
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleChargeSubscription = async () => {
    if (!selectedSubscription) return;
    setCharging(true);

    try {
      const res = await fetch(`/api/payments/recurring/${selectedSubscription.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        setShowChargeModal(false);
        fetchSubscriptions();

        const updated = await res.json();
        setSelectedSubscription(updated.subscription);
      }
    } catch (error) {
      console.error("Error charging subscription:", error);
    } finally {
      setCharging(false);
    }
  };

  const handleUpdateStatus = async (subscriptionId: string, action: string) => {
    setUpdating(subscriptionId);

    try {
      const res = await fetch(`/api/payments/recurring/${subscriptionId}/pause`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        fetchSubscriptions();
        if (selectedSubscription?.id === subscriptionId) {
          const updated = await res.json();
          setSelectedSubscription(updated);
        }
      }
    } catch (error) {
      console.error("Error updating subscription status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const resetForm = () => {
    setFormData({
      contactId: "",
      productId: "",
      name: "",
      amount: "",
      billingCycle: "monthly",
      startDate: new Date().toISOString().split("T")[0],
      paymentMethod: "credit_card",
    });
  };

  // Handle product selection - auto-fill name and price
  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setFormData((prev) => ({
      ...prev,
      productId,
      name: product ? (product.nameHe || product.name) : prev.name,
      amount: product ? product.price.toString() : prev.amount,
    }));
  };

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      !searchQuery ||
      sub.contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalMRR = subscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, s) => {
      // Normalize to monthly
      switch (s.billingCycle) {
        case "weekly":
          return sum + s.amount * 4;
        case "quarterly":
          return sum + s.amount / 3;
        case "yearly":
          return sum + s.amount / 12;
        default:
          return sum + s.amount;
      }
    }, 0);

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
          <h2 className="text-xl font-bold text-navy">מנויים</h2>
          <p className="text-navy/60">
            {subscriptions.filter((s) => s.status === "active").length} מנויים פעילים | MRR:{" "}
            {formatPrice(totalMRR)}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 ml-2" />
          מנוי חדש
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Play className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-navy/60">פעילים</p>
                <p className="text-xl font-bold text-navy">
                  {subscriptions.filter((s) => s.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal/10">
                <DollarSign className="h-5 w-5 text-teal" />
              </div>
              <div>
                <p className="text-sm text-navy/60">הכנסה חודשית (MRR)</p>
                <p className="text-xl font-bold text-navy">{formatPrice(totalMRR)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Pause className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-navy/60">מושהים</p>
                <p className="text-xl font-bold text-navy">
                  {subscriptions.filter((s) => s.status === "paused").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <RefreshCw className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-navy/60">סה״כ הכנסות</p>
                <p className="text-xl font-bold text-navy">
                  {formatPrice(subscriptions.reduce((sum, s) => sum + s.totalRevenue, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                placeholder="חיפוש לפי שם, אימייל או מנוי..."
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

      {/* Subscriptions Table */}
      <Card>
        <CardContent className="p-0">
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12 text-navy/50">
              <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>אין מנויים להצגה</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 ml-2" />
                צור מנוי ראשון
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-cream/50 border-b border-blush">
                    <th className="text-right p-4 text-sm font-medium text-navy">לקוח</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">מנוי</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">סכום</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">תדירות</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">חיוב הבא</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">סטטוס</th>
                    <th className="text-right p-4 text-sm font-medium text-navy">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((subscription) => {
                    const statusInfo = statusConfig[subscription.status] || statusConfig.active;
                    const StatusIcon = statusInfo.icon;

                    return (
                      <tr
                        key={subscription.id}
                        className="border-b border-blush/50 hover:bg-cream/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs font-medium">
                              {subscription.contact.firstName[0]}
                              {subscription.contact.lastName?.[0] || ""}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-navy">
                                {subscription.contact.firstName} {subscription.contact.lastName}
                              </p>
                              <p className="text-xs text-navy/50">{subscription.contact.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-navy">{subscription.name}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-navy">
                            {formatPrice(subscription.amount)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-navy">
                            {billingCycleLabels[subscription.billingCycle] ||
                              subscription.billingCycle}
                          </span>
                        </td>
                        <td className="p-4">
                          {subscription.nextBillingDate && subscription.status === "active" ? (
                            <div className="flex items-center gap-2 text-sm text-navy">
                              <Calendar className="h-4 w-4 text-navy/50" />
                              {new Date(subscription.nextBillingDate).toLocaleDateString("he-IL")}
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
                              onClick={() => setSelectedSubscription(subscription)}
                              className="p-2 text-navy/50 hover:text-navy hover:bg-cream rounded-lg transition-colors"
                              title="צפייה בפרטים"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {subscription.status === "active" && (
                              <button
                                onClick={() => {
                                  setSelectedSubscription(subscription);
                                  setShowChargeModal(true);
                                }}
                                className="p-2 text-navy/50 hover:text-teal hover:bg-teal/10 rounded-lg transition-colors"
                                title="חייב עכשיו"
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

      {/* Subscription Detail Sidebar */}
      {selectedSubscription && !showChargeModal && (
        <div className="fixed inset-y-0 left-0 z-50 w-96 bg-white shadow-xl border-r border-blush overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-blush">
            <h3 className="text-lg font-bold text-navy">פרטי מנוי</h3>
            <button onClick={() => setSelectedSubscription(null)}>
              <X className="w-5 h-5 text-navy/50 hover:text-navy" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Status & Amount */}
            <div className="text-center py-4 bg-cream rounded-lg">
              <p className="text-sm text-navy/60">{selectedSubscription.name}</p>
              <p className="text-3xl font-bold text-navy">
                {formatPrice(selectedSubscription.amount)}
              </p>
              <p className="text-sm text-navy/60">
                {billingCycleLabels[selectedSubscription.billingCycle]}
              </p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mt-3",
                  statusConfig[selectedSubscription.status]?.color
                )}
              >
                {statusConfig[selectedSubscription.status]?.label}
              </span>
            </div>

            {/* Customer */}
            <div>
              <h5 className="font-medium text-navy mb-2">לקוח</h5>
              <div className="bg-cream rounded-lg p-4">
                <p className="font-medium text-navy">
                  {selectedSubscription.contact.firstName}{" "}
                  {selectedSubscription.contact.lastName}
                </p>
                <p className="text-sm text-navy/60">{selectedSubscription.contact.email}</p>
                {selectedSubscription.contact.phone && (
                  <p className="text-sm text-navy/60">{selectedSubscription.contact.phone}</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div>
              <h5 className="font-medium text-navy mb-2">סטטיסטיקות</h5>
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-cream rounded-lg">
                  <span className="text-navy/60">סה״כ חיובים</span>
                  <span className="font-bold text-navy">{selectedSubscription.totalCharges}</span>
                </div>
                <div className="flex justify-between p-3 bg-cream rounded-lg">
                  <span className="text-navy/60">סה״כ הכנסות</span>
                  <span className="font-bold text-green-600">
                    {formatPrice(selectedSubscription.totalRevenue)}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-cream rounded-lg">
                  <span className="text-navy/60">אמצעי תשלום</span>
                  <span className="text-navy">
                    {paymentMethodLabels[selectedSubscription.paymentMethod] ||
                      selectedSubscription.paymentMethod}
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
                    {new Date(selectedSubscription.startDate).toLocaleDateString("he-IL")}
                  </span>
                </div>
                {selectedSubscription.nextBillingDate &&
                  selectedSubscription.status === "active" && (
                    <div className="flex justify-between p-3 bg-teal/10 rounded-lg">
                      <span className="text-teal">חיוב הבא</span>
                      <span className="font-medium text-teal">
                        {new Date(selectedSubscription.nextBillingDate).toLocaleDateString(
                          "he-IL"
                        )}
                      </span>
                    </div>
                  )}
              </div>
            </div>

            {/* Payment History */}
            {selectedSubscription.payments.length > 0 && (
              <div>
                <h5 className="font-medium text-navy mb-2">חיובים אחרונים</h5>
                <div className="space-y-2">
                  {selectedSubscription.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex justify-between items-center p-3 bg-cream rounded-lg"
                    >
                      <div>
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
            <div className="space-y-2 pt-4 border-t border-blush">
              {selectedSubscription.status === "active" && (
                <>
                  <Button
                    onClick={() => setShowChargeModal(true)}
                    className="w-full"
                  >
                    <CreditCard className="h-4 w-4 ml-2" />
                    חייב עכשיו
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleUpdateStatus(selectedSubscription.id, "pause")}
                      disabled={updating === selectedSubscription.id}
                      variant="outline"
                      className="flex-1"
                    >
                      {updating === selectedSubscription.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Pause className="h-4 w-4 ml-2" />
                          השהה
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus(selectedSubscription.id, "cancel")}
                      disabled={updating === selectedSubscription.id}
                      variant="ghost"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 ml-2" />
                      בטל
                    </Button>
                  </div>
                </>
              )}

              {selectedSubscription.status === "paused" && (
                <Button
                  onClick={() => handleUpdateStatus(selectedSubscription.id, "resume")}
                  disabled={updating === selectedSubscription.id}
                  className="w-full"
                >
                  {updating === selectedSubscription.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Play className="h-4 w-4 ml-2" />
                      הפעל מחדש
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Subscription Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-navy/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-blush">
              <h3 className="text-lg font-bold text-navy">יצירת מנוי</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5 text-navy/50 hover:text-navy" />
              </button>
            </div>

            <form onSubmit={handleCreateSubscription} className="p-4 space-y-4">
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

              {/* Product Select (Optional) */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  מוצר (אופציונלי)
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="">ללא מוצר</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.nameHe || product.name} ({formatPrice(product.price)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  שם המנוי *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  placeholder="למשל: מנוי חודשי פרימיום"
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                />
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

              {/* Billing Cycle */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  תדירות
                </label>
                <select
                  value={formData.billingCycle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, billingCycle: e.target.value }))
                  }
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="weekly">שבועי</option>
                  <option value="monthly">חודשי</option>
                  <option value="quarterly">רבעוני</option>
                  <option value="yearly">שנתי</option>
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

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  אמצעי תשלום
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))
                  }
                  className="w-full h-11 px-4 border border-blush rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="credit_card">כרטיס אשראי</option>
                  <option value="bank_transfer">העברה בנקאית</option>
                  <option value="bit">ביט</option>
                </select>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={creating || !formData.contactId || !formData.name || !formData.amount}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      יוצר...
                    </>
                  ) : (
                    "צור מנוי"
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

      {/* Charge Modal */}
      {showChargeModal && selectedSubscription && (
        <div className="fixed inset-0 z-50 bg-navy/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-blush">
              <h3 className="text-lg font-bold text-navy">חיוב מנוי</h3>
              <button onClick={() => setShowChargeModal(false)}>
                <X className="w-5 h-5 text-navy/50 hover:text-navy" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-cream rounded-lg p-4 text-center">
                <p className="text-sm text-navy/60">{selectedSubscription.name}</p>
                <p className="text-2xl font-bold text-navy">
                  {formatPrice(selectedSubscription.amount)}
                </p>
                <p className="text-sm text-navy/60 mt-2">
                  {selectedSubscription.contact.firstName} {selectedSubscription.contact.lastName}
                </p>
              </div>

              <p className="text-sm text-navy/60 text-center">
                לחיצה על "חייב עכשיו" תיצור חיוב חדש ותעדכן את תאריך החיוב הבא.
              </p>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleChargeSubscription}
                  className="flex-1"
                  disabled={charging}
                >
                  {charging ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      מחייב...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 ml-2" />
                      חייב עכשיו
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowChargeModal(false)}
                >
                  ביטול
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
