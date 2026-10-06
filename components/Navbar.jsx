'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Categories' },
    { href: '/my-bookings', label: 'My Booking' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F4]/95 backdrop-blur-sm border-b border-[#E8E4D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link 
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F6E58D] border border-[#E8E4D8] flex items-center justify-center font-bold text-xl text-[#292824] shadow-sm group-hover:bg-[#FFF4B8] transition-colors">
              R
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-[#292824]">
                Rent<span className="text-[#292824]/80 font-semibold">Ease</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-[#FFF4B8] text-[#292824] border border-[#E8E4D8]">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-[#E8E4D8] shadow-subtle">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-150 ${
                    isActive
                      ? 'bg-[#F6E58D] text-[#292824] shadow-sm font-semibold'
                      : 'text-[#77736A] hover:text-[#292824] hover:bg-[#FAF9F4]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & Trust Indicator */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#F6E58D] hover:bg-[#EED977] text-[#292824] border border-[#E8E4D8] shadow-sm transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>Browse Catalog</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-[#E8E4D8] bg-white text-[#292824] hover:bg-[#FAF9F4] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E8E4D8] px-4 pt-2 pb-6 space-y-2 shadow-card">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-[#F6E58D] text-[#292824] font-semibold'
                    : 'text-[#77736A] hover:bg-[#FAF9F4] hover:text-[#292824]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[#E8E4D8]">
            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3 px-4 rounded-lg bg-[#F6E58D] text-[#292824] font-medium text-center shadow-sm"
            >
              Browse All Equipment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
