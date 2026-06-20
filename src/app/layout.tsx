import type { Metadata } from "next";
import localFont from "next/font/local";
import "./style.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const generalSans = localFont({
  src: [
    {
      path: "../../public/fonts/GeneralSans_Complete_Font/GeneralSans-Extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/GeneralSans_Complete_Font/GeneralSans-ExtralightItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../public/fonts/GeneralSans_Complete_Font/GeneralSans-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GeneralSans_Complete_Font/GeneralSans-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/GeneralSans_Complete_Font/GeneralSans-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GeneralSans_Complete_Font/GeneralSans-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/GeneralSans_Complete_Font/GeneralSans-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GeneralSans_Complete_Font/GeneralSans-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/GeneralSans_Complete_Font/GeneralSans-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/GeneralSans_Complete_Font/GeneralSans-SemiboldItalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/GeneralSans_Complete_Font/GeneralSans-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GeneralSans_Complete_Font/GeneralSans-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://taxisaverthailand.com"),
  title: "Taxi Saver Thailand",
  description:
    "Taxi Saver Thailand — affordable ride-hailing services across Thailand with no deposit required.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
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
    "taxi bangkok to rayong",
    "taxi pattaya to bangkok",
    "suvarnabhumi to pattaya taxi",
    "don mueang to pattaya taxi",
    "taxi bkk to hua hin",
    "taxi bkk to rayong",
    "bangkok airport taxi transfer",
    "private transfer bangkok to pattaya",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Taxi Saver Thailand",
    description: "Affordable ride-hailing and transfer services across Thailand with no deposit required.",
    url: "https://taxisaverthailand.com",
    siteName: "Taxi Saver Thailand",
    images: [
      {
        url: "/images/hero/BG.webp",
        width: 1200,
        height: 630,
        alt: "Taxi Saver Thailand - Affordable Taxi Transfers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxi Saver Thailand",
    description: "Affordable ride-hailing and transfer services across Thailand with no deposit required.",
    images: ["/images/hero/BG.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={generalSans.className}>{children}</body>
    </html>
  );
}

