'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, RotateCcw, Clock, Award } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/login') return null;
  return (
    <footer className="mt-20 border-t border-[#E8E4D8] bg-white">
      {/* Trust Guarantee Bar */}
      <div className="border-b border-[#E8E4D8] bg-[#FAF9F4]/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#FFF4B8] border border-[#E8E4D8] text-[#292824]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#292824]">100% Inspected & Sanitized</h4>
                <p className="text-xs text-[#77736A] mt-0.5">Every unit undergoes strict bench testing and UV cleaning between rentals.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#FFF4B8] border border-[#E8E4D8] text-[#292824]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#292824]">Refundable Deposits</h4>
                <p className="text-xs text-[#77736A] mt-0.5">Automatic deposit release to your original payment method upon return.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#FFF4B8] border border-[#E8E4D8] text-[#292824]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#292824]">Flexible Extensions</h4>
                <p className="text-xs text-[#77736A] mt-0.5">Keep the gear longer whenever stock allows with 1-click self extension.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#FFF4B8] border border-[#E8E4D8] text-[#292824]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#292824]">Complete Accessory Kits</h4>
                <p className="text-xs text-[#77736A] mt-0.5">Cables, chargers, spare batteries, and rugged cases included by default.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F6E58D] border border-[#E8E4D8] flex items-center justify-center font-bold text-sm text-[#292824]">
                R
              </div>
              <span className="text-xl font-bold tracking-tight text-[#292824]">RentEase</span>
            </div>
            <p className="text-xs text-[#77736A] leading-relaxed">
              RentEase is a modern gear and equipment rental platform. Rent gaming consoles, cameras, travel packs, VR headsets, and 4K projectors without upfront ownership costs.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-[#292824] uppercase tracking-wider mb-3">Popular Categories</h5>
            <ul className="space-y-2 text-xs text-[#77736A]">
              <li><Link href="/categories?category=Gaming+Consoles" className="hover:text-[#292824]">Gaming Consoles</Link></li>
              <li><Link href="/categories?category=Cameras" className="hover:text-[#292824]">Cinema & Mirrorless Cameras</Link></li>
              <li><Link href="/categories?category=Travel+Gear" className="hover:text-[#292824]">Travel & Outdoor Gear</Link></li>
              <li><Link href="/categories?category=VR+Equipment" className="hover:text-[#292824]">VR & Mixed Reality</Link></li>
              <li><Link href="/categories?category=Projectors" className="hover:text-[#292824]">Portable Laser Projectors</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-[#292824] uppercase tracking-wider mb-3">Rental Marketplace</h5>
            <ul className="space-y-2 text-xs text-[#77736A]">
              <li><Link href="/my-bookings" className="hover:text-[#292824]">Manage My Booking</Link></li>
              <li><Link href="/admin" className="hover:text-[#292824]">Operator Admin Panel</Link></li>
              <li><span className="text-[#77736A]">Damage Protection Policy</span></li>
              <li><span className="text-[#77736A]">Courier Pickup & Returns</span></li>
              <li><span className="text-[#77736A]">Terms & Security Deposits</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-[#292824] uppercase tracking-wider mb-3">Rental Hub Support</h5>
            <p className="text-xs text-[#77736A] leading-relaxed mb-2">
              Need assistance selecting equipment or planning a multi-day commercial shoot?
            </p>
            <div className="p-3 bg-[#FAF9F4] rounded-lg border border-[#E8E4D8] text-xs">
              <span className="font-semibold text-[#292824] block">Direct Dispatch Support</span>
              <span className="text-[#77736A] block">support@rentease-market.com</span>
              <span className="text-[#77736A] block mt-0.5">Mon–Sat: 8:00 AM – 8:00 PM</span>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-[#E8E4D8] flex flex-col sm:flex-row items-center justify-between text-xs text-[#77736A]">
          <p>© 2026 RentEase Equipment Rental Marketplace. Powered by Next.js & PostgreSQL/Supabase.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>Verified Fleet</span>
            <span>•</span>
            <span>PostgreSQL & Supabase Ready</span>
            <span>•</span>
            <span>Transparent Pricing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
