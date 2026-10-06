'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  Calendar, 
  X, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

export default function SellerPage() {
  const router = useRouter();
  const { user, profile, role, loading: authLoading, becomeSeller } = useAuth();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'bookings'
  const [products, setProducts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Gaming Consoles',
    pricePerDay: '',
    deposit: '',
    totalStock: 1,
    image: '',
    description: '',
  });

  const [upgrading, setUpgrading] = useState(false);

  const categories = [
    'Gaming Consoles',
    'Cameras',
    'Travel Gear',
    'VR Equipment',
    'Projectors',
  ];

  const fetchSellerData = async () => {
    setLoading(true);
    try {
      const [prodsRes, bookingsRes] = await Promise.all([
        fetch('/api/products?owner=me'),
        fetch('/api/bookings?view=seller'),
      ]);

      if (prodsRes.ok) setProducts(await prodsRes.json());
      if (bookingsRes.ok) setBookings(await bookingsRes.json());
    } catch (err) {
      console.error('Failed to load seller data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user && (role === 'seller' || role === 'admin')) {
      fetchSellerData();
    }
  }, [authLoading, user, role]);

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-[#77736A]">
        Verifying seller permissions...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[#FFF4B8] border border-[#E8E4D8] text-[#292824] mx-auto flex items-center justify-center font-bold">
          <Package className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#292824]">Seller Login Required</h2>
        <p className="text-xs text-[#77736A]">
          Please sign in to list your rental gear or view orders for your equipment.
        </p>
        <Link
          href="/login?redirect=/seller"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F6E58D] text-xs font-bold text-[#292824] border border-[#E8E4D8] shadow-subtle"
        >
          <span>Log In to Proceed</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Logged in as buyer
  if (role === 'buyer') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-[#FFF4B8] border border-[#E8E4D8] text-[#292824] mx-auto flex items-center justify-center font-bold shadow-subtle">
          <Sparkles className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#292824]">Ready to become a Seller?</h2>
          <p className="text-xs text-[#77736A] max-w-md mx-auto mt-2 leading-relaxed">
            Your account is currently registered as a customer/renter. To list your equipment for rent, upgrade to a Seller profile with a single click.
          </p>
        </div>
        <div>
          <button
            onClick={async () => {
              setUpgrading(true);
              try {
                await becomeSeller();
                fetchSellerData();
              } catch (e) {
                alert(e.message);
              } finally {
                setUpgrading(false);
              }
            }}
            disabled={upgrading}
            className="px-6 py-3 rounded-xl bg-[#F6E58D] hover:bg-[#EED977] text-xs font-bold text-[#292824] border border-[#E8E4D8] shadow-subtle transition-colors"
          >
            {upgrading ? 'Enabling Seller Mode...' : 'Activate Seller Account (1-Click)'}
          </button>
        </div>
      </div>
    );
  }

  // Seller or Admin
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Gaming Consoles',
      pricePerDay: '',
      deposit: '',
      totalStock: 1,
      image: '',
      description: '',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      pricePerDay: prod.pricePerDay,
      deposit: prod.deposit,
      totalStock: prod.totalStock,
      image: prod.image,
      description: prod.description || '',
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm),
      });

      if (res.ok) {
        setIsProductModalOpen(false);
        fetchSellerData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save product.');
      }
    } catch (err) {
      alert('Network error saving product.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSellerData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete product.');
      }
    } catch (err) {
      alert('Error deleting product.');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchSellerData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update status.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold mb-2">
            Seller Fleet & Bookings
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#292824]">
            Seller Dashboard
          </h1>
          <p className="text-sm text-[#77736A] mt-1">
            List and manage your rental equipment and monitor incoming customer reservations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchSellerData}
            className="p-2 rounded-lg bg-white border border-[#E8E4D8] text-xs font-semibold text-[#292824] hover:bg-[#FAF9F4] shadow-subtle"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenCreateProduct}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#F6E58D] hover:bg-[#EED977] text-[#292824] text-xs font-bold border border-[#E8E4D8] shadow-subtle transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>List New Equipment</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#E8E4D8] p-5 shadow-card">
          <span className="text-xs text-[#77736A] block">My Active Listings</span>
          <span className="text-2xl font-bold text-[#292824] block mt-1">{products.length} models</span>
          <span className="text-[11px] text-[#77736A] block mt-1">Available in catalog</span>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E4D8] p-5 shadow-card">
          <span className="text-xs text-[#77736A] block">Customer Bookings for My Gear</span>
          <span className="text-2xl font-bold text-[#292824] block mt-1">{bookings.length} reservations</span>
          <span className="text-[11px] text-emerald-700 font-medium block mt-1">Tracked under your account</span>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E4D8] p-5 shadow-card">
          <span className="text-xs text-[#77736A] block">Owner ID</span>
          <span className="font-mono text-xs text-[#292824] truncate block mt-1">{user.id}</span>
          <span className="text-[11px] text-[#77736A] block mt-1">Bound to all your listings</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E4D8] pb-1">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all border-b-2 ${
            activeTab === 'inventory'
              ? 'border-[#292824] text-[#292824] bg-white'
              : 'border-transparent text-[#77736A] hover:text-[#292824]'
          }`}
        >
          My Listed Gear ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all border-b-2 ${
            activeTab === 'bookings'
              ? 'border-[#292824] text-[#292824] bg-white'
              : 'border-transparent text-[#77736A] hover:text-[#292824]'
          }`}
        >
          Customer Bookings ({bookings.length})
        </button>
      </div>

      {/* Tab 1: Inventory */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {products.length > 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8E4D8] shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F4] border-b border-[#E8E4D8] text-[#77736A] uppercase font-semibold">
                    <tr>
                      <th className="px-5 py-3.5">Equipment Name</th>
                      <th className="px-5 py-3.5">Category</th>
                      <th className="px-5 py-3.5">Rate / Day</th>
                      <th className="px-5 py-3.5">Deposit</th>
                      <th className="px-5 py-3.5">Units</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E4D8]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF9F4]/40 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg object-cover border border-[#E8E4D8] bg-[#FAF9F4]"
                            />
                            <div>
                              <div className="font-semibold text-[#292824]">{p.name}</div>
                              <div className="text-[11px] text-[#77736A] line-clamp-1">{p.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded bg-[#FAF9F4] border border-[#E8E4D8] text-[#292824] font-medium">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-bold text-[#292824]">
                          ${p.pricePerDay}
                        </td>
                        <td className="px-5 py-4 text-[#77736A]">
                          ${p.deposit}
                        </td>
                        <td className="px-5 py-4 font-semibold text-[#292824]">
                          {p.totalStock} units
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 rounded-lg bg-white border border-[#E8E4D8] hover:bg-[#FAF9F4] text-[#292824]"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg bg-white border border-red-200 hover:bg-red-50 text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E8E4D8] p-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF4B8] border border-[#E8E4D8] text-[#292824] mx-auto flex items-center justify-center font-bold">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#292824]">No equipment listed yet</h3>
              <p className="text-xs text-[#77736A]">
                You haven't listed any equipment for rent. Add your first item to start earning rental fees!
              </p>
              <button
                onClick={handleOpenCreateProduct}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#F6E58D] hover:bg-[#EED977] text-[#292824] border border-[#E8E4D8]"
              >
                List Your First Item
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length > 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8E4D8] shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F4] border-b border-[#E8E4D8] text-[#77736A] uppercase font-semibold">
                    <tr>
                      <th className="px-5 py-3.5">Reference & Item</th>
                      <th className="px-5 py-3.5">Customer</th>
                      <th className="px-5 py-3.5">Rental Dates</th>
                      <th className="px-5 py-3.5">Total Paid</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E4D8]">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#FAF9F4]/40 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-mono font-bold text-[#292824]">{b.id}</div>
                          <div className="font-semibold text-[#292824] mt-0.5">{b.productName}</div>
                          <div className="text-[11px] text-[#77736A]">{b.deliveryMethod}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-[#292824]">{b.customer?.name}</div>
                          <div className="text-[11px] text-[#77736A]">{b.customer?.email}</div>
                          <div className="text-[11px] text-[#77736A]">{b.customer?.phone}</div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="font-medium text-[#292824]">{b.startDate} → {b.endDate}</div>
                          <div className="text-[11px] text-[#77736A]">{b.days} days duration</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-[#292824]">${b.total}</div>
                          <div className="text-[11px] text-emerald-800">${b.deposit} deposit</div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                            b.status === 'Confirmed' ? 'bg-[#FFF4B8] text-[#292824] border-[#E8E4D8]' :
                            b.status === 'Active / Picked Up' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
                            b.status === 'Completed / Returned' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                            className="px-2.5 py-1.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-lg text-xs font-medium text-[#292824]"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Active / Picked Up">Active / Picked Up</option>
                            <option value="Completed / Returned">Completed / Returned</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E8E4D8] p-12 text-center max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FFF4B8] border border-[#E8E4D8] text-[#292824] mx-auto flex items-center justify-center font-bold">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#292824]">No bookings yet</h3>
              <p className="text-xs text-[#77736A]">
                When customers reserve your listed equipment, reservations will show up here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E4D8] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E4D8] pb-3">
              <h3 className="text-base font-bold text-[#292824]">
                {editingProduct ? 'Edit Rental Listing' : 'List New Rental Equipment'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-[#77736A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#292824] block mb-1">Equipment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony Alpha A7 IV Kit"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#292824] block mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-lg"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#292824] block mb-1">Stock Units *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={productForm.totalStock}
                    onChange={(e) => setProductForm({ ...productForm, totalStock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#292824] block mb-1">Daily Rental Price ($) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={productForm.pricePerDay}
                    onChange={(e) => setProductForm({ ...productForm, pricePerDay: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#292824] block mb-1">Deposit ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Defaults to 5x daily price"
                    value={productForm.deposit}
                    onChange={(e) => setProductForm({ ...productForm, deposit: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#292824] block mb-1">Photo Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-[#292824] block mb-1">Description & Inclusions</label>
                <textarea
                  rows="3"
                  placeholder="Included accessories, condition, batteries..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-lg"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-2 font-semibold bg-white border border-[#E8E4D8] rounded-lg hover:bg-[#FAF9F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 font-semibold bg-[#F6E58D] text-[#292824] rounded-lg hover:bg-[#EED977] border border-[#E8E4D8]"
                >
                  {editingProduct ? 'Update Listing' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
