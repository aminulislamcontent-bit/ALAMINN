import type { Metadata } from "next";
import MarketingKit from "@/components/admin/kits/marketing";

export const metadata: Metadata = { title: "Marketing Campaign Kit", robots: { index: false, follow: false } };
export default function Page() { return <MarketingKit />; }
