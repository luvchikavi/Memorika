import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  size?: "small" | "medium" | "large" | "hero";
  variant?: "full" | "icon" | "text";
  className?: string;
}

// Main Logo - The actual Memorika brand logo image (transparent)
export function LogoMain({ className, size = 200 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/brand/logo-transparent.png"
      alt="Memorika Logo"
      width={size}
      height={size}
      className={cn("object-contain", className)}
    />
  );
}

// Logo with text - for headers and hero sections
export function LogoWithText({
  size = "medium",
  className
}: {
  size?: "small" | "medium" | "large" | "hero";
  className?: string
}) {
  const sizes = {
    small: { logo: 32, text: "text-lg" },
    medium: { logo: 48, text: "text-2xl" },
    large: { logo: 64, text: "text-3xl" },
    hero: { logo: 80, text: "text-4xl" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/brand/logo-transparent.png"
        alt="Memorika"
        width={s.logo}
        height={s.logo}
        className="object-contain"
      />
      <span className={cn("font-bold text-navy", s.text)}>Memorika</span>
    </div>
  );
}

// Logo with tagline - for hero sections
export function LogoWithTagline({
  size = "medium",
  className
}: {
  size?: "small" | "medium" | "large" | "hero";
  className?: string
}) {
  const sizes = {
    small: { logo: 40, text: "text-xl", tagline: "text-sm" },
    medium: { logo: 56, text: "text-2xl", tagline: "text-base" },
    large: { logo: 72, text: "text-3xl", tagline: "text-lg" },
    hero: { logo: 96, text: "text-4xl", tagline: "text-xl" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex flex-col items-center lg:items-start", className)}>
      <div className="flex items-center gap-3">
        <Image
          src="/brand/logo-transparent.png"
          alt="Memorika"
          width={s.logo}
          height={s.logo}
          className="object-contain"
        />
        <span className={cn("font-bold text-navy", s.text)}>Memorika</span>
      </div>
      <p className={cn("text-navy/60 mt-1", s.tagline)}>ניקוי זכרונות מפתח</p>
    </div>
  );
}

const sizeClasses = {
  small: {
    text: "text-xl",
    icon: "w-8 h-8",
    tagline: "text-xs",
  },
  medium: {
    text: "text-2xl",
    icon: "w-10 h-10",
    tagline: "text-sm",
  },
  large: {
    text: "text-4xl",
    icon: "w-14 h-14",
    tagline: "text-base",
  },
  hero: {
    text: "text-5xl md:text-6xl",
    icon: "w-16 h-16",
    tagline: "text-lg",
  },
};

// ==========================================
// NEW LOGO CONCEPTS - Brain + Key + Release
// ==========================================

// Concept A: Brain with Key - memories releasing as particles
export function LogoKeyA({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 70 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Brain left hemisphere */}
      <path
        d="M18 20C14 20 10 24 10 30C10 34 12 37 12 37C10 38 8 42 10 46C12 50 16 50 18 50C18 52 20 55 25 55C30 55 32 52 32 50"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-teal"
        fill="none"
      />
      <path
        d="M18 20C18 16 22 12 28 12C32 12 35 14 35 14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-teal"
        fill="none"
      />
      {/* Brain folds left */}
      <path d="M16 28C18 28 20 30 20 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-teal" opacity="0.6" />
      <path d="M14 38C17 38 19 40 19 42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-teal" opacity="0.6" />

      {/* Brain right hemisphere */}
      <path
        d="M52 20C56 20 60 24 60 30C60 34 58 37 58 37C60 38 62 42 60 46C58 50 54 50 52 50C52 52 50 55 45 55C40 55 38 52 38 50"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-teal-light"
        fill="none"
      />
      <path
        d="M52 20C52 16 48 12 42 12C38 12 35 14 35 14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-teal-light"
        fill="none"
      />

      {/* Key in center */}
      <circle cx="35" cy="28" r="8" stroke="currentColor" strokeWidth="2.5" className="text-teal" fill="none" />
      <circle cx="35" cy="28" r="3" fill="currentColor" className="text-teal" />
      <rect x="33" y="35" width="4" height="12" rx="1" fill="currentColor" className="text-teal" />
      <rect x="37" y="42" width="5" height="2.5" rx="1" fill="currentColor" className="text-teal" />
      <rect x="37" y="46" width="3" height="2" rx="0.5" fill="currentColor" className="text-teal" />

      {/* Releasing particles */}
      <rect x="50" y="14" width="4" height="4" rx="1" fill="currentColor" className="text-gold" opacity="0.9" />
      <rect x="56" y="10" width="3" height="3" rx="0.5" fill="currentColor" className="text-gold" opacity="0.7" />
      <rect x="54" y="18" width="3" height="3" rx="0.5" fill="currentColor" className="text-gold" opacity="0.8" />
      <rect x="60" y="14" width="2.5" height="2.5" rx="0.5" fill="currentColor" className="text-gold" opacity="0.6" />
      <rect x="58" y="6" width="2" height="2" rx="0.5" fill="currentColor" className="text-gold" opacity="0.5" />
      <rect x="64" y="10" width="2" height="2" rx="0.5" fill="currentColor" className="text-gold" opacity="0.4" />
    </svg>
  );
}

// Concept B: Simplified Brain-Key with gradient effect
export function LogoButterflyB({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Brain outline - stylized */}
      <path
        d="M12 22C8 24 6 30 8 36C10 42 14 44 18 44C18 48 22 50 28 50"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-teal"
        fill="none"
      />
      <path
        d="M12 22C12 16 18 10 28 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-teal"
        fill="none"
      />
      <path
        d="M48 22C52 24 54 30 52 36C50 42 46 44 42 44C42 48 38 50 32 50"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-teal-light"
        fill="none"
      />
      <path
        d="M48 22C48 16 42 10 32 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-teal-light"
        fill="none"
      />

      {/* Key integrated in center */}
      <circle cx="30" cy="24" r="6" stroke="currentColor" strokeWidth="2" className="text-navy" fill="none" />
      <circle cx="30" cy="24" r="2.5" fill="currentColor" className="text-navy" />
      <rect x="28.5" y="29" width="3" height="10" rx="1" fill="currentColor" className="text-navy" />
      <rect x="31.5" y="34" width="4" height="2" rx="0.5" fill="currentColor" className="text-navy" />
      <rect x="31.5" y="37" width="3" height="1.5" rx="0.5" fill="currentColor" className="text-navy" />

      {/* Floating particles - releasing memories */}
      <circle cx="46" cy="12" r="2.5" fill="currentColor" className="text-gold" />
      <circle cx="52" cy="8" r="2" fill="currentColor" className="text-gold" opacity="0.8" />
      <circle cx="50" cy="16" r="1.5" fill="currentColor" className="text-gold" opacity="0.6" />
      <circle cx="56" cy="12" r="1.5" fill="currentColor" className="text-gold" opacity="0.5" />
      <circle cx="54" cy="4" r="1" fill="currentColor" className="text-gold" opacity="0.4" />
    </svg>
  );
}

// Concept C: Brain silhouette with key unlocking - minimal
export function LogoLotusC({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Brain silhouette - filled, gradient feel */}
      <path
        d="M15 25C10 25 6 30 8 38C10 44 15 46 20 46C20 50 25 52 32 52C39 52 44 50 44 46C49 46 54 44 56 38C58 30 54 25 49 25C50 20 46 14 38 12C34 11 30 12 30 12C30 12 26 11 22 12C14 14 10 20 15 25Z"
        fill="currentColor"
        className="text-teal"
        opacity="0.15"
      />
      <path
        d="M15 25C10 25 6 30 8 38C10 44 15 46 20 46C20 50 25 52 32 52C39 52 44 50 44 46C49 46 54 44 56 38C58 30 54 25 49 25C50 20 46 14 38 12C34 11 30 12 30 12C30 12 26 11 22 12C14 14 10 20 15 25Z"
        stroke="currentColor"
        strokeWidth="2"
        className="text-teal"
        fill="none"
      />

      {/* Center line */}
      <path d="M30 12V52" stroke="currentColor" strokeWidth="1" className="text-teal" opacity="0.3" />

      {/* Key hovering/unlocking */}
      <circle cx="30" cy="28" r="7" stroke="currentColor" strokeWidth="2" className="text-teal-dark" fill="none" />
      <circle cx="30" cy="28" r="3" fill="currentColor" className="text-gold" />
      <rect x="28" y="34" width="4" height="8" rx="1" fill="currentColor" className="text-teal-dark" />
      <rect x="32" y="38" width="4" height="2" rx="0.5" fill="currentColor" className="text-teal-dark" />

      {/* Particles floating up and out */}
      <rect x="44" y="10" width="3" height="3" rx="0.5" fill="currentColor" className="text-gold" transform="rotate(15 44 10)" />
      <rect x="50" y="6" width="2.5" height="2.5" rx="0.5" fill="currentColor" className="text-gold" opacity="0.8" transform="rotate(30 50 6)" />
      <rect x="48" y="14" width="2" height="2" rx="0.5" fill="currentColor" className="text-gold" opacity="0.6" transform="rotate(-10 48 14)" />
      <rect x="54" y="10" width="1.5" height="1.5" rx="0.3" fill="currentColor" className="text-gold" opacity="0.5" />
    </svg>
  );
}

