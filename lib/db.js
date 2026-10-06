import fs from 'fs';
import path from 'path';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

// Local helpers
function readJSON(file, fallback = []) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return fallback;
  }
}

function writeJSON(file, data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
    return false;
  }
}

function isDateOverlap(start1, end1, start2, end2) {
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();
  return Math.max(s1, s2) <= Math.min(e1, e2);
}

function calculateRentalDays(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  const diffTime = e.getTime() - s.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, isNaN(diffDays) ? 1 : diffDays);
}

// Convert DB snake_case product to App camelCase
function mapProductFromDB(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    pricePerDay: Number(row.price_per_day || row.pricePerDay),
    deposit: Number(row.deposit),
    totalStock: Number(row.total_stock ?? row.totalStock ?? 1),
    rating: Number(row.rating || 5.0),
    reviewCount: Number(row.review_count ?? row.reviewCount ?? 0),
    image: row.image,
    description: row.description,
    features: row.features || [],
    specs: row.specs || {},
    isAvailable: row.is_available ?? row.isAvailable ?? true,
    createdAt: row.created_at || row.createdAt,
  };
}

// Convert DB snake_case booking to App camelCase
function mapBookingFromDB(row) {
  if (!row) return null;
  return {
    id: row.id,
    productId: row.product_id || row.productId,
    productName: row.product_name || row.productName,
    productCategory: row.product_category || row.productCategory,
    productImage: row.product_image || row.productImage,
    customer: {
      name: row.customer_name || row.customer?.name || 'Anonymous',
      email: row.customer_email || row.customer?.email || 'N/A',
      phone: row.customer_phone || row.customer?.phone || 'N/A',
      address: row.customer_address || row.customer?.address || 'Pickup at store',
    },
    startDate: row.start_date ? String(row.start_date).split('T')[0] : row.startDate,
    endDate: row.end_date ? String(row.end_date).split('T')[0] : row.endDate,
    days: Number(row.days || 1),
    pricePerDay: Number(row.price_per_day || row.pricePerDay),
    rentalSubtotal: Number(row.rental_subtotal || row.rentalSubtotal),
    deposit: Number(row.deposit),
    serviceFee: Number(row.service_fee || row.serviceFee),
    total: Number(row.total),
    deliveryMethod: row.delivery_method || row.deliveryMethod,
    status: row.status,
    paymentStatus: row.payment_status || row.paymentStatus,
    notes: row.notes,
    createdAt: row.created_at || row.createdAt,
  };
}

// ----------------- PRODUCTS ----------------- //

export async function getProducts(filters = {}) {
  const { category, search, minPrice, maxPrice, sortBy, availableOnly } = filters;
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      let query = supabase.from('products').select('*');

      if (category && category !== 'All') {
        query = query.ilike('category', category);
      }
      if (search && search.trim() !== '') {
        const q = search.trim();
        query = query.or(`name.ilike.%${q}%,category.ilike.%${q}%,description.ilike.%${q}%`);
      }
      if (minPrice) {
        query = query.gte('price_per_day', Number(minPrice));
      }
      if (maxPrice) {
        query = query.lte('price_per_day', Number(maxPrice));
      }
      if (availableOnly === 'true') {
        query = query.eq('is_available', true).gt('total_stock', 0);
      }

      if (sortBy === 'price-low') {
        query = query.order('price_per_day', { ascending: true });
      } else if (sortBy === 'price-high') {
        query = query.order('price_per_day', { ascending: false });
      } else if (sortBy === 'rating') {
        query = query.order('rating', { ascending: false });
      } else if (sortBy === 'name') {
        query = query.order('name', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map(mapProductFromDB);
      }
      console.warn('Supabase product query error, falling back to local file:', error);
    } catch (err) {
      console.warn('Supabase fetch failed, falling back:', err);
    }
  }

  // Fallback to local storage
  let products = readJSON(PRODUCTS_FILE, []);

  if (category && category !== 'All') {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (minPrice) {
    products = products.filter(p => p.pricePerDay >= Number(minPrice));
  }

  if (maxPrice) {
    products = products.filter(p => p.pricePerDay <= Number(maxPrice));
  }

  if (availableOnly === 'true') {
    products = products.filter(p => p.isAvailable && p.totalStock > 0);
  }

  if (sortBy === 'price-low') {
    products.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (sortBy === 'price-high') {
    products.sort((a, b) => b.pricePerDay - a.pricePerDay);
  } else if (sortBy === 'rating') {
    products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'name') {
    products.sort((a, b) => a.name.localeCompare(b.name));
  }

  return products.map(mapProductFromDB);
}

export async function getProductById(id) {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) {
        return mapProductFromDB(data);
      }
    } catch (e) {
      // fallback
    }
  }

  const products = readJSON(PRODUCTS_FILE, []);
  const found = products.find(p => p.id === id);
  return mapProductFromDB(found);
}

