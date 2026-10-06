'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import BookingModal from '@/components/BookingModal';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [selectedProductForBooking, setSelectedProductForBooking] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  const categories = [
    { 
      name: 'Gaming Consoles', 
      tagline: 'PS5 Slim, Xbox Series X, Switch OLED', 
      count: '4 models', 
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      name: 'Cameras', 
      tagline: 'Full-frame mirrorless & cinema kits', 
      count: '3 kits', 
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      name: 'Travel Gear', 
      tagline: 'Lightweight drones, packs, expedition tents', 
      count: '3 kits', 
      image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      name: 'VR Equipment', 
      tagline: 'Mixed reality headsets & spatial controllers', 
      count: '2 units', 
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      name: 'Projectors', 
      tagline: '1080p & 4K portable laser cinema', 
      count: '2 models', 
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80' 
    },
  ];

  const featured = products.slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="pt-8 sm:pt-14 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Headline & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E8E4D8] shadow-subtle text-xs font-semibold text-[#292824]">
                <span className="w-2 h-2 rounded-full bg-[#F6E58D] border border-[#292824]"></span>
                <span>Verified Hardware Rental Fleet</span>
                <span className="text-[#77736A]">•</span>
                <span className="text-[#77736A] font-normal">Sanitized & Bench Tested</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-[#292824] leading-[1.12]">
                Rent premium gear for your next trip, shoot, or game night.
              </h1>

              <p className="text-base sm:text-lg text-[#77736A] max-w-xl leading-relaxed">
                Experience high-end cameras, gaming consoles, travel drones, and portable projectors without the burden of buying. Clean gear delivered to your door with transparent deposits.
              </p>

              {/* Quick Jump Bar */}
              <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E8E4D8] shadow-card max-w-xl space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
                <div className="flex-1">
                  <label className="text-[11px] font-semibold text-[#77736A] uppercase tracking-wider block mb-1">
                    What are you looking for?
                  </label>
                  <Link 
                    href="/categories"
                    className="w-full text-left text-sm font-medium text-[#292824] hover:text-[#77736A] transition-colors flex items-center justify-between py-1"
                  >
                    <span>Browse all 5 rental categories</span>
                    <Search className="w-4 h-4 text-[#77736A]" />
                  </Link>
                </div>
                <div className="sm:border-l sm:border-[#E8E4D8] sm:pl-3">
                  <Link
                    href="/categories"
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#F6E58D] hover:bg-[#EED977] text-[#292824] text-sm font-bold border border-[#E8E4D8] shadow-subtle transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Explore Fleet</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Trust Metrics */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#77736A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#292824]" />
                  <span>100% Refundable Deposits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#292824]" />
                  <span>Free 2-Way Shipping / Depot Pickup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#292824]" />
                  <span>No Subscription Required</span>
                </div>
              </div>

            </div>

            {/* Right Column: Featured Hardware Preview */}
            <div className="lg:col-span-5">
              <div className="relative bg-white rounded-2xl border border-[#E8E4D8] p-4 shadow-card">
                
                {/* Hero Product Highlight Banner */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF9F4] border border-[#E8E4D8] mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80"
                    alt="PlayStation 5 Rental"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#F6E58D] text-[#292824] border border-[#E8E4D8] shadow-subtle">
                      Most Rented This Week
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#E8E4D8] text-xs shadow-subtle">
                    <span className="font-bold text-[#292824]">$24</span>
                    <span className="text-[#77736A]"> / day</span>
                  </div>
                </div>

                {/* Hero Item Details */}
                <div className="space-y-2 px-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#77736A]">Gaming Consoles</span>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3.5 h-3.5 fill-[#F6E58D] text-[#D8C252]" />
                      <span className="font-semibold text-[#292824]">4.9</span>
                      <span className="text-[#77736A]">(42 rentals)</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-base text-[#292824]">
                    Sony PlayStation 5 Slim Digital + 2 Controllers
                  </h3>
                  <p className="text-xs text-[#77736A] leading-relaxed">
                    Includes 2 DualSense controllers, pre-configured party games, HDMI 2.1 cable, and carry case.
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      In Stock for Immediate Dispatch
                    </span>
                    <button
                      onClick={() => setSelectedProductForBooking(products.find(p => p.id === 'prod-1') || products[0])}
                      className="text-xs font-semibold px-4 py-2 rounded-lg bg-[#F6E58D] hover:bg-[#EED977] text-[#292824] border border-[#E8E4D8] shadow-subtle transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#292824] tracking-tight">
              Explore by Category
            </h2>
            <p className="text-sm text-[#77736A] mt-1">
              Select an equipment category to browse available stock, rates, and inclusions.
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#292824] hover:text-[#77736A] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/categories?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white rounded-xl border border-[#E8E4D8] p-4 cursor-pointer hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#FAF9F4] border border-[#E8E4D8] mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#292824] group-hover:text-black">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#77736A] mt-0.5 line-clamp-1">
                  {cat.tagline}
                </p>
                <div className="mt-2 pt-2 border-t border-[#E8E4D8] flex items-center justify-between text-[11px]">
                  <span className="font-medium text-[#292824]">{cat.count}</span>
                  <span className="text-[#77736A] group-hover:text-[#292824] transition-colors">Rent →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Gear Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#77736A] mb-1">
              <span>Ready for Immediate Reservation</span>
            </div>
            <h2 className="text-2xl font-bold text-[#292824] tracking-tight">
              Featured Equipment
            </h2>
            <p className="text-sm text-[#77736A] mt-1">
              Top requested cameras, consoles, projectors, and travel kits with full accessories.
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-white hover:bg-[#FAF9F4] text-[#292824] border border-[#E8E4D8] shadow-subtle transition-colors"
          >
            Browse All ({products.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBookNow={(p) => setSelectedProductForBooking(p)}
            />
          ))}
        </div>
      </section>

      {/* How It Works (Trustworthy Marketplace Flow) */}
      <section className="bg-white border-y border-[#E8E4D8] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#77736A]">
              Simple & Transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#292824] tracking-tight mt-1">
              How renting with RentEase works
            </h2>
            <p className="text-sm text-[#77736A] mt-2">
              We make renting professional hardware as seamless as booking a stay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAF9F4] rounded-xl border border-[#E8E4D8] p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F6E58D] border border-[#E8E4D8] flex items-center justify-center font-bold text-base text-[#292824]">
                1
              </div>
              <h3 className="text-base font-bold text-[#292824]">Select dates & reserve</h3>
              <p className="text-xs text-[#77736A] leading-relaxed">
                Choose your exact rental duration. Real-time calendar availability checks guarantee that reserved units are locked in for you.
              </p>
            </div>

            <div className="bg-[#FAF9F4] rounded-xl border border-[#E8E4D8] p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F6E58D] border border-[#E8E4D8] flex items-center justify-center font-bold text-base text-[#292824]">
                2
              </div>
              <h3 className="text-base font-bold text-[#292824]">Doorstep drop-off or pickup</h3>
              <p className="text-xs text-[#77736A] leading-relaxed">
                Receive the gear sanitized, tested, and fully charged with all necessary cables, batteries, and protective cases.
              </p>
            </div>

            <div className="bg-[#FAF9F4] rounded-xl border border-[#E8E4D8] p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F6E58D] border border-[#E8E4D8] flex items-center justify-center font-bold text-base text-[#292824]">
                3
              </div>
              <h3 className="text-base font-bold text-[#292824]">Return & deposit release</h3>
              <p className="text-xs text-[#77736A] leading-relaxed">
                Drop it off at the depot or hand it to our courier. After quick bench check, your security deposit is released automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

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
