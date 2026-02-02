"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";
import Link from "next/link";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function FacebookPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-600 rounded-lg text-white">
          <FacebookIcon className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-navy">Facebook</h2>
          <p className="text-navy/60">קמפיינים ופרסומים בפייסבוק</p>
        </div>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Construction className="h-16 w-16 mx-auto mb-4 text-blue-600" />
          <h3 className="text-xl font-bold text-navy mb-2">בקרוב!</h3>
          <p className="text-navy/60 mb-6 max-w-md mx-auto">
            אינטגרציית Facebook לקמפיינים תהיה זמינה בקרוב.
            בינתיים, תוכל להגדיר את פרטי החיבור בהגדרות.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/admin/messaging/settings">
              <Button variant="outline">הגדר חיבור</Button>
            </Link>
            <Link href="/admin/sales">
              <Button className="bg-blue-600 hover:bg-blue-700">צור קמפיין ב-Sales Flow</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
