import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const BOOKINGS_FILE = path.join(__dirname, 'data', 'bookings.json');

// Ensure data folder exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helpers for file I/O
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
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
    return false;
  }
}

// Overlap calculation: check if two date intervals overlap
function isDateOverlap(start1, end1, start2, end2) {
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();
  return Math.max(s1, s2) <= Math.min(e1, e2);
}

// Calculate days between two dates (minimum 1 day)
function calculateRentalDays(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  const diffTime = e.getTime() - s.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, isNaN(diffDays) ? 1 : diffDays);
}

// ----------------- PRODUCT ROUTES ----------------- //

// GET /api/products (with filtering, search, sorting)
app.get('/api/products', (req, res) => {
  const { category, search, minPrice, maxPrice, sortBy, availableOnly } = req.query;
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

  // Sorting
  if (sortBy === 'price-low') {
    products.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (sortBy === 'price-high') {
    products.sort((a, b) => b.pricePerDay - a.pricePerDay);
  } else if (sortBy === 'rating') {
    products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'name') {
    products.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.json(products);
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const products = readJSON(PRODUCTS_FILE, []);
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Check current active bookings count for live status
  const bookings = readJSON(BOOKINGS_FILE, []);
  const today = new Date().toISOString().split('T')[0];
  const activeBookings = bookings.filter(b => 
    b.productId === product.id &&
    (b.status === 'Confirmed' || b.status === 'Active / Picked Up') &&
    isDateOverlap(today, today, b.startDate, b.endDate)
  );

  const availableUnitsNow = Math.max(0, product.totalStock - activeBookings.length);

  res.json({
    ...product,
    availableUnitsNow,
  });
});

// POST /api/products (Admin create)
app.post('/api/products', (req, res) => {
  const { name, category, pricePerDay, deposit, totalStock, image, description, features, specs } = req.body;
  if (!name || !category || !pricePerDay) {
    return res.status(400).json({ error: 'Name, category, and pricePerDay are required' });
  }

  const products = readJSON(PRODUCTS_FILE, []);
  const newProduct = {
    id: `prod-${Date.now()}`,
    name: name.trim(),
    category: category.trim(),
    pricePerDay: Number(pricePerDay),
    deposit: Number(deposit) || Math.round(Number(pricePerDay) * 5),
    totalStock: Number(totalStock) || 1,
    rating: 5.0,
    reviewCount: 0,
    image: image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
    description: description || 'High-performance rental gear in pristine condition.',
    features: Array.isArray(features) ? features : (features ? [features] : ['Original accessories included', 'Sanitized and inspected']),
    specs: specs || { "Condition": "Grade A Mint", "Rental Period": "1 day minimum" },
    isAvailable: true
  };

  products.unshift(newProduct);
  writeJSON(PRODUCTS_FILE, products);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id (Admin update)
app.put('/api/products/:id', (req, res) => {
  const products = readJSON(PRODUCTS_FILE, []);
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    id: req.params.id // ensure ID remains constant
  };

  writeJSON(PRODUCTS_FILE, products);
  res.json(products[index]);
});

// DELETE /api/products/:id (Admin delete)
app.delete('/api/products/:id', (req, res) => {
  let products = readJSON(PRODUCTS_FILE, []);
  const initialLength = products.length;
  products = products.filter(p => p.id !== req.params.id);

  if (products.length === initialLength) {
    return res.status(404).json({ error: 'Product not found' });
  }

  writeJSON(PRODUCTS_FILE, products);
  res.json({ success: true, message: 'Product deleted' });
});

// ----------------- AVAILABILITY CHECK ROUTE ----------------- //

// POST /api/check-availability
app.post('/api/check-availability', (req, res) => {
  const { productId, startDate, endDate } = req.body;
  if (!productId || !startDate || !endDate) {
    return res.status(400).json({ error: 'productId, startDate, and endDate are required' });
  }

  const products = readJSON(PRODUCTS_FILE, []);
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const bookings = readJSON(BOOKINGS_FILE, []);
  // Count active overlapping bookings
  const overlapping = bookings.filter(b => 
    b.productId === productId &&
    b.status !== 'Cancelled' &&
    b.status !== 'Completed / Returned' &&
    isDateOverlap(startDate, endDate, b.startDate, b.endDate)
  );

  const availableStock = Math.max(0, product.totalStock - overlapping.length);
  const isAvailable = product.isAvailable && availableStock > 0;

  res.json({
    productId,
    startDate,
    endDate,
    totalStock: product.totalStock,
    activeBookingsCount: overlapping.length,
    availableStock,
    isAvailable,
  });
});

// ----------------- BOOKING ROUTES ----------------- //

// GET /api/bookings
app.get('/api/bookings', (req, res) => {
  const { email, phone, search, status } = req.query;
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
      (b.customer && b.customer.name.toLowerCase().includes(q)) ||
      (b.customer && b.customer.email.toLowerCase().includes(q))
    );
  }

  // Sort latest first
  bookings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  res.json(bookings);
});

// GET /api/bookings/:id
app.get('/api/bookings/:id', (req, res) => {
  const bookings = readJSON(BOOKINGS_FILE, []);
  const searchId = req.params.id.trim().toUpperCase();
  const booking = bookings.find(b => b.id.toUpperCase() === searchId);

  if (!booking) {
    return res.status(404).json({ error: `Booking ${req.params.id} not found` });
  }

  res.json(booking);
});

// POST /api/bookings (Create new booking)
app.post('/api/bookings', (req, res) => {
  const { productId, startDate, endDate, customer, deliveryMethod, notes } = req.body;

  if (!productId || !startDate || !endDate || !customer || !customer.name || !customer.email) {
    return res.status(400).json({ error: 'Missing required booking details (productId, dates, customer info)' });
  }

  const products = readJSON(PRODUCTS_FILE, []);
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const sDate = new Date(startDate);
  const eDate = new Date(endDate);
  if (isNaN(sDate.getTime()) || isNaN(eDate.getTime()) || eDate < sDate) {
    return res.status(400).json({ error: 'Invalid rental date range. End date must be on or after start date.' });
  }

  // Check availability
  const bookings = readJSON(BOOKINGS_FILE, []);
  const overlapping = bookings.filter(b =>
    b.productId === productId &&
    b.status !== 'Cancelled' &&
    b.status !== 'Completed / Returned' &&
    isDateOverlap(startDate, endDate, b.startDate, b.endDate)
  );

  if (overlapping.length >= product.totalStock) {
    return res.status(409).json({
      error: 'Product is fully booked for the selected dates. Please choose different dates.',
      conflictingDates: { startDate, endDate },
      totalStock: product.totalStock,
      bookedCount: overlapping.length
    });
  }

  // Pricing logic
  const days = calculateRentalDays(startDate, endDate);
  const rentalSubtotal = days * product.pricePerDay;
  const deposit = product.deposit || Math.round(product.pricePerDay * 5);
  const serviceFee = Math.max(8, Math.round(rentalSubtotal * 0.1)); // 10% or min $8 for maintenance/prep
  const total = rentalSubtotal + deposit + serviceFee;

  const bookingId = `RE-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newBooking = {
    id: bookingId,
    productId: product.id,
    productName: product.name,
    productCategory: product.category,
    productImage: product.image,
    customer: {
      name: customer.name.trim(),
      email: customer.email.trim(),
      phone: customer.phone ? customer.phone.trim() : 'N/A',
      address: customer.address ? customer.address.trim() : 'Pickup at store'
    },
    startDate,
    endDate,
    days,
    pricePerDay: product.pricePerDay,
    rentalSubtotal,
    deposit,
    serviceFee,
    total,
    deliveryMethod: deliveryMethod || 'Store Pickup',
    status: 'Confirmed',
    paymentStatus: 'Paid (Card)',
    notes: notes || 'Standard reservation.',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);
  writeJSON(BOOKINGS_FILE, bookings);

  res.status(201).json(newBooking);
});

// PATCH /api/bookings/:id/status (Admin change status)
app.patch('/api/bookings/:id/status', (req, res) => {
  const { status, paymentStatus, notes } = req.body;
  const bookings = readJSON(BOOKINGS_FILE, []);
  const index = bookings.findIndex(b => b.id.toUpperCase() === req.params.id.trim().toUpperCase());

  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  if (status) bookings[index].status = status;
  if (paymentStatus) bookings[index].paymentStatus = paymentStatus;
  if (notes) bookings[index].notes = notes;

  writeJSON(BOOKINGS_FILE, bookings);
  res.json(bookings[index]);
});

// POST /api/bookings/:id/cancel (Customer or admin cancel)
app.post('/api/bookings/:id/cancel', (req, res) => {
  const { reason } = req.body;
  const bookings = readJSON(BOOKINGS_FILE, []);
  const index = bookings.findIndex(b => b.id.toUpperCase() === req.params.id.trim().toUpperCase());

  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  if (bookings[index].status === 'Completed / Returned') {
    return res.status(400).json({ error: 'Cannot cancel a completed rental.' });
  }

  bookings[index].status = 'Cancelled';
  bookings[index].paymentStatus = 'Refund Processed';
  bookings[index].cancellationReason = reason || 'Customer requested cancellation';
  bookings[index].cancelledAt = new Date().toISOString();

  writeJSON(BOOKINGS_FILE, bookings);
  res.json({ success: true, booking: bookings[index] });
});

// ----------------- STATS ROUTE ----------------- //

app.get('/api/stats', (req, res) => {
  const products = readJSON(PRODUCTS_FILE, []);
  const bookings = readJSON(BOOKINGS_FILE, []);

  const totalProducts = products.length;
  const totalUnits = products.reduce((acc, p) => acc + (p.totalStock || 0), 0);
  const activeBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Active / Picked Up');
  
  // Calculate revenue excluding cancelled
  const completedOrActive = bookings.filter(b => b.status !== 'Cancelled');
  const totalRevenue = completedOrActive.reduce((acc, b) => acc + (b.rentalSubtotal || 0) + (b.serviceFee || 0), 0);
  const totalDepositHeld = bookings.filter(b => b.status === 'Active / Picked Up' || b.status === 'Confirmed')
    .reduce((acc, b) => acc + (b.deposit || 0), 0);

  res.json({
    totalProducts,
    totalUnits,
    totalBookings: bookings.length,
    activeRentalsCount: activeBookings.length,
    totalRevenue,
    totalDepositHeld,
  });
});

app.listen(PORT, () => {
  console.log(`RentEase backend server running on http://localhost:${PORT}`);
});
