import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const navigation = {
  main: [
    { name: "ראשי", href: "/" },
    { name: "אודות", href: "/about" },
    { name: "קורסים", href: "/courses" },
    { name: "צור קשר", href: "/contact" },
  ],
  courses: [
    { name: "ניקוי זכרונות מפתח", href: "/courses/key-memories" },
    { name: "קורס מתקדם", href: "/courses/advanced" },
    { name: "סופרוויז׳ן", href: "/courses/supervision" },
    { name: "וובינרים", href: "/webinars" },
  ],
  social: [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "YouTube", href: "#", icon: Youtube },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-4">
              <Image
                src="/brand/logo-transparent.png"
                alt="Memorika"
                width={70}
                height={70}
                className="object-contain"
              />
              <div>
                <span className="text-2xl font-bold text-white block">Memorika</span>
                <span className="block text-sm text-white/60">
                  ניקוי זכרונות מפתח
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              טראומה היא לא גזירת גורל.
              <br />
              שיטה ייחודית לטיפול בטראומה שפותחה על ידי קרן מלניאק לאורך 14 שנות עבודה קלינית.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gold mb-4">ניווט מהיר</h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-sm font-semibold text-gold mb-4">קורסים והכשרות</h3>
            <ul className="space-y-3">
              {navigation.courses.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gold mb-4">יצירת קשר</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+972500000000"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 flip-rtl" />
                  050-000-0000
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@memorika.co.il"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  info@memorika.co.il
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-white/70">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>ישראל</span>
                </div>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white/70 hover:text-gold transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/50">
              © {new Date().getFullYear()} Memorika. כל הזכויות שמורות.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-white/50 hover:text-white/70">
                מדיניות פרטיות
              </Link>
              <Link href="/terms" className="text-sm text-white/50 hover:text-white/70">
                תנאי שימוש
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
