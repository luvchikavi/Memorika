import { CheckCircle, Sparkles, Target, Zap } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "מאתרים את זכרונות המפתח",
    description: "השיטה מזהה במדויק את הזכרונות הקריטיים שמהם נובעת הטראומה",
  },
  {
    icon: Sparkles,
    title: "מנקים את הזכרון",
    description: "תהליך ייחודי שמאפשר להשתחרר מהמטען הרגשי ללא צורך לחוות מחדש את הכאב",
  },
  {
    icon: Zap,
    title: "תוצאות מהירות",
    description: "שינוי משמעותי מורגש לרוב כבר בטיפול הראשון",
  },
  {
    icon: CheckCircle,
    title: "שינוי קבוע",
    description: "לא טיפול סימפטומטי אלא עבודה עם השורש - התוצאות נשארות",
  },
];

export function SolutionSection() {
  return (
    <section id="method" className="py-20 lg:py-28 bg-gradient-to-b from-teal to-teal-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              השיטה שעובדת
            </div>

            <h2 className="text-white mb-6">
              שיטת{" "}
              <span className="text-gold">ניקוי זכרונות מפתח</span>
            </h2>

            <p className="text-lg text-white/80 mb-8">
              לאורך 14 שנות עבודה קלינית עם אלפי מטופלים, פיתחתי שיטה ייחודית שמשלבת
              את עקרונות ה-NLP עם טכניקות מקוריות לאיתור וניקוי של זכרונות מפתח.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-white/70">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12">
              <div className="text-center">
                <div className="text-6xl mb-6">🧠</div>
                <h3 className="text-2xl font-bold text-gold mb-4">
                  איך זה עובד?
                </h3>
                <div className="space-y-6 text-right">
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-gold text-navy font-bold flex items-center justify-center shrink-0">1</span>
                    <div>
                      <h4 className="font-bold mb-1">מיפוי</h4>
                      <p className="text-sm text-white/70">מזהים את זכרונות המפתח הרלוונטיים</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-gold text-navy font-bold flex items-center justify-center shrink-0">2</span>
                    <div>
                      <h4 className="font-bold mb-1">ניקוי</h4>
                      <p className="text-sm text-white/70">מפרקים את המטען הרגשי בצורה עדינה</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-gold text-navy font-bold flex items-center justify-center shrink-0">3</span>
                    <div>
                      <h4 className="font-bold mb-1">שחרור</h4>
                      <p className="text-sm text-white/70">הזיכרון נשאר, הכאב משתחרר</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gold/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
