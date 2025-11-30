import React, { useState } from 'react';
import { Product, ProductType } from '../../types';
import { Plus, Link, DollarSign, UploadCloud, MonitorPlay } from 'lucide-react';

interface ProductFormProps {
  onAddProduct: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct }) => {
  const [type, setType] = useState<ProductType>(ProductType.AFFILIATE_PHYSICAL);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    affiliate_link: '',
    image_url: '',
    video_url: '',
    category: 'General',
  });

  const isAffiliate = type === ProductType.AFFILIATE_PHYSICAL;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    
    // Validation
    if (isAffiliate && !formData.affiliate_link) {
      alert("Affiliate link is required for affiliate products.");
      return;
    }
    if (!isAffiliate && !formData.price) {
      alert("Price is required for direct products.");
      return;
    }

    const newProduct: Product = {
      id: crypto.randomUUID(),
      shop_id: '', // Assigned by parent
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      affiliate_link: isAffiliate ? formData.affiliate_link : undefined,
      product_type: type,
      images: [formData.image_url || 'https://via.placeholder.com/400'],
      video_url: formData.video_url,
      category: formData.category,
      rating: 0,
      reviewCount: 0
    };

    onAddProduct(newProduct);
    
    // Reset form partial
    setFormData({
      title: '',
      description: '',
      price: '',
      affiliate_link: '',
      image_url: '',
      video_url: '',
      category: 'General',
    });
    alert('Product added successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-600" /> Add New Product
        </h2>
        
        {/* Type Switcher */}
        <div className="flex bg-white rounded-md border border-gray-300 p-1">
           {[
             { label: 'Affiliate', value: ProductType.AFFILIATE_PHYSICAL, icon: Link },
             { label: 'Digital', value: ProductType.DIGITAL_DOWNLOAD, icon: UploadCloud },
             { label: 'Service', value: ProductType.SERVICE, icon: MonitorPlay },
           ].map(t => (
             <button
               key={t.value}
               type="button"
               onClick={() => setType(t.value as ProductType)}
               className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                 type === t.value 
                   ? 'bg-slate-800 text-white shadow-sm' 
                   : 'text-gray-600 hover:bg-gray-100'
               }`}
             >
               <t.icon className="w-3 h-3" /> {t.label}
             </button>
           ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Product Title</label>
          <input
            required
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            placeholder="e.g. Mechanical Keyboard Keycaps"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Description</label>
          <textarea
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Describe the product features, benefits, or service details..."
          />
        </div>

        {/* Dynamic Section based on Type */}
        <div className="col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
           <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
             {isAffiliate ? <Link className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
             {isAffiliate ? 'Affiliate Configuration' : 'Pricing & Delivery'}
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isAffiliate ? (
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Affiliate Link (Destination)</label>
                  <input
                    required
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                    value={formData.affiliate_link}
                    onChange={e => setFormData({...formData, affiliate_link: e.target.value})}
                    placeholder="https://amazon.com/dp/..."
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Users will be redirected here when they click "Buy Now".</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Price ($)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                       {type === ProductType.DIGITAL_DOWNLOAD ? 'Upload File' : 'Service Duration'}
                    </label>
                    {type === ProductType.DIGITAL_DOWNLOAD ? (
                      <div className="border border-dashed border-gray-300 bg-white rounded-md p-2 text-center text-xs text-gray-500 cursor-pointer hover:bg-gray-50">
                        Click to upload file
                      </div>
                    ) : (
                       <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="e.g. 1 Hour Session"
                      />
                    )}
                  </div>
                </>
              )}

              {/* Price field for Affiliate is purely display */}
              {isAffiliate && (
                <div>
                   <label className="block text-xs font-semibold text-gray-600 mb-1">Display Price (Optional)</label>
                   <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                   />
                </div>
              )}
           </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Category</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
            placeholder="e.g. Electronics"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Media</label>
          <input
            type="url"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all mb-2"
            value={formData.image_url}
            onChange={e => setFormData({...formData, image_url: e.target.value})}
            placeholder="Image URL (https://...)"
          />
          <input
            type="url"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={formData.video_url}
            onChange={e => setFormData({...formData, video_url: e.target.value})}
            placeholder="Video URL (Optional)"
          />
        </div>

        <div className="col-span-2 pt-4">
           <button 
             type="submit"
             className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors"
           >
             Save Product
           </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;