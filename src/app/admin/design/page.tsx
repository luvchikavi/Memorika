"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LogoMain,
  LogoKeyA,
  LogoButterflyB,
  LogoLotusC,
  LogoBirdD,
  LogoME,
  LogoHandsF,
  LogoTreeG,
  LogoDropH,
} from "@/components/brand/logo";
import Image from "next/image";
import { Check } from "lucide-react";
import { useState } from "react";

const colors = [
  { name: "Deep Teal", nameHe: "טורקיז עמוק", hex: "#0D5C63", usage: "צבע ראשי" },
  { name: "Warm Gold", nameHe: "זהב חם", hex: "#D4A853", usage: "אקסנט" },
  { name: "Soft Cream", nameHe: "קרם רך", hex: "#FDF8F3", usage: "רקע" },
  { name: "Navy", nameHe: "כחול כהה", hex: "#1A365D", usage: "טקסט" },
  { name: "Sage Green", nameHe: "ירוק מרווה", hex: "#87A878", usage: "הצלחה" },
  { name: "Blush", nameHe: "ורוד עדין", hex: "#E8D5D0", usage: "גבולות" },
];

const logoOptions = [
  {
    id: "main-logo",
    name: "Main Logo",
    nameHe: "לוגו ראשי",
    description: "הלוגו הראשי של Memorika - מוח, מפתח וחלקיקים משתחררים",
    Icon: LogoMain,
    isImage: true,
  },
  {
    id: "brain-key-full",
    name: "Brain & Key Full",
    nameHe: "מוח ומפתח מלא",
    description: "מוח מפורט עם מפתח במרכז וחלקיקים משתחררים",
    Icon: LogoKeyA,
    isImage: false,
  },
  {
    id: "brain-key-simple",
    name: "Brain & Key Simple",
    nameHe: "מוח ומפתח פשוט",
    description: "גרסה פשוטה ונקייה עם עיגולים משתחררים",
    Icon: LogoButterflyB,
    isImage: false,
  },
  {
    id: "brain-silhouette",
    name: "Brain Silhouette",
    nameHe: "צללית מוח",
    description: "צללית מוח עם מפתח ומרובעים מסתובבים",
    Icon: LogoLotusC,
    isImage: false,
  },
  {
    id: "brain-waves",
    name: "Brain Waves",
    nameHe: "גלי מוח",
    description: "מוח כגלים זורמים עם מפתח במרכז",
    Icon: LogoBirdD,
    isImage: false,
  },
  {
    id: "brain-compact",
    name: "Compact Icon",
    nameHe: "אייקון קומפקטי",
    description: "גרסה קומפקטית לאייקון אפליקציה",
    Icon: LogoME,
    isImage: false,
  },
  {
    id: "brain-unlock",
    name: "Unlocking Brain",
    nameHe: "מוח נפתח",
    description: "מפתח בתנועה פותח את המוח - דינמי",
    Icon: LogoHandsF,
    isImage: false,
  },
  {
    id: "brain-hex",
    name: "Hexagon Tech",
    nameHe: "משושים טכנולוגי",
    description: "מפתח משושה עם חלקיקים משושים - מתוחכם",
    Icon: LogoTreeG,
    isImage: false,
  },
  {
    id: "brain-badge",
    name: "Badge Style",
    nameHe: "סגנון תג",
    description: "מוח ומפתח בתוך עיגול - סגנון אמבלמה",
    Icon: LogoDropH,
    isImage: false,
  },
];

