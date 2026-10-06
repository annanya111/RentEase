'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({
  label = 'Password',
  placeholder = 'Enter your password',
  value,
  onChange,
  required = false,
  disabled = false,
  autoComplete = 'current-password',
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label className="block text-sm font-semibold text-[#17263A]">
          {label}
        </label>
      )}
      <div className="relative rounded-2xl transition-all duration-200">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#64748B]">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className="w-full rounded-2xl border border-[#E2DDD2] bg-[#FAF9F5] py-3.5 pl-11 pr-12 text-sm text-[#17263A] placeholder-[#94A3B8] shadow-sm transition-all duration-200 focus:border-[#F6B51B] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#F6B51B]/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#64748B] hover:text-[#17263A] focus:outline-none focus:ring-2 focus:ring-[#F6B51B] rounded-r-2xl transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
