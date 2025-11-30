import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductModal from './components/ProductModal';
import AdminDashboard from './components/AdminDashboard';
import AuthPage from './components/AuthPage';
import ShopProfile from './components/ShopProfile';
import { MOCK_PRODUCTS, MOCK_ANALYTICS, MOCK_SHOPS } from './constants';
import { Product, FilterState, AnalyticsMetrics, ProductType, UserProfile, Shop, UserRole } from './types';
import { ArrowRight, Zap, Monitor, Package } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'store' | 'admin' | 'auth' | 'shop_page'>('store');
  const [viewSlug, setViewSlug] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [analytics, setAnalytics] = useState<AnalyticsMetrics[]>(MOCK_ANALYTICS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Auth State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    type: 'all',
    category: 'all'
  });

  // Derived state
  const isSearching = filters.query.length > 0 || filters.type !== 'all';

  const getFilteredProducts = () => {
    let result = products;

    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (filters.type !== 'all') {
      result = result.filter(p => p.product_type === filters.type);
    }
    return result;
  };

  const filteredProducts = getFilteredProducts();

  // --- Handlers ---

  const handleTrackClick = (productId: string) => {
    setAnalytics(prev => {
      const existing = prev.find(p => p.product_id === productId);
      if (existing) {
        return prev.map(p => p.product_id === productId ? { ...p, clicks: p.clicks + 1 } : p);
      } else {
        return [...prev, { product_id: productId, clicks: 1, sales_count: 0, views: 1, revenue: 0 }];
      }
    });
  };

  const handleAddProduct = (product: Product) => {
    // If seller, attach their shop ID
    const productWithShop = currentShop ? { ...product, shop_id: currentShop.id } : product;
    setProducts([productWithShop, ...products]);
  };

  const handleLogin = (role: UserRole, shopName?: string) => {
    const newUser: UserProfile = {
      id: 'new-user-id',
      email: 'user@example.com',
      role,
      created_at: new Date().toISOString()
    };
    setUser(newUser);

    if (role === 'seller' && shopName) {
      const newShop: Shop = {
        id: `shop-${Math.random().toString(36).substr(2, 9)}`,
        profile_id: newUser.id,
        shop_name: shopName,
        slug: shopName.toLowerCase().replace(/\s+/g, '-'),
        verified: false,
        wallet_balance: 0
      };
      setCurrentShop(newShop);
      setView('admin');
    } else {
      setView('store');
    }
  };

  const handleOpenAdmin = () => {
    if (!user) {
      setView('auth');
    } else if (user.role === 'seller') {
      setView('admin');
    } else {
      // Buyer Profile
      alert("Buyer profile would be here.");
    }
  };

  const handleProductClick = (product: Product) => {
    // Increment view count mock
    setAnalytics(prev => {
        return prev.map(p => p.product_id === product.id ? { ...p, views: p.views + 1 } : p);
    });
    setSelectedProduct(product);
  };

  // --- Render Logic ---

  if (view === 'auth') {
    return <AuthPage onLogin={handleLogin} onCancel={() => setView('store')} />;
  }

  if (view === 'admin' && user?.role === 'seller') {
    return (
      <AdminDashboard 
        products={products.filter(p => currentShop ? p.shop_id === currentShop.id : true)}
        onAddProduct={handleAddProduct}
        analytics={analytics}
        onUpdateMetrics={setAnalytics}
        onExit={() => setView('store')}
      />
    );
  }

  if (view === 'shop_page' && viewSlug) {
    const shop = MOCK_SHOPS.find(s => s.slug === viewSlug);
    if (shop) {
        const shopProducts = products.filter(p => p.shop_id === shop.id);
        return (
            <ShopProfile 
                shop={shop} 
                products={shopProducts} 
                onBack={() => { setView('store'); setViewSlug(null); }}
                onProductClick={handleProductClick}
            />
        );
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar 
        onSearch={setFilters} 
        onOpenAdmin={handleOpenAdmin} 
        currentFilters={filters}
        user={user}
        onLogout={() => { setUser(null); setCurrentShop(null); setView('store'); }}
      />

      <main className="flex-1 max-w-[1600px] mx-auto w-full">
        {isSearching ? (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {filters.query ? `Results for "${filters.query}"` : 'Filtered Results'}
            </h2>
            <ProductList 
              products={filteredProducts} 
              onProductClick={handleProductClick} 
            />
          </div>
        ) : (
          <div className="flex flex-col gap-10 pb-10">
            {/* Hero */}
            <div className="bg-[#0f172a] text-white py-16 px-6 md:px-20 relative overflow-hidden">
               <div className="relative z-10 max-w-3xl">
                 <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                   One Platform.<br />
                   <span className="text-[#38bdf8]">Infinite Possibilities.</span>
                 </h1>
                 <p className="text-slate-400 text-lg mb-8 max-w-lg">
                   The hybrid marketplace where you can buy top-tier gear, download digital assets, and hire experts.
                 </p>
                 <div className="flex gap-4">
                    <button onClick={() => setFilters({...filters, type: ProductType.AFFILIATE_PHYSICAL})} className="bg-[#38bdf8] text-slate-900 font-bold px-6 py-3 rounded-full hover:bg-white transition-colors">
                        Shop Products
                    </button>
                    <button onClick={() => setView('auth')} className="bg-transparent border border-slate-600 text-white font-bold px-6 py-3 rounded-full hover:border-white transition-colors">
                        Start Selling
                    </button>
                 </div>
               </div>
               {/* Abstract BG Shape */}
               <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-bl from-blue-900/20 to-transparent"></div>
            </div>

            {/* Featured Shops (Mock) */}
            <div className="px-6 md:px-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Trending Shops</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MOCK_SHOPS.map(shop => (
                        <div 
                            key={shop.id} 
                            onClick={() => { setView('shop_page'); setViewSlug(shop.slug); }}
                            className="bg-white border border-slate-200 p-6 rounded-xl hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 group"
                        >
                            <img src={shop.logo_url} className="w-16 h-16 rounded-full bg-gray-100" />
                            <div>
                                <h3 className="font-bold text-lg group-hover:text-blue-600">{shop.shop_name}</h3>
                                <p className="text-slate-500 text-sm">@{shop.slug}</p>
                            </div>
                            <div className="ml-auto">
                                <ArrowRight className="text-slate-300 group-hover:text-blue-600" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div className="px-6 md:px-12 space-y-12">
               
               {/* Section 1 */}
               <div>
                  <div className="flex items-center gap-2 mb-4">
                     <Package className="text-blue-600 w-6 h-6" />
                     <h2 className="text-2xl font-bold text-slate-900">Physical Gear</h2>
                  </div>
                  <ProductList 
                    products={products.filter(p => p.product_type === ProductType.AFFILIATE_PHYSICAL).slice(0, 4)} 
                    onProductClick={handleProductClick} 
                  />
               </div>

               {/* Section 2 */}
               <div className="bg-slate-900 -mx-6 md:-mx-12 px-6 md:px-12 py-12 text-white">
                  <div className="flex items-center gap-2 mb-4">
                     <Monitor className="text-[#38bdf8] w-6 h-6" />
                     <h2 className="text-2xl font-bold">Digital Assets</h2>
                  </div>
                  <ProductList 
                    products={products.filter(p => p.product_type === ProductType.DIGITAL_DOWNLOAD).slice(0, 4)} 
                    onProductClick={handleProductClick} 
                  />
               </div>

               {/* Section 3 */}
               <div>
                  <div className="flex items-center gap-2 mb-4">
                     <Zap className="text-purple-600 w-6 h-6" />
                     <h2 className="text-2xl font-bold text-slate-900">Expert Services</h2>
                  </div>
                  <ProductList 
                    products={products.filter(p => p.product_type === ProductType.SERVICE).slice(0, 4)} 
                    onProductClick={handleProductClick} 
                  />
               </div>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">Oosma</span>
                <p className="text-slate-500 text-sm mt-2">The future of hybrid commerce.</p>
            </div>
            <div>
                <h4 className="font-bold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                    <li><a href="#" className="hover:text-blue-600">Marketplace</a></li>
                    <li><a href="#" className="hover:text-blue-600">Sell on Oosma</a></li>
                    <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                    <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
                    <li><a href="#" className="hover:text-blue-600">Community</a></li>
                </ul>
            </div>
        </div>
      </footer>

      <ProductModal 
        isOpen={!!selectedProduct} 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onTrackClick={handleTrackClick}
      />

    </div>
  );
};

export default App;