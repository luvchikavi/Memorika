"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  FileText,
  Users,
  Layers,
  Star,
  StarOff,
  Check,
  X,
  Search,
  Stethoscope,
  Mountain,
  Calendar,
  Download,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  nameHe: string | null;
  description: string | null;
  price: number;
  currency: string;
  category: string | null;
  isActive: boolean;
  isFeatured: boolean;
  image: string | null;
  createdAt: string;
  _count?: {
    leads: number;
    deals: number;
  };
}

const categories = [
  { id: "course", label: "קורס", icon: BookOpen, color: "bg-blue-500" },
  { id: "digital", label: "מוצר דיגיטלי", icon: Download, color: "bg-purple-500" },
  { id: "ebook", label: "ספר דיגיטלי", icon: FileText, color: "bg-indigo-500" },
  { id: "coaching", label: "אימון", icon: Users, color: "bg-green-500" },
  { id: "clinic", label: "קליניקה", icon: Stethoscope, color: "bg-pink-500" },
  { id: "retreat", label: "ריטריט", icon: Mountain, color: "bg-teal-500" },
  { id: "meeting", label: "פגישה", icon: Calendar, color: "bg-amber-500" },
  { id: "bundle", label: "חבילה", icon: Layers, color: "bg-orange-500" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    nameHe: "",
    description: "",
    price: "",
    currency: "ILS",
    category: "course",
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/sales/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProduct
        ? `/api/sales/products/${editingProduct.id}`
        : "/api/sales/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchProducts();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameHe: product.nameHe || "",
      description: product.description || "",
      price: product.price.toString(),
      currency: product.currency,
      category: product.category || "course",
      isActive: product.isActive,
      isFeatured: product.isFeatured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק את המוצר?")) return;

    try {
      const res = await fetch(`/api/sales/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      const res = await fetch(`/api/sales/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !product.isFeatured }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, isFeatured: !p.isFeatured } : p
          )
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/sales/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, isActive: !p.isActive } : p
          )
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      nameHe: "",
      description: "",
      price: "",
      currency: "ILS",
      category: "course",
      isActive: true,
      isFeatured: false,
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.nameHe && product.nameHe.includes(searchQuery)) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !filterCategory || product.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryInfo = (categoryId: string | null) => {
    return categories.find((c) => c.id === categoryId) || categories[0];
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">מוצרים וקורסים</h2>
          <p className="text-navy/60">נהל את המוצרים, המחירים והקורסים שלך</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-teal hover:bg-teal-dark text-white"
        >
          <Plus className="h-4 w-4 ml-2" />
          הוסף מוצר
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">{products.length}</p>
                <p className="text-sm text-navy/60">סה״כ מוצרים</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">
                  {products.filter((p) => p.isActive).length}
                </p>
                <p className="text-sm text-navy/60">פעילים</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">
                  {products.filter((p) => p.isFeatured).length}
                </p>
                <p className="text-sm text-navy/60">מודגשים</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Layers className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">
                  {products.reduce((sum, p) => sum + (p._count?.deals || 0), 0)}
                </p>
                <p className="text-sm text-navy/60">מכירות</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40" />
              <Input
                placeholder="חיפוש מוצר..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterCategory === null ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(null)}
              >
                הכל
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={filterCategory === cat.id ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setFilterCategory(cat.id)}
                >
                  <cat.icon className="h-4 w-4 ml-1" />
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-navy/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingProduct ? "עריכת מוצר" : "הוספת מוצר חדש"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>שם באנגלית *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>שם בעברית</Label>
                    <Input
                      value={formData.nameHe}
                      onChange={(e) =>
                        setFormData({ ...formData, nameHe: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>תיאור</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>מחיר *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>מטבע</Label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                    >
                      <option value="ILS">₪ ILS</option>
                      <option value="USD">$ USD</option>
                      <option value="EUR">€ EUR</option>
                    </select>
                  </div>
                  <div>
                    <Label>קטגוריה</Label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span>פעיל</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({ ...formData, isFeatured: e.target.checked })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span>מוצר מודגש</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-teal hover:bg-teal-dark">
                    {editingProduct ? "שמור שינויים" : "הוסף מוצר"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    ביטול
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-navy/30" />
            <p className="text-navy/60">
              {products.length === 0
                ? "אין מוצרים עדיין. הוסף את המוצר הראשון!"
                : "לא נמצאו מוצרים התואמים לחיפוש"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const categoryInfo = getCategoryInfo(product.category);
            const CategoryIcon = categoryInfo.icon;

            return (
              <Card
                key={product.id}
                className={`relative ${!product.isActive ? "opacity-60" : ""}`}
              >
                {/* Featured badge */}
                {product.isFeatured && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    מודגש
                  </div>
                )}

                <CardContent className="p-5">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`${categoryInfo.color} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}
                    >
                      <CategoryIcon className="h-3 w-3" />
                      {categoryInfo.label}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleFeatured(product)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title={product.isFeatured ? "הסר הדגשה" : "הדגש"}
                      >
                        {product.isFeatured ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <StarOff className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => toggleActive(product)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title={product.isActive ? "השבת" : "הפעל"}
                      >
                        {product.isActive ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-bold text-navy text-lg mb-1">
                    {product.nameHe || product.name}
                  </h3>
                  {product.nameHe && product.name && (
                    <p className="text-sm text-navy/50 mb-2">{product.name}</p>
                  )}

                  {/* Description */}
                  {product.description && (
                    <p className="text-sm text-navy/60 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-teal">
                      {product.currency === "ILS" ? "₪" : product.currency === "USD" ? "$" : "€"}
                      {product.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-navy/50 mb-4 pb-4 border-b">
                    <span>{product._count?.leads || 0} לידים</span>
                    <span>{product._count?.deals || 0} מכירות</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit2 className="h-4 w-4 ml-1" />
                      ערוך
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
