# RentEase

### Full-Stack Rental Marketplace

RentEase is a full-stack rental marketplace that allows users to discover rental equipment, check real-time availability, and create and manage reservations.

The application includes a customer-facing marketplace and an operations dashboard for managing rental inventory and booking lifecycles.

---

## 🚀 Live Demo

**Live Application:** Coming soon

**Repository:**  
https://github.com/annanya111/RentEase

---

## 📌 About the Project

RentEase was built to solve a common problem in rental platforms: managing inventory availability while multiple customers may request the same product for overlapping rental periods.

The application handles:

- Product discovery
- Category-based browsing
- Availability checking
- Date-based reservations
- Inventory validation
- Rental price calculation
- Booking lifecycle management
- Customer booking lookup
- Inventory management
- Operations statistics

The backend performs the availability and inventory validation rather than relying only on frontend checks.

---

## ✨ Key Features

### 🛍️ Rental Marketplace

- Browse rental equipment
- Search products
- Filter by category
- Filter by price
- Filter by availability
- Sort products
- View detailed product information

### 📅 Booking System

- Select rental start and end dates
- Check real-time availability
- Specify rental quantity
- Calculate rental cost automatically
- Generate unique booking references
- Store reservations in PostgreSQL

### 📦 Inventory Management

The application calculates available inventory based on existing overlapping bookings.

For example:

```text
Total Units = 5

Existing bookings:
Booking A → 2 units
Booking B → 1 unit

Available Units = 5 - 2 - 1
                 = 2 units
