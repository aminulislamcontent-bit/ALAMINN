import type { Metadata } from "next";
import IntegrationsKit from "@/components/admin/kits/integrations";

export const metadata: Metadata = { title: "Integration Hub", robots: { index: false, follow: false } };
export default function Page() { return <IntegrationsKit />; }
