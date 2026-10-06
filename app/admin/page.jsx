'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  Search, 
  X, 
  RefreshCw,
  Database
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter bookings
  const [statusFilter, setStatusFilter] = useState('All');
  const [bookingSearch, setBookingSearch] = useState('');

  // Add / Edit Product modal
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

  const categories = [
    'Gaming Consoles',
    'Cameras',
    'Travel Gear',
    'VR Equipment',
    'Projectors',
  ];

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, productsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/bookings'),
        fetch('/api/products'),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchAdminData();
      } else {
        alert('Failed to update booking status.');
      }
    } catch (err) {
      alert('Network error updating status.');
    }
  };

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Gaming Consoles',
      pricePerDay: '',
      deposit: '',
      totalStock: 3,
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
        fetchAdminData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save product.');
      }
    } catch (err) {
      alert('Error saving product.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this item from the rental fleet?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAdminData();
      } else {
        alert('Failed to delete product.');
      }
    } catch (err) {
      alert('Error deleting product.');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'All' && b.status !== statusFilter) return false;
    if (bookingSearch.trim() !== '') {
      const q = bookingSearch.toLowerCase().trim();
      return (
        b.id.toLowerCase().includes(q) ||
        (b.customer?.name && b.customer.name.toLowerCase().includes(q)) ||
        (b.customer?.email && b.customer.email.toLowerCase().includes(q)) ||
        (b.productName && b.productName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#FFF4B8] border border-[#E8E4D8] text-xs font-semibold text-[#292824] mb-2">
            Operations & Fleet Control
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#292824]">
            RentEase Admin Dashboard
          </h1>
          <p className="text-sm text-[#77736A] mt-1">
            Manage dispatch statuses, track returns, inspect security deposits, and maintain gear inventory.
          </p>
        </div>
        <button
          onClick={fetchAdminData}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#E8E4D8] text-xs font-semibold text-[#292824] hover:bg-[#FAF9F4] self-start sm:self-auto shadow-subtle"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Database Connection Notice */}
      {stats && (
        <div className="bg-white rounded-xl border border-[#E8E4D8] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-subtle">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#FAF9F4] border border-[#E8E4D8] text-[#292824]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#292824] flex items-center gap-2">
                <span>Active Database Backend:</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                  stats.isSupabaseConnected 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-[#FFF4B8] text-[#292824] border-[#E8E4D8]'
                }`}>
                  {stats.databaseType}
                </span>
              </div>
              <p className="text-[11px] text-[#77736A] mt-0.5">
                {stats.isSupabaseConnected 
                  ? 'All reads and writes are synchronized with live PostgreSQL tables.' 
                  : 'Add your Supabase credentials to .env.local to link cloud PostgreSQL directly. Schema is in supabase/schema.sql.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Overview Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-[#E8E4D8] p-5 shadow-card">
            <div className="flex items-center justify-between text-xs text-[#77736A] mb-1">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-[#292824]" />
            </div>
            <div className="text-2xl font-bold text-[#292824]">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#77736A] mt-1 block">
              Excludes refunded deposits
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#E8E4D8] p-5 shadow-card">
            <div className="flex items-center justify-between text-xs text-[#77736A] mb-1">
              <span>Active Rentals in Field</span>
              <Clock className="w-4 h-4 text-[#292824]" />
            </div>
            <div className="text-2xl font-bold text-[#292824]">
              {stats.activeRentalsCount}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
              Currently dispatched with customers
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#E8E4D8] p-5 shadow-card">
            <div className="flex items-center justify-between text-xs text-[#77736A] mb-1">
              <span>Total Bookings Logged</span>
              <Calendar className="w-4 h-4 text-[#292824]" />
            </div>
            <div className="text-2xl font-bold text-[#292824]">
              {stats.totalBookings}
            </div>
            <span className="text-[11px] text-[#77736A] mt-1 block">
              Historical reservations
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#E8E4D8] p-5 shadow-card">
            <div className="flex items-center justify-between text-xs text-[#77736A] mb-1">
              <span>Fleet Inventory Units</span>
              <Package className="w-4 h-4 text-[#292824]" />
            </div>
            <div className="text-2xl font-bold text-[#292824]">
              {stats.totalUnits} <span className="text-sm font-normal text-[#77736A]">({stats.totalProducts} models)</span>
            </div>
            <span className="text-[11px] text-[#77736A] mt-1 block">
              Across 5 primary categories
            </span>
          </div>
        </div>
      )}

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[#E8E4D8] pb-1">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all border-b-2 ${
            activeTab === 'bookings'
              ? 'border-[#292824] text-[#292824] bg-white'
              : 'border-transparent text-[#77736A] hover:text-[#292824]'
          }`}
        >
          Bookings Management ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all border-b-2 ${
            activeTab === 'inventory'
              ? 'border-[#292824] text-[#292824] bg-white'
              : 'border-transparent text-[#77736A] hover:text-[#292824]'
          }`}
        >
          Fleet Inventory ({products.length})
        </button>
      </div>

      {/* TAB 1: BOOKINGS MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-[#E8E4D8] p-4 shadow-card grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-[#77736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ID, customer name, email, or item..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#FAF9F4] border border-[#E8E4D8] rounded-xl text-[#292824] focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
              />
            </div>

            <div className="md:col-span-6 flex items-center justify-start md:justify-end gap-2 overflow-x-auto">
              {['All', 'Confirmed', 'Active / Picked Up', 'Completed / Returned', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                    statusFilter === status
                      ? 'bg-[#F6E58D] text-[#292824] border-[#E8E4D8]'
                      : 'bg-[#FAF9F4] text-[#77736A] hover:text-[#292824] border-[#E8E4D8]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E4D8] shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F4] border-b border-[#E8E4D8] text-[#77736A] uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Reference & Item</th>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Rental Dates</th>
                    <th className="px-5 py-3.5">Amount / Deposit</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4D8]">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#FAF9F4]/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-mono font-bold text-[#292824]">{b.id}</div>
                        <div className="font-medium text-[#292824] mt-0.5 max-w-[200px] truncate">{b.productName}</div>
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
                          onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                          className="px-2.5 py-1.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-lg text-xs font-medium text-[#292824] focus:outline-none focus:ring-1 focus:ring-[#F6E58D]"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Active / Picked Up">Active / Picked Up</option>
                          <option value="Completed / Returned">Completed / Returned</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-5 py-8 text-center text-[#77736A]">
                        No matching reservations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FLEET INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#292824]">
              Rental Fleet Catalog
            </h2>
            <button
              onClick={handleOpenCreateProduct}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F6E58D] hover:bg-[#EED977] text-[#292824] text-xs font-bold border border-[#E8E4D8] shadow-subtle transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Equipment</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E4D8] shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F4] border-b border-[#E8E4D8] text-[#77736A] uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Equipment Name</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Rate / Day</th>
                    <th className="px-5 py-3.5">Deposit</th>
                    <th className="px-5 py-3.5">Fleet Stock</th>
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
                      <td className="px-5 py-4">
                        <span className="font-semibold text-[#292824]">{p.totalStock} units</span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 rounded-lg bg-white border border-[#E8E4D8] hover:bg-[#FAF9F4] text-[#292824] shadow-subtle"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-white border border-red-200 hover:bg-red-50 text-red-600 shadow-subtle"
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
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E4D8] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E4D8] pb-3">
              <h3 className="text-base font-bold text-[#292824]">
                {editingProduct ? 'Edit Rental Equipment' : 'Add New Rental Equipment'}
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
                  placeholder="e.g. Sony PlayStation 5 Pro"
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
                    className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#292824] block mb-1">Fleet Stock Units *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={productForm.totalStock}
                    onChange={(e) => setProductForm({ ...productForm, totalStock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#292824] block mb-1">Price Per Day ($) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={productForm.pricePerDay}
                    onChange={(e) => setProductForm({ ...productForm, pricePerDay: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
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
                    className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
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
                  className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#292824] block mb-1">Description / Inclusions</label>
                <textarea
                  rows="3"
                  placeholder="Features, accessories, power brick, travel case..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF9F4] border border-[#E8E4D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6E58D]"
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
                  {editingProduct ? 'Update Product' : 'Add to Fleet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
