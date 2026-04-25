import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { getProducts } from '../api/product.api';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar activePage="products" />

      <main className="pt-24 min-h-screen">

        {/* Editorial Header */}
        <header className="px-8 mb-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold tracking-[0.1em] text-primary uppercase mb-2 block">Curated Selection</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface">Ready-to-Wear</h1>
            </div>
            <div className="flex items-center gap-4 border-b border-outline-variant/30 pb-2 min-w-[200px]">
              <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Sort By</span>
              <select className="bg-transparent border-none focus:ring-0 text-sm font-semibold text-on-surface cursor-pointer w-full text-right p-0">
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Curated Trend</option>
              </select>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row gap-12 mb-24">

          {/* Product Grid */}
          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
              {loading ? (
                <p className="text-on-surface-variant col-span-3 text-center py-24">Loading products...</p>
              ) : products.map((product) => (
                <Link key={product._id} to={`/products/${product._id}`} className="group relative block">
                  <div className="aspect-[3/4] bg-surface-container-highest overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={product.name}
                      src={product.images[0]}
                    />
                    {product.isNew && (
                      <div className="absolute top-4 left-4 bg-primary px-3 py-1">
                        <span className="text-[9px] font-bold text-white uppercase tracking-widest">New</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-4 left-4 right-4 bg-surface/80 backdrop-blur-md p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span className="block w-full text-center text-[10px] font-bold uppercase tracking-[0.2em] py-2 bg-on-surface text-surface">View Product</span>
                    </div>
                  </div>
                  <div className="mt-6 space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/60">{product.brand}</p>
                        <h4 className="text-sm font-bold text-on-surface">{product.name}</h4>
                      </div>
                      <p className="text-sm font-bold text-primary">${product.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More */}
            {!loading && (
            <div className="mt-24 text-center">
              <button className="px-12 py-4 bg-surface border border-outline-variant hover:border-primary text-xs font-bold uppercase tracking-[0.3em] transition-all duration-300 text-on-surface">
                View More Arrivals
              </button>
              <p className="mt-4 text-xs text-on-surface-variant/40 tracking-wider">Showing {products.length} items</p>
            </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f6f3f2] dark:bg-[#1c1b1b] w-full mt-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-12 py-16 border-t border-[#dcc1ba]/15">
        <div className="space-y-4">
          <div className="text-lg font-bold text-[#1c1b1b] dark:text-[#fcf9f8]">ATELIER</div>
          <p className="text-sm text-[#56423d] dark:text-[#dcc1ba] max-w-xs leading-relaxed font-['Manrope']">A modern digital atelier dedicated to the craft of exceptional design and timeless aesthetics.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <a className="block text-sm text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors font-['Manrope'] tracking-wide" href="#">Shipping</a>
            <a className="block text-sm text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors font-['Manrope'] tracking-wide" href="#">Returns</a>
          </div>
          <div className="space-y-2">
            <a className="block text-sm text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors font-['Manrope'] tracking-wide" href="#">Privacy Policy</a>
            <a className="block text-sm text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors font-['Manrope'] tracking-wide" href="#">Terms of Service</a>
          </div>
        </div>
        <div className="md:text-right">
          <div className="text-sm text-[#56423d] dark:text-[#dcc1ba] font-['Manrope'] tracking-wide mb-4">Subscribe to the Atelier Journal</div>
          <div className="flex md:justify-end">
            <input className="bg-transparent border-b border-[#dcc1ba] focus:border-[#994127] focus:ring-0 text-sm py-2 px-0 w-full max-w-[200px]" placeholder="Your email" type="email" />
            <button className="ml-4 material-symbols-outlined text-[#994127]">arrow_forward</button>
          </div>
          <div className="mt-8 text-xs text-[#56423d]/60 dark:text-[#dcc1ba]/60">© 2024 Atelier Editorial. All rights reserved.</div>
        </div>
      </footer>

    </div>
  );
};

export default ProductListing;