export async function createProduct(prod) {
  const newProduct = {
    id: `prod-${Date.now()}`,
    name: prod.name.trim(),
    category: prod.category.trim(),
    price_per_day: Number(prod.pricePerDay),
    deposit: Number(prod.deposit) || Math.round(Number(prod.pricePerDay) * 5),
    total_stock: Number(prod.totalStock) || 1,
    rating: 5.0,
    review_count: 0,
    image: prod.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
    description: prod.description || 'High-performance rental gear in pristine condition.',
    features: Array.isArray(prod.features) ? prod.features : ['Original accessories included', 'Sanitized and inspected'],
    specs: prod.specs || { "Condition": "Grade A Mint", "Rental Period": "1 day minimum" },
    is_available: true,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').insert([newProduct]).select().single();
      if (!error && data) {
        return mapProductFromDB(data);
      }
    } catch (e) {
      console.warn('Supabase insert failed:', e);
    }
  }

  // Fallback
  const products = readJSON(PRODUCTS_FILE, []);
  const mapped = mapProductFromDB(newProduct);
  products.unshift(mapped);
  writeJSON(PRODUCTS_FILE, products);
  return mapped;
}

export async function updateProduct(id, updates) {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const dbUpdates = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.pricePerDay !== undefined) dbUpdates.price_per_day = updates.pricePerDay;
      if (updates.deposit !== undefined) dbUpdates.deposit = updates.deposit;
      if (updates.totalStock !== undefined) dbUpdates.total_stock = updates.totalStock;
      if (updates.image !== undefined) dbUpdates.image = updates.image;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.isAvailable !== undefined) dbUpdates.is_available = updates.isAvailable;

      const { data, error } = await supabase.from('products').update(dbUpdates).eq('id', id).select().single();
      if (!error && data) {
        return mapProductFromDB(data);
      }
    } catch (e) {
      console.warn('Supabase update failed:', e);
    }
  }

  const products = readJSON(PRODUCTS_FILE, []);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates, id };
    writeJSON(PRODUCTS_FILE, products);
    return mapProductFromDB(products[index]);
  }
  return null;
}

export async function deleteProduct(id) {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (e) {
      // ignore
    }
  }

  let products = readJSON(PRODUCTS_FILE, []);
  products = products.filter(p => p.id !== id);
  writeJSON(PRODUCTS_FILE, products);
  return true;
}

// ----------------- BOOKINGS ----------------- //

