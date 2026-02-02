import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-teal to-navy relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-light/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-white mb-6">
            מוכנים להתחיל את המסע?
          </h2>

          <p className="text-xl text-white/80 mb-8">
            הצטרפו למאות המטפלים שכבר למדו את שיטת ניקוי זכרונות מפתח
            והתחילו לעזור למטופלים שלהם בצורה אפקטיבית יותר.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="w-full sm:w-auto">
                הרשמה לקורס הקרוב
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-teal"
              >
                <MessageCircle className="h-5 w-5" />
                יש לי שאלות
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gold">✓</span>
              תעודת הסמכה
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold">✓</span>
              קבוצות קטנות
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold">✓</span>
              ליווי אחרי הקורס
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold">✓</span>
              אחריות 100%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
