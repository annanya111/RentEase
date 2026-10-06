'use client';

import React from 'react';
import Link from 'next/link';
import { User, ArrowRight } from 'lucide-react';

export default function SignupPrompt({ redirectUrl = '/' }) {
  const signupHref = `/signup${redirectUrl && redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`;

  return (
    <Link
      href={signupHref}
      className="group block w-full rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FEF3C7] hover:shadow-sm"
    >
      <div className="flex items-center justify-between gap-3.5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#F6B51B]/25 text-[#B45309] shadow-xs group-hover:bg-[#F6B51B]/35 transition-colors">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#17263A] group-hover:text-black transition-colors">
              New to RentEase?
            </h4>
            <p className="text-xs text-[#64748B]">
              Create your account and start renting today.
            </p>
          </div>
        </div>

        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/80 text-[#17263A] transition-transform duration-200 group-hover:translate-x-1 group-hover:bg-white shadow-xs">
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
