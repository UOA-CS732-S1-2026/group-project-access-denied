import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import {
  categoryWomen,
  categoryMen,
  categoryAccessories,
  brandStory,
} from '../assets/images';

const HomePage = () => {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar activePage="home" />

      <main>

        {/* Hero Section */}
        <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              alt="Hero"
              className="w-full h-full object-cover"
              src="/hero.png"
            />
            <div className="absolute inset-0 bg-on-background/5"></div>
          </div>
          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-on-surface leading-tight mb-6">
                ESTHÉTIQUE <br /> MODERNE
              </h1>
              <p className="text-xl text-on-surface-variant font-light mb-10 max-w-lg leading-relaxed">
                Curated selections from the world&apos;s most innovative designers, focused on form, function, and the beauty of simplicity.
              </p>
              <a
                className="inline-flex items-center px-10 py-5 primary-gradient text-on-primary rounded-lg font-semibold tracking-wide hover:opacity-90 transition-all scale-95 active:transition-transform"
                href="products"
              >
                Shop New Arrivals
                <span className="material-symbols-outlined ml-2">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>

        {/* Shop by Category (Asymmetric Bento Grid) */}
        <section className="py-32 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">Top This Season</span>
                <h2 className="text-4xl font-bold tracking-tight text-on-surface">Curated Picks</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Women */}
              <div className="md:col-span-7 relative group overflow-hidden rounded-xl h-[50vh]">
                <img
                  alt="Women"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={categoryWomen}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                <div className="absolute bottom-10 left-10 text-white">
                  <h3 className="text-3xl font-bold mb-2">Women</h3>
                  <p className="text-sm tracking-widest uppercase opacity-80 mb-6">The New Silhouette</p>
                  <Link
                    className="inline-flex bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-white hover:text-black transition-all"
                    to="products/69ecbcf80a8ce07d57856da7"
                  >
                    View Product
                  </Link>
                </div>
              </div>
              {/* Men & Accessories Column */}
              <div className="md:col-span-5 grid grid-rows-2 gap-8 h-[50vh]">
                <div className="relative group overflow-hidden rounded-xl h-full">
                  <img
                    alt="Men"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={categoryMen}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-2xl font-bold">Men</h3>
                    <p className="text-xs tracking-widest uppercase opacity-80">Tailored Precision</p>
                  </div>
                </div>
                <div className="relative group overflow-hidden rounded-xl h-full">
                  <img
                    alt="Accessories"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={categoryAccessories}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-2xl font-bold">Accessories</h3>
                    <p className="text-xs tracking-widest uppercase opacity-80">The Finishing Touch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Story (Asymmetric Layout) */}
        <section className="py-32 bg-surface-container-low overflow-hidden">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row items-center gap-20">
              <div className="md:w-1/2 relative">
                <div className="relative z-10 rounded-xl overflow-hidden shadow-ambient transform -rotate-2">
                  <img
                    alt="Brand Story"
                    className="w-full h-[40vh] md:h-[55vh] object-cover"
                    src={brandStory}
                  />
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl z-0"></div>
              </div>
              <div className="md:w-1/2">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-6 block">Our Ethos</span>
                <h2 className="text-5xl font-extrabold tracking-tighter text-on-surface mb-8 leading-tight">Crafting the Future of Wardrobes</h2>
                <div className="space-y-6 text-lg text-on-surface-variant font-light leading-relaxed">
                  <p>
                    APAPPAREL was founded on the belief that clothing should be a reflection of intent. We reject the cycle of disposable trends in favor of enduring quality and architectural silhouettes.
                  </p>
                  <p>
                    Every piece is sourced from ethical mills and crafted by artisans who share our obsession with detail. From the weight of a silk blouse to the tension of a seam, we believe luxury is felt, not seen.
                  </p>
                </div>
                <div className="mt-12 flex space-x-12">
                  <div>
                    <p className="text-3xl font-bold text-on-surface">100%</p>
                    <p className="text-xs uppercase tracking-widest text-outline mt-1">Ethical Sourcing</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-on-surface">15+</p>
                    <p className="text-xs uppercase tracking-widest text-outline mt-1">Design Partners</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-on-surface">Zero</p>
                    <p className="text-xs uppercase tracking-widest text-outline mt-1">Waste Goal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />

    </div>
  );
};

export default HomePage;