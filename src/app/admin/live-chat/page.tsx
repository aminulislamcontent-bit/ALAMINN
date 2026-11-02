import type { Metadata } from "next";
import ChatKit from "@/components/admin/kits/chat";

export const metadata: Metadata = { title: "Live Support Desk", robots: { index: false, follow: false } };
export default function Page() { return <ChatKit />; }
