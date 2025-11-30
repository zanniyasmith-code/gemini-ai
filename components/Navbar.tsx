import React, { useState, useEffect } from 'react';
import { ProductType, FilterState, UserProfile } from '../types';
import { Search, ShoppingCart, Menu, LogOut, Store } from 'lucide-react';

interface NavbarProps {
  onSearch: (filters: FilterState) => void;
  onOpenAdmin: () => void;
  currentFilters: FilterState;
  user: UserProfile | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onOpenAdmin, currentFilters, user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState(currentFilters.query);
  const [selectedType, setSelectedType] = useState<ProductType | 'all'>(currentFilters.type);

  useEffect(() => {
    setSearchTerm(currentFilters.query);
    setSelectedType(currentFilters.type);
  }, [currentFilters]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    onSearch({
      query: term,
      type: selectedType,
      category: 'all'
    });
  };

  const handleTypeChange = (type: ProductType | 'all') => {
    setSelectedType(type);
    onSearch({
      query: searchTerm,
      type: type,
      category: 'all'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      query: searchTerm,
      type: selectedType,
      category: 'all'
    });
  };

  return (
    <nav className="bg-[#0f172a] text-white sticky top-0 z-50 shadow-md">
      {/* Top Main Bar */}
      <div className="flex items-center px-4 py-3 gap-4">
        {/* Logo */}
        <div 
          onClick={() => {
            handleSearchChange('');
            handleTypeChange('all');
          }}
          className="flex items-center gap-1 cursor-pointer"
        >
           <Store className="w-8 h-8 text-[#38bdf8]" />
           <span className="text-2xl font-extrabold tracking-tight leading-none">
             Oosma
           </span>
        </div>

        {/* Location / Deliver To (Visual Only) */}
        <div className="hidden md:flex flex-col text-xs hover:border border-transparent hover:border-gray-600 p-2 rounded cursor-pointer transition-colors">
          <span className="text-gray-400">Deliver to</span>
          <span className="font-bold">Global</span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex-1 flex h-10 rounded-lg overflow-hidden ring-1 ring-gray-700 focus-within:ring-2 focus-within:ring-[#38bdf8]">
          <select 
            className="bg-gray-100 text-gray-700 text-xs px-2 border-r border-gray-300 outline-none cursor-pointer hover:bg-gray-200 border-none max-w-[100px]"
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value as ProductType | 'all')}
          >
            <option value="all">All</option>
            <option value={ProductType.AFFILIATE_PHYSICAL}>Products</option>
            <option value={ProductType.DIGITAL_DOWNLOAD}>Digital</option>
            <option value={ProductType.SERVICE}>Services</option>
          </select>
          <input
            type="text"
            className="flex-1 px-3 text-black outline-none"
            placeholder="Search Oosma..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-[#38bdf8] hover:bg-[#0ea5e9] px-4 text-white flex items-center justify-center transition-colors font-medium"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* Admin / Dashboard / Sign In */}
          <div 
            onClick={onOpenAdmin}
            className="flex flex-col text-xs hover:border border-transparent hover:border-gray-600 p-2 rounded cursor-pointer text-white transition-colors"
          >
            <span className="text-gray-400">
              {user ? `Hello, ${user.role === 'seller' ? 'Seller' : 'User'}` : 'Hello, sign in'}
            </span>
            <span className="font-bold flex items-center gap-1">
              {user?.role === 'seller' ? 'Seller Dashboard' : 'Account & Lists'}
            </span>
          </div>

          {/* Cart */}
          <div className="flex items-center gap-1 hover:border border-transparent hover:border-gray-600 p-2 rounded cursor-pointer relative transition-colors">
            <ShoppingCart className="w-7 h-7" />
            <span className="absolute top-0 right-0 md:right-5 bg-[#38bdf8] text-black text-[10px] font-bold px-1 rounded-full">0</span>
            <span className="hidden md:inline font-bold self-end mt-2">Cart</span>
          </div>

          {/* Logout (if user) */}
          {user && (
            <button 
               onClick={onLogout}
               className="hover:text-[#38bdf8] transition-colors"
               title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}

        </div>
      </div>
      
      {/* Mobile / Secondary Nav (Visual) */}
      <div className="bg-[#1e293b] text-white text-sm py-2 px-4 flex items-center gap-6 overflow-x-auto border-t border-gray-800">
        <div className="flex items-center gap-1 font-bold cursor-pointer hover:text-[#38bdf8] transition-colors">
          <Menu className="w-5 h-5" /> All
        </div>
        <a href="#" className="whitespace-nowrap hover:text-[#38bdf8] transition-colors">Today's Deals</a>
        <a href="#" className="whitespace-nowrap hover:text-[#38bdf8] transition-colors">Customer Service</a>
        <a href="#" className="whitespace-nowrap hover:text-[#38bdf8] transition-colors">Registry</a>
        <a href="#" className="whitespace-nowrap hover:text-[#38bdf8] transition-colors">Gift Cards</a>
        <a href="#" onClick={onOpenAdmin} className="whitespace-nowrap hover:text-[#38bdf8] transition-colors">Sell on Oosma</a>
      </div>
    </nav>
  );
};

export default Navbar;