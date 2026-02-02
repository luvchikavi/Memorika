"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Instagram,
} from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    title: "טלפון",
    value: "050-000-0000",
    href: "tel:+972500000000",
  },
  {
    icon: Mail,
    title: "אימייל",
    value: "info@memorika.co.il",
    href: "mailto:info@memorika.co.il",
  },
  {
    icon: MapPin,
    title: "מיקום",
    value: "ישראל",
    href: null,
  },
  {
    icon: Clock,
    title: "שעות פעילות",
    value: "א׳-ה׳ 9:00-18:00",
    href: null,
  },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: MessageCircle, href: "https://wa.me/972500000000", label: "WhatsApp" },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-cream to-blush/30 py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-navy mb-6">
              צרו{" "}
              <span className="text-teal">קשר</span>
            </h1>
            <p className="text-xl text-navy/70 max-w-2xl mx-auto">
              יש לכם שאלות? רוצים לשמוע עוד על הקורסים? נשמח לעזור!
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-navy mb-6">שלחו הודעה</h2>

                {isSubmitted ? (
                  <Card className="bg-sage/10 border-sage/30">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto bg-sage/20 rounded-full flex items-center justify-center mb-4">
                        <Send className="w-8 h-8 text-sage" />
                      </div>
                      <h3 className="text-xl font-bold text-navy mb-2">ההודעה נשלחה!</h3>
                      <p className="text-navy/70">
                        תודה שפנית אלינו. נחזור אליך בהקדם האפשרי.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="שם מלא"
                        placeholder="השם שלך"
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        required
                      />
                      <Input
                        label="טלפון"
                        type="tel"
                        placeholder="050-000-0000"
                        value={formState.phone}
                        onChange={(e) =>
                          setFormState({ ...formState, phone: e.target.value })
                        }
                      />
                    </div>
                    <Input
                      label="אימייל"
                      type="email"
                      placeholder="your@email.com"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      required
                    />
                    <div className="w-full">
                      <label className="block text-sm font-medium text-navy mb-1.5">
                        נושא
                      </label>
                      <select
                        className="flex h-11 w-full rounded-lg border border-blush bg-white px-4 py-2 text-base text-navy transition-colors focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                        value={formState.subject}
                        onChange={(e) =>
                          setFormState({ ...formState, subject: e.target.value })
                        }
                        required
                      >
                        <option value="">בחרו נושא</option>
                        <option value="course-info">מידע על קורסים</option>
                        <option value="registration">הרשמה לקורס</option>
                        <option value="supervision">סופרוויז׳ן</option>
                        <option value="collaboration">שיתוף פעולה</option>
                        <option value="other">אחר</option>
                      </select>
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-navy mb-1.5">
                        הודעה
                      </label>
                      <textarea
                        className="flex min-h-32 w-full rounded-lg border border-blush bg-white px-4 py-3 text-base text-navy transition-colors placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent resize-none"
                        placeholder="כתבו את ההודעה שלכם..."
                        value={formState.message}
                        onChange={(e) =>
                          setFormState({ ...formState, message: e.target.value })
                        }
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "שולח..." : "שליחה"}
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                )}
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-navy mb-6">פרטי התקשרות</h2>

                <div className="space-y-4 mb-8">
                  {contactInfo.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        {item.href ? (
                          <a
                            href={item.href}
                            className="flex items-center gap-4 hover:text-teal transition-colors"
                          >
                            <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-teal" />
                            </div>
                            <div>
                              <p className="text-sm text-navy/60">{item.title}</p>
                              <p className="font-medium text-navy">{item.value}</p>
                            </div>
                          </a>
                        ) : (
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-teal" />
                            </div>
                            <div>
                              <p className="text-sm text-navy/60">{item.title}</p>
                              <p className="font-medium text-navy">{item.value}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-lg font-bold text-navy mb-4">עקבו אחרינו</h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center text-navy hover:bg-teal hover:text-white transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <social.icon className="w-5 h-5" />
                        <span className="sr-only">{social.label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick Contact */}
                <Card className="mt-8 bg-gradient-to-br from-teal to-navy text-white">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-2">רוצים תשובה מהירה?</h3>
                    <p className="text-white/80 text-sm mb-4">
                      שלחו הודעת WhatsApp ונחזור אליכם תוך שעות
                    </p>
                    <a
                      href="https://wa.me/972500000000"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="primary" size="sm">
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Teaser */}
        <section className="py-20 lg:py-28 bg-cream">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-navy mb-6">יש לכם שאלות נוספות?</h2>
            <p className="text-xl text-navy/70 mb-8 max-w-2xl mx-auto">
              בדקו את דף השאלות הנפוצות שלנו - אולי התשובה כבר שם
            </p>
            <a href="/#faq">
              <Button variant="outline" size="lg">
                לשאלות נפוצות
              </Button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
