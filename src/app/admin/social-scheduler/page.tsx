import type { Metadata } from "next";
import { Suspense } from "react";
import { KitLoading } from "@/components/admin/kits/shared";
import SocialKit from "@/components/admin/kits/social";

export const metadata: Metadata = { title: "Social Media Scheduler", robots: { index: false, follow: false } };
export default function Page() { return <Suspense fallback={<KitLoading />}><SocialKit /></Suspense>; }
