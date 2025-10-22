// app/(site)/layout.tsx
import SiteHeader from "@/components/SiteHeaderSettings";
import SiteFooter from "../../components/SiteFooter";
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
