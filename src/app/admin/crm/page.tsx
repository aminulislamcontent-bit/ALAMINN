import type { Metadata } from "next";
import CrmKit from "@/components/admin/kits/crm";

export const metadata: Metadata = { title: "CRM Pipeline", robots: { index: false, follow: false } };
export default function Page() { return <CrmKit />; }
