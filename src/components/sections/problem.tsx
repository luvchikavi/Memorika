import { AlertCircle, Clock, Heart, RefreshCw } from "lucide-react";

const problems = [
  {
    icon: AlertCircle,
    title: "טראומה לא מטופלת",
    description: "הרבה מטופלים סובלים שנים מטראומה בלי לקבל טיפול אפקטיבי שבאמת עוזר",
  },
  {
    icon: Clock,
    title: "טיפולים ארוכים מדי",
    description: "טיפולים קונבנציונליים לוקחים שנים ולא תמיד מביאים לתוצאות",
  },
  {
    icon: RefreshCw,
    title: "חזרה על הכאב",
    description: "שיטות רבות מחייבות לחזור על הזיכרונות הכואבים שוב ושוב",
  },
  {
    icon: Heart,
    title: "חוסר בכלים",
    description: "מטפלים רבים מרגישים שחסרים להם כלים אפקטיביים לעבודה עם טראומה",
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-navy mb-6">
            הבעיה שרבים מתמודדים איתה
          </h2>
          <p className="text-lg text-navy/70">
            אם את/ה מטפל/ת, בוודאי נתקלת במטופלים שסובלים מטראומה ומרגישים שהם תקועים.
            גם עבור מי שמחפש טיפול - לא תמיד קל למצוא שיטה שעובדת.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="relative p-6 rounded-2xl bg-cream/50 border border-blush/50 hover:border-teal/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4 group-hover:bg-teal/20 transition-colors">
                <problem.icon className="w-6 h-6 text-teal" />
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">
                {problem.title}
              </h3>
              <p className="text-navy/70 text-sm leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
