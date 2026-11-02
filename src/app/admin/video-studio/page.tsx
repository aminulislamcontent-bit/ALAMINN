import type { Metadata } from "next";
import VideoKit from "@/components/admin/kits/video";

export const metadata: Metadata = { title: "Video Storyboard Studio", robots: { index: false, follow: false } };
export default function Page() { return <VideoKit />; }
