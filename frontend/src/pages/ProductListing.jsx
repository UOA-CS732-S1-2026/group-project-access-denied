import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/product.api';
import { useCart } from '../context/CartContext';

const ProductListing = () => {
  const { cartCount } = useCart();
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

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#fcf9f8]/80 dark:bg-[#1c1b1b]/80 backdrop-blur-md flex justify-between items-center px-8 py-4 max-w-full mx-auto">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-[#1c1b1b] dark:text-[#fcf9f8]">ATELIER</Link>
        <div className="hidden md:flex items-center space-x-12">
          <Link to="/products" className="text-[#994127] font-semibold border-b-2 border-[#994127] pb-1 font-['Manrope'] tracking-tight">Clothes</Link>
          <Link to="/products" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors font-['Manrope'] tracking-tight">Shoes</Link>
          <Link to="/#new-arrivals" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors font-['Manrope'] tracking-tight">New Arrivals</Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/account" className="hover:opacity-80 transition-opacity duration-300 text-on-surface">
            <span className="material-symbols-outlined">person</span>
          </Link>
          <Link to="/cart" className="hover:opacity-80 transition-opacity duration-300 relative text-on-surface">
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
            )}
          </Link>
        </div>
      </nav>

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

          {/* Sidebar Filter */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-10">
              <section>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-on-surface mb-4">Categories</h3>
                <ul className="space-y-3">
                  <li><a className="text-sm text-on-surface font-medium hover:text-primary transition-colors flex justify-between" href="#">Outerwear <span className="text-on-surface-variant/40">(12)</span></a></li>
                  <li><a className="text-sm text-on-surface-variant hover:text-primary transition-colors flex justify-between" href="#">Knitwear <span className="text-on-surface-variant/40">(24)</span></a></li>
                  <li><a className="text-sm text-on-surface-variant hover:text-primary transition-colors flex justify-between" href="#">Dresses <span className="text-on-surface-variant/40">(18)</span></a></li>
                  <li><a className="text-sm text-on-surface-variant hover:text-primary transition-colors flex justify-between" href="#">Trousers <span className="text-on-surface-variant/40">(31)</span></a></li>
                  <li><a className="text-sm text-on-surface-variant hover:text-primary transition-colors flex justify-between" href="#">Footwear <span className="text-on-surface-variant/40">(42)</span></a></li>
                </ul>
              </section>
              <section>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-on-surface mb-4">Size</h3>
                <div className="grid grid-cols-4 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', '38', '40', '42'].map((size) => (
                    <button
                      key={size}
                      className={`h-10 text-xs border flex items-center justify-center font-medium transition-all ${
                        size === 'S' ? 'border-primary bg-primary text-white' : 'border-outline-variant/30 hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-on-surface mb-4">Color Palette</h3>
                <div className="flex flex-wrap gap-3">
                  <button className="w-6 h-6 rounded-full bg-[#1c1b1b] border border-white/20 ring-1 ring-offset-2 ring-transparent hover:ring-primary/40 transition-all"></button>
                  <button className="w-6 h-6 rounded-full bg-[#994127] ring-1 ring-offset-2 ring-primary transition-all"></button>
                  <button className="w-6 h-6 rounded-full bg-[#fcf9f8] border border-outline-variant ring-1 ring-offset-2 ring-transparent transition-all"></button>
                  <button className="w-6 h-6 rounded-full bg-[#dcc1ba] ring-1 ring-offset-2 ring-transparent transition-all"></button>
                  <button className="w-6 h-6 rounded-full bg-[#56423d] ring-1 ring-offset-2 ring-transparent transition-all"></button>
                  <button className="w-6 h-6 rounded-full bg-[#89726c] ring-1 ring-offset-2 ring-transparent transition-all"></button>
                </div>
              </section>
              <section>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-on-surface mb-4">Price</h3>
                <div className="space-y-4">
                  <input className="w-full accent-primary bg-surface-container-high h-1 rounded-full appearance-none cursor-pointer" max="2000" min="0" step="50" type="range" />
                  <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                    <span>$0</span>
                    <span>$2,000+</span>
                  </div>
                </div>
              </section>
            </div>
          </aside>

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
