import { Award, BookOpen, Users, Heart } from "lucide-react";

const achievements = [
  { icon: BookOpen, label: "14+ שנות ניסיון" },
  { icon: Users, label: "אלפי מטופלים" },
  { icon: Award, label: "מאות בוגרי קורסים" },
  { icon: Heart, label: "שיטה ייחודית" },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
              {/* Placeholder for Keren's image */}
              <div className="aspect-square bg-gradient-to-br from-blush to-cream-dark flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-40 h-40 mx-auto bg-teal/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-5xl text-teal font-bold">KM</span>
                  </div>
                  <p className="text-navy font-medium">קרן מלניאק</p>
                  <p className="text-navy/60 text-sm">מייסדת שיטת Memorika</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full bg-teal/10 rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-navy mb-6">
              היי, אני{" "}
              <span className="text-teal">קרן מלניאק</span>
            </h2>

            <div className="space-y-4 text-navy/70 mb-8">
              <p>
                לפני יותר מ-14 שנה התחלתי את דרכי כמטפלת NLP. עם הזמן, גיליתי שחלק
                מהמטופלים שלי - אלה שסבלו מטראומה - לא הגיבו לטכניקות הסטנדרטיות.
              </p>
              <p>
                במקום לוותר, התחלתי לפתח גישה חדשה. זיהיתי שהמפתח נמצא ב&quot;זכרונות מפתח&quot; -
                אותם רגעים קריטיים שבהם נוצרה הטראומה. פיתחתי שיטה ייחודית לאיתור
                וניקוי של זכרונות אלה.
              </p>
              <p>
                לאורך שנים של עבודה עם אלפי מטופלים, שכללתי את השיטה. ראיתי תוצאות
                שוב ושוב - אנשים שסבלו שנים מטראומה השתחררו ממנה.
              </p>
              <p className="font-medium text-navy">
                היום אני לא רק מטפלת - אני מכשירה מטפלים. רוצה שהשיטה תגיע לכמה
                שיותר אנשים.
              </p>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-blush/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-teal" />
                  </div>
                  <span className="text-sm font-medium text-navy">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
