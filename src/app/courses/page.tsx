import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Check,
  Star,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

const courses = [
  {
    id: "key-memories",
    title: "קורס ניקוי זכרונות מפתח",
    subtitle: "הקורס המרכזי",
    description: "קורס אינטנסיבי של 3 ימים שיעניק לך את כל הכלים להתמקצע בטיפול בטראומה באמצעות השיטה הייחודית.",
    price: 3500,
    earlyBirdPrice: 2800,
    duration: "3 ימים",
    hours: "30+ שעות",
    groupSize: "עד 20 משתתפים",
    location: "ישראל",
    includes: [
      "הבנה מעמיקה של מנגנוני טראומה",
      "טכניקות לאיתור זכרונות מפתח",
      "שיטות ניקוי וטיפול מתקדמות",
      "תרגול מעשי עם הדרכה צמודה",
      "חומרי לימוד דיגיטליים",
      "תעודת הסמכה",
      "גישה לקהילת הבוגרים",
      "אפשרות לסופרוויז׳ן המשך",
    ],
    featured: true,
    nextDate: "מרץ 2026",
  },
  {
    id: "advanced",
    title: "קורס מתקדם",
    subtitle: "לבוגרי הקורס הבסיסי",
    description: "העמקה בשיטה עם טכניקות מתקדמות, עבודה עם מקרים מורכבים, וסופרוויז׳ן קבוצתי.",
    price: 2200,
    earlyBirdPrice: 1800,
    duration: "2 ימים",
    hours: "16 שעות",
    groupSize: "עד 15 משתתפים",
    location: "ישראל",
    includes: [
      "טכניקות מתקדמות",
      "עבודה עם מקרים מורכבים",
      "סופרוויז׳ן קבוצתי",
      "תרגול מעשי",
      "חומרי לימוד נוספים",
    ],
    featured: false,
    nextDate: "בקרוב",
  },
  {
    id: "supervision",
    title: "סופרוויז׳ן אישי",
    subtitle: "ליווי מקצועי",
    description: "פגישות אישיות לליווי מקצועי, סיוע במקרים מאתגרים, והתפתחות מקצועית מתמשכת.",
    price: 450,
    earlyBirdPrice: null,
    duration: "פגישה",
    hours: "60 דקות",
    groupSize: "אישי",
    location: "זום / פרונטלי",
    includes: [
      "ליווי אישי",
      "עבודה על מקרים",
      "פידבק מקצועי",
      "התפתחות מתמשכת",
    ],
    featured: false,
    nextDate: "תיאום אישי",
  },
];

const upcomingCourses = [
  { title: "קורס ניקוי זכרונות מפתח", date: "15-17 מרץ 2026", spots: 8 },
  { title: "קורס ניקוי זכרונות מפתח", date: "26-28 אפריל 2026", spots: 15 },
  { title: "קורס מתקדם", date: "מאי 2026", spots: 12 },
];

export default function CoursesPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-cream to-blush/30 py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-teal/10 text-teal px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              הקורס הקרוב נפתח במרץ
            </div>
            <h1 className="text-navy mb-6">
              קורסים{" "}
              <span className="text-teal">והכשרות</span>
            </h1>
            <p className="text-xl text-navy/70 max-w-2xl mx-auto">
              בחרו את המסלול המתאים לכם והתחילו את המסע להפוך למטפלי טראומה מומחים
            </p>
          </div>
        </section>

        {/* Upcoming Courses Banner */}
        <section className="bg-teal text-white py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-gold" />
                <span className="font-medium">קורסים קרובים:</span>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                {upcomingCourses.map((course, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                    <span className="text-sm">{course.title}</span>
                    <span className="text-gold text-sm font-medium">{course.date}</span>
                    <span className="text-xs bg-gold text-navy px-2 py-0.5 rounded-full">
                      {course.spots} מקומות
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Courses List */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className={`relative overflow-hidden ${
                    course.featured ? "ring-2 ring-teal shadow-xl" : ""
                  }`}
                >
                  {course.featured && (
                    <div className="absolute top-4 left-4 bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full">
                      הכי פופולרי
                    </div>
                  )}

                  <CardHeader className={`${course.featured ? "bg-gradient-to-l from-teal to-teal-dark text-white" : "bg-cream"}`}>
                    <div className="text-sm opacity-80 mb-1">{course.subtitle}</div>
                    <CardTitle className={course.featured ? "text-white" : "text-navy"}>
                      {course.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6">
                    <p className="text-navy/70 text-sm mb-6">{course.description}</p>

                    {/* Price */}
                    <div className="mb-6 pb-6 border-b border-blush">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-navy">₪{course.price.toLocaleString()}</span>
                        {course.earlyBirdPrice && (
                          <span className="text-sm text-navy/50">מחיר מלא</span>
                        )}
                      </div>
                      {course.earlyBirdPrice && (
                        <p className="text-sm text-teal mt-1">
                          ✨ Early Bird: ₪{course.earlyBirdPrice.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-navy/70">
                        <Clock className="w-4 h-4 text-teal" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-navy/70">
                        <Users className="w-4 h-4 text-teal" />
                        {course.groupSize}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-navy/70">
                        <Calendar className="w-4 h-4 text-teal" />
                        {course.nextDate}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-navy/70">
                        <MapPin className="w-4 h-4 text-teal" />
                        {course.location}
                      </div>
                    </div>

                    {/* Includes */}
                    <div className="space-y-2 mb-6">
                      {course.includes.slice(0, 4).map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-sage" />
                          <span className="text-navy/70">{item}</span>
                        </div>
                      ))}
                      {course.includes.length > 4 && (
                        <p className="text-sm text-teal">+ עוד {course.includes.length - 4} יתרונות</p>
                      )}
                    </div>

                    {/* CTA */}
                    <Link href={`/courses/${course.id}`}>
                      <Button
                        className="w-full"
                        variant={course.featured ? "primary" : "outline"}
                      >
                        פרטים והרשמה
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Who is it for */}
        <section className="py-20 lg:py-28 bg-cream">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-navy mb-6">למי הקורסים מתאימים?</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { title: "מטפלי NLP", desc: "שרוצים להתמקצע בטראומה" },
                { title: "פסיכולוגים", desc: "שמחפשים כלים נוספים" },
                { title: "עובדים סוציאליים", desc: "שעובדים עם טראומה" },
                { title: "קואצ׳רים", desc: "שנתקלים בחסמים עמוקים" },
              ].map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-bold text-navy mb-2">{item.title}</h3>
                    <p className="text-sm text-navy/60">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="max-w-3xl mx-auto bg-gradient-to-br from-teal to-navy text-white">
              <CardContent className="p-8 lg:p-12 text-center">
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="text-xl lg:text-2xl mb-6 leading-relaxed">
                  &quot;הקורס שינה לחלוטין את הדרך שבה אני עובדת עם מטופלי טראומה.
                  הכלים שקיבלתי מקרן הם פרקטיים ויעילים. ממליצה בחום!&quot;
                </blockquote>
                <div>
                  <p className="font-bold">ד״ר מיכל כהן</p>
                  <p className="text-white/70 text-sm">פסיכולוגית קלינית</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 bg-gradient-to-br from-gold/20 to-cream">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-navy mb-6">יש שאלות?</h2>
            <p className="text-xl text-navy/70 mb-8 max-w-2xl mx-auto">
              נשמח לעזור לכם לבחור את הקורס המתאים ביותר
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                צרו קשר
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