export default function DesignPackagePage() {
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);

  const selectedOption = logoOptions.find(o => o.id === selectedLogo);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">חבילת עיצוב - לוגו</h1>
        <p className="text-navy/60">הלוגו הראשי + וריאציות נוספות - בחרי את המועדף</p>
      </div>

      {/* Logo Options Grid */}
      <Card>
        <CardHeader>
          <CardTitle>אופציות לוגו</CardTitle>
          <p className="text-sm text-navy/60">לחצי על הלוגו המועדף לתצוגה מקדימה</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {logoOptions.map((option) => (
              <div
                key={option.id}
                className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedLogo === option.id
                    ? "border-teal bg-teal/5 shadow-lg"
                    : "border-blush hover:border-teal/50"
                }`}
                onClick={() => setSelectedLogo(option.id)}
              >
                {selectedLogo === option.id && (
                  <div className="absolute top-2 left-2 w-6 h-6 bg-teal rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex justify-center mb-4 h-36 items-center">
                  {option.isImage ? (
                    <Image src="/brand/logo-transparent.png" alt={option.name} width={140} height={140} className="object-contain" />
                  ) : (
                    <option.Icon className="w-28 h-28" />
                  )}
                </div>
                <h4 className="font-bold text-navy text-center">{option.nameHe}</h4>
                <p className="text-xs text-navy/50 text-center mt-1 line-clamp-2">{option.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Logo Preview */}
      {selectedOption && (
        <Card className="border-2 border-teal/30">
          <CardHeader className="bg-teal/5">
            <CardTitle>תצוגה מקדימה: {selectedOption.nameHe}</CardTitle>
            <p className="text-sm text-navy/60">{selectedOption.description}</p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Light background */}
              <div className="bg-cream p-8 rounded-xl">
                <p className="text-xs text-navy/40 mb-6 text-center">רקע בהיר</p>
                <div className="flex flex-col items-center gap-8">
                  {/* Icon only - large */}
                  {selectedOption.isImage ? (
                    <Image src="/brand/logo-transparent.png" alt="Memorika" width={96} height={96} className="object-contain" />
                  ) : (
                    <selectedOption.Icon className="w-24 h-24" />
                  )}

                  {/* With text */}
                  <div className="flex items-center gap-4">
                    {selectedOption.isImage ? (
                      <Image src="/brand/logo-transparent.png" alt="Memorika" width={48} height={48} className="object-contain" />
                    ) : (
                      <selectedOption.Icon className="w-12 h-12" />
                    )}
                    <span className="text-3xl font-bold text-navy">Memorika</span>
                  </div>

                  {/* With tagline */}
                  <div className="text-center">
                    <div className="flex items-center gap-3 justify-center">
                      {selectedOption.isImage ? (
                        <Image src="/brand/logo-transparent.png" alt="Memorika" width={40} height={40} className="object-contain" />
                      ) : (
                        <selectedOption.Icon className="w-10 h-10" />
                      )}
                      <span className="text-2xl font-bold text-navy">Memorika</span>
                    </div>
                    <p className="text-navy/60 mt-2 text-lg">ניקוי זכרונות מפתח</p>
                  </div>
                </div>
              </div>

              {/* Dark background */}
              <div className="bg-navy p-8 rounded-xl">
                <p className="text-xs text-white/40 mb-6 text-center">רקע כהה</p>
                <div className="flex flex-col items-center gap-8 [&_svg_.text-teal]:text-white [&_svg_.text-navy]:text-white">
                  {/* Icon only - large */}
                  {selectedOption.isImage ? (
                    <Image src="/brand/logo-transparent.png" alt="Memorika" width={96} height={96} className="object-contain" />
                  ) : (
                    <selectedOption.Icon className="w-24 h-24" />
                  )}

                  {/* With text */}
                  <div className="flex items-center gap-4">
                    {selectedOption.isImage ? (
                      <Image src="/brand/logo-transparent.png" alt="Memorika" width={48} height={48} className="object-contain" />
                    ) : (
                      <selectedOption.Icon className="w-12 h-12" />
                    )}
                    <span className="text-3xl font-bold text-white">Memorika</span>
                  </div>

                  {/* With tagline */}
                  <div className="text-center">
                    <div className="flex items-center gap-3 justify-center">
                      {selectedOption.isImage ? (
                        <Image src="/brand/logo-transparent.png" alt="Memorika" width={40} height={40} className="object-contain" />
                      ) : (
                        <selectedOption.Icon className="w-10 h-10" />
                      )}
                      <span className="text-2xl font-bold text-white">Memorika</span>
                    </div>
                    <p className="text-white/60 mt-2 text-lg">ניקוי זכרונות מפתח</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-8 p-8 bg-cream/50 rounded-xl">
              <h4 className="font-bold text-navy mb-6 text-center text-lg">גדלים שונים</h4>
              <div className="flex items-end justify-center gap-12">
                <div className="text-center">
                  {selectedOption.isImage ? (
                    <Image src="/brand/logo-transparent.png" alt="XS" width={48} height={48} className="object-contain mx-auto" />
                  ) : (
                    <selectedOption.Icon className="w-12 h-12 mx-auto" />
                  )}
                  <p className="text-sm text-navy/40 mt-2">XS</p>
                </div>
                <div className="text-center">
                  {selectedOption.isImage ? (
                    <Image src="/brand/logo-transparent.png" alt="S" width={80} height={80} className="object-contain mx-auto" />
                  ) : (
                    <selectedOption.Icon className="w-20 h-20 mx-auto" />
                  )}
                  <p className="text-sm text-navy/40 mt-2">S</p>
                </div>
                <div className="text-center">
                  {selectedOption.isImage ? (
                    <Image src="/brand/logo-transparent.png" alt="M" width={120} height={120} className="object-contain mx-auto" />
                  ) : (
                    <selectedOption.Icon className="w-28 h-28 mx-auto" />
                  )}
                  <p className="text-sm text-navy/40 mt-2">M</p>
                </div>
                <div className="text-center">
                  {selectedOption.isImage ? (
                    <Image src="/brand/logo-transparent.png" alt="L" width={160} height={160} className="object-contain mx-auto" />
                  ) : (
                    <selectedOption.Icon className="w-36 h-36 mx-auto" />
                  )}
                  <p className="text-sm text-navy/40 mt-2">L</p>
                </div>
                <div className="text-center">
                  {selectedOption.isImage ? (
                    <Image src="/brand/logo-transparent.png" alt="XL" width={200} height={200} className="object-contain mx-auto" />
                  ) : (
                    <selectedOption.Icon className="w-48 h-48 mx-auto" />
                  )}
                  <p className="text-sm text-navy/40 mt-2">XL</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>פלטת צבעים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {colors.map((color) => (
              <div key={color.hex} className="rounded-xl overflow-hidden border border-blush">
                <div
                  className="h-16 flex items-end p-2"
                  style={{ backgroundColor: color.hex }}
                >
                  <span
                    className={`text-xs font-mono ${
                      color.hex === "#FDF8F3" || color.hex === "#E8D5D0"
                        ? "text-navy"
                        : "text-white"
                    }`}
                  >
                    {color.hex}
                  </span>
                </div>
                <div className="p-2 bg-white">
                  <h4 className="font-bold text-navy text-xs">{color.nameHe}</h4>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>טיפוגרפיה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-cream/50 rounded-xl">
              <h4 className="text-sm text-navy/50 mb-2">Heebo - עברית</h4>
              <p className="text-3xl font-bold text-navy">ניקוי זכרונות מפתח</p>
              <p className="text-lg text-navy/70 mt-2">טראומה היא לא גזירת גורל</p>
            </div>
            <div className="p-6 bg-cream/50 rounded-xl">
              <h4 className="text-sm text-navy/50 mb-2">Poppins - English</h4>
              <p className="text-3xl font-bold text-navy">Memorika</p>
              <p className="text-lg text-navy/70 mt-2">Key Memory Cleaning</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Selection */}
      {selectedLogo && (
        <Card className="bg-gradient-to-l from-teal to-teal-dark text-white">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold">נבחר: {selectedOption?.nameHe}</h3>
              <p className="text-white/70 text-sm">לחצי לאישור הבחירה</p>
            </div>
            <Button variant="primary" size="lg">
              <Check className="w-5 h-5" />
              אשר בחירה
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
