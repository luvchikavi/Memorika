import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream to-blush/30 py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-teal/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 gap-12 items-center">
          {/* Content - Centered Hero */}
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-2 rounded-full text-sm font-medium mb-10">
              <span className="w-2 h-2 bg-teal rounded-full animate-pulse" />
              הקורס הקרוב נפתח בקרוב
            </div>

            {/* Logo */}
            <div className="flex justify-center mb-2">
              <Image
                src="/brand/logo-transparent.png"
                alt="Memorika"
                width={400}
                height={400}
                className="object-contain"
              />
            </div>

            {/* Tagline */}
            <h1 className="text-3xl lg:text-4xl font-medium text-navy tracking-wide mb-6" style={{ fontFamily: 'var(--font-poppins), var(--font-heebo), sans-serif' }}>
              ניקוי זכרונות מפתח
            </h1>

            {/* Slogan */}
            <p className="text-xl lg:text-2xl text-navy/70 mb-4 max-w-2xl mx-auto">
              טראומה היא לא גזירת גורל
            </p>

            {/* Description */}
            <p className="text-lg text-navy/60 mb-10 max-w-2xl mx-auto">
              הגישה הייחודית לטיפול בטראומה שפיתחתי לאורך 14 שנות עבודה קלינית עם אלפי מטופלים.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/courses">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                  הרשמה לקורס
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                  <Play className="h-5 w-5" />
                  למידע נוסף
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-teal">14+</div>
                <div className="text-sm text-navy/60 mt-1">שנות ניסיון</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-teal">1000+</div>
                <div className="text-sm text-navy/60 mt-1">מטופלים</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-teal">500+</div>
                <div className="text-sm text-navy/60 mt-1">בוגרי קורסים</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
