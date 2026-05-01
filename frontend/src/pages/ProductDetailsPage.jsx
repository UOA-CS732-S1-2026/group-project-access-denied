import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProduct } from '../api/product.api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    getProduct(id)
      .then((res) => {
        setProduct(res.data);
        setSelectedSize(res.data.sizes?.[0] || '');
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, { size: selectedSize });
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-on-surface-variant">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-on-surface-variant mb-4">Product not found.</p>
          <button onClick={() => navigate('/products')} className="text-primary underline text-sm">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar activePage="products" />

      <main className="pt-24 pb-20 max-w-7xl mx-auto px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-12 flex items-center text-xs tracking-widest uppercase text-outline">
          <Link className="hover:text-primary" to="/">Home</Link>
          <span className="mx-3">/</span>
          <Link className="hover:text-primary" to="/products">{product.category}</Link>
          <span className="mx-3">/</span>
          <span className="text-on-surface">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Product Gallery */}
          <div className="lg:col-span-7">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-4 overflow-x-auto no-scrollbar md:w-24 shrink-0">
                {product.images.map((src, i) => (
                  <div key={i} className={`aspect-[3/4] w-20 md:w-full bg-surface-container-highest cursor-pointer hover:opacity-80 transition-opacity ${i === 0 ? 'ring-1 ring-primary/30' : ''}`}>
                    <img className="w-full h-full object-cover" alt={`${product.name} view ${i + 1}`} src={src} />
                  </div>
                ))}
              </div>
              {/* Main Image */}
              <div className="flex-1 aspect-[3/4] bg-surface-container-highest relative overflow-hidden group">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={product.name}
                  src={product.images[0]}
                />
                <div className="absolute bottom-6 right-6 flex gap-2">
                  <button className="bg-surface/80 backdrop-blur-md p-2 hover:bg-surface transition-colors">
                    <span className="material-symbols-outlined text-on-surface">zoom_in</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-2">
              <span className="text-[10px] tracking-[0.2em] font-extrabold uppercase text-primary">Limited Edition</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-primary">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
                <span className="material-symbols-outlined">star_half</span>
              </div>
              <span className="text-xs text-outline tracking-wider font-medium">128 REVIEWS</span>
            </div>
            <div className="text-3xl font-light text-on-surface mb-10">
              ${product.price}.00
            </div>


            {/* Size Selection */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <span className="text-xs font-bold tracking-widest uppercase text-on-surface">Select Size</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-sm border transition-colors ${
                      size === selectedSize
                        ? 'border-primary bg-surface-container-low font-semibold'
                        : 'border-outline-variant/30 hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleAddToCart}
                className="w-full py-5 bg-gradient-to-tr from-primary to-primary-container text-white font-bold tracking-widest uppercase text-xs transition-transform active:scale-[0.98] hover:opacity-90"
              >
                Add to Bag
              </button>
            </div>

            {/* Delivery Info */}
            <div className="mt-12 space-y-4 pt-8 border-t border-outline-variant/15">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface">Complimentary Shipping</p>
                  <p className="text-xs text-on-surface-variant mt-1">Delivery expected between Nov 24 - Nov 26</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary">verified</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface">Authenticity Guaranteed</p>
                  <p className="text-xs text-on-surface-variant mt-1">Certified apapparel-crafted leather with serial verification.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Tabs */}
        <section className="mt-32 border-t border-outline-variant/15 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-4 sticky top-24 h-fit">
              <h2 className="text-3xl font-bold tracking-tighter text-on-surface mb-8">Craftsmanship &amp; Care</h2>
              <ul className="space-y-6">
                {['Product Description'].map((tab, i) => (
                  <li key={tab}>
                    <button className={`text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-4 group ${i === 0 ? 'text-primary' : 'text-outline hover:text-primary transition-colors'}`}>
                      <span className={`w-2 h-[1px] ${i === 0 ? 'bg-primary' : 'bg-outline group-hover:bg-primary'}`}></span>
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-8">
              <div className="prose prose-sm max-w-none text-on-surface-variant leading-relaxed space-y-8">
                <p className="text-lg font-medium text-on-surface">A timeless investment piece designed for the modern individual who values artisanal quality over mass-produced trends.</p>
                <p>Our {product.name} is handcrafted in our signature Tuscany workshop using locally sourced, vegetable-tanned leather. This specific process ensures that each piece develops a unique patina over time, telling the story of your journeys.</p>
                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface mb-2">Features</h4>
                    <ul className="list-disc pl-4 space-y-2 text-xs">
                      <li>Italian-made Riri zippers</li>
                      <li>Hand-stitched reinforced seams</li>
                      <li>Hidden internal passport pocket</li>
                      <li>Signature silk-blend lining</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface mb-2">Heritage</h4>
                    <p className="text-xs">Each piece takes 34 hours of focused craftsmanship by a single artisan, ensuring perfection in every detail from the collar to the hem.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-32 pt-20 bg-surface-container-low -mx-6 lg:-mx-8 px-6 lg:px-24 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-20">
              <div className="lg:w-1/3">
                <h2 className="text-3xl font-bold tracking-tighter text-on-surface mb-4">Customer Reviews</h2>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-5xl font-light text-on-surface">4.8</span>
                  <div className="flex flex-col">
                    <div className="flex text-primary">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                    <span className="text-[10px] text-outline uppercase tracking-widest font-bold">Based on 128 reviews</span>
                  </div>
                </div>
                <div className="space-y-3 mt-10">
                  {[['5', '85%'], ['4', '10%'], ['3', '3%'], ['2', '0%'], ['1', '2%']].map(([star, pct]) => (
                    <div key={star} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-outline">
                      <span className="w-4">{star}</span>
                      <div className="flex-1 h-1 bg-outline-variant/20 relative">
                        {pct !== '0%' && <div className="absolute inset-y-0 left-0 bg-primary" style={{ width: pct }}></div>}
                      </div>
                      <span className="w-8 text-right">{pct}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-2/3 space-y-12">
                {[
                  { initials: 'JS', name: 'James S.', date: 'Oct 12, 2024', title: 'Exceptional Quality', body: "The leather is incredibly soft yet substantial. I've owned jackets from big luxury houses that don't match this level of construction. A true investment." },
                  { initials: 'MK', name: 'Marcus K.', date: 'Sep 28, 2024', title: 'The Perfect Fit', body: 'Fit true to size. The slim cut is very flattering without feeling restrictive. The smell of the leather is just incredible.' },
                ].map((review) => (
                  <div key={review.initials} className="border-b border-outline-variant/20 pb-12">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex text-primary mb-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          ))}
                        </div>
                        <h4 className="text-sm font-bold text-on-surface">{review.title}</h4>
                      </div>
                      <span className="text-[10px] text-outline font-bold uppercase tracking-widest">{review.date}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-6 italic">&ldquo;{review.body}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold">{review.initials}</div>
                      <span className="text-xs font-bold tracking-widest uppercase">{review.name} <span className="text-[10px] text-primary ml-2 italic">Verified Purchase</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

    </div>
  );
};

export default ProductDetailsPage;
