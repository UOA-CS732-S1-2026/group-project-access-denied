import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const ReturnsPage = () => {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />

      <main className="max-w-4xl mx-auto px-8 py-24">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">
          Support
        </span>
        <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface mb-4 leading-tight">
          Returns &amp; Exchanges
        </h1>
        <p className="text-on-surface-variant text-sm mb-16">
          Last updated: March 12, 2026
        </p>

        <div className="space-y-12 text-on-surface-variant leading-relaxed font-light">

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Our Policy</h2>
            <p>
              We want you to love every piece you receive from APapparel. If for any reason you are
              not completely satisfied, we accept returns within{' '}
              <span className="font-semibold text-on-surface">30 days</span> of the delivery date
              for a full refund to your original payment method. Items must be returned in their
              original condition — unworn, unwashed, with all tags attached and original packaging
              intact.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Eligible Items</h2>
            <p className="mb-4">The following conditions must be met for a return to be accepted:</p>
            <ul className="space-y-2 list-none mt-4">
              {[
                'Item is unworn and unwashed',
                'All original tags are attached',
                'Item is in its original packaging',
                'Return is initiated within 30 days of delivery',
                'Item was purchased directly through apapparel.com',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Non-Returnable Items</h2>
            <p className="mb-4">The following items are final sale and cannot be returned or exchanged:</p>
            <ul className="space-y-2 list-none mt-4">
              {[
                'Items marked as "Final Sale" at time of purchase',
                'Intimates and swimwear (for hygiene reasons)',
                'Items that have been worn, washed, or altered',
                'Items returned without original tags or packaging',
                'Gift cards',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">cancel</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">How to Initiate a Return</h2>
            <div className="space-y-6 mt-4">
              {[
                { step: '01', title: 'Log in to your account', body: 'Navigate to your Order History and locate the order containing the item you wish to return.' },
                { step: '02', title: 'Request a return', body: 'Select the item(s) and choose "Initiate Return". Select your reason from the dropdown and submit. You will receive a return authorisation email within 1 business day.' },
                { step: '03', title: 'Pack your item', body: 'Carefully repack the item in its original packaging. Include the packing slip inside the box. Ensure all tags are still attached.' },
                { step: '04', title: 'Ship it back', body: 'Affix the prepaid return label included in your return authorisation email to the outside of the package and drop it at any UPS or USPS location.' },
                { step: '05', title: 'Receive your refund', body: 'Once we receive and inspect your return (typically 3–5 business days), your refund will be issued to the original payment method within 5–10 business days.' },
              ].map(({ step, title, body }) => (
                <div key={step} className="flex gap-6">
                  <span className="text-3xl font-extrabold text-primary/20 leading-none flex-shrink-0">{step}</span>
                  <div>
                    <h3 className="font-semibold text-on-surface mb-1">{title}</h3>
                    <p className="text-sm">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Exchanges</h2>
            <p>
              We do not process direct exchanges. If you would like a different size or colour, please
              return your original item for a refund and place a new order. This ensures the fastest
              turnaround — waiting for a round-trip exchange can take 2–3 weeks, whereas a return and
              new order typically resolves within a few days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Return Shipping Costs</h2>
            <p>
              APapparel provides a <span className="font-semibold text-on-surface">prepaid return label</span> for
              all domestic returns. The cost of return shipping ($12.00) will be deducted from your
              refund. If you choose to use your own carrier, we recommend insured tracked shipping —
              we cannot be responsible for items lost or damaged in transit on the way back to us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-on-surface mb-4">Damaged or Incorrect Items</h2>
            <p>
              If you receive a damaged, defective, or incorrect item, please contact us within{' '}
              <span className="font-semibold text-on-surface">48 hours</span> of delivery with your
              order number and photos of the issue. We will arrange a free return and send a
              replacement or issue a full refund at no cost to you.
            </p>
          </section>

          <section className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/15">
            <h2 className="text-xl font-bold text-on-surface mb-4">Need Help?</h2>
            <p className="mb-2">Our support team is happy to assist with any return questions:</p>
            <ul className="space-y-1 text-sm mt-4">
              <li><span className="font-semibold text-on-surface">Email:</span> returns@apapparel.com</li>
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

export default ReturnsPage;
