import type { Metadata } from "next";
import localFont from "next/font/local";
import "./style.css";
import { Geist, Kanit } from "next/font/google";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "../../public/context/LanguageContext";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
  display: "swap",
});

const generalSans = localFont({
  src: [
    {
      path: "../../public/fonts/GeneralSans_Complete_Font/GeneralSans-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GeneralSans_Complete_Font/GeneralSans-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GeneralSans_Complete_Font/GeneralSans-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/GeneralSans_Complete_Font/GeneralSans-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://taxisaverthailand.com"),
  title: {
    default: "Taxi Saver Thailand | Private Taxi Service & Airport Transfer",
    template: "%s | Taxi Saver Thailand"
  },
  description:
    "Affordable private taxi service and airport transfers in Thailand. Book rides from Suvarnabhumi (BKK) and Don Mueang (DMK) to Bangkok, Pattaya, Hua Hin. No deposit required, pay the driver directly.",
  icons: {
    icon: [
      {
        url: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    shortcut: "/icon.png",
    apple: [
      {
        url: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
  keywords: [
    "taxi saver",
    "taxi saver thailand",
    "book taxi thailand",
    "airport transfer bangkok",
    "pattaya taxi transfer",
    "hua hin taxi transfer",
    "bangkok to pattaya taxi",
    "suvarnabhumi airport taxi",
    "don mueang airport taxi",
    "no deposit taxi booking",
    "taxi bkk to pattaya",
    "taxi bangkok to pattaya",
    "taxi bangkok to hua hin",
    "taxi pattaya to bangkok",
    "suvarnabhumi to pattaya taxi",
    "don mueang to pattaya taxi",
    "taxi bkk to hua hin",
    "bangkok airport taxi transfer",
    "private transfer bangkok to pattaya",
    "toyota alphard taxi bangkok",
    "toyota alphard taxi bangkok to pattaya",
    "toyota fortuner taxi thailand",
    "suv taxi bangkok to pattaya",
    "vip van transfer bangkok",
    "luxury van transfer pattaya",
    "sedan taxi bangkok airport",
    "camry taxi bangkok",
    "minivan transfer bangkok",
    "private commuter van bangkok",
    "taxi bangkok airport to pattaya hotel",
    "private transfer don mueang to pattaya",
    "suvarnabhumi to pattaya taxi price",
    "bangkok to hua hin private taxi cost",
    "taxi transfer bangkok to koh chang",
    "taxi bangkok to ban phe pier",
    "bangkok airport to hotel transfer",
    "bkk airport pick up service",
    "dmk airport pick up service",
    "เหมารถไปต่างจังหวัด",
    "เหมารถกรุงเทพไปพัทยา",
    "เหมารถกรุงเทพไปหัวหิน",
    "แท็กซี่สุวรรณภูมิ พัทยา",
    "แท็กซี่ดอนเมือง พัทยา",
    "รถรับส่งสุวรรณภูมิ กรุงเทพ",
    "รถรับส่งสนามบินดอนเมือง",
    "รถตู้นำเที่ยวพัทยา",
    "แท็กซี่กรุงเทพไปชลบุรี",
    "เหมารถไปท่าเรือบ้านเพ",
    "รถตู้อัลพาร์ด สุวรรณภูมิ",
    "เหมารถตู้อัลพาร์ด",
    "จองรถตู้ vip พัทยา",
    "รถตู้อัลพาร์ดไปพัทยา",
    "รถฟอร์จูนเนอร์เหมาไปพัทยา",
    "รถตู้นำเที่ยวหัวหิน",
    "เหมารถตู้ commuter กรุงเทพ",
    "บริการแท็กซี่ 24 ชั่วโมง",
    "จองรถออนไลน์ ไม่มีมัดจำ",
    "บริการรถรับส่งสนามบินสุวรรณภูมิไปพัทยา ราคา",
    "รถเหมาจากพัทยาไปกรุงเทพ",
    "จองรถข้ามจังหวัด พัทยา หัวหิน",
    "เหมารถตู้อัลพาร์ด กทม"
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Taxi Saver Thailand | Private Taxi Service & Airport Transfer",
    description: "Affordable private taxi service and airport transfers in Thailand. Book rides from Suvarnabhumi (BKK) and Don Mueang (DMK) to Bangkok, Pattaya, Hua Hin. No deposit required, pay the driver directly.",
    url: "https://taxisaverthailand.com",
    siteName: "Taxi Saver Thailand",
    images: [
      {
        url: "/images/og-share.jpg",
        width: 1200,
        height: 675,
        alt: "Taxi Saver Thailand - Private Taxi & Airport Transfer Service",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxi Saver Thailand | Private Taxi & Airport Transfer",
    description: "Affordable private taxi service and airport transfers in Thailand. Book rides from Suvarnabhumi (BKK) and Don Mueang (DMK) to Bangkok, Pattaya, Hua Hin. No deposit required, pay the driver directly.",
    images: ["/images/og-share.jpg"],
  },
  verification: {
    google: "ZOXt7Akm0hUNBxuu9IDKoxnc-YqjN_EpWgWNfu-K5qw",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TaxiService",
      "@id": "https://taxisaverthailand.com/#taxiservice",
      "name": "Taxi Saver Thailand",
      "description": "Affordable private taxi service and airport transfers in Thailand. Book rides from Suvarnabhumi (BKK) and Don Mueang (DMK) to Bangkok, Pattaya, Hua Hin. No deposit required, pay the driver directly.",
      "url": "https://taxisaverthailand.com",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Taxi Saver Thailand",
        "image": "https://taxisaverthailand.com/images/og-share.jpg",
        "telephone": "+66624494253",
        "email": "Taxisaverthailand@gmail.com",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Bangkok",
          "addressCountry": "TH"
        }
      },
      "areaServed": [
        { "@type": "AdministrativeArea", "name": "Bangkok" },
        { "@type": "AdministrativeArea", "name": "Pattaya" },
        { "@type": "AdministrativeArea", "name": "Hua Hin" }
      ],
      "offers": {
        "@type": "Offer",
        "priceCurrency": "THB",
        "price": "1000",
        "description": "Starting from 1,000 THB for airport transfer"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, kanit.variable, generalSans.variable)}>
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18298436537"
        />
        <script
          id="google-tag-aw-18298436537"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'AW-18298436537');
            `,
          }}
        />
      </head>
      <body className={generalSans.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