// Concept D: Abstract brain waves with key - modern/tech feel
export function LogoBirdD({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 65 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Brain represented as flowing waves */}
      <path
        d="M8 28C8 28 15 20 25 22C35 24 30 32 20 34C10 36 8 28 8 28Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-teal"
        fill="none"
      />
      <path
        d="M10 36C10 36 18 30 28 32C38 34 34 44 22 44C12 44 10 36 10 36Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-teal"
        opacity="0.7"
        fill="none"
      />
      <path
        d="M52 28C52 28 45 20 35 22C25 24 30 32 40 34C50 36 52 28 52 28Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-teal-light"
        fill="none"
      />
      <path
        d="M50 36C50 36 42 30 32 32C22 34 26 44 38 44C48 44 50 36 50 36Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-teal-light"
        opacity="0.7"
        fill="none"
      />

      {/* Central key */}
      <circle cx="30" cy="26" r="5" fill="currentColor" className="text-teal" />
      <circle cx="30" cy="26" r="2" fill="currentColor" className="text-gold" />
      <rect x="28.5" y="30" width="3" height="10" rx="0.5" fill="currentColor" className="text-teal" />
      <rect x="31.5" y="36" width="3" height="1.5" rx="0.3" fill="currentColor" className="text-teal" />

      {/* Particles dispersing */}
      <circle cx="50" y="12" r="2" fill="currentColor" className="text-gold" />
      <circle cx="56" y="8" r="1.5" fill="currentColor" className="text-gold" opacity="0.7" />
      <circle cx="54" y="16" r="1.5" fill="currentColor" className="text-gold" opacity="0.6" />
      <circle cx="60" y="12" r="1" fill="currentColor" className="text-gold" opacity="0.5" />
      <circle cx="58" y="4" r="1" fill="currentColor" className="text-gold" opacity="0.4" />
    </svg>
  );
}

// Concept E: Compact brain icon with integrated key - app icon style
export function LogoME({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 55 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Compact brain shape */}
      <path
        d="M14 20C10 22 8 28 10 34C12 40 18 42 22 42C24 46 28 48 34 46"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-teal"
        fill="none"
      />
      <path
        d="M14 20C14 14 20 8 30 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-teal"
        fill="none"
      />
      <path
        d="M42 20C46 22 48 28 46 34C44 40 38 42 34 42"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-teal-light"
        fill="none"
      />
      <path
        d="M42 20C42 14 36 8 30 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-teal-light"
        fill="none"
      />

      {/* Key - prominent */}
      <circle cx="28" cy="24" r="6" stroke="currentColor" strokeWidth="2" className="text-navy" fill="none" />
      <path d="M28 24L28 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-gold" />
      <rect x="26" y="29" width="4" height="12" rx="1" fill="currentColor" className="text-navy" />
      <rect x="30" y="35" width="5" height="2" rx="0.5" fill="currentColor" className="text-navy" />
      <rect x="30" y="39" width="3.5" height="1.5" rx="0.5" fill="currentColor" className="text-navy" />

      {/* Particles */}
      <rect x="42" y="8" width="3.5" height="3.5" rx="0.8" fill="currentColor" className="text-gold" />
      <rect x="48" y="4" width="2.5" height="2.5" rx="0.5" fill="currentColor" className="text-gold" opacity="0.7" />
      <rect x="46" y="12" width="2.5" height="2.5" rx="0.5" fill="currentColor" className="text-gold" opacity="0.6" />
      <rect x="52" y="8" width="2" height="2" rx="0.4" fill="currentColor" className="text-gold" opacity="0.5" />
    </svg>
  );
}

// Concept F: Half brain with key turning - action moment
export function LogoHandsF({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Half brain - right side emphasized */}
      <path
        d="M30 8C40 8 50 14 52 24C54 34 50 42 42 46C36 49 30 48 30 48"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-teal"
        fill="none"
      />
      {/* Brain folds */}
      <path d="M36 16C40 18 44 24 44 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-teal" opacity="0.5" />
      <path d="M38 32C42 34 46 38 44 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-teal" opacity="0.4" />

      {/* Key entering from left - dynamic angle */}
      <g transform="rotate(-20 30 28)">
        <circle cx="22" cy="28" r="7" stroke="currentColor" strokeWidth="2.5" className="text-navy" fill="none" />
        <circle cx="22" cy="28" r="3" fill="currentColor" className="text-gold" />
        <rect x="28" y="26" width="14" height="4" rx="1" fill="currentColor" className="text-navy" />
        <rect x="36" y="30" width="4" height="3" rx="0.5" fill="currentColor" className="text-navy" />
        <rect x="40" y="30" width="3" height="2" rx="0.5" fill="currentColor" className="text-navy" />
      </g>

      {/* Releasing particles - more dramatic spread */}
      <rect x="48" y="6" width="4" height="4" rx="1" fill="currentColor" className="text-gold" transform="rotate(15 48 6)" />
      <rect x="56" y="10" width="3" height="3" rx="0.5" fill="currentColor" className="text-gold" opacity="0.8" />
      <rect x="52" y="2" width="2.5" height="2.5" rx="0.5" fill="currentColor" className="text-gold" opacity="0.7" />
      <rect x="54" y="16" width="2.5" height="2.5" rx="0.5" fill="currentColor" className="text-gold" opacity="0.6" />
      <rect x="60" y="6" width="2" height="2" rx="0.4" fill="currentColor" className="text-gold" opacity="0.5" />
      <rect x="58" y="14" width="1.5" height="1.5" rx="0.3" fill="currentColor" className="text-gold" opacity="0.4" />
    </svg>
  );
}

// Concept G: Detailed brain with hexagonal key/particles - tech sophisticated
export function LogoTreeG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 70 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Detailed brain - left */}
      <path
        d="M12 26C8 26 4 30 6 38C8 44 14 48 20 48C22 52 28 54 35 52"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-teal"
        fill="none"
      />
      <path d="M12 26C10 20 14 12 24 10C30 9 35 12 35 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-teal" fill="none" />
      <path d="M14 32C18 30 20 34 18 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-teal" opacity="0.5" />
      <path d="M16 42C20 40 24 44 22 48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-teal" opacity="0.4" />

      {/* Detailed brain - right */}
      <path
        d="M54 26C58 26 62 30 60 38C58 44 52 48 46 48C44 52 38 54 35 52"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-teal-light"
        fill="none"
      />
      <path d="M54 26C56 20 52 12 42 10C36 9 35 12 35 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-teal-light" fill="none" />

      {/* Central key with hexagon head */}
      <polygon points="35,20 40,24 40,32 35,36 30,32 30,24" stroke="currentColor" strokeWidth="2" className="text-navy" fill="none" />
      <circle cx="35" cy="28" r="3" fill="currentColor" className="text-gold" />
      <rect x="33" y="36" width="4" height="10" rx="1" fill="currentColor" className="text-navy" />
      <rect x="37" y="41" width="5" height="2" rx="0.5" fill="currentColor" className="text-navy" />
      <rect x="37" y="44" width="3" height="1.5" rx="0.3" fill="currentColor" className="text-navy" />

      {/* Hexagonal particles releasing */}
      <polygon points="54,10 57,12 57,16 54,18 51,16 51,12" fill="currentColor" className="text-gold" />
      <polygon points="60,6 62,7 62,9 60,10 58,9 58,7" fill="currentColor" className="text-gold" opacity="0.7" />
      <polygon points="58,14 60,15 60,17 58,18 56,17 56,15" fill="currentColor" className="text-gold" opacity="0.6" />
      <polygon points="64,10 65,11 65,12 64,13 63,12 63,11" fill="currentColor" className="text-gold" opacity="0.5" />
      <polygon points="62,2 63,3 63,4 62,5 61,4 61,3" fill="currentColor" className="text-gold" opacity="0.4" />
    </svg>
  );
}

