'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import AuthInput from './AuthInput';
import PasswordInput from './PasswordInput';
import SignupPrompt from './SignupPrompt';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotMsg, setForgotMsg] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setForgotMsg(false);
    setLoading(true);

    try {
      await login(email, password);
      router.push(redirectUrl);
    } catch (err) {
      console.error('Login error:', err);
      let message = err.message || 'Failed to log in.';
      if (message.includes('Invalid login credentials')) {
        message = 'Invalid email or password. Please verify your credentials.';
      } else if (message.includes('Email not confirmed')) {
        message = 'Please check your inbox to confirm your email before logging in.';
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[560px] mx-auto animate-fade-slide-up">
      <div className="bg-white rounded-[28px] border border-[#E8E4D8]/80 p-7 sm:p-10 lg:p-12 shadow-[0_12px_40px_rgba(23,38,58,0.04)] space-y-7">
        
        {/* Top of Card Header */}
        <div className="text-left space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[#FFF4B8] border border-[#F6E58D] text-lg shadow-xs mb-1 select-none">
            👋
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17263A] tracking-tight">
            Welcome Back!
          </h2>
          <p className="text-sm text-[#64748B]">
            Log in to your RentEase account
          </p>
        </div>

        {/* Friendly Error Banner */}
        {errorMsg && (
          <div className="p-3.5 bg-red-50/90 border border-red-200 text-red-800 rounded-2xl text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Forgot Password Notice if clicked */}
        {forgotMsg && (
          <div className="p-3.5 bg-amber-50/90 border border-amber-200 text-amber-900 rounded-2xl text-xs flex items-center justify-between gap-2">
            <span>Password reset instructions can be sent to your registered email address.</span>
            <button
              type="button"
              onClick={() => setForgotMsg(false)}
              className="text-amber-800 hover:text-amber-950 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            icon={Mail}
            autoComplete="email"
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            autoComplete="current-password"
          />

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
            <label className="flex items-center gap-2 text-[#17263A] font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#F6B51B] focus:ring-[#F6B51B] border-[#D1CCC0] accent-[#F6B51B]"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => setForgotMsg(true)}
              className="font-semibold text-[#64748B] hover:text-[#17263A] transition-colors focus:outline-none"
            >
              Forgot password?
            </button>
          </div>

          {/* Large Full-Width Yellow Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-[#F6B51B] hover:bg-[#E8A50B] active:bg-[#D49405] text-[#17263A] font-bold text-base shadow-sm transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2.5 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Logging In...</span>
              </>
            ) : (
              <>
                <span>Log In</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Divider: ---------------- OR ---------------- */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E8E4D8]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-[#94A3B8] font-semibold tracking-wider">
              OR
            </span>
          </div>
        </div>

        {/* Premium Sign-up Prompt */}
        <SignupPrompt redirectUrl={redirectUrl} />

      </div>
    </div>
  );
}
