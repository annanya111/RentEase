'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import RentalIllustration from '@/components/auth/RentalIllustration';
import LoginForm from '@/components/auth/LoginForm';

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const signupHref = `/signup${redirectUrl && redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`;

  return (
    <div className="relative min-h-screen w-full bg-[#FAF9F4] text-[#17263A] overflow-x-hidden flex flex-col justify-between selection:bg-[#F6E58D] selection:text-[#17263A]">
      
      {/* Subtle Pale-Yellow Abstract Curved Background Shapes */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        {/* Top-left soft warm glow */}
        <div className="absolute -top-32 -left-32 w-[540px] h-[540px] rounded-full bg-[#FFF4B8]/40 blur-3xl" />
        {/* Bottom-right soft golden glow */}
        <div className="absolute -bottom-40 -right-40 w-[640px] h-[640px] rounded-full bg-[#FEF3C7]/40 blur-3xl" />
        {/* Center organic soft curve */}
        <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] rounded-full bg-[#FAF0D4]/30 blur-[100px]" />
        
        {/* Subtle decorative curved background lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-35"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <path
            d="M-100 120 C 300 180, 500 50, 900 120 C 1300 190, 1600 80, 2000 150"
            stroke="#E8E2D0"
            strokeWidth="1.2"
            strokeDasharray="6 6"
          />
          <path
            d="M-50 480 C 400 400, 700 620, 1200 490 C 1600 380, 1900 520, 2200 440"
            stroke="#EFE9DC"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Top Header Row (Logo on Left, Sign Up on Right) */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 flex items-center justify-between z-30">
        
        {/* RentEase Logo */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-10 h-10 rounded-2xl bg-[#F6B51B] border border-[#E8A50B] flex items-center justify-center font-black text-xl text-[#17263A] shadow-xs group-hover:bg-[#FCD34D] transition-all group-hover:scale-105">
            R
          </div>
          <div>
            <div className="text-2xl font-extrabold tracking-tight text-[#17263A] leading-tight">
              Rent<span className="text-[#64748B] font-semibold">Ease</span>
            </div>
            <div className="text-[11px] font-medium text-[#64748B] tracking-wide">
              Rent Today • Use Tomorrow
            </div>
          </div>
        </Link>

        {/* Top Right Action: "Don't have an account? Sign Up" */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs sm:text-sm text-[#64748B] font-medium">
            Don’t have an account?
          </span>
          <Link
            href={signupHref}
            className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#FFF4B8] hover:bg-[#F6E58D] text-[#17263A] text-xs sm:text-sm font-bold border border-[#E8E4D8] shadow-xs transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Two-Column Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT SIDE: Branding Headline & Polished 2D Flat Illustration */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-5 lg:pr-4 text-left order-1">
            
            {/* Main Headline */}
            <div className="space-y-2.5">
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.12] text-[#17263A]">
                Your Things. <br />
                <span className="text-[#D97706] sm:text-[#F6B51B]">Someone Else’s</span> Need.
              </h1>
              <p className="text-sm sm:text-base text-[#64748B] font-normal leading-relaxed max-w-lg">
                Rent what you need. Share what you don’t. <br className="hidden sm:inline" />
                It’s simple, sustainable and smart.
              </p>
            </div>

            {/* Illustration Canvas */}
            <div className="w-full">
              <RentalIllustration />
            </div>

          </div>

          {/* RIGHT SIDE: Large White Rounded Login Card */}
          <div className="lg:col-span-5 flex justify-center items-center order-2 w-full">
            <LoginForm />
          </div>

        </div>
      </main>

      {/* Clean Subtle Footer Bar */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] border-t border-[#E8E4D8]/60 mt-auto">
        <p>© 2026 RentEase Marketplace. Verified Equipment Fleet & Sustainable Sharing.</p>
        <div className="flex items-center gap-4 mt-2 sm:mt-0 text-[11px] text-[#64748B]">
          <span>Secure Supabase Auth</span>
          <span>•</span>
          <span>Flexible Daily Rentals</span>
          <span>•</span>
          <span>Damage Protection</span>
        </div>
      </footer>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#FAF9F4] flex items-center justify-center text-sm font-semibold text-[#64748B]">
          Loading RentEase secure portal...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
