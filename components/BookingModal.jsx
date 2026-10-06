'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Calendar, ShieldCheck, Check, AlertCircle, Clock, Truck, MapPin, ArrowRight } from 'lucide-react';

export default function BookingModal({ product, onClose, onBookingSuccess }) {
  if (!product) return null;

  const getTomorrowDateStr = (addDays = 1) => {
    const d = new Date();
    d.setDate(d.getDate() + addDays);
    return d.toISOString().split('T')[0];
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(getTomorrowDateStr(1));
  const [endDate, setEndDate] = useState(getTomorrowDateStr(4));
  const [deliveryMethod, setDeliveryMethod] = useState('Doorstep Delivery');
  
  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');

  // States
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const computeDays = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, isNaN(diff) ? 1 : diff);
  };

  const days = computeDays(startDate, endDate);
  const subtotal = days * product.pricePerDay;
  const deposit = product.deposit || Math.round(product.pricePerDay * 5);
  const serviceFee = Math.max(8, Math.round(subtotal * 0.1));
  const total = subtotal + deposit + serviceFee;

  // Real-time availability check when dates change
  useEffect(() => {
    if (!startDate || !endDate) return;
    if (new Date(endDate) < new Date(startDate)) {
      setErrorMessage('End date cannot be earlier than start date.');
      return;
    }

    setErrorMessage('');
    setIsCheckingAvailability(true);

    fetch('/api/check-availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        startDate,
        endDate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAvailabilityData(data);
        setIsCheckingAvailability(false);
      })
      .catch((err) => {
        console.error('Availability check failed:', err);
        setIsCheckingAvailability(false);
      });
  }, [product.id, startDate, endDate]);

  const handleStartDateChange = (e) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    if (new Date(endDate) <= new Date(newStart)) {
      const nextDay = new Date(newStart);
      nextDay.setDate(nextDay.getDate() + 2);
      setEndDate(nextDay.toISOString().split('T')[0]);
    }
  };

  const handleEndDateChange = (e) => {
    const newEnd = e.target.value;
    setEndDate(newEnd);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMessage('Please provide your name and email address.');
      return;
    }

    if (availabilityData && !availabilityData.isAvailable) {
      setErrorMessage('This item is fully booked for the selected date range. Please choose another date.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          startDate,
          endDate,
          deliveryMethod,
          notes,
          customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            address: customerAddress || (deliveryMethod === 'Store Pickup' ? 'Store Pickup' : 'Standard Address'),
          },
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit booking reservation.');
      }

      setConfirmedBooking(result);
      if (onBookingSuccess) {
        onBookingSuccess(result);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong while booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative bg-white rounded-2xl border border-[#E8E4D8] shadow-2xl max-w-2xl w-full overflow-hidden text-[#292824]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E4D8] flex items-center justify-between bg-[#FAF9F4]">
          <div>
            <h2 className="text-lg font-bold text-[#292824]">
              {confirmedBooking ? 'Reservation Confirmed' : 'Book Rental Equipment'}
            </h2>
            <p className="text-xs text-[#77736A]">
              {confirmedBooking 
                ? 'Your rental contract is generated in PostgreSQL / Supabase.' 
                : 'Zero hidden fees • Free cancellation up to 24h before rental'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#77736A] hover:text-[#292824] hover:bg-white border border-transparent hover:border-[#E8E4D8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Confirmed State */}
        {confirmedBooking ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-[#FAF9F4] border border-[#E8E4D8] rounded-xl p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-[#F6E58D] border border-[#E8E4D8] text-[#292824] mx-auto flex items-center justify-center font-bold mb-3">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#77736A] block">
                Booking Reference
              </span>
              <span className="text-2xl font-mono font-bold text-[#292824] tracking-tight">
                {confirmedBooking.id}
              </span>
              <p className="text-xs text-[#77736A] mt-1">
                A confirmation summary has been registered for {confirmedBooking.customer?.email}.
              </p>
            </div>

            <div className="border border-[#E8E4D8] rounded-xl p-5 space-y-3 bg-white">
              <div className="flex items-center gap-4">
                <img
                  src={confirmedBooking.productImage}
                  alt={confirmedBooking.productName}
                  className="w-16 h-16 rounded-lg object-cover border border-[#E8E4D8]"
                />
                <div>
                  <h4 className="font-semibold text-sm text-[#292824]">{confirmedBooking.productName}</h4>
                  <p className="text-xs text-[#77736A]">{confirmedBooking.productCategory}</p>
                  <p className="text-xs text-[#292824] font-medium mt-1">
                    {confirmedBooking.startDate} → {confirmedBooking.endDate} ({confirmedBooking.days} {confirmedBooking.days === 1 ? 'day' : 'days'})
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E4D8] grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#77736A] block">Customer</span>
                  <span className="font-medium text-[#292824]">{confirmedBooking.customer?.name}</span>
                </div>
                <div>
                  <span className="text-[#77736A] block">Delivery Method</span>
                  <span className="font-medium text-[#292824]">{confirmedBooking.deliveryMethod}</span>
                </div>
                <div>
                  <span className="text-[#77736A] block">Rental Total Paid</span>
                  <span className="font-bold text-[#292824]">${confirmedBooking.total}</span>
                </div>
                <div>
                  <span className="text-[#77736A] block">Refundable Security Deposit</span>
                  <span className="font-medium text-emerald-700">${confirmedBooking.deposit} (Refundable)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/my-bookings"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#F6E58D] hover:bg-[#EED977] text-[#292824] font-semibold text-sm border border-[#E8E4D8] shadow-subtle transition-colors text-center"
              >
                Go to My Bookings
              </Link>
            </div>
          </div>
        ) : (
          /* Reservation Form */
          <form onSubmit={handleSubmitBooking} className="p-6 space-y-6">
            
            {/* Selected Product Quick Header */}
            <div className="flex items-center gap-4 p-3 bg-[#FAF9F4] rounded-xl border border-[#E8E4D8]">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover border border-[#E8E4D8] flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-white text-[#77736A] border border-[#E8E4D8]">
                  {product.category}
                </span>
                <h4 className="font-semibold text-sm text-[#292824] truncate mt-1">
                  {product.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-[#77736A] mt-0.5">
                  <span className="font-bold text-[#292824]">${product.pricePerDay} / day</span>
                  <span>•</span>
                  <span>${product.deposit} refundable deposit</span>
                </div>
              </div>
            </div>

            {/* Date Pickers */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#292824] uppercase tracking-wider block">
                Rental Dates
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-[#77736A] block mb-1">Start Date</span>
                  <input
                    type="date"
                    min={todayStr}
                    value={startDate}
                    onChange={handleStartDateChange}
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E8E4D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E58D] text-[#292824]"
                  />
                </div>
                <div>
                  <span className="text-xs text-[#77736A] block mb-1">End / Return Date</span>
                  <input
                    type="date"
                    min={startDate}
                    value={endDate}
                    onChange={handleEndDateChange}
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E8E4D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E58D] text-[#292824]"
                  />
                </div>
              </div>

              {/* Availability Notice */}
              <div className="pt-1">
                {isCheckingAvailability ? (
                  <p className="text-xs text-[#77736A] flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    Checking real-time calendar availability...
                  </p>
                ) : availabilityData ? (
                  availabilityData.isAvailable ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 rounded-md px-3 py-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Available for this period ({availabilityData.availableStock} of {availabilityData.totalStock} units free).</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Fully booked for these dates. Please choose an alternative start/end date.</span>
                    </div>
                  )
                ) : null}
              </div>
            </div>

            {/* Delivery or Store Pickup */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#292824] uppercase tracking-wider block">
                Fulfillment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('Doorstep Delivery')}
                  className={`p-3 text-left rounded-xl border transition-all text-xs flex flex-col gap-1 ${
                    deliveryMethod === 'Doorstep Delivery'
                      ? 'bg-[#FFF4B8]/40 border-[#292824] shadow-subtle'
                      : 'bg-white border-[#E8E4D8] hover:bg-[#FAF9F4]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-[#292824]">
                    <Truck className="w-4 h-4" /> Doorstep Delivery
                  </div>
                  <span className="text-[#77736A] text-[11px]">Free delivery & return courier pickup</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('Store Pickup')}
                  className={`p-3 text-left rounded-xl border transition-all text-xs flex flex-col gap-1 ${
                    deliveryMethod === 'Store Pickup'
                      ? 'bg-[#FFF4B8]/40 border-[#292824] shadow-subtle'
                      : 'bg-white border-[#E8E4D8] hover:bg-[#FAF9F4]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-[#292824]">
                    <MapPin className="w-4 h-4" /> Store Pickup
                  </div>
                  <span className="text-[#77736A] text-[11px]">Same-day ready at local equipment depot</span>
                </button>
              </div>
            </div>

            {/* Customer Contact */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-[#292824] uppercase tracking-wider block">
                Customer Information
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-[#77736A] block mb-1">Full Name *</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Lin"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E8E4D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
                  />
                </div>
                <div>
                  <span className="text-xs text-[#77736A] block mb-1">Email Address *</span>
                  <input
                    type="email"
                    required
                    placeholder="e.g. maya@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E8E4D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-[#77736A] block mb-1">Phone Number</span>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E8E4D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
                  />
                </div>
                <div>
                  <span className="text-xs text-[#77736A] block mb-1">
                    {deliveryMethod === 'Doorstep Delivery' ? 'Delivery Address' : 'Pickup Note'}
                  </span>
                  <input
                    type="text"
                    placeholder={deliveryMethod === 'Doorstep Delivery' ? 'Street, Apt, City, Zip' : 'Approximate arrival time'}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E8E4D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
                  />
                </div>
              </div>
            </div>

            {/* Price Breakdown Card */}
            <div className="bg-[#FAF9F4] rounded-xl border border-[#E8E4D8] p-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#77736A]">
                <span>Rental Rate ({days} {days === 1 ? 'day' : 'days'} × ${product.pricePerDay})</span>
                <span className="font-semibold text-[#292824]">${subtotal}</span>
              </div>
              <div className="flex justify-between text-[#77736A]">
                <span className="flex items-center gap-1">
                  Equipment Inspection & Preparation Fee
                </span>
                <span className="font-semibold text-[#292824]">${serviceFee}</span>
              </div>
              <div className="flex justify-between text-[#77736A]">
                <span className="flex items-center gap-1 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" /> Refundable Security Deposit
                </span>
                <span className="font-semibold text-emerald-800">${deposit}</span>
              </div>
              <div className="pt-2 border-t border-[#E8E4D8] flex justify-between items-baseline text-sm">
                <span className="font-bold text-[#292824]">Estimated Total</span>
                <span className="text-lg font-bold text-[#292824]">${total}</span>
              </div>
              <p className="text-[11px] text-[#77736A] pt-1">
                * Security deposit of ${deposit} is fully released to your original payment method within 24 hours of gear return.
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 text-xs font-semibold rounded-lg bg-white hover:bg-[#FAF9F4] text-[#292824] border border-[#E8E4D8] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (availabilityData && !availabilityData.isAvailable)}
                className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-subtle ${
                  availabilityData && !availabilityData.isAvailable
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                    : 'bg-[#F6E58D] hover:bg-[#EED977] text-[#292824] border border-[#E8E4D8]'
                }`}
              >
                {isSubmitting ? (
                  <span>Reserving Equipment...</span>
                ) : (
                  <>
                    <span>Confirm Rental Reservation (${total})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
