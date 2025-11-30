import React, { useState } from 'react';
import { Product, ProductType } from '../types';
import { X, ExternalLink, Star, ShieldCheck, Sparkles, PlayCircle, Download } from 'lucide-react';
import { generateProductInsight } from '../services/geminiService';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackClick: (productId: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onTrackClick }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [activeMedia, setActiveMedia] = useState<{ type: 'image' | 'video'; index: number }>({ type: 'image', index: 0 });

  // Reset state when modal closes or product changes
  React.useEffect(() => {
    if (!isOpen) {
      setInsight(null);
      setLoadingInsight(false);
      setActiveMedia({ type: 'image', index: 0 });
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const isAffiliate = product.product_type === ProductType.AFFILIATE_PHYSICAL && !!product.affiliate_link;

  const handleAction = () => {
    onTrackClick(product.id);
    if (isAffiliate && product.affiliate_link) {
      window.open(product.affiliate_link, '_blank');
    } else {
      alert("Added to Cart (Mock)");
    }
  };

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    const text = await generateProductInsight(product.title, product.description);
    setInsight(text);
    setLoadingInsight(false);
  };

  let vendorName = 'Oosma';
  if (isAffiliate && product.affiliate_link) {
    try {
      vendorName = new URL(product.affiliate_link).hostname.replace('www.', '');
    } catch (e) { /* ignore */ }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto p-4 md:p-8">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[1200px] flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
        
        {/* Close Button Mobile */}
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-white/80 rounded-full md:hidden">
            <X className="w-5 h-5" />
        </button>

        {/* LEFT: MEDIA (Scrollable on mobile) */}
        <div className="w-full md:w-1/2 bg-gray-50 p-6 flex flex-col gap-4 overflow-y-auto">
            <div className="aspect-square bg-white rounded-xl flex items-center justify-center p-4 shadow-sm border border-gray-100 relative">
                 {activeMedia.type === 'video' && product.video_url ? (
                   <iframe 
                     src={product.video_url} 
                     className="w-full h-full rounded-lg" 
                     title="Product Video"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                     allowFullScreen
                   ></iframe>
                 ) : (
                   <img 
                    src={product.images[activeMedia.index]} 
                    alt={product.title} 
                    className="max-w-full max-h-full object-contain" 
                   />
                 )}
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                    <button 
                      key={`img-${i}`}
                      onClick={() => setActiveMedia({ type: 'image', index: i })}
                      className={`w-20 h-20 border rounded-lg p-1 bg-white flex-shrink-0 transition-all ${
                        activeMedia.type === 'image' && activeMedia.index === i ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-contain" />
                    </button>
                ))}
            </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto relative">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full hidden md:block">
               <X className="w-6 h-6 text-gray-400" />
            </button>

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        product.product_type === ProductType.SERVICE ? 'bg-blue-100 text-blue-800' :
                        product.product_type === ProductType.DIGITAL_DOWNLOAD ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        {product.product_type === ProductType.DIGITAL_DOWNLOAD ? 'Digital' : 
                         product.product_type === ProductType.SERVICE ? 'Service' : 'Physical'}
                    </span>
                    <div className="flex text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-gray-500 text-sm ml-1 font-medium">{product.rating}</span>
                    </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">{product.title}</h1>
                <p className="text-sm text-gray-500">Sold by <span className="font-semibold text-gray-900">{vendorName}</span></p>
            </div>

            {/* Price & Action */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="text-3xl font-bold text-gray-900">
                    {product.price > 0 ? `$${product.price.toFixed(2)}` : 'Free'}
                </div>
                <button 
                  onClick={handleAction}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                      isAffiliate 
                        ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
                        : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {isAffiliate ? (
                      <>View on {vendorName} <ExternalLink className="w-5 h-5" /></>
                  ) : product.product_type === ProductType.DIGITAL_DOWNLOAD ? (
                      <>Download Now <Download className="w-5 h-5" /></>
                  ) : (
                      <>Add to Cart</>
                  )}
                </button>
            </div>

            {/* AI Insight */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5 mb-6">
                 <div className="flex items-center justify-between mb-3">
                   <h3 className="font-bold text-indigo-900 flex items-center gap-2 text-sm">
                     <Sparkles className="w-4 h-4 text-indigo-500" />
                     Gemini Smart Analysis
                   </h3>
                   {!insight && !loadingInsight && (
                     <button 
                       onClick={handleGenerateInsight}
                       className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors font-medium"
                     >
                       Generate Insight
                     </button>
                   )}
                 </div>
                 
                 {loadingInsight && (
                   <div className="flex items-center gap-2 text-indigo-600 text-sm animate-pulse">
                     <Sparkles className="w-4 h-4 animate-spin" />
                     Analyzing product data...
                   </div>
                 )}
 
                 {insight && (
                   <div className="prose prose-sm text-indigo-800 text-sm whitespace-pre-line leading-relaxed">
                     {insight}
                   </div>
                 )}
                 
                 {!insight && !loadingInsight && (
                     <p className="text-xs text-indigo-400">Get an instant AI summary of pros/cons.</p>
                 )}
            </div>

            {/* Description */}
            <div>
                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ProductModal;