import type { Metadata } from "next";
import DiagramsKit from "@/components/admin/kits/diagrams";

export const metadata: Metadata = { title: "AI Diagram Designer", robots: { index: false, follow: false } };
export default function Page() { return <DiagramsKit />; }
