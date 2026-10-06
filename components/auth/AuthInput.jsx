'use client';

import React from 'react';

export default function AuthInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  icon: Icon,
  disabled = false,
  autoComplete,
}) {
  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label className="block text-sm font-semibold text-[#17263A]">
          {label}
        </label>
      )}
      <div className="relative rounded-2xl transition-all duration-200">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#64748B]">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`w-full rounded-2xl border border-[#E2DDD2] bg-[#FAF9F5] py-3.5 text-sm text-[#17263A] placeholder-[#94A3B8] shadow-sm transition-all duration-200 focus:border-[#F6B51B] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#F6B51B]/20 disabled:cursor-not-allowed disabled:opacity-60 ${
            Icon ? 'pl-11 pr-4' : 'px-4'
          }`}
        />
      </div>
    </div>
  );
}
