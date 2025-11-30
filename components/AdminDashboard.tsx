import React, { useState } from 'react';
import { Product, AnalyticsMetrics } from '../types';
import AnalyticsDashboard from './admin/AnalyticsDashboard';
import ProductForm from './admin/ProductForm';
import { LayoutDashboard, PackagePlus, ArrowLeft, Database, Store } from 'lucide-react';
import { SQL_SCHEMA_CODE } from '../constants';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  analytics: AnalyticsMetrics[];
  onUpdateMetrics: (metrics: AnalyticsMetrics[]) => void;
  onExit: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, 
  onAddProduct, 
  analytics, 
  onUpdateMetrics,
  onExit 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'sql'>('overview');

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
           <div className="flex items-center gap-2">
             <Store className="w-6 h-6 text-blue-600" />
             <span className="font-bold text-lg text-slate-900">Seller<span className="text-slate-400">Hub</span></span>
           </div>
        </div>

        <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'overview' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" /> Overview
          </button>

          <button 
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'products' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <PackagePlus className="w-5 h-5" /> Products
          </button>
          
          <button 
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'sql' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Database className="w-5 h-5" /> Settings (SQL)
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
           <button 
             onClick={onExit}
             className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium w-full px-2"
           >
             <ArrowLeft className="w-4 h-4" /> Back to Marketplace
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-8 justify-between sticky top-0 z-20">
          <h1 className="text-lg font-bold text-slate-800 capitalize">
            {activeTab === 'sql' ? 'Platform Configuration' : activeTab}
          </h1>
          <div className="flex items-center gap-3">
             <div className="text-right hidden md:block">
               <div className="text-sm font-bold text-slate-900">My Store</div>
               <div className="text-xs text-slate-500">Seller Account</div>
             </div>
             <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
               S
             </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <AnalyticsDashboard 
              products={products}
              analytics={analytics}
              onUpdateMetrics={onUpdateMetrics}
            />
          )}

          {activeTab === 'products' && (
            <div className="max-w-3xl mx-auto">
              <ProductForm onAddProduct={onAddProduct} />
            </div>
          )}

          {activeTab === 'sql' && (
             <div className="bg-[#1e1e1e] rounded-lg shadow-lg border border-slate-800 overflow-hidden">
               <div className="p-4 bg-[#2d2d2d] border-b border-slate-700 flex justify-between items-center">
                 <h3 className="text-slate-200 font-mono text-sm flex items-center gap-2">
                    <Database className="w-4 h-4" /> Supabase SQL Schema
                 </h3>
                 <span className="text-xs text-slate-400">PostgreSQL</span>
               </div>
               <pre className="text-green-400 font-mono text-xs p-6 overflow-x-auto leading-relaxed">
                 <code>{SQL_SCHEMA_CODE}</code>
               </pre>
             </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;