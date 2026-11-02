import type { Metadata } from "next";
import HumanizerKit from "@/components/admin/kits/humanizer";

export const metadata: Metadata = { title: "Content Humanizer", robots: { index: false, follow: false } };
export default function Page() { return <HumanizerKit />; }
