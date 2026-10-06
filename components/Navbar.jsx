'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Package, Menu, X, User, LogOut, PlusCircle, Shield, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, role, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getRoleBadge = () => {
    if (!role) return null;
    if (role === 'admin') {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
          Admin
        </span>
      );
    }
    if (role === 'seller') {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
          Seller
        </span>
      );
    }
    return (
      <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFF4B8] text-[#292824] border border-[#E8E4D8]">
        Renter
      </span>
    );
  };

  if (pathname === '/login') {
    return null;
  }

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

          {/* Desktop Navigation Links based on Auth & Role */}
          <nav className="hidden lg:flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-[#E8E4D8] shadow-subtle">
            {/* Common: Home & Categories */}
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                pathname === '/'
                  ? 'bg-[#F6E58D] text-[#292824] shadow-sm font-semibold'
                  : 'text-[#77736A] hover:text-[#292824] hover:bg-[#FAF9F4]'
              }`}
            >
              Home
            </Link>

            <Link
              href="/categories"
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                pathname.startsWith('/categories')
                  ? 'bg-[#F6E58D] text-[#292824] shadow-sm font-semibold'
                  : 'text-[#77736A] hover:text-[#292824] hover:bg-[#FAF9F4]'
              }`}
            >
              Categories
            </Link>

            {/* Logged Out */}
            {!loading && !user && (
              <Link
                href="/login?redirect=/seller"
                className="px-4 py-2 text-sm font-medium text-[#77736A] hover:text-[#292824] hover:bg-[#FAF9F4] rounded-full transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>List Your Product</span>
              </Link>
            )}

            {/* Buyer: My Bookings */}
            {!loading && user && role === 'buyer' && (
              <Link
                href="/my-bookings"
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  pathname.startsWith('/my-bookings')
                    ? 'bg-[#F6E58D] text-[#292824] shadow-sm font-semibold'
                    : 'text-[#77736A] hover:text-[#292824] hover:bg-[#FAF9F4]'
                }`}
              >
                My Bookings
              </Link>
            )}

            {/* Seller: My Products & Seller Dashboard */}
            {!loading && user && role === 'seller' && (
              <>
                <Link
                  href="/seller"
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    pathname === '/seller'
                      ? 'bg-[#F6E58D] text-[#292824] shadow-sm font-semibold'
                      : 'text-[#77736A] hover:text-[#292824] hover:bg-[#FAF9F4]'
                  }`}
                >
                  My Products
                </Link>
                <Link
                  href="/seller"
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    pathname.startsWith('/seller')
                      ? 'bg-[#F6E58D] text-[#292824] shadow-sm font-semibold'
                      : 'text-[#77736A] hover:text-[#292824] hover:bg-[#FAF9F4]'
                  }`}
                >
                  Seller Dashboard
                </Link>
              </>
            )}

            {/* Admin: Admin Panel */}
            {!loading && user && role === 'admin' && (
              <Link
                href="/admin"
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-1.5 ${
                  pathname.startsWith('/admin')
                    ? 'bg-[#F6E58D] text-[#292824] shadow-sm font-semibold'
                    : 'text-[#77736A] hover:text-[#292824] hover:bg-[#FAF9F4]'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            {/* Authenticated Account Link */}
            {!loading && user && (
              <Link
                href="/account"
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  pathname.startsWith('/account')
                    ? 'bg-[#F6E58D] text-[#292824] shadow-sm font-semibold'
                    : 'text-[#77736A] hover:text-[#292824] hover:bg-[#FAF9F4]'
                }`}
              >
                Account
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-9 bg-gray-100 animate-pulse rounded-lg"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                {getRoleBadge()}
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E8E4D8] bg-white text-xs font-semibold text-[#292824] hover:bg-[#FAF9F4] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#77736A]" />
                  <span className="max-w-[120px] truncate">{profile?.name || user.email?.split('@')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg border border-[#E8E4D8] bg-white text-[#77736A] hover:text-red-700 hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-[#FAF9F4] text-[#292824] border border-[#E8E4D8] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#F6E58D] hover:bg-[#EED977] text-[#292824] border border-[#E8E4D8] shadow-subtle transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
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
        <div className="lg:hidden bg-white border-b border-[#E8E4D8] px-4 pt-3 pb-6 space-y-2 shadow-card">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#292824] hover:bg-[#FAF9F4]"
          >
            Home
          </Link>
          <Link
            href="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#292824] hover:bg-[#FAF9F4]"
          >
            Categories
          </Link>

          {!user ? (
            <>
              <Link
                href="/login?redirect=/seller"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#292824] hover:bg-[#FAF9F4]"
              >
                List Your Product
              </Link>
              <div className="pt-3 border-t border-[#E8E4D8] grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-lg bg-white border border-[#E8E4D8] text-center text-xs font-semibold text-[#292824]"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-lg bg-[#F6E58D] text-center text-xs font-bold text-[#292824] border border-[#E8E4D8]"
                >
                  Sign Up
                </Link>
              </div>
            </>
          ) : (
            <>
              {role === 'buyer' && (
                <Link
                  href="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#292824] hover:bg-[#FAF9F4]"
                >
                  My Bookings
                </Link>
              )}

              {role === 'seller' && (
                <>
                  <Link
                    href="/seller"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#292824] hover:bg-[#FAF9F4]"
                  >
                    My Products
                  </Link>
                  <Link
                    href="/seller"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#292824] hover:bg-[#FAF9F4]"
                  >
                    Seller Dashboard
                  </Link>
                </>
              )}

              {role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-[#292824] hover:bg-[#FAF9F4]"
                >
                  Admin Panel
                </Link>
              )}

              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#292824] hover:bg-[#FAF9F4]"
              >
                Account Settings ({role})
              </Link>

              <div className="pt-2 border-t border-[#E8E4D8]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
