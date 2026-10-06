'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Box, 
  RotateCcw, 
  Truck 
} from 'lucide-react';
import BookingModal from '@/components/BookingModal';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading product:', err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-[#77736A]">
        Loading equipment details...
      </div>
    );
  }

  if (!product || product.error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#292824]">Equipment Not Found</h2>
        <p className="text-xs text-[#77736A]">The requested rental item could not be retrieved from the database.</p>
        <Link 
          href="/categories"
          className="inline-block px-4 py-2 rounded-lg bg-[#F6E58D] text-xs font-bold text-[#292824] border border-[#E8E4D8]"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isAvailable = product.isAvailable && product.totalStock > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#77736A] hover:text-[#292824] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to rental catalog</span>
      </Link>

      {/* Main Product Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Hero Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF9F4] border border-[#E8E4D8] shadow-card">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-white/95 text-[#292824] border border-[#E8E4D8] shadow-subtle backdrop-blur-sm">
                {product.category}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              {isAvailable ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[#FAF9F4]/95 text-[#292824] border border-[#E8E4D8] shadow-subtle backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {product.totalStock} units in stock
                </span>
              ) : (
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 shadow-subtle">
                  Reserved Out
                </span>
              )}
            </div>
          </div>

          {/* Description Block */}
          <div className="bg-white rounded-2xl border border-[#E8E4D8] p-6 shadow-card space-y-4">
            <h2 className="text-lg font-bold text-[#292824]">Equipment Overview</h2>
            <p className="text-sm text-[#77736A] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* What's Included In The Box */}
          {product.features && product.features.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E8E4D8] p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-[#292824]" />
                <h3 className="text-base font-bold text-[#292824]">Included in Your Rental Package</h3>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#292824]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical Specifications */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E8E4D8] p-6 shadow-card space-y-4">
              <h3 className="text-base font-bold text-[#292824]">Hardware Specifications</h3>
              <div className="divide-y divide-[#E8E4D8] text-xs">
                {Object.entries(product.specs).map(([label, value]) => (
                  <div key={label} className="py-2.5 flex justify-between gap-4">
                    <span className="text-[#77736A] font-medium">{label}</span>
                    <span className="text-[#292824] font-semibold text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rental Assurances */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FAF9F4] rounded-xl border border-[#E8E4D8] p-4 text-center space-y-1">
              <ShieldCheck className="w-5 h-5 text-[#292824] mx-auto" />
              <div className="text-xs font-bold text-[#292824]">Bench Tested</div>
              <p className="text-[11px] text-[#77736A]">Pre-inspected before dispatch</p>
            </div>
            <div className="bg-[#FAF9F4] rounded-xl border border-[#E8E4D8] p-4 text-center space-y-1">
              <RotateCcw className="w-5 h-5 text-[#292824] mx-auto" />
              <div className="text-xs font-bold text-[#292824]">Deposit Protected</div>
              <p className="text-[11px] text-[#77736A]">Automatic release upon return</p>
            </div>
            <div className="bg-[#FAF9F4] rounded-xl border border-[#E8E4D8] p-4 text-center space-y-1">
              <Truck className="w-5 h-5 text-[#292824] mx-auto" />
              <div className="text-xs font-bold text-[#292824]">Doorstep or Depot</div>
              <p className="text-[11px] text-[#77736A]">Prepaid return label included</p>
            </div>
          </div>

        </div>

        {/* Right Column: Pricing & Sticky Rental Box */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          
          <div className="bg-white rounded-2xl border border-[#E8E4D8] p-6 shadow-card space-y-5">
            
            {/* Title & Rating */}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#77736A] mb-2">
                <Star className="w-3.5 h-3.5 fill-[#F6E58D] text-[#D8C252]" />
                <span className="font-bold text-[#292824]">{product.rating || '4.9'}</span>
                <span>({product.reviewCount || '20+'} verified user rentals)</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#292824] leading-snug">
                {product.name}
              </h1>
            </div>

            {/* Daily Pricing Display */}
            <div className="p-4 bg-[#FAF9F4] rounded-xl border border-[#E8E4D8] space-y-1">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-[#292824]">${product.pricePerDay}</span>
                  <span className="text-xs text-[#77736A] font-medium"> / day</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#77736A] block">Security Deposit</span>
                  <span className="text-sm font-semibold text-[#292824]">${product.deposit}</span>
                </div>
              </div>
              <p className="text-[11px] text-[#77736A] pt-1">
                * 100% refundable security deposit credited back upon return inspection.
              </p>
            </div>

            {/* Inclusions summary */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#77736A]">
                <span>Availability</span>
                <span className="font-semibold text-emerald-800">Ready for dispatch</span>
              </div>
              <div className="flex items-center justify-between text-[#77736A]">
                <span>Min rental period</span>
                <span className="font-medium text-[#292824]">1 Day</span>
              </div>
              <div className="flex items-center justify-between text-[#77736A]">
                <span>Cancellation</span>
                <span className="font-medium text-[#292824]">Free up to 24h prior</span>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => setIsBookingOpen(true)}
              disabled={!isAvailable}
              className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-all shadow-subtle ${
                isAvailable
                  ? 'bg-[#F6E58D] hover:bg-[#EED977] text-[#292824] border border-[#E8E4D8]'
                  : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
              }`}
            >
              {isAvailable ? 'Check Dates & Reserve Rental' : 'Currently Unavailable'}
            </button>

            <div className="text-[11px] text-[#77736A] text-center">
              No immediate charge until dates and availability are confirmed.
            </div>

          </div>

        </div>

      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          product={product}
          onClose={() => setIsBookingOpen(false)}
        />
      )}

    </div>
  );
}
