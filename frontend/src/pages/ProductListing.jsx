import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
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
          </div>
        </div>
      </main>

      <Footer />

    </div>
  );
};

export default ProductListing;
