"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";
import Link from "next/link";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function InstagramPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg text-white">
          <InstagramIcon className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-navy">Instagram</h2>
          <p className="text-navy/60">קמפיינים ופרסומים באינסטגרם</p>
        </div>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Construction className="h-16 w-16 mx-auto mb-4 text-purple-500" />
          <h3 className="text-xl font-bold text-navy mb-2">בקרוב!</h3>
          <p className="text-navy/60 mb-6 max-w-md mx-auto">
            אינטגרציית Instagram לקמפיינים תהיה זמינה בקרוב.
            בינתיים, תוכל להגדיר את פרטי החיבור בהגדרות.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/admin/messaging/settings">
              <Button variant="outline">הגדר חיבור</Button>
            </Link>
            <Link href="/admin/sales">
              <Button className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">צור קמפיין ב-Sales Flow</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
