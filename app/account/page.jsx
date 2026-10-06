'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Shield, Package, Calendar, LogOut, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

export default function AccountPage() {
  const router = useRouter();
  const { user, profile, role, loading, logout, becomeSeller } = useAuth();
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeMsg, setUpgradeMsg] = useState('');

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-xs text-[#77736A]">
        Loading your account profile...
      </div>
    );
  }

  if (!user) {
    router.push('/login?redirect=/account');
    return null;
  }

  const handleBecomeSeller = async () => {
    setUpgrading(true);
    setUpgradeMsg('');
    try {
      await becomeSeller();
      setUpgradeMsg('Congratulations! Your account is now upgraded to Seller. You can list gear and manage rentals.');
    } catch (err) {
      alert(err.message || 'Failed to upgrade to seller.');
    } finally {
      setUpgrading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#292824]">
          My Account
        </h1>
        <p className="text-sm text-[#77736A] mt-1">
          Manage your RentEase profile, membership role, and active rental workflows.
        </p>
      </div>

      {upgradeMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-semibold block">{upgradeMsg}</span>
            <Link href="/seller" className="font-bold underline text-[#292824] mt-1 inline-block">
              Open Seller Dashboard →
            </Link>
          </div>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-[#E8E4D8] p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-[#E8E4D8]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F6E58D] border border-[#E8E4D8] flex items-center justify-center font-bold text-2xl text-[#292824] shadow-subtle">
              {(profile?.name || user.email)?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#292824]">
                {profile?.name || user.email?.split('@')[0]}
              </h2>
              <p className="text-xs text-[#77736A]">{user.email}</p>
            </div>
          </div>
          <div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              role === 'admin' ? 'bg-amber-100 text-amber-900 border-amber-300' :
              role === 'seller' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
              'bg-[#FFF4B8] text-[#292824] border-[#E8E4D8]'
            }`}>
              {role === 'admin' ? 'Platform Admin' : role === 'seller' ? 'Verified Seller' : 'Customer / Renter'}
            </span>
          </div>
        </div>

        {/* Account Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[#FAF9F4] rounded-xl border border-[#E8E4D8]">
            <span className="text-[#77736A] block">User ID</span>
            <span className="font-mono text-[#292824] font-medium truncate block mt-0.5">{user.id}</span>
          </div>
          <div className="p-4 bg-[#FAF9F4] rounded-xl border border-[#E8E4D8]">
            <span className="text-[#77736A] block">Account Status</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Active Supabase Session
            </span>
          </div>
        </div>
      </div>

      {/* Role Actions Card */}
      {role === 'buyer' && (
        <div className="bg-white rounded-2xl border border-[#E8E4D8] p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#FFF4B8] border border-[#E8E4D8] text-[#292824]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#292824]">
                Want to list and rent out your own equipment?
              </h3>
              <p className="text-xs text-[#77736A] mt-1 leading-relaxed">
                As a seller, you can add cameras, gaming consoles, drones, and projectors to RentEase, manage daily rental rates, and track customer bookings.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleBecomeSeller}
              disabled={upgrading}
              className="py-2.5 px-5 rounded-xl bg-[#F6E58D] hover:bg-[#EED977] text-[#292824] font-bold text-xs border border-[#E8E4D8] shadow-subtle transition-colors flex items-center gap-2"
            >
              <span>{upgrading ? 'Upgrading Role...' : 'Upgrade to Seller Account (1-Click)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {role === 'seller' && (
          <Link
            href="/seller"
            className="p-5 bg-white rounded-2xl border border-[#E8E4D8] shadow-card hover:shadow-card-hover transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FAF9F4] border border-[#E8E4D8] text-[#292824]">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#292824]">Seller Dashboard</h4>
                <p className="text-xs text-[#77736A]">Manage inventory & product bookings</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#77736A] group-hover:text-[#292824] transition-colors" />
          </Link>
        )}

        {role === 'admin' && (
          <Link
            href="/admin"
            className="p-5 bg-white rounded-2xl border border-[#E8E4D8] shadow-card hover:shadow-card-hover transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FAF9F4] border border-[#E8E4D8] text-[#292824]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#292824]">Platform Administration</h4>
                <p className="text-xs text-[#77736A]">Full fleet, bookings & revenue telemetry</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#77736A] group-hover:text-[#292824] transition-colors" />
          </Link>
        )}

        <Link
          href="/my-bookings"
          className="p-5 bg-white rounded-2xl border border-[#E8E4D8] shadow-card hover:shadow-card-hover transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FAF9F4] border border-[#E8E4D8] text-[#292824]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#292824]">My Rental Reservations</h4>
              <p className="text-xs text-[#77736A]">View receipt & return status</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#77736A] group-hover:text-[#292824] transition-colors" />
        </Link>
      </div>

      {/* Logout Action */}
      <div className="pt-4 border-t border-[#E8E4D8] flex justify-end">
        <button
          onClick={handleLogout}
          className="py-2 px-4 rounded-xl border border-red-200 text-xs font-semibold text-red-700 bg-white hover:bg-red-50 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of RentEase</span>
        </button>
      </div>

    </div>
  );
}