export async function getBookings(filters = {}) {
  const { email, phone, search, status } = filters;
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      let query = supabase.from('bookings').select('*');

      if (email) {
        query = query.ilike('customer_email', email);
      }
      if (status && status !== 'All') {
        query = query.eq('status', status);
      }
      if (search && search.trim() !== '') {
        const q = search.trim();
        query = query.or(`id.ilike.%${q}%,customer_name.ilike.%${q}%,customer_email.ilike.%${q}%,product_name.ilike.%${q}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (!error && data) {
        return data.map(mapBookingFromDB);
      }
    } catch (err) {
      console.warn('Supabase bookings query error, using local fallback:', err);
    }
  }

  // Fallback
  let bookings = readJSON(BOOKINGS_FILE, []);
  if (email) {
    bookings = bookings.filter(b => b.customer && b.customer.email.toLowerCase() === email.toLowerCase());
  }
  if (phone) {
    bookings = bookings.filter(b => b.customer && b.customer.phone.includes(phone));
  }
  if (status && status !== 'All') {
    bookings = bookings.filter(b => b.status === status);
  }
  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    bookings = bookings.filter(b =>
      b.id.toLowerCase().includes(q) ||
      (b.productName && b.productName.toLowerCase().includes(q)) ||
      (b.customer?.name && b.customer.name.toLowerCase().includes(q)) ||
      (b.customer?.email && b.customer.email.toLowerCase().includes(q))
    );
  }
  bookings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return bookings.map(mapBookingFromDB);
}

export async function getBookingById(id) {
  const searchId = id.trim().toUpperCase();
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase.from('bookings').select('*').ilike('id', searchId).single();
      if (!error && data) {
        return mapBookingFromDB(data);
      }
    } catch (e) {
      // fallback
    }
  }

  const bookings = readJSON(BOOKINGS_FILE, []);
  const found = bookings.find(b => b.id.toUpperCase() === searchId);
  return mapBookingFromDB(found);
}

export async function checkAvailability(productId, startDate, endDate) {
  const product = await getProductById(productId);
  if (!product) return { error: 'Product not found' };

  const allBookings = await getBookings();
  const overlapping = allBookings.filter(b =>
    b.productId === productId &&
    b.status !== 'Cancelled' &&
    b.status !== 'Completed / Returned' &&
    isDateOverlap(startDate, endDate, b.startDate, b.endDate)
  );

  const availableStock = Math.max(0, product.totalStock - overlapping.length);
  const isAvailable = product.isAvailable && availableStock > 0;

  return {
    productId,
    startDate,
    endDate,
    totalStock: product.totalStock,
    activeBookingsCount: overlapping.length,
    availableStock,
    isAvailable,
  };
}

export async function createBooking({ productId, startDate, endDate, customer, deliveryMethod, notes }) {
  const product = await getProductById(productId);
  if (!product) throw new Error('Product not found');

  const avail = await checkAvailability(productId, startDate, endDate);
  if (!avail.isAvailable) {
    throw new Error('Product is fully reserved for the requested dates. Please choose another date range.');
  }

  const days = calculateRentalDays(startDate, endDate);
  const rentalSubtotal = days * product.pricePerDay;
  const deposit = product.deposit || Math.round(product.pricePerDay * 5);
  const serviceFee = Math.max(8, Math.round(rentalSubtotal * 0.1));
  const total = rentalSubtotal + deposit + serviceFee;
  const bookingId = `RE-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const bookingPayload = {
    id: bookingId,
    product_id: product.id,
    product_name: product.name,
    product_category: product.category,
    product_image: product.image,
    customer_name: customer.name.trim(),
    customer_email: customer.email.trim(),
    customer_phone: customer.phone ? customer.phone.trim() : 'N/A',
    customer_address: customer.address ? customer.address.trim() : 'Store Pickup',
    start_date: startDate,
    end_date: endDate,
    days,
    price_per_day: product.pricePerDay,
    rental_subtotal: rentalSubtotal,
    deposit,
    service_fee: serviceFee,
    total,
    delivery_method: deliveryMethod || 'Doorstep Delivery',
    status: 'Confirmed',
    payment_status: 'Paid (Card)',
    notes: notes || 'Standard reservation.',
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('bookings').insert([bookingPayload]).select().single();
      if (!error && data) {
        return mapBookingFromDB(data);
      }
    } catch (e) {
      console.warn('Supabase booking insert failed, saving to local:', e);
    }
  }

  // Local fallback
  const mapped = mapBookingFromDB(bookingPayload);
  const bookings = readJSON(BOOKINGS_FILE, []);
  bookings.unshift(mapped);
  writeJSON(BOOKINGS_FILE, bookings);
  return mapped;
}

export async function updateBookingStatus(id, { status, paymentStatus, notes }) {
  const searchId = id.trim().toUpperCase();
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const updates = {};
      if (status) updates.status = status;
      if (paymentStatus) updates.payment_status = paymentStatus;
      if (notes) updates.notes = notes;

      const { data, error } = await supabase.from('bookings').update(updates).ilike('id', searchId).select().single();
      if (!error && data) {
        return mapBookingFromDB(data);
      }
    } catch (e) {
      // fallback
    }
  }

  const bookings = readJSON(BOOKINGS_FILE, []);
  const index = bookings.findIndex(b => b.id.toUpperCase() === searchId);
  if (index !== -1) {
    if (status) bookings[index].status = status;
    if (paymentStatus) bookings[index].paymentStatus = paymentStatus;
    if (notes) bookings[index].notes = notes;
    writeJSON(BOOKINGS_FILE, bookings);
    return mapBookingFromDB(bookings[index]);
  }
  return null;
}

export async function cancelBooking(id, reason) {
  const searchId = id.trim().toUpperCase();
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          status: 'Cancelled',
          payment_status: 'Refund Processed',
          cancellation_reason: reason || 'Customer requested cancellation',
        })
        .ilike('id', searchId)
        .select()
        .single();

      if (!error && data) {
        return { success: true, booking: mapBookingFromDB(data) };
      }
    } catch (e) {
      // fallback
    }
  }

  const bookings = readJSON(BOOKINGS_FILE, []);
  const index = bookings.findIndex(b => b.id.toUpperCase() === searchId);
  if (index !== -1) {
    bookings[index].status = 'Cancelled';
    bookings[index].paymentStatus = 'Refund Processed';
    bookings[index].cancellationReason = reason || 'Customer requested cancellation';
    writeJSON(BOOKINGS_FILE, bookings);
    return { success: true, booking: mapBookingFromDB(bookings[index]) };
  }

  throw new Error('Booking not found');
}

// ----------------- STATS ----------------- //

export async function getStats() {
  const products = await getProducts();
  const bookings = await getBookings();

  const totalProducts = products.length;
  const totalUnits = products.reduce((acc, p) => acc + (p.totalStock || 0), 0);
  const activeBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Active / Picked Up');
  const nonCancelled = bookings.filter(b => b.status !== 'Cancelled');
  const totalRevenue = nonCancelled.reduce((acc, b) => acc + (b.rentalSubtotal || 0) + (b.serviceFee || 0), 0);
  const totalDepositHeld = bookings.filter(b => b.status === 'Active / Picked Up' || b.status === 'Confirmed')
    .reduce((acc, b) => acc + (b.deposit || 0), 0);

  return {
    databaseType: isSupabaseConfigured() ? 'Supabase / PostgreSQL' : 'Local Persistent Engine (Supabase Ready)',
    isSupabaseConnected: isSupabaseConfigured(),
    totalProducts,
    totalUnits,
    totalBookings: bookings.length,
    activeRentalsCount: activeBookings.length,
    totalRevenue,
    totalDepositHeld,
  };
}
