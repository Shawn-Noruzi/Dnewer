// app/(marketing)/terms/page.tsx
import type { Metadata } from "next";
import Spacer from "@/components/Spacer";
import ContactCtaServer from "@/components/contact/ContactCtaBannerServer";
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms and conditions that govern use of Factory Optical (1980) Ltd. websites and services.",
};

export default function TermsPage() {
  return (
    <section className="section pt-[100px]">
      {/* Hero */}
      <section className="section p-0">
        <div className="relative overflow-hidden bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-200 ring-1 ring-black/5">
          <div className="container max-w-6xl py-8">
            <h1 className="font-display text-3xl md:text-4xl leading-tight text-black">
              Terms &amp; Conditions
            </h1>
          </div>
        </div>
      </section>

      <div className="container max-w-6xl">
        <div className="prose prose-zinc max-w-none">
          <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using our website and services, you agree to be
            bound by these Terms &amp; Conditions (“Terms”). If you do not agree,
            please do not use our services.
          </p>

          <h2>2. Services</h2>
          <p>
            We provide eyewear products, optometry appointments, related
            services, and informational content. We may modify, suspend, or
            discontinue any service at any time.
          </p>

          <h2>3. User Responsibilities</h2>
          <ul>
            <li>Provide accurate information when booking or purchasing.</li>
            <li>Do not misuse or disrupt the website or services.</li>
            <li>Respect applicable laws and regulations.</li>
          </ul>

          <h2>4. Pricing &amp; Availability</h2>
          <p>
            Prices, promotions, and availability may change without notice. We
            reserve the right to correct errors and cancel orders when necessary
            (including suspected fraud or mispricing).
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            Content on our site (text, images, logos, graphics) is owned by
            Factory Optical (1980) Ltd. or licensed to us. You may not reuse,
            reproduce, or distribute without permission.
          </p>

          <h2>6. Third-Party Links</h2>
          <p>
            Links to third-party websites are provided for convenience only; we
            are not responsible for their content, policies, or practices.
          </p>

          <h2>7. Disclaimers</h2>
          <p>
            Our services and information are provided “as-is” without warranties
            of any kind, to the fullest extent permitted by law.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the extent permitted by law, Factory Optical (1980) Ltd. shall
            not be liable for indirect, incidental, special, or consequential
            damages arising from your use of our services.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Province of British
            Columbia and applicable federal laws of Canada.
          </p>

          <h2>10. Changes</h2>
          <p>
            We may update these Terms from time to time. Continued use of our
            services means you accept the updated Terms.
          </p>

          <h2>11. Contact</h2>
          <p>
            Factory Optical (1980) Ltd.<br />
            Email: <a href="mailto:jeff@factoryoptical.net">jeff@factoryoptical.net</a><br />
            Phone: <a href="tel:+16048735288">+1 604 873 5288</a><br />
            Address: 2752 Rupert Street, Vancouver, BC
          </p>
        </div>
      </div>
                  <Spacer />
            <ContactCtaServer />
    </section>
  );
}
