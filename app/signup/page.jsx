'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const data = await signup(email, password, name);

      // If email confirmation is enabled in Supabase, show confirmation message
      if (data?.session) {
        router.push(redirectUrl);
      } else {
        setSuccessMsg(
          'Account created successfully! If email confirmation is required, please check your inbox to activate your account, then log in.'
        );
      }
    } catch (err) {
      console.error('Signup error:', err);
      let message = err.message || 'Failed to create account.';
      if (message.includes('already registered')) {
        message = 'This email address is already registered. Please log in instead.';
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-2xl border border-[#E8E4D8] p-6 sm:p-8 shadow-card space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-[#F6E58D] border border-[#E8E4D8] text-[#292824] mx-auto flex items-center justify-center font-bold text-xl mb-3 shadow-subtle">
            R
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#292824]">
            Create an Account
          </h1>
          <p className="text-xs text-[#77736A]">
            Join RentEase to reserve gear or list equipment as a seller.
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
            <Link
              href={`/login${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
              className="inline-block mt-2 font-bold text-[#292824] underline"
            >
              Proceed to Login →
            </Link>
          </div>
        )}

        {/* Form */}
        {!successMsg && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#292824] block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Lin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-xl text-sm text-[#292824] focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#292824] block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-xl text-sm text-[#292824] focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#292824] block mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-xl text-sm text-[#292824] focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#292824] block mb-1">Confirm Password</label>
              <input
                type="password"
                required
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-xl text-sm text-[#292824] focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F4] border border-[#E8E4D8] text-[11px] text-[#77736A] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#292824] flex-shrink-0 mt-0.5" />
              <span>
                New accounts start with verified customer rental access. You can list gear as a seller anytime with 1 click from your account.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#F6E58D] hover:bg-[#EED977] text-[#292824] font-bold text-sm border border-[#E8E4D8] shadow-subtle transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Link */}
        <div className="pt-4 border-t border-[#E8E4D8] text-center text-xs text-[#77736A]">
          Already have an account?{' '}
          <Link
            href={`/login${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
            className="font-bold text-[#292824] hover:underline"
          >
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#77736A]">Loading sign up form...</div>}>
      <SignupForm />
    </Suspense>
  );
}
