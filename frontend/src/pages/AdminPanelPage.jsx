import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { importProductImage, getAllProducts } from '../api/admin.api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const STATS = [
  { icon: 'payments',     label: 'Total Revenue',    value: '$124,592.00', badge: '+12.5%', badgeColor: 'text-tertiary bg-tertiary/10' },
  { icon: 'shopping_bag', label: 'Active Orders',     value: '1,284',       badge: '+8.2%',  badgeColor: 'text-tertiary bg-tertiary/10' },
  { icon: 'person_add',   label: 'New Customers',     value: '312',         badge: '-2.4%',  badgeColor: 'text-primary bg-primary/10'  },
  { icon: 'trending_up',  label: 'Conversion Rate',   value: '4.82%',       badge: '+18.9%', badgeColor: 'text-tertiary bg-tertiary/10' },
];

const NAV_SECTIONS = [
  { label: 'Store Management', items: [
    { id: 'products',    icon: 'inventory_2',    label: 'Products',    fill: true },
    { id: 'promotions',  icon: 'local_offer',    label: 'Promotions',  fill: true },
  ]},
];

// Static promo codes shown in the admin panel.
// CTF: WINTERSALE25 is the only "Active" code — players discover it here
// after logging in with default credentials, then abuse it at checkout.
const PROMO_CODES = [
  { code: 'WINTERSALE25',   discount: '25%', status: 'Active',  validUntil: '2026-08-31', uses: 47,  note: 'Winter campaign — 25% off all orders' },
  { code: 'FREESHIP',       discount: 'Shipping', status: 'Active', validUntil: '2026-12-31', uses: 12, note: 'Free shipping on any order' },
  { code: 'LAUNCH25',       discount: '25%', status: 'Draft',   validUntil: '—',          uses: 0,   note: 'Q3 launch event (not yet approved)' },
  { code: 'VIP50',          discount: '50%', status: 'Draft',   validUntil: '—',          uses: 0,   note: 'VIP influencer programme — pending legal' },
  { code: 'BFRIDAY30',      discount: '30%', status: 'Expired', validUntil: '2025-11-30',  uses: 812, note: 'Black Friday 2025' },
  { code: 'WELCOME15',      discount: '15%', status: 'Expired', validUntil: '2025-06-01',  uses: 1_304, note: 'New-customer welcome offer' },
  { code: 'STAFF20',        discount: '20%', status: 'Draft',   validUntil: '—',          uses: 0,   note: 'Internal staff discount (HR approval pending)' },
];

const stockLevel = (price) => {
  if (price > 600) return { pct: '100%', color: 'bg-tertiary', qty: 124, textColor: 'text-on-surface-variant' };
  if (price > 300) return { pct: '85%',  color: 'bg-tertiary', qty: 42,  textColor: 'text-on-surface-variant' };
  return                  { pct: '15%',  color: 'bg-primary',  qty: 8,   textColor: 'text-primary' };
};

const PAGE_SIZE = 5;

const AdminPanelPage = () => {
  const { user } = useAuth();
  const [activeNav, setActiveNav]   = useState('products');
  const [products, setProducts]     = useState([]);

  useEffect(() => {
    getAllProducts().then((res) => setProducts(res.data)).catch(() => {});
  }, []);
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', brand: '', category: 'Clothes', price: '', image: '', isNew: false, featured: false });
  const [showImportModal, setShowImportModal] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState(null);

  // Redirect non-admins
  if (user && user.role !== 'admin') return <Navigate to="/" replace />;
  if (!user) return <Navigate to="/login" replace />;

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
    setPage(1);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    setProducts((prev) => [...prev, { ...newProduct, _id: Date.now().toString(), price: Number(newProduct.price) }]);
    setNewProduct({ name: '', category: 'clothing', price: '', image: '', isNew: false, featured: false });
    setShowAddModal(false);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    setImportLoading(true);
    setImportError(null);
    setImportResult(null);
    try {
      const productId = products[0]?._id || 'preview';
      const { data } = await importProductImage(productId, importUrl);
      setImportResult(data);
    } catch (err) {
      setImportError(err.response?.data || { message: err.message });
    } finally {
      setImportLoading(false);
    }
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setImportUrl('');
    setImportResult(null);
    setImportError(null);
  };

  const inputClass = 'w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all';

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body">
      <Navbar activePage="admin" />

      <div className="flex pt-20 min-h-screen">

        {/* Sidebar */}
        <aside className="w-64 bg-surface-container-low hidden md:flex flex-col py-8 px-6 fixed h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="space-y-1">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label}>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline mb-3 mt-6 px-2 first:mt-0">{section.label}</div>
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all group ${
                      activeNav === item.id
                        ? 'bg-surface-container-lowest text-primary shadow-sm ring-1 ring-outline-variant/10'
                        : 'text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-lg ${activeNav === item.id ? 'text-primary' : 'group-hover:text-primary transition-colors'}`}
                      style={item.fill && activeNav === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {item.icon}
                    </span>
                    <span className={`text-sm ${activeNav === item.id ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="mt-auto pt-8">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-xs font-semibold text-primary mb-1">Premium Plan</p>
              <p className="text-[10px] text-on-surface-variant mb-3">You have 12 days left in your current cycle.</p>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[70%]"></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-8 bg-surface">

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-[0_4px_20px_rgba(86,66,61,0.04)]">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.badgeColor}`}>{stat.badge}</span>
                </div>
                <div className="text-on-surface-variant text-xs font-medium mb-1">{stat.label}</div>
                <div className="text-2xl font-extrabold tracking-tight text-on-surface">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Products Section — visible when sidebar nav is on 'products' */}
          {activeNav === 'products' && (<>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-on-surface mb-1">Manage Products</h1>
              <p className="text-sm text-on-surface-variant">
                {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
                {search && ` for "${search}"`}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden md:block relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                <input
                  className="bg-surface-container-low border border-outline-variant/20 text-sm py-2 pl-10 pr-4 w-64 focus:ring-1 focus:ring-primary rounded-lg transition-all"
                  placeholder="Search inventory..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <button
                onClick={() => setShowImportModal(true)}
                className="border-2 border-primary text-primary px-5 py-2.5 text-sm font-bold rounded-lg hover:bg-primary/5 transition-colors flex items-center"
              >
                <span className="material-symbols-outlined text-sm mr-2">cloud_download</span>
                Import from URL
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-primary text-white px-5 py-2.5 text-sm font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-sm mr-2">add</span>
                Add New Product
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden shadow-[0_4px_30px_rgba(86,66,61,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    {['Product Image', 'Product Name', 'Category', 'Stock Level', 'Price', 'Actions'].map((h, i) => (
                      <th key={h} className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center text-on-surface-variant text-sm font-light">No products match your search.</td>
                    </tr>
                  ) : (
                    paginated.map((product) => {
                      const stock = stockLevel(product.price);
                      return (
                        <tr key={product._id} className="hover:bg-surface-container-low/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="w-16 h-20 bg-surface-container rounded overflow-hidden">
                              <img className="w-full h-full object-cover" alt={product.name} src={product.images[0]} />
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-md">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-bold text-on-surface">{product.name}</div>
                              {product.isActive === false && (
                                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">Draft</span>
                              )}
                            </div>
                            <div className="text-[10px] text-outline font-medium tracking-wide">{product.brand}</div>
                            {product.description && (
                              <div className="text-xs text-on-surface-variant mt-1 line-clamp-2" title={product.description}>
                                {product.description}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded">{product.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                                <div className={`${stock.color} h-full`} style={{ width: stock.pct }}></div>
                              </div>
                              <span className={`text-xs font-bold ${stock.textColor}`}>{stock.qty}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-on-surface">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-outline hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="p-2 text-outline hover:text-error hover:bg-error/5 rounded-lg transition-all"
                              >
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-surface-container-low/50 flex items-center justify-between border-t border-outline-variant/10">
              <div className="text-xs text-on-surface-variant font-medium">
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} products
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-colors disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                      n === page ? 'bg-primary text-white' : 'hover:bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-colors disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
          </>)}

          {/* Promotions Table — visible when sidebar nav is on 'promotions' */}
          {activeNav === 'promotions' && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-on-surface mb-1">Promo Codes</h1>
                  <p className="text-sm text-on-surface-variant">{PROMO_CODES.length} codes configured</p>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden shadow-[0_4px_30px_rgba(86,66,61,0.03)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low/50">
                        {['Code', 'Discount', 'Status', 'Valid Until', 'Uses', 'Note'].map((h) => (
                          <th key={h} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {PROMO_CODES.map((promo) => {
                        const statusColor =
                          promo.status === 'Active'  ? 'text-tertiary bg-tertiary/10' :
                          promo.status === 'Expired' ? 'text-on-surface-variant bg-surface-container' :
                                                       'text-primary bg-primary/10';
                        return (
                          <tr key={promo.code} className="hover:bg-surface-container-low/30 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-mono text-sm font-bold text-on-surface">{promo.code}</span>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-on-surface">{promo.discount}</td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${statusColor}`}>
                                {promo.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-on-surface-variant">{promo.validUntil}</td>
                            <td className="px-6 py-4 text-sm text-on-surface-variant">{promo.uses.toLocaleString()}</td>
                            <td className="px-6 py-4 text-xs text-on-surface-variant max-w-xs truncate" title={promo.note}>{promo.note}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </main>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/40 backdrop-blur-sm px-4">
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold tracking-tight text-on-surface">Add New Product</h2>
              <button onClick={() => setShowAddModal(false)} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1 block">Product Name</label>
                  <input required value={newProduct.name} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="e.g. Silk Blouse" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1 block">Brand</label>
                  <input required value={newProduct.brand} onChange={(e) => setNewProduct((p) => ({ ...p, brand: e.target.value }))} className={inputClass} placeholder="e.g. Parchment" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1 block">Category</label>
                  <select value={newProduct.category} onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))} className={inputClass}>
                    <option>Clothes</option>
                    <option>Shoes</option>
                    <option>Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1 block">Price ($)</label>
                  <input required type="number" min="1" value={newProduct.price} onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))} className={inputClass} placeholder="e.g. 250" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1 block">Image URL</label>
                <input value={newProduct.image} onChange={(e) => setNewProduct((p) => ({ ...p, image: e.target.value }))} className={inputClass} placeholder="https://..." />
              </div>
              <div className="flex gap-6 pt-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={newProduct.isNew} onChange={(e) => setNewProduct((p) => ({ ...p, isNew: e.target.checked }))} className="accent-primary" />
                  New Arrival
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={newProduct.featured} onChange={(e) => setNewProduct((p) => ({ ...p, featured: e.target.checked }))} className="accent-primary" />
                  Featured on Home
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-outline/20 hover:border-primary/40 text-sm font-semibold rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-br from-primary to-primary-container text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/40 backdrop-blur-sm px-4">
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-2xl p-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold tracking-tight text-on-surface">Import Image from Supplier URL</h2>
              <button onClick={closeImportModal} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant mb-6">
              Paste a URL from a supplier portal — APapparel will fetch and preview the image before adding it to a product.
            </p>
            <form onSubmit={handleImport} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1 block">Supplier Image URL</label>
                <input
                  required
                  type="url"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  className={inputClass}
                  placeholder="https://cdn.supplier.com/products/jacket.jpg"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={closeImportModal} className="flex-1 py-3 border border-outline/20 hover:border-primary/40 text-sm font-semibold rounded-lg transition-colors">Cancel</button>
                <button
                  type="submit"
                  disabled={importLoading}
                  className="flex-1 py-3 bg-gradient-to-br from-primary to-primary-container text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {importLoading ? 'Fetching…' : 'Fetch & Preview'}
                </button>
              </div>
            </form>

            {importError && (
              <div className="mt-6 p-4 bg-error/5 border border-error/20 rounded-lg">
                <div className="text-[10px] font-bold uppercase tracking-widest text-error mb-2">Fetch failed</div>
                <pre className="text-xs text-on-surface whitespace-pre-wrap break-all font-mono">
                  {JSON.stringify(importError, null, 2)}
                </pre>
              </div>
            )}

            {importResult && (
              <div className="mt-6 p-4 bg-surface-container-low border border-outline-variant/20 rounded-lg">
                <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-2">Server response</div>
                <pre className="text-xs text-on-surface whitespace-pre-wrap break-all font-mono max-h-80 overflow-auto">
                  {JSON.stringify(importResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="md:ml-64">
        <Footer />
      </div>

    </div>
  );
};

export default AdminPanelPage;
