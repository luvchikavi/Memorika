import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Users,
  Heart,
  GraduationCap,
  Target,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

const milestones = [
  { year: "2010", text: "התחלת הדרך כמטפלת NLP" },
  { year: "2014", text: "פיתוח הגישה הייחודית לטראומה" },
  { year: "2016", text: "הכשרת המטפלים הראשונים" },
  { year: "2020", text: "הקמת המכון להכשרת מטפלים" },
  { year: "2024", text: "השקת שיטת ניקוי זכרונות מפתח" },
];

const values = [
  {
    icon: Heart,
    title: "אמפתיה",
    description: "הבנה עמוקה של הכאב והמסע של כל מטופל",
  },
  {
    icon: Target,
    title: "מקצועיות",
    description: "גישה מבוססת ניסיון קליני של 14 שנים",
  },
  {
    icon: Sparkles,
    title: "חדשנות",
    description: "שיטה ייחודית שמתפתחת ומשתכללת כל הזמן",
  },
  {
    icon: Users,
    title: "קהילה",
    description: "בניית קהילת מטפלים תומכת ומעצימה",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-cream to-blush/30 py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Image */}
              <div className="relative order-2 lg:order-1">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="aspect-[4/5] bg-gradient-to-br from-teal/20 to-gold/20 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-40 h-40 mx-auto bg-teal/20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-5xl text-teal font-bold">KM</span>
                      </div>
                      <p className="text-navy font-medium text-xl">קרן מלניאק</p>
                      <p className="text-navy/60">מייסדת Memorika</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-full h-full bg-gold/20 rounded-2xl -z-10" />
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2">
                <h1 className="text-navy mb-6">
                  היי, אני{" "}
                  <span className="text-teal">קרן מלניאק</span>
                </h1>
                <p className="text-xl text-navy/70 mb-6">
                  מייסדת שיטת &quot;ניקוי זכרונות מפתח&quot; ומכון להכשרת מטפלי NLP בישראל.
                </p>
                <div className="space-y-4 text-navy/70">
                  <p>
                    לפני יותר מ-14 שנה התחלתי את דרכי כמטפלת. מהר מאוד הבנתי שיש
                    משהו שחסר - כלים אמיתיים לעבודה עם טראומה.
                  </p>
                  <p>
                    ראיתי מטופלים שסבלו שנים, עברו טיפולים רבים, ועדיין הרגישו
                    תקועים. זה לא היה מקובל עליי.
                  </p>
                  <p>
                    התחלתי לחקור, לנסות, לפתח. לאורך שנים של עבודה עם אלפי
                    מטופלים, גיבשתי שיטה ייחודית שעובדת - שיטת ניקוי זכרונות מפתח.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-navy mb-6">הערכים שמנחים אותי</h2>
              <p className="text-lg text-navy/70">
                כל מה שאני עושה מונחה על ידי ערכים ברורים שמלווים אותי מהיום הראשון
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-teal/10 flex items-center justify-center mb-4">
                      <value.icon className="w-7 h-7 text-teal" />
                    </div>
                    <h3 className="text-lg font-bold text-navy mb-2">{value.title}</h3>
                    <p className="text-sm text-navy/70">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 lg:py-28 bg-cream">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-navy mb-6">המסע שלי</h2>
              <p className="text-lg text-navy/70">
                14 שנים של למידה, פיתוח והכשרה
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                {/* Line */}
                <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-teal/20" />

                {/* Milestones */}
                <div className="space-y-8">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="relative flex gap-6">
                      <div className="w-12 h-12 rounded-full bg-teal text-white flex items-center justify-center font-bold text-sm shrink-0 z-10">
                        {milestone.year}
                      </div>
                      <div className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-navy">{milestone.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-navy mb-6">הכשרה והסמכות</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <GraduationCap className="w-10 h-10 text-teal mx-auto mb-4" />
                  <h3 className="font-bold text-navy mb-2">NLP Master Practitioner</h3>
                  <p className="text-sm text-navy/60">הסמכה בינלאומית</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="w-10 h-10 text-teal mx-auto mb-4" />
                  <h3 className="font-bold text-navy mb-2">מאמנת NLP מוסמכת</h3>
                  <p className="text-sm text-navy/60">מכשירה מטפלים</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-10 h-10 text-teal mx-auto mb-4" />
                  <h3 className="font-bold text-navy mb-2">מומחית טראומה</h3>
                  <p className="text-sm text-navy/60">14 שנות ניסיון קליני</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 bg-gradient-to-br from-teal to-navy text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-white mb-6">רוצים ללמוד את השיטה?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              הצטרפו לקורס ניקוי זכרונות מפתח וקבלו את כל הכלים להתמקצע בטיפול בטראומה
            </p>
            <Link href="/courses">
              <Button size="lg">
                לפרטים על הקורס
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
