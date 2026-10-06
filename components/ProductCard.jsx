'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShieldCheck } from 'lucide-react';

export default function ProductCard({ product, onBookNow }) {
  const isAvailable = product.isAvailable && product.totalStock > 0;

  return (
    <div className="group bg-white rounded-xl border border-[#E8E4D8] shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <Link 
        href={`/products/${product.id}`}
        className="relative aspect-[4/3] bg-[#FAF9F4] overflow-hidden block cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white/95 text-[#292824] border border-[#E8E4D8] shadow-subtle backdrop-blur-sm">
            {product.category}
          </span>
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#FAF9F4]/95 text-[#292824] border border-[#E8E4D8] shadow-subtle backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {product.totalStock} available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200 shadow-subtle">
              Booked Out
            </span>
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Review */}
          <div className="flex items-center gap-1.5 mb-2 text-xs text-[#77736A]">
            <Star className="w-3.5 h-3.5 fill-[#F6E58D] text-[#D8C252]" />
            <span className="font-semibold text-[#292824]">{product.rating || '4.9'}</span>
            <span>({product.reviewCount || '20+'} reviews)</span>
            <span className="mx-1 text-[#E8E4D8]">•</span>
            <span className="text-[#77736A] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#77736A]" /> Inspected
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/products/${product.id}`}>
            <h3 className="text-base font-semibold text-[#292824] line-clamp-2 hover:text-black cursor-pointer transition-colors mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-[#77736A] line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-[#E8E4D8]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xl font-bold text-[#292824]">${product.pricePerDay}</span>
              <span className="text-xs text-[#77736A] font-medium"> / day</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#77736A] block">Refundable deposit</span>
              <span className="text-xs font-medium text-[#292824]">${product.deposit}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${product.id}`}
              className="w-full py-2 px-3 text-xs font-medium rounded-lg bg-white hover:bg-[#FAF9F4] text-[#292824] border border-[#E8E4D8] transition-colors text-center"
            >
              Details
            </Link>
            <button
              onClick={() => onBookNow && onBookNow(product)}
              disabled={!isAvailable}
              className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors text-center shadow-subtle ${
                isAvailable
                  ? 'bg-[#F6E58D] hover:bg-[#EED977] text-[#292824] border border-[#E8E4D8]'
                  : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
              }`}
            >
              {isAvailable ? 'Book Rental' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
