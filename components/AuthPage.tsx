import React, { useState } from 'react';
import { UserRole } from '../types';
import { Store, ShoppingBag, ArrowRight } from 'lucide-react';

interface AuthPageProps {
  onLogin: (role: UserRole, shopName?: string) => void;
  onCancel: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onCancel }) => {
  const [role, setRole] = useState<UserRole>('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'seller' && !shopName) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin(role, role === 'seller' ? shopName : undefined);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Brand Header */}
      <div className="mb-8 text-center cursor-pointer group" onClick={onCancel}>
         <div className="flex items-center justify-center gap-2 mb-2">
           <Store className="w-10 h-10 text-[#38bdf8]" />
           <span className="text-4xl font-extrabold tracking-tight text-slate-900">
             Oosma
           </span>
         </div>
         <p className="text-sm text-slate-500 font-medium">The Hybrid Marketplace for Everyone</p>
      </div>

      <div className="bg-white w-full max-w-[480px] rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Toggle Switch */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200">
          <button
            onClick={() => setRole('buyer')}
            className={`flex items-center justify-center gap-2 py-3 rounded-md text-sm font-semibold transition-all ${
              role === 'buyer' 
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Join as Buyer
          </button>
          <button
            onClick={() => setRole('seller')}
            className={`flex items-center justify-center gap-2 py-3 rounded-md text-sm font-semibold transition-all ${
              role === 'seller' 
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Store className="w-4 h-4" /> Become a Seller
          </button>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {role === 'seller' ? 'Setup your Seller Profile' : 'Create your Oosma Account'}
          </h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            {role === 'seller' 
              ? 'Launch your branded shop, manage inventory, and track earnings with our Shopify-style dashboard.' 
              : 'Access millions of products, digital downloads, and professional services in one marketplace.'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                required 
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent outline-none transition-all"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {role === 'seller' && (
              <div className="flex flex-col gap-1.5 animate-fade-in">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Shop Name</label>
                <input 
                  type="text" 
                  required 
                  className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Acme Digital Assets"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
                <p className="text-[11px] text-slate-400 font-medium">Your shop URL will be oosma.com/shop/{shopName.toLowerCase().replace(/\s+/g, '-')}</p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                required 
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#38bdf8] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full bg-[#0f172a] hover:bg-black text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {role === 'seller' ? 'Launch Store' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-slate-500">
        <p>Already have an account? <a href="#" className="font-semibold text-slate-900 hover:underline">Log in</a></p>
      </div>

    </div>
  );
};

export default AuthPage;