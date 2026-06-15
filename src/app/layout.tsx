import type { Metadata } from "next";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
