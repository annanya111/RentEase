'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, RefreshCw } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import BookingModal from '@/components/BookingModal';

function CategoriesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState(100);
  const [selectedProductForBooking, setSelectedProductForBooking] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(err => console.error('Failed to load products:', err));
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const categories = [
    'All',
    'Gaming Consoles',
    'Cameras',
    'Travel Gear',
    'VR Equipment',
    'Projectors',
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && selectedCategory !== 'All') {
        if (p.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesDesc = p.description && p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesDesc) return false;
      }

      if (onlyAvailable && (!p.isAvailable || p.totalStock <= 0)) {
        return false;
      }

      if (p.pricePerDay > maxPriceFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price-high') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [products, selectedCategory, searchQuery, onlyAvailable, maxPriceFilter, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('default');
    setOnlyAvailable(false);
    setMaxPriceFilter(100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#292824]">
          Rental Inventory Catalog
        </h1>
        <p className="text-sm text-[#77736A] mt-1">
          Browse sanitized, premium tech and travel gear available for daily and weekly rentals.
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = (selectedCategory || 'All').toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-[#F6E58D] text-[#292824] border-[#E8E4D8] shadow-subtle'
                  : 'bg-white text-[#77736A] hover:text-[#292824] border-[#E8E4D8] hover:bg-[#FAF9F4]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Control Toolbar */}
      <div className="bg-white rounded-2xl border border-[#E8E4D8] p-4 shadow-card grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search input */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-[#77736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by gear name, model, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#FAF9F4] border border-[#E8E4D8] rounded-xl text-[#292824] focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
          />
        </div>

        {/* Max Price Slider */}
        <div className="md:col-span-3 flex items-center gap-3">
          <span className="text-xs text-[#77736A] whitespace-nowrap">Up to:</span>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={maxPriceFilter}
            onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
            className="w-full accent-[#292824]"
          />
          <span className="text-xs font-bold text-[#292824] min-w-[50px]">
            ${maxPriceFilter}/day
          </span>
        </div>

        {/* Availability Toggle */}
        <div className="md:col-span-2 flex items-center">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-[#292824]">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded border-[#E8E4D8] text-[#292824] focus:ring-[#F6E58D] w-4 h-4"
            />
            <span>In stock only</span>
          </label>
        </div>

        {/* Sort selector */}
        <div className="md:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#FAF9F4] border border-[#E8E4D8] rounded-xl text-[#292824] focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
          >
            <option value="default">Sort: Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#77736A]">
        <div>
          Showing <span className="font-semibold text-[#292824]">{filteredProducts.length}</span> rental items
          {selectedCategory && selectedCategory !== 'All' ? ` in "${selectedCategory}"` : ''}
        </div>
        {(searchQuery || selectedCategory !== 'All' || onlyAvailable || maxPriceFilter < 100 || sortBy !== 'default') && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-[#292824] hover:underline"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBookNow={(p) => setSelectedProductForBooking(p)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-[#E8E4D8] p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF4B8] border border-[#E8E4D8] text-[#292824] mx-auto flex items-center justify-center font-bold">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#292824]">No rental equipment found</h3>
            <p className="text-xs text-[#77736A] mt-1">
              We couldn't find any items matching your selected category, price range, or search keyword.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#F6E58D] hover:bg-[#EED977] text-[#292824] border border-[#E8E4D8] shadow-subtle transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {selectedProductForBooking && (
        <BookingModal
          product={selectedProductForBooking}
          onClose={() => setSelectedProductForBooking(null)}
        />
      )}

    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#77736A]">Loading inventory catalog...</div>}>
      <CategoriesContent />
    </Suspense>
  );
}
