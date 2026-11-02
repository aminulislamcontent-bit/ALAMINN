import type { Metadata } from "next";
import SeoKit from "@/components/admin/kits/seo";

export const metadata: Metadata = { title: "SEO Engine Audit", robots: { index: false, follow: false } };
export default function Page() { return <SeoKit />; }
