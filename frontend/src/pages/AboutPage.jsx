import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { founderPhoto } from '../assets/images';

const AboutPage = () => {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">

        {/* Hero banner */}
        <section className="relative py-28 bg-surface-container-low overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl"></div>
          <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">
              Who We Are
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-6">
              Meet the Founder
            </h1>
            <p className="text-lg text-on-surface-variant font-light max-w-2xl mx-auto leading-relaxed">
              APapparel was born from a passion for redefining modern luxury. Our vision combines
              decades of fashion industry experience with a relentless drive for innovation and ethical practice.
            </p>
          </div>
        </section>

        {/* Founder Profile */}
        <section className="py-24 bg-surface">
          <div className="max-w-4xl mx-auto px-8">
            <div className="flex flex-col md:flex-row gap-12 items-center bg-surface-container-low rounded-3xl p-8 md:p-12 border border-outline-variant/10 shadow-lg">

              {/* Photo */}
              <div className="w-full md:w-1/2 rounded-2xl overflow-hidden aspect-[4/5] relative group shadow-md">
                <img
                  src={founderPhoto}
                  alt="Ajith Patel"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">Ajith Patel</h2>
                <p className="text-sm font-bold tracking-[0.2em] uppercase text-primary mb-6">
                  Founder & CEO
                </p>
                <div className="space-y-4 text-base text-on-surface-variant leading-relaxed mb-8">
                  <p>
                    A visionary entrepreneur with over 15 years in luxury fashion. Ajith founded APapparel with the mission to blend timeless craftsmanship with modern sensibility.
                  </p>
                  <p>
                    His relentless pursuit of perfection and dedication to ethical sourcing have established APapparel as a leader in contemporary, sustainable luxury.
                  </p>
                </div>

                <div className="pt-6 border-t border-outline-variant/20">
                  <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant mb-2 block">
                    Get in touch
                  </span>
                  <a
                    href="mailto:AjithPatel@APapparel.com"
                    className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined">mail</span>
                    AjithPatel@APapparel.com
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Values section */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">
              Our Values
            </span>
            <h2 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-16">
              Built on Principle
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <span className="material-symbols-outlined text-4xl text-primary mb-4 block">eco</span>
                <h3 className="text-lg font-bold text-on-surface mb-2">Sustainability</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Every decision we make considers its environmental impact. We partner exclusively with ethical mills and zero-waste manufacturers.
                </p>
              </div>
              <div>
                <span className="material-symbols-outlined text-4xl text-primary mb-4 block">diamond</span>
                <h3 className="text-lg font-bold text-on-surface mb-2">Craftsmanship</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  We believe luxury is in the details. Each garment undergoes rigorous quality checks to ensure lasting beauty and comfort.
                </p>
              </div>
              <div>
                <span className="material-symbols-outlined text-4xl text-primary mb-4 block">diversity_3</span>
                <h3 className="text-lg font-bold text-on-surface mb-2">Inclusivity</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Fashion should be for everyone. Our extended size ranges and adaptive designs reflect our commitment to serving all bodies.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
