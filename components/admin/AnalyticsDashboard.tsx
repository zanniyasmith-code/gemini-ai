import React, { useState } from 'react';
import { AnalyticsMetrics, Product } from '../../types';
import { BarChart3, TrendingUp, DollarSign, MousePointer2 } from 'lucide-react';

interface AnalyticsDashboardProps {
  products: Product[];
  analytics: AnalyticsMetrics[];
  onUpdateMetrics: (newMetrics: AnalyticsMetrics[]) => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ products, analytics, onUpdateMetrics }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{sales: string, commission: string}>({ sales: '', commission: '' });

  // Merge products with analytics
  const data = products.map(p => {
    const metrics = analytics.find(a => a.product_id === p.id) || { clicks: 0, sales_count: 0, revenue: 0, views: 0, product_id: p.id };
    return { ...p, ...metrics };
  });

  // Sort by clicks for the chart
  const topProducts = [...data].sort((a, b) => b.clicks - a.clicks).slice(0, 5);
  const maxClicks = Math.max(...topProducts.map(p => p.clicks), 1);

  const totalClicks = analytics.reduce((acc, curr) => acc + curr.clicks, 0);
  const totalCommission = analytics.reduce((acc, curr) => acc + curr.revenue, 0);

  const startEdit = (metrics: AnalyticsMetrics) => {
    setEditingId(metrics.product_id);
    setEditValues({
      sales: metrics.sales_count.toString(),
      commission: metrics.revenue.toString()
    });
  };

  const saveEdit = (productId: string) => {
    const updated = analytics.map(a => {
      if (a.product_id === productId) {
        return {
          ...a,
          sales_count: parseInt(editValues.sales) || 0,
          revenue: parseFloat(editValues.commission) || 0
        };
      }
      return a;
    });
    
    // If the product didn't have analytics entry yet (should be rare in this mock structure but good practice)
    if (!analytics.find(a => a.product_id === productId)) {
        updated.push({
            product_id: productId,
            views: 0,
            clicks: 0,
            sales_count: parseInt(editValues.sales) || 0,
            revenue: parseFloat(editValues.commission) || 0
        });
    }

    onUpdateMetrics(updated);
    setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
           <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
             <MousePointer2 className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm text-gray-500 font-medium">Total Clicks</p>
             <h3 className="text-2xl font-bold text-gray-900">{totalClicks}</h3>
           </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
           <div className="p-3 bg-green-50 text-green-600 rounded-full">
             <DollarSign className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm text-gray-500 font-medium">Est. Commission</p>
             <h3 className="text-2xl font-bold text-gray-900">${totalCommission.toFixed(2)}</h3>
           </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
           <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
             <TrendingUp className="w-6 h-6" />
           </div>
           <div>
             <p className="text-sm text-gray-500 font-medium">Conversion Rate</p>
             <h3 className="text-2xl font-bold text-gray-900">
               {totalClicks > 0 ? ((analytics.reduce((acc, c) => acc + c.sales_count, 0) / totalClicks) * 100).toFixed(1) : 0}%
             </h3>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
           <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
             <BarChart3 className="w-5 h-5 text-gray-500" /> Top Clicked Products
           </h3>
           <div className="flex flex-col gap-4">
             {topProducts.map((product) => (
               <div key={product.id} className="w-full">
                 <div className="flex justify-between text-xs mb-1">
                   <span className="font-medium text-gray-700 truncate w-32">{product.title}</span>
                   <span className="text-gray-500">{product.clicks} clicks</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                   <div 
                     className="bg-[#febd69] h-2.5 rounded-full transition-all duration-500" 
                     style={{ width: `${(product.clicks / maxClicks) * 100}%` }}
                   ></div>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Table Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
           <div className="p-4 border-b border-gray-200 bg-gray-50">
             <h3 className="text-lg font-bold text-gray-800">Performance Data</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                 <tr>
                   <th className="px-6 py-3 font-medium">Product</th>
                   <th className="px-6 py-3 font-medium text-center">Clicks</th>
                   <th className="px-6 py-3 font-medium text-center">Sales (Manual)</th>
                   <th className="px-6 py-3 font-medium text-center">Commission ($)</th>
                   <th className="px-6 py-3 font-medium text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {data.map((row) => (
                   <tr key={row.id} className="hover:bg-gray-50">
                     <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[200px]" title={row.title}>
                       {row.title}
                     </td>
                     <td className="px-6 py-4 text-center text-gray-600">
                       {row.clicks}
                     </td>
                     
                     {/* Sales Input */}
                     <td className="px-6 py-4 text-center">
                       {editingId === row.id ? (
                         <input 
                           type="number" 
                           className="w-16 p-1 border border-gray-300 rounded text-center text-xs"
                           value={editValues.sales}
                           onChange={(e) => setEditValues({...editValues, sales: e.target.value})}
                         />
                       ) : (
                         <span className="text-gray-600">{row.sales_count}</span>
                       )}
                     </td>

                     {/* Commission Input */}
                     <td className="px-6 py-4 text-center">
                        {editingId === row.id ? (
                         <input 
                           type="number" 
                           step="0.01"
                           className="w-20 p-1 border border-gray-300 rounded text-center text-xs"
                           value={editValues.commission}
                           onChange={(e) => setEditValues({...editValues, commission: e.target.value})}
                         />
                       ) : (
                         <span className="text-green-600 font-medium">${row.revenue.toFixed(2)}</span>
                       )}
                     </td>

                     <td className="px-6 py-4 text-right">
                       {editingId === row.id ? (
                         <button 
                           onClick={() => saveEdit(row.id)}
                           className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs transition-colors"
                         >
                           Save
                         </button>
                       ) : (
                         <button 
                           onClick={() => startEdit({
                             product_id: row.id, 
                             clicks: row.clicks, 
                             sales_count: row.sales_count, 
                             revenue: row.revenue,
                             views: row.views
                           })}
                           className="text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline"
                         >
                           Edit
                         </button>
                       )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;