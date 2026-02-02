"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "האם צריך רקע קודם ב-NLP כדי להשתתף בקורס?",
    answer: "לא חובה, אבל מומלץ. הקורס מתאים גם למי שאין לו רקע ב-NLP, אך ניסיון קודם בתחום הטיפולי יעזור להפיק יותר מהלמידה. אנחנו מלמדים את כל הבסיס הנדרש.",
  },
  {
    question: "כמה זמן לוקח לראות תוצאות עם השיטה?",
    answer: "אחד היתרונות הגדולים של השיטה הוא שהתוצאות לרוב מורגשות כבר בטיפול הראשון. המטופל מרגיש שינוי משמעותי בעוצמת הרגשות הקשורים לזיכרון הטראומטי.",
  },
  {
    question: "האם הקורס כולל תרגול מעשי?",
    answer: "בהחלט! הקורס הוא אינטנסיבי ומעשי. מעבר ללימוד התיאורטי, תתרגלו את הטכניקות בזוגות ובקבוצות קטנות, עם הדרכה צמודה שלי.",
  },
  {
    question: "מה קורה אחרי הקורס?",
    answer: "בוגרי הקורס מקבלים גישה לקהילת הבוגרים, אפשרות לסופרוויז׳ן המשך, וגישה לקורסים מתקדמים. אני מאמינה בליווי לאורך זמן.",
  },
  {
    question: "האם יש תעודה בסיום הקורס?",
    answer: "כן, בסיום הקורס תקבלו תעודת הסמכה בשיטת ׳ניקוי זכרונות מפתח׳ מטעם Memorika.",
  },
  {
    question: "מה אם אני צריך/ה לבטל?",
    answer: "ביטול עד שבועיים לפני הקורס - החזר מלא. ביטול עד שבוע לפני - החזר של 50%. לאחר מכן אין החזר, אבל אפשר להעביר את ההרשמה למחזור אחר.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-navy mb-6">
              שאלות{" "}
              <span className="text-teal">נפוצות</span>
            </h2>
            <p className="text-lg text-navy/70">
              יש שאלה? כנראה שהתשובה כאן. אם לא - תמיד אפשר ליצור קשר
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-blush rounded-xl overflow-hidden bg-cream/30"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between p-5 text-right hover:bg-cream/50 transition-colors"
                >
                  <span className="font-medium text-navy pr-4">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-teal shrink-0 transition-transform duration-200",
                      openIndex === index && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    openIndex === index ? "max-h-96" : "max-h-0"
                  )}
                >
                  <p className="p-5 pt-0 text-navy/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
