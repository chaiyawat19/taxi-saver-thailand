import type { Metadata } from "next";
import BookingPageClient from "./BookingPageClient";

export const metadata: Metadata = {
  title: "Book Private Transfer Online | BKK & DMK Airport Taxi",
  description:
    "Fast and secure booking form for private airport transfers and inter-city taxis in Thailand. SUV & VIP Van options, pay driver directly.",
  keywords: [
    "book taxi online thailand",
    "airport taxi transfer booking",
    "suvarnabhumi taxi booking",
    "don mueang airport taxi booking",
    "pattaya taxi booking online",
    "hua hin private transfer booking",
    "book private transfer thailand",
    "toyota alphard booking bangkok",
    "book vip van bangkok to pattaya",
    "book fortuner taxi bangkok",
    "no deposit taxi booking bangkok",
    "จองแท็กซี่ออนไลน์",
    "จองรถตู้ vip สุวรรณภูมิ",
    "จองรถตู้ไปพัทยา",
    "จองรถตู้ไปหัวหิน",
    "เหมารถตู้อัลพาร์ด จองออนไลน์",
    "จองรถฟอร์จูนเนอร์ไปต่างจังหวัด",
    "จองแท็กซี่สุวรรณภูมิ ราคาถูก",
    "จองรถรับส่งสนามบินดอนเมือง",
    "จองรถกรุงเทพไปพัทยา",
    "จองรถกรุงเทพไปหัวหิน",
    "เหมารถตู้อัลพาร์ด กทม จอง"
  ],
  alternates: {
    canonical: "/booking",
  },
};

export default function BookingPage() {
  return <BookingPageClient />;
}
