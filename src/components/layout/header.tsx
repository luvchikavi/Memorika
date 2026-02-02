"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "ראשי", href: "/" },
  { name: "אודות", href: "/about" },
  { name: "קורסים", href: "/courses" },
  { name: "המלצות", href: "/#testimonials" },
  { name: "צור קשר", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-blush/50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex h-28 items-center justify-between">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-4">
              <Image
                src="/brand/logo-transparent.png"
                alt="Memorika"
                width={90}
                height={90}
                className="object-contain"
              />
              <div>
                <span className="text-3xl font-bold text-navy block">
                  Memorika
                </span>
                <span className="block text-base text-navy/60 -mt-0.5">
                  ניקוי זכרונות מפתח
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-navy"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">פתח תפריט</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-navy hover:text-teal transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
                כניסה
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="sm">
                הרשמה לקורס
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden",
          mobileMenuOpen ? "fixed inset-0 z-50" : "hidden"
        )}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-navy/20 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu panel */}
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-cream px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-blush">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
              <Image
                src="/brand/logo-transparent.png"
                alt="Memorika"
                width={60}
                height={60}
                className="object-contain"
              />
              <span className="text-2xl font-bold text-navy">Memorika</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-navy"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">סגור תפריט</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-blush">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-navy hover:bg-blush/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6 space-y-3">
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    <User className="h-4 w-4" />
                    כניסה
                  </Button>
                </Link>
                <Link href="/courses" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">
                    הרשמה לקורס
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
