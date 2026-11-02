import type { Metadata } from "next";
import { Suspense } from "react";
import { KitLoading } from "@/components/admin/kits/shared";
import EmailKit from "@/components/admin/kits/email";

export const metadata: Metadata = { title: "Email Campaign Builder", robots: { index: false, follow: false } };
export default function Page() { return <Suspense fallback={<KitLoading />}><EmailKit /></Suspense>; }
