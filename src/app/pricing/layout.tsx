import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Fare Table - Taxi Saver Thailand",
  description:
    "Compare fixed taxi transfer prices across all routes in Thailand — Pattaya, Bangkok, Hua Hin, Suvarnabhumi, and Don Mueang. No hidden fees, all tolls included.",
  alternates: {
    canonical: "/pricing",
  },
  keywords: [
    "taxi price thailand",
    "bangkok pattaya taxi price",
    "pattaya hua hin taxi fare",
    "airport transfer price bangkok",
    "fixed rate taxi thailand",
    "taxi fare comparison thailand",
  ],
  openGraph: {
    title: "Pricing & Fare Table - Taxi Saver Thailand",
    description: "Compare fixed taxi fares across all routes. No deposit, no hidden fees.",
    url: "https://taxisaverthailand.com/pricing",
    siteName: "Taxi Saver Thailand",
    images: [
      {
        url: "/images/hero/BG.webp",
        width: 1200,
        height: 630,
        alt: "Taxi Saver Thailand Pricing",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing & Fare Table - Taxi Saver Thailand",
    description: "Compare fixed taxi fares across all routes. No deposit, no hidden fees.",
    images: ["/images/hero/BG.webp"],
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
