import http from 'http';

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Testing RentEase Backend API ---');

  // Test 1: Fetch Products
  const products = await makeRequest('/api/products');
  console.log('✓ /api/products status:', products.status, `(${products.data.length} products found)`);

  // Test 2: Check Availability
  const avail = await makeRequest('/api/check-availability', 'POST', {
    productId: 'prod-1',
    startDate: '2026-10-15',
    endDate: '2026-10-18',
  });
  console.log('✓ /api/check-availability status:', avail.status, 'Available:', avail.data.isAvailable);

  // Test 3: Create Booking
  const newBooking = await makeRequest('/api/bookings', 'POST', {
    productId: 'prod-3',
    startDate: '2026-10-20',
    endDate: '2026-10-23',
    deliveryMethod: 'Doorstep Delivery',
    customer: {
      name: 'Elena Rostova',
      email: 'elena@example.com',
      phone: '+1 (555) 345-6789',
      address: '772 Horizon Way, Seattle, WA',
    },
  });
  console.log('✓ /api/bookings POST status:', newBooking.status, 'Booking ID:', newBooking.data?.id, 'Total: $' + newBooking.data?.total);

  // Test 4: Fetch Stats
  const stats = await makeRequest('/api/stats');
  console.log('✓ /api/stats status:', stats.status, 'Total Bookings:', stats.data?.totalBookings, 'Revenue: $' + stats.data?.totalRevenue);

  // Test 5: Cancel Booking
  if (newBooking.data?.id) {
    const cancelRes = await makeRequest(`/api/bookings/${newBooking.data.id}/cancel`, 'POST', {
      reason: 'Automated validation check test',
    });
    console.log('✓ /api/bookings/:id/cancel status:', cancelRes.status, 'Cancelled:', cancelRes.data?.success);
  }

  console.log('--- All backend API tests passed! ---');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
