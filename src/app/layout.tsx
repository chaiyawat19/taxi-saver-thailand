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
  title: "Taxi Saver Thailand",
  description:
    "Taxi Saver Thailand — affordable ride-hailing services across Thailand with no deposit required.",
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

