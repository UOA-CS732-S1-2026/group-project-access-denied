import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const ShippingPage = () => {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />

      <main className="max-w-4xl mx-auto px-8 py-24">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">
          Support
        </span>
        <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface mb-4 leading-tight">
          Shipping Information
        </h1>
        <p className="text-on-surface-variant text-sm mb-16">
          Last updated: March 12, 2026
        </p>

        <div className="space-y-12 text-on-surface-variant leading-relaxed font-light">

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Complimentary Shipping</h2>
            <p>
              Orders over <span className="font-semibold text-on-surface">$500</span> qualify for complimentary standard shipping anywhere within
              the contiguous United States. This threshold is calculated on the pre-tax order subtotal
              after any applicable discounts. We believe that when you are investing in pieces built
              to last, the least we can do is get them to your door without an additional charge.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Standard Shipping</h2>
            <p className="mb-4">
              For orders below the complimentary threshold, a flat rate of{' '}
              <span className="font-semibold text-on-surface">$25.00</span> applies regardless of
              order size or weight. We keep it simple — one rate, no surprises at checkout.
            </p>
            <div className="border border-outline-variant/20 rounded-lg overflow-hidden mt-6">
              <table className="w-full text-sm">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-on-surface">Method</th>
                    <th className="text-left px-6 py-4 font-semibold text-on-surface">Estimated Delivery</th>
                    <th className="text-left px-6 py-4 font-semibold text-on-surface">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  <tr>
                    <td className="px-6 py-4">Standard</td>
                    <td className="px-6 py-4">5–8 business days</td>
                    <td className="px-6 py-4">$25.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Complimentary Standard</td>
                    <td className="px-6 py-4">5–8 business days</td>
                    <td className="px-6 py-4 text-green-700 font-semibold">Free (orders $500+)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Express</td>
                    <td className="px-6 py-4">2–3 business days</td>
                    <td className="px-6 py-4">$45.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Overnight</td>
                    <td className="px-6 py-4">Next business day</td>
                    <td className="px-6 py-4">$75.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Processing Time</h2>
            <p>
              All orders are processed within <span className="font-semibold text-on-surface">1–2 business days</span> of
              being placed. Orders placed on weekends or public holidays will be processed on the
              following business day. During peak periods — including seasonal sales and new collection
              launches — processing may extend to 3 business days. You will receive a shipping
              confirmation email with tracking information as soon as your order leaves our fulfilment
              centre.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Carriers</h2>
            <p>
              We partner with UPS, FedEx, and USPS to deliver your order. The carrier assigned to
              your shipment is determined by destination and parcel dimensions. Carrier selection is
              at our discretion and cannot be requested. All shipments include tracking and are
              covered by carrier insurance up to the declared value of the goods.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">International Shipping</h2>
            <p className="mb-4">
              We currently ship to select international destinations. International orders are subject
              to the import duties, taxes, and customs fees of the destination country. These charges
              are levied by the destination country and are the sole responsibility of the recipient.
              APapparel has no control over these charges and cannot predict their amount.
            </p>
            <p>
              International delivery typically takes <span className="font-semibold text-on-surface">10–21 business days</span> depending
              on destination and customs clearance. A flat international shipping rate of{' '}
              <span className="font-semibold text-on-surface">$60.00</span> applies to all international orders.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Tracking Your Order</h2>
            <p>
              Once your order has shipped, a confirmation email containing your tracking number will
              be sent to the email address on your account. You can also view the status of all past
              orders at any time from your{' '}
              <Link to="/orders" className="text-primary hover:underline">Order History</Link>{' '}
              page. If your tracking information has not updated within 5 business days of your
              shipping confirmation, please contact our support team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Undeliverable Packages</h2>
            <p>
              If a package is returned to us due to an incorrect address, failed delivery attempts,
              or refusal of delivery, we will contact you to arrange re-shipment at your expense.
              Packages that remain undeliverable for more than 30 days will be treated as a return
              and refunded to the original payment method, less original shipping charges.
            </p>
          </section>

          <section className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/15">
            <h2 className="text-xl font-bold text-on-surface mb-4">Need Help?</h2>
            <p className="mb-2">If you have questions about your shipment, reach out to us:</p>
            <ul className="space-y-1 text-sm mt-4">
              <li><span className="font-semibold text-on-surface">Email:</span> shipping@apapparel.com</li>
              <li><span className="font-semibold text-on-surface">Hours:</span> Monday–Friday, 9 AM–6 PM EST</li>
              <li><span className="font-semibold text-on-surface">Response time:</span> Within 1 business day</li>
            </ul>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShippingPage;
