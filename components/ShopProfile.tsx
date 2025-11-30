import React from 'react';
import { Shop, Product } from '../types';
import ProductList from './ProductList';
import { BadgeCheck, MapPin } from 'lucide-react';

interface ShopProfileProps {
  shop: Shop;
  products: Product[];
  onBack: () => void;
  onProductClick: (p: Product) => void;
}

const ShopProfile: React.FC<ShopProfileProps> = ({ shop, products, onBack, onProductClick }) => {
  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      
      {/* Banner */}
      <div className="h-48 md:h-64 bg-slate-800 w-full relative overflow-hidden">
        {shop.banner_url ? (
            <img src={shop.banner_url} alt="Shop Banner" className="w-full h-full object-cover opacity-80" />
        ) : (
            <div className="w-full h-full bg-gradient-to-r from-indigo-900 to-slate-900"></div>
        )}
        <button 
            onClick={onBack}
            className="absolute top-4 left-4 bg-black/30 hover:bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm transition-colors"
        >
            &larr; Back to Marketplace
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
            <div className="w-32 h-32 rounded-xl bg-white border-4 border-white shadow-md overflow-hidden">
                <img 
                    src={shop.logo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${shop.shop_name}`} 
                    alt={shop.shop_name} 
                    className="w-full h-full object-cover"
                />
            </div>
            
            <div className="flex-1 text-center md:text-left mb-2">
                <h1 className="text-3xl font-extrabold text-slate-900 flex items-center justify-center md:justify-start gap-2">
                    {shop.shop_name}
                    {shop.verified && <BadgeCheck className="w-6 h-6 text-blue-500" />}
                </h1>
                <p className="text-slate-500 font-medium">@{shop.slug}</p>
            </div>

            <div className="flex gap-3">
                <div className="text-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-xl font-bold text-slate-900">{products.length}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Products</div>
                </div>
                <div className="text-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-xl font-bold text-slate-900">4.9</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Rating</div>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Featured Collections</h2>
                <select className="text-sm border-none bg-slate-50 rounded px-3 py-1 outline-none text-slate-600 cursor-pointer hover:bg-slate-100">
                    <option>All Products</option>
                    <option>Best Sellers</option>
                    <option>New Arrivals</option>
                </select>
            </div>
            <ProductList products={products} onProductClick={onProductClick} />
        </div>

      </div>
    </div>
  );
};

export default ShopProfile;