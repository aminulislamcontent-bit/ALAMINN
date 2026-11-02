import type { Metadata } from "next";
import AnalyticsKit from "@/components/admin/kits/analytics";

export const metadata: Metadata = { title: "System Analytics", robots: { index: false, follow: false } };
export default function Page() { return <AnalyticsKit />; }
