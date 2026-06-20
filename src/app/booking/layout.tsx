import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Ride - Taxi Saver Thailand",
  description: "Book your taxi transfer in Thailand easily without any deposit. Confirm via WhatsApp or Email.",
  alternates: {
    canonical: "/booking",
  },
  openGraph: {
    title: "Book a Ride - Taxi Saver Thailand",
    description: "Book your taxi transfer in Thailand easily without any deposit. Confirm via WhatsApp or Email.",
    url: "https://taxisaverthailand.com/booking",
    siteName: "Taxi Saver Thailand",
    images: [
      {
        url: "/images/hero/BG.webp",
        width: 1200,
        height: 630,
        alt: "Book Taxi Transfer Thailand",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Ride - Taxi Saver Thailand",
    description: "Book your taxi transfer in Thailand easily without any deposit. Confirm via WhatsApp or Email.",
    images: ["/images/hero/BG.webp"],
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
