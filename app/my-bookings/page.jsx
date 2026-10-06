'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Calendar, CheckCircle2, Clock, X, FileText, ArrowRight, Printer } from 'lucide-react';

export default function MyBookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState(null);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of plans');
  const [cancelStatusMsg, setCancelStatusMsg] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      b.id.toLowerCase().includes(q) ||
      (b.customer?.name && b.customer.name.toLowerCase().includes(q)) ||
      (b.customer?.email && b.customer.email.toLowerCase().includes(q)) ||
      (b.productName && b.productName.toLowerCase().includes(q))
    );
  });

  const handleCancelBooking = async (bookingId) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason }),
      });

      if (res.ok) {
        setCancelStatusMsg('Booking successfully cancelled. Refund initiated.');
        setCancellingBookingId(null);
        fetchBookings();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to cancel booking.');
      }
    } catch (err) {
      alert('Error cancelling booking.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF4B8] text-[#292824] border border-[#E8E4D8]">
            <Clock className="w-3.5 h-3.5" /> Confirmed Reservation
          </span>
        );
      case 'Active / Picked Up':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Rental in Progress
          </span>
        );
      case 'Completed / Returned':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FAF9F4] text-[#77736A] border border-[#E8E4D8]">
            Returned & Deposit Released
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-800 border border-red-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FAF9F4] text-[#292824] border border-[#E8E4D8]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#292824]">
            My Rental Bookings
          </h1>
          <p className="text-sm text-[#77736A] mt-1">
            Track active reservations, view equipment receipts, or manage rental extensions.
          </p>
        </div>
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-lg bg-[#F6E58D] hover:bg-[#EED977] text-[#292824] text-xs font-bold border border-[#E8E4D8] shadow-subtle transition-colors"
        >
          <span>Rent More Gear</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Search by Reference or Email */}
      <div className="bg-white rounded-2xl border border-[#E8E4D8] p-4 shadow-card">
        <div className="relative">
          <Search className="w-4 h-4 text-[#77736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Booking ID (e.g. RE-2026-8419), customer name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF9F4] border border-[#E8E4D8] rounded-xl text-[#292824] focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
          />
        </div>
      </div>

      {cancelStatusMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {cancelStatusMsg}
          </span>
          <button onClick={() => setCancelStatusMsg('')} className="text-[#77736A] hover:text-[#292824]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bookings List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#77736A]">
          Loading reservations...
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-[#E8E4D8] p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all space-y-4"
            >
              {/* Header row: ID & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E8E4D8]">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#FAF9F4] border border-[#E8E4D8] font-mono text-xs font-bold text-[#292824]">
                    {b.id}
                  </span>
                  <span className="text-xs text-[#77736A]">
                    Reserved on {new Date(b.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div>{getStatusBadge(b.status)}</div>
              </div>

              {/* Product and Rental Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Product Summary */}
                <div className="md:col-span-5 flex items-center gap-4">
                  <img
                    src={b.productImage}
                    alt={b.productName}
                    className="w-20 h-20 rounded-xl object-cover border border-[#E8E4D8] flex-shrink-0 bg-[#FAF9F4]"
                  />
                  <div>
                    <span className="text-[11px] font-medium text-[#77736A] block">
                      {b.productCategory}
                    </span>
                    <h3 className="text-base font-bold text-[#292824]">
                      {b.productName}
                    </h3>
                    <p className="text-xs text-[#77736A] mt-1">
                      Fulfillment: <span className="text-[#292824] font-medium">{b.deliveryMethod}</span>
                    </p>
                  </div>
                </div>

                {/* Rental Period */}
                <div className="md:col-span-3 space-y-1">
                  <span className="text-[11px] font-semibold text-[#77736A] uppercase tracking-wider block">
                    Rental Duration
                  </span>
                  <div className="text-xs font-semibold text-[#292824]">
                    {b.startDate} → {b.endDate}
                  </div>
                  <div className="text-xs text-[#77736A]">
                    {b.days} {b.days === 1 ? 'day' : 'days'} ({b.pricePerDay ? `$${b.pricePerDay}/day` : ''})
                  </div>
                </div>

                {/* Pricing & Deposit */}
                <div className="md:col-span-2 space-y-1">
                  <span className="text-[11px] font-semibold text-[#77736A] uppercase tracking-wider block">
                    Total Charged
                  </span>
                  <div className="text-base font-bold text-[#292824]">
                    ${b.total}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    ${b.deposit} deposit
                  </div>
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedBookingForReceipt(b)}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-white hover:bg-[#FAF9F4] text-[#292824] border border-[#E8E4D8] shadow-subtle transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Receipt</span>
                  </button>

                  {b.status === 'Confirmed' && (
                    <button
                      onClick={() => setCancellingBookingId(b.id)}
                      className="w-full py-2 px-3 text-xs font-medium rounded-lg bg-white hover:bg-red-50 text-red-700 border border-red-200 transition-colors"
                    >
                      Cancel Rental
                    </button>
                  )}
                </div>

              </div>

              {/* Customer Contact Footer */}
              <div className="pt-3 border-t border-[#E8E4D8] flex flex-wrap items-center justify-between text-xs text-[#77736A]">
                <div>
                  Customer: <span className="font-semibold text-[#292824]">{b.customer?.name}</span> ({b.customer?.email})
                </div>
                {b.customer?.address && b.customer.address !== 'Store Pickup' && (
                  <div>
                    Delivery to: <span className="text-[#292824]">{b.customer.address}</span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-[#E8E4D8] p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF4B8] border border-[#E8E4D8] text-[#292824] mx-auto flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#292824]">No bookings found</h3>
            <p className="text-xs text-[#77736A] mt-1">
              You haven't reserved any rental gear yet or no records match your query.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-block px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#F6E58D] hover:bg-[#EED977] text-[#292824] border border-[#E8E4D8] shadow-subtle transition-colors"
          >
            Browse Available Inventory
          </Link>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E4D8] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#292824]">Cancel Reservation?</h3>
              <button onClick={() => setCancellingBookingId(null)} className="text-[#77736A]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#77736A] leading-relaxed">
              Are you sure you want to cancel booking <strong className="text-[#292824]">{cancellingBookingId}</strong>?
              Under our policy, full rental fees and security deposits are 100% refunded when cancelled prior to dispatch.
            </p>
            <div>
              <label className="text-xs font-semibold text-[#292824] block mb-1">Reason for cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2 text-xs border border-[#E8E4D8] rounded-lg bg-[#FAF9F4]"
              >
                <option value="Change of plans">Change of plans / event postponed</option>
                <option value="Found alternative equipment">Found alternative equipment</option>
                <option value="Need different rental dates">Need different rental dates</option>
                <option value="Accidental booking">Accidental reservation</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancellingBookingId(null)}
                className="flex-1 py-2 text-xs font-semibold bg-white border border-[#E8E4D8] rounded-lg hover:bg-[#FAF9F4]"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancelBooking(cancellingBookingId)}
                className="flex-1 py-2 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedBookingForReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E4D8] max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#E8E4D8] pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F6E58D] border border-[#E8E4D8] flex items-center justify-center font-bold text-sm text-[#292824]">
                  R
                </div>
                <span className="text-xl font-bold tracking-tight text-[#292824]">RentEase Rental Invoice</span>
              </div>
              <button onClick={() => setSelectedBookingForReceipt(null)} className="text-[#77736A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#77736A] block">Reference</span>
                <span className="font-mono font-bold text-sm text-[#292824]">{selectedBookingForReceipt.id}</span>
              </div>
              <div>
                <span className="text-[#77736A] block">Status</span>
                <span className="font-semibold text-[#292824]">{selectedBookingForReceipt.status}</span>
              </div>
              <div>
                <span className="text-[#77736A] block">Customer</span>
                <span className="font-semibold text-[#292824]">{selectedBookingForReceipt.customer?.name}</span>
                <span className="text-[#77736A] block">{selectedBookingForReceipt.customer?.email}</span>
              </div>
              <div>
                <span className="text-[#77736A] block">Fulfillment</span>
                <span className="font-semibold text-[#292824]">{selectedBookingForReceipt.deliveryMethod}</span>
              </div>
            </div>

            <div className="border border-[#E8E4D8] rounded-xl p-4 bg-[#FAF9F4] text-xs space-y-2">
              <div className="font-semibold text-sm text-[#292824] mb-2">{selectedBookingForReceipt.productName}</div>
              <div className="flex justify-between text-[#77736A]">
                <span>Rental Dates</span>
                <span className="font-medium text-[#292824]">{selectedBookingForReceipt.startDate} to {selectedBookingForReceipt.endDate}</span>
              </div>
              <div className="flex justify-between text-[#77736A]">
                <span>Duration</span>
                <span className="font-medium text-[#292824]">{selectedBookingForReceipt.days} days @ ${selectedBookingForReceipt.pricePerDay}/day</span>
              </div>
              <div className="flex justify-between text-[#77736A]">
                <span>Rental Subtotal</span>
                <span className="font-medium text-[#292824]">${selectedBookingForReceipt.rentalSubtotal}</span>
              </div>
              <div className="flex justify-between text-[#77736A]">
                <span>Inspection & Cleaning Fee</span>
                <span className="font-medium text-[#292824]">${selectedBookingForReceipt.serviceFee}</span>
              </div>
              <div className="flex justify-between text-[#77736A]">
                <span>Security Deposit (Refundable)</span>
                <span className="font-medium text-emerald-800">${selectedBookingForReceipt.deposit}</span>
              </div>
              <div className="pt-2 border-t border-[#E8E4D8] flex justify-between font-bold text-sm text-[#292824]">
                <span>Total Paid</span>
                <span>${selectedBookingForReceipt.total}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#77736A] leading-relaxed">
              * Equipment must be returned with all original cables, adapters, and accessories listed in the checklist. Deposit release is dispatched within 24 hours of bench return check.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 text-xs font-semibold bg-white border border-[#E8E4D8] rounded-lg hover:bg-[#FAF9F4] flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setSelectedBookingForReceipt(null)}
                className="flex-1 py-2 text-xs font-semibold bg-[#F6E58D] text-[#292824] rounded-lg hover:bg-[#EED977]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
