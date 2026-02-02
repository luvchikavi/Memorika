"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, ChevronRight, ChevronLeft, Star } from "lucide-react";

// Placeholder testimonials - will be replaced with real ones
const testimonials = [
  {
    id: 1,
    name: "ד״ר מיכל כהן",
    role: "פסיכולוגית קלינית",
    content: "הקורס שינה לחלוטין את הדרך שבה אני עובדת עם מטופלי טראומה. הכלים שקיבלתי מקרן הם פרקטיים ויעילים. רואה תוצאות מהיום הראשון.",
    rating: 5,
  },
  {
    id: 2,
    name: "יוסי לוי",
    role: "מטפל NLP",
    content: "אחרי 10 שנים בתחום, חשבתי שאני מכיר הכל. השיטה של קרן פתחה לי צוהר לעולם חדש לגמרי. ממליץ בחום לכל מטפל.",
    rating: 5,
  },
  {
    id: 3,
    name: "רונית אברהם",
    role: "קואצ׳רית",
    content: "הגעתי בלי רקע בטיפול בטראומה ויצאתי עם ארגז כלים מלא. קרן מלמדת בצורה ברורה ומעשית. הקורס הכי משתלם שעשיתי.",
    rating: 5,
  },
  {
    id: 4,
    name: "אורית דוד",
    role: "עובדת סוציאלית",
    content: "שנים חיפשתי כלים אפקטיביים לעבודה עם טראומה. בשלושה ימים קיבלתי מה שלא קיבלתי בשנים של השתלמויות אחרות.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-navy mb-6">
            מה אומרים{" "}
            <span className="text-teal">בוגרי הקורס</span>
          </h2>
          <p className="text-lg text-navy/70">
            מאות מטפלים כבר למדו את השיטה והשתמשו בה בהצלחה עם המטופלים שלהם
          </p>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white">
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-gold/50 mb-4" />
                <p className="text-navy/70 text-sm mb-4 leading-relaxed">
                  {testimonial.content}
                </p>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-navy">{testimonial.name}</p>
                  <p className="text-sm text-navy/60">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <Card className="bg-white">
            <CardContent className="p-6">
              <Quote className="w-8 h-8 text-gold/50 mb-4" />
              <p className="text-navy/70 mb-4 leading-relaxed">
                {testimonials[currentIndex].content}
              </p>
              <div className="flex gap-1 mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <div>
                <p className="font-bold text-navy">{testimonials[currentIndex].name}</p>
                <p className="text-sm text-navy/60">{testimonials[currentIndex].role}</p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white border border-blush flex items-center justify-center text-navy hover:bg-teal hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-teal" : "bg-blush"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white border border-blush flex items-center justify-center text-navy hover:bg-teal hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
