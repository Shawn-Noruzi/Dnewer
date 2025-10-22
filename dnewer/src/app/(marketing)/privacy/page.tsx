// app/(marketing)/privacy/page.tsx
import type { Metadata } from "next";
import Spacer from "@/components/Spacer";
import ContactCtaServer from "@/components/contact/ContactCtaBannerServer";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "How Factory Optical (1980) Ltd. collects, uses, discloses, and protects your information.",
};

export default function PrivacyPage() {
    return (
        <section className="section pt-[100px]">
            {/* Hero */}
            <section className="section p-0">
                <div className="relative overflow-hidden bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-200 ring-1 ring-black/5">
                    <div className="container max-w-6xl py-8">
                        <h1 className="font-display text-3xl md:text-4xl leading-tight text-black">
                            Privacy Policy
                        </h1>
                    </div>
                </div>
            </section>

            <div className="container max-w-6xl">
                <div className="prose prose-zinc max-w-none">
                    <p><strong>Effective Date:</strong> 11/06/2024</p>
                    <p>
                        Factory Optical (1980) Ltd. (“we,” “us,” or “our”) values the privacy
                        of our customers and is committed to protecting the personal
                        information you share with us. This Privacy Policy outlines how we
                        collect, use, disclose, and protect your information when you
                        interact with our services, including our website, SMS notifications
                        for product pickup, and appointment reminders. By using our
                        services, you consent to the practices described in this Privacy
                        Policy.
                    </p>

                    <h2>1. Information We Collect</h2>
                    <h3>Personal Information</h3>
                    <p>
                        We collect personal information that you provide to us directly,
                        such as your name, phone number, email address, and other details
                        necessary for appointment bookings, managing orders, and
                        communicating with you about our products and services.
                    </p>
                    <h3>Automatically Collected Information</h3>
                    <p>
                        When you visit our website or interact with our online services, we
                        may automatically collect information about your device and usage.
                        This includes your IP address, browser type, operating system,
                        referring URLs, and pages viewed on our website.
                    </p>
                    <h3>Cookies and Tracking Technologies</h3>
                    <p>
                        We use cookies and similar tracking technologies to enhance your
                        experience on our website, track visitor usage, and gather
                        statistical information. Cookies are small text files placed on your
                        device by your browser. You may choose to disable cookies through
                        your browser settings, but doing so may limit your access to certain
                        features of our site.
                    </p>

                    <h2>2. How We Use Your Information</h2>
                    <ul>
                        <li>
                            <strong>To Provide and Improve Our Services:</strong> Manage
                            appointment bookings, product pickups, and related customer
                            communications.
                        </li>
                        <li>
                            <strong>To Customize Your Experience:</strong> Personalize your
                            experience on our website and tailor communications.
                        </li>
                        <li>
                            <strong>To Analyze and Optimize Performance:</strong> Improve our
                            website, products, and services using aggregated usage data.
                        </li>
                        <li>
                            <strong>To Ensure Compliance and Safety:</strong> We may monitor
                            messages to ensure compliance with A2P 10DLC regulations and other
                            legal standards.
                        </li>
                    </ul>

                    <h2>3. Cookies and Tracking Technologies</h2>
                    <p>Our website uses the following types of cookies:</p>
                    <ul>
                        <li><strong>Essential Cookies</strong></li>
                        <li><strong>Performance and Analytics Cookies</strong></li>
                        <li><strong>Functional Cookies</strong></li>
                        <li><strong>Advertising and Targeting Cookies</strong></li>
                    </ul>
                    <p>
                        You can control cookies via your browser settings. Disabling some
                        cookies may affect site functionality.
                    </p>

                    <h2>4. How We Share Your Information</h2>
                    <p>
                        We do not sell or rent your personal data. We may share your
                        information:
                    </p>
                    <ul>
                        <li>
                            <strong>With Service Providers:</strong> e.g., SMS providers like
                            Twilio, to deliver services you request.
                        </li>
                        <li>
                            <strong>For Legal Compliance:</strong> If required by law or to
                            protect our rights and interests.
                        </li>
                    </ul>

                    <h2>5. Data Security</h2>
                    <p>
                        We implement security measures such as encryption, secure servers,
                        and regular reviews. No system is 100% secure—please use caution
                        when sharing sensitive information.
                    </p>

                    <h2>6. Retention of Data</h2>
                    <p>
                        We retain personal information only as long as necessary for the
                        purposes described or as required by law, then securely delete or
                        anonymize it.
                    </p>

                    <h2>7. Your Privacy Rights</h2>
                    <p>
                        Depending on your jurisdiction, you may request access, correction,
                        deletion, restriction, objection, or portability. Contact us using
                        the details below.
                    </p>

                    <h2>8. Children’s Privacy</h2>
                    <p>
                        Our services are not intended for individuals under 13. If you
                        believe a child has provided personal information, please contact
                        us.
                    </p>

                    <h2>9. Third-Party Links</h2>
                    <p>
                        Our website may link to third-party sites. We are not responsible
                        for their practices; review their policies before providing data.
                    </p>

                    <h2>10. Changes to This Privacy Policy</h2>
                    <p>
                        We may update this Policy periodically. Significant changes will be
                        posted with an updated effective date.
                    </p>

                    <h2>11. Contact Us</h2>
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