// Concept H: Circular brain emblem with centered key - badge style
export function LogoDropH({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="30" cy="30" r="26" stroke="currentColor" strokeWidth="2" className="text-teal" opacity="0.3" fill="none" />

      {/* Brain pattern inside circle */}
      <path
        d="M14 28C10 28 10 34 14 38C18 42 22 42 26 40"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-teal"
        fill="none"
      />
      <path
        d="M14 28C14 22 20 16 30 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-teal"
        fill="none"
      />
      <path
        d="M46 28C50 28 50 34 46 38C42 42 38 42 34 40"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-teal-light"
        fill="none"
      />
      <path
        d="M46 28C46 22 40 16 30 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-teal-light"
        fill="none"
      />

      {/* Central key */}
      <circle cx="30" cy="26" r="5" fill="currentColor" className="text-navy" />
      <circle cx="30" cy="26" r="2" fill="currentColor" className="text-gold" />
      <rect x="28.5" y="30" width="3" height="10" rx="0.5" fill="currentColor" className="text-navy" />
      <rect x="31.5" y="35" width="4" height="2" rx="0.3" fill="currentColor" className="text-navy" />
      <rect x="31.5" y="38" width="3" height="1.5" rx="0.3" fill="currentColor" className="text-navy" />

      {/* Particles breaking out of circle */}
      <rect x="48" y="10" width="4" height="4" rx="1" fill="currentColor" className="text-gold" transform="rotate(20 48 10)" />
      <rect x="54" y="14" width="3" height="3" rx="0.5" fill="currentColor" className="text-gold" opacity="0.8" />
      <rect x="52" y="6" width="2.5" height="2.5" rx="0.5" fill="currentColor" className="text-gold" opacity="0.7" />
      <rect x="58" y="10" width="2" height="2" rx="0.4" fill="currentColor" className="text-gold" opacity="0.5" />
      <rect x="56" y="18" width="2" height="2" rx="0.4" fill="currentColor" className="text-gold" opacity="0.4" />
    </svg>
  );
}

// Main Logo Component - Using the actual brand logo image
export function MemorikeLogo({ size = "medium", variant = "full", className }: LogoProps) {
  const logoSizes = {
    small: 32,
    medium: 48,
    large: 64,
    hero: 80,
  };

  const textSizes = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-3xl",
    hero: "text-4xl",
  };

  if (variant === "icon") {
    return (
      <Image
        src="/brand/logo-transparent.png"
        alt="Memorika"
        width={logoSizes[size]}
        height={logoSizes[size]}
        className={cn("object-contain", className)}
      />
    );
  }

  if (variant === "text") {
    return (
      <div className={cn("flex flex-col", className)}>
        <span className={cn("font-bold text-navy tracking-tight", textSizes[size])}>
          Memorika
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/brand/logo-transparent.png"
        alt="Memorika"
        width={logoSizes[size]}
        height={logoSizes[size]}
        className="object-contain"
      />
      <span className={cn("font-bold text-navy tracking-tight leading-none", textSizes[size])}>
        Memorika
      </span>
    </div>
  );
}

// Logo with tagline
export function MemorikLogoWithTagline({ size = "medium", className }: LogoProps) {
  const logoSizes = {
    small: 40,
    medium: 56,
    large: 72,
    hero: 96,
  };

  const textSizes = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-3xl",
    hero: "text-4xl",
  };

  const taglineSizes = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
    hero: "text-lg",
  };

  return (
    <div className={cn("flex flex-col items-center lg:items-start gap-2", className)}>
      <div className="flex items-center gap-3">
        <Image
          src="/brand/logo-transparent.png"
          alt="Memorika"
          width={logoSizes[size]}
          height={logoSizes[size]}
          className="object-contain"
        />
        <span className={cn("font-bold text-navy tracking-tight", textSizes[size])}>
          Memorika
        </span>
      </div>
      <span className={cn("text-navy/60 font-medium", taglineSizes[size])}>
        ניקוי זכרונות מפתח
      </span>
    </div>
  );
}

// Export all logo variations
export const LogoVariations = {
  KeyA: LogoKeyA,
  ButterflyB: LogoButterflyB,
  LotusC: LogoLotusC,
  BirdD: LogoBirdD,
  ME: LogoME,
  HandsF: LogoHandsF,
  TreeG: LogoTreeG,
  DropH: LogoDropH,
  Full: MemorikeLogo,
  WithTagline: MemorikLogoWithTagline,
};
