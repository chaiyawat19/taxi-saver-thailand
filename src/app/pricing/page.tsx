import type { Metadata } from "next";
import PricingPageClient from "./PricingPageClient";

export const metadata: Metadata = {
  title: "Taxi Fares & Fixed Rates | Bangkok, Pattaya, Hua Hin",
  description:
    "View our cheap, fixed taxi prices from Bangkok (BKK/DMK) airports to top destinations. No hidden fees, toll taxes included in the fare.",
  keywords: [
    "taxi fares thailand",
    "airport taxi prices bangkok",
    "bangkok to pattaya taxi rate",
    "taxi fare suvarnabhumi to pattaya",
    "taxi pricing hua hin",
    "taxi saver pricing",
    "bangkok to hua hin private taxi cost",
    "airport transfer prices thailand",
    "camry taxi rates bangkok",
    "toyota alphard taxi price bangkok",
    "vip van rate bangkok to pattaya",
    "how much is taxi from suvarnabhumi to pattaya",
    "pattaya to bangkok taxi cost",
    "อัตราค่าบริการแท็กซี่",
    "ราคาแท็กซี่กรุงเทพไปพัทยา",
    "ราคาเหมารถไปต่างจังหวัด",
    "ราคาแท็กซี่สุวรรณภูมิไปพัทยา",
    "เหมารถตู้อัลพาร์ด ราคา",
    "ค่ารถตู้วีไอพีไปพัทยา",
    "ราคาแท็กซี่กรุงเทพไปหัวหิน",
    "เหมารถตู้คอมมิวเตอร์ ราคา",
    "ราคารถตู้นำเที่ยว พัทยา"
  ],
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingPage() {
  return <PricingPageClient />;
}
