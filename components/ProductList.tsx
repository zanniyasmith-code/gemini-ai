import React from 'react';
import { Product, ProductType } from '../types';
import { Star, ShoppingCart, ExternalLink, Play, Download } from 'lucide-react';
import { MOCK_SHOPS } from '../constants';

interface ProductListProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const getVendorDomain = (url: string) => {
  try {
    if (!url) return 'Site';
    const hostname = new URL(url).hostname;
    return hostname.replace('www.', '').split('.')[0];
  } catch {
    return 'Site';
  }
};

export const ProductCard: React.FC<{ product: Product; onClick: () => void }> = ({ product, onClick }) => {
  const shop = MOCK_SHOPS.find(s => s.id === product.shop_id);
  const isAffiliate = !!product.affiliate_link;
  const vendorName = shop ? shop.shop_name : (isAffiliate ? getVendorDomain(product.affiliate_link || '') : 'Oosma');

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAffiliate && product.affiliate_link) {
      window.open(product.affiliate_link, '_blank');
    } else {
      alert("Added to cart (Mock)");
    }
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition-all cursor-pointer h-full group"
      onClick={onClick}
    >
      {/* Image Area */}
      <div className="bg-gray-50 aspect-[4/3] relative overflow-hidden">
         <img 
           src={product.images[0]} 
           alt={product.title} 
           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
         />
         {/* Type Badge */}
         <div className="absolute top-2 left-2">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full shadow-sm uppercase tracking-wide ${
                product.product_type === ProductType.SERVICE ? 'bg-blue-100 text-blue-800' :
                product.product_type === ProductType.DIGITAL_DOWNLOAD ? 'bg-purple-100 text-purple-800' :
                'bg-white/90 text-gray-800 backdrop-blur-sm'
            }`}>
              {product.product_type === ProductType.DIGITAL_DOWNLOAD ? 'Digital' : 
               product.product_type === ProductType.SERVICE ? 'Service' : 'Product'}
            </span>
         </div>
      </div>

      {/* Details Area */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        
        {/* Title */}
        <h3 className="text-gray-900 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#38bdf8] transition-colors">
          {product.title}
        </h3>

        {/* Vendor */}
        <div className="text-xs text-gray-500">
           Sold by <span className="font-medium text-gray-700">{vendorName}</span>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
               <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Price & Action */}
        <div className="flex items-end justify-between mt-2 pt-3 border-t border-gray-50">
          <div>
            {product.price > 0 ? (
                <>
                    <span className="text-xs font-medium text-gray-500">$</span>
                    <span className="text-lg font-bold text-gray-900">{Math.floor(product.price)}</span>
                    <span className="text-xs font-medium text-gray-500">.{product.price.toFixed(2).split('.')[1]}</span>
                </>
            ) : (
                <span className="text-sm font-bold text-green-600">Free</span>
            )}
          </div>
          
          <button 
             onClick={handleAction}
             className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1.5 ${
               isAffiliate 
                 ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200' 
                 : 'bg-[#0f172a] text-white hover:bg-[#38bdf8] hover:text-black'
             }`}
          >
             {isAffiliate ? (
                <>View on {getVendorDomain(product.affiliate_link || '')} <ExternalLink className="w-3 h-3" /></>
             ) : product.product_type === ProductType.DIGITAL_DOWNLOAD ? (
                <>Download <Download className="w-3 h-3" /></>
             ) : (
                <>Add <ShoppingCart className="w-3 h-3" /></>
             )}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductList: React.FC<ProductListProps> = ({ products, onProductClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onClick={() => onProductClick(product)} 
        />
      ))}
    </div>
  );
};

export default ProductList;