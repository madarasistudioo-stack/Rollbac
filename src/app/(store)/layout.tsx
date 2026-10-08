import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIAssistantWidget } from "@/components/AIAssistantWidget";
import { CulturalAccents } from "@/components/CulturalAccents";
import { Tracker } from "@/components/Tracker";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CulturalAccents />
      <Navbar />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <AIAssistantWidget />
      <Suspense fallback={null}>
        <Tracker />
      </Suspense>
    </>
  );
}
