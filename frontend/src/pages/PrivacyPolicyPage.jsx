import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />

      <main className="max-w-4xl mx-auto px-8 py-24">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">
          Legal
        </span>
        <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface mb-4 leading-tight">
          Privacy Policy
        </h1>
        <p className="text-on-surface-variant text-sm mb-16">
          Last updated: March 12, 2026
        </p>

        <div className="space-y-12 text-on-surface-variant leading-relaxed font-light">

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">1. Introduction</h2>
            <p>
              APapparel Limited (&quot;APapparel&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting
              your personal information. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you visit our website or make a purchase. Please
              read this policy carefully. If you disagree with its terms, please discontinue use of
              our site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">2. Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide directly to us when you create an account, place an
              order, or contact us for support. This includes:
            </p>
            <ul className="space-y-2 list-disc list-inside mt-4 marker:text-primary">
              <li>Name and email address</li>
              <li>Shipping and billing address</li>
              <li>Phone number (optional)</li>
              <li>Username and encrypted password</li>
              <li>Security question and answer (used for account recovery)</li>
              <li>Order history and purchase details</li>
              <li>Communications you send to our support team</li>
            </ul>
            <p className="mt-4">
              We also automatically collect certain information when you visit our site, including
              your IP address, browser type, operating system, referring URLs, and pages viewed.
              This is standard practice and helps us diagnose issues and improve the experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="space-y-2 list-disc list-inside mt-4 marker:text-primary">
              <li>Process and fulfil your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to your enquiries and provide customer support</li>
              <li>Maintain and improve our website and services</li>
              <li>Detect and prevent fraudulent transactions</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">4. Payment Information</h2>
            <p>
              APapparel does not store your full payment card details on our servers. Payment
              information entered at checkout is processed directly by our payment provider and is
              subject to their privacy policy. We receive only a tokenised reference and the last four
              digits of your card for display purposes. We are PCI-DSS compliant and take payment
              security seriously.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">5. Sharing Your Information</h2>
            <p className="mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share
              your information with trusted service providers who assist us in operating our website
              and conducting our business, provided they agree to keep your information confidential.
              These include:
            </p>
            <ul className="space-y-2 list-disc list-inside mt-4 marker:text-primary">
              <li>Shipping carriers (UPS, FedEx, USPS) — to deliver your orders</li>
              <li>Payment processors — to handle transactions securely</li>
              <li>Email service providers — to send transactional and marketing emails</li>
              <li>Analytics providers — to understand how our site is used</li>
            </ul>
            <p className="mt-4">
              We may also disclose your information where required by law, court order, or
              government authority.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">6. Cookies</h2>
            <p>
              Our website uses cookies and similar tracking technologies to enhance your browsing
              experience, remember your preferences, and analyse site traffic. Essential cookies are
              necessary for the site to function and cannot be disabled. Analytics and marketing
              cookies are optional and can be managed through your browser settings. By continuing
              to use our site, you consent to our use of cookies as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">7. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed
              to provide services. Order records are retained for a minimum of 7 years to comply
              with accounting and tax obligations. You may request deletion of your account and
              associated personal data at any time, subject to our legal retention requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">8. Your Rights</h2>
            <p className="mb-4">Depending on your location, you may have the right to:</p>
            <ul className="space-y-2 list-disc list-inside mt-4 marker:text-primary">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data (right to be forgotten)</li>
              <li>Object to or restrict certain types of processing</li>
              <li>Receive a copy of your data in a portable format</li>
              <li>Withdraw consent for marketing communications at any time</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us using the details below. We will
              respond to all requests within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">9. Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal
              information against unauthorised access, alteration, disclosure, or destruction. These
              include encrypted data transmission (HTTPS), hashed password storage, and access
              controls limiting who within our organisation can view your data. However, no method
              of transmission over the internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">10. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 16. We do not knowingly
              collect personal information from children. If you believe we have inadvertently
              collected information from a child, please contact us immediately and we will take
              steps to delete it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will revise the
              &quot;Last updated&quot; date at the top of this page and, where the changes are material, notify
              you by email or by a prominent notice on our website. Your continued use of our
              services after any changes constitutes your acceptance of the revised policy.
            </p>
          </section>

          <section className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/15">
            <h2 className="text-xl font-bold text-on-surface mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or how we handle your data,
              please contact our Privacy Team:
            </p>
            <ul className="space-y-1 text-sm">
              <li><span className="font-semibold text-on-surface">Email:</span> privacy@apapparel.com</li>
              <li><span className="font-semibold text-on-surface">Address:</span> APapparel Limited, 12 Commerce Lane, Auckland 1010, New Zealand</li>
              <li><span className="font-semibold text-on-surface">Response time:</span> Within 30 days</li>
            </ul>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
