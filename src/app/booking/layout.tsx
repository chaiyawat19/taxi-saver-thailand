import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Ride - Taxi Saver Thailand",
  description: "Book your taxi transfer in Thailand easily without any deposit. Confirm via WhatsApp or Email.",
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
