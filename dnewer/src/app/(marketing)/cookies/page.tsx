// app/(marketing)/cookies/page.tsx
import type { Metadata } from "next";
import Spacer from "@/components/Spacer";
import ContactCtaServer from "@/components/contact/ContactCtaBannerServer";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Cookie Policy",
    description:
        "Learn how Factory Optical (1980) Ltd. uses cookies and similar technologies on our website.",
};

export default function CookiesPage() {
    return (
        <section className="section pt-[100px]">
            {/* Hero */}
            <section className="section p-0">
                <div className="relative overflow-hidden bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-200 ring-1 ring-black/5">
                    <div className="container max-w-6xl py-8">
                        <h1 className="font-display text-3xl md:text-4xl leading-tight text-black">
                            Cookie Policy
                        </h1>
                    </div>
                </div>
            </section>

            <div className="container max-w-6xl">
                <div className="prose prose-zinc max-w-none">
                    <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

                    <h2>1. What Are Cookies?</h2>
                    <p>
                        Cookies are small text files placed on your device by your browser.
                        They help websites function, remember preferences, and analyze usage.
                    </p>

                    <h2>2. How We Use Cookies</h2>
                    <ul>
                        <li><strong>Essential:</strong> Enable core site functionality and security.</li>
                        <li>
                            <strong>Analytics/Performance:</strong> Understand how visitors
                            use our site to improve it.
                        </li>
                        <li>
                            <strong>Functional:</strong> Remember preferences for a customized
                            experience.
                        </li>
                        <li>
                            <strong>Advertising/Targeting:</strong> Show relevant promotions
                            (where applicable).
                        </li>
                    </ul>

                    <h2>3. Managing Cookies</h2>
                    <p>
                        Most browsers let you control cookies via settings. Blocking some
                        cookies may impact functionality. Refer to your browser’s help
                        docs for instructions.
                    </p>

                    <h2>4. Third-Party Cookies</h2>
                    <p>
                        We may allow trusted third parties (e.g., analytics or advertising
                        partners) to set cookies subject to their own policies.
                    </p>

                    <h2>5. Updates</h2>
                    <p>
                        We may update this Cookie Policy from time to time. Changes will be
                        posted on this page.
                    </p>

                    <h2>6. Contact</h2>
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
