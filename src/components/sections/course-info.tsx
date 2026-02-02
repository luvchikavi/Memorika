import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Calendar, Clock, Users, ArrowLeft } from "lucide-react";

const courseIncludes = [
  "הבנה מעמיקה של מנגנוני טראומה",
  "טכניקות לאיתור זכרונות מפתח",
  "שיטות ניקוי וטיפול מתקדמות",
  "תרגול מעשי עם הדרכה צמודה",
  "חומרי לימוד דיגיטליים",
  "תעודת הסמכה",
  "גישה לקהילת הבוגרים",
  "אפשרות לסופרוויז׳ן המשך",
];

const courseDetails = [
  { icon: Calendar, label: "משך הקורס", value: "3 ימים אינטנסיביים" },
  { icon: Clock, label: "שעות למידה", value: "30+ שעות" },
  { icon: Users, label: "גודל קבוצה", value: "עד 20 משתתפים" },
];

export function CourseInfoSection() {
  return (
    <section id="course" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-navy mb-6">
            קורס{" "}
            <span className="text-teal">ניקוי זכרונות מפתח</span>
          </h2>
          <p className="text-lg text-navy/70">
            קורס אינטנסיבי של 3 ימים שיעניק לך את כל הכלים להתמקצע בטיפול בטראומה
            באמצעות השיטה הייחודית שפיתחתי.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Course Card */}
          <Card className="border-2 border-teal/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-teal to-teal-dark text-white rounded-t-2xl">
              <CardTitle className="text-2xl">קורס ניקוי זכרונות מפתח</CardTitle>
              <p className="text-white/80">הכשרה מלאה בשיטה</p>
            </CardHeader>
            <CardContent className="p-6">
              {/* Price */}
              <div className="mb-6 pb-6 border-b border-blush">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-navy">₪3,500</span>
                  <span className="text-navy/60">לקורס המלא</span>
                </div>
                <p className="text-sm text-teal mt-2">
                  ✨ מחיר Early Bird: ₪2,800 (עד שבועיים לפני)
                </p>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                {courseDetails.map((detail, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center">
                      <detail.icon className="w-4 h-4 text-teal" />
                    </div>
                    <div>
                      <span className="text-sm text-navy/60">{detail.label}: </span>
                      <span className="font-medium text-navy">{detail.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link href="/courses/key-memories">
                <Button size="lg" className="w-full">
                  לפרטים והרשמה
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* What's Included */}
          <div>
            <h3 className="text-xl font-bold text-navy mb-6">מה כולל הקורס?</h3>
            <div className="grid gap-3">
              {courseIncludes.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-cream/50 hover:bg-cream transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-teal" />
                  </div>
                  <span className="text-navy">{item}</span>
                </div>
              ))}
            </div>

            {/* Target audience */}
            <div className="mt-8 p-6 rounded-xl bg-gold/10 border border-gold/20">
              <h4 className="font-bold text-navy mb-3">למי הקורס מתאים?</h4>
              <ul className="space-y-2 text-sm text-navy/70">
                <li>• מטפלי NLP שרוצים להתמקצע בטראומה</li>
                <li>• פסיכולוגים ועובדים סוציאליים</li>
                <li>• קואצ׳רים ומטפלים רגשיים</li>
                <li>• כל מי שעוסק בעבודה טיפולית</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
