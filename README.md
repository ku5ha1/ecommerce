# 🛒 eCommerce App

Fullstack eCommerce app with a **FastAPI backend** and a **React frontend**.

- JWT Auth
- Product listing
- Cart (add, update, remove, clear)
- Simple order flow

---

## 🚀 Tech Stack

- Backend: FastAPI + SQLAlchemy + JWT
- Frontend: React (vibe coded)

---

## 🛠 Running Locally

```bash
# Backend
cd backend
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

---

## API Endpoints

Base URL (local): `http://localhost:8000`

Auth header (for protected endpoints):

```http
Authorization: Bearer <token>
```

### Auth
- POST `/auth/register` — Register a new user
- POST `/auth/login` — Login and receive access token + user info
- POST `/auth/me` — Get current user (requires auth)

### Products
- GET `/products/all` — Get all products
- GET `/products/category/{category_id}` — Get products by category
- GET `/products/{product_id}` — Get single product by id

### Categories
- GET `/categories/all` — Get all categories
- GET `/categories/{category_id}` — Get single category by id

### Cart (requires auth)
- POST `/cart/add` — Add item to cart (body: product_id, quantity)
- GET `/cart/cart` — Get current user's cart items
- PUT `/cart/update/{product_id}` — Update quantity (query: qty)
- DELETE `/cart/remove/{product_id}` — Remove item from cart
- DELETE `/cart/clear-all` — Clear entire cart

### Checkout (requires auth)
- POST `/checkout/` — Create order from cart items and shipping info

### Orders (requires auth)
- GET `/orders/` — List current user's orders
- GET `/orders/{order_id}` — Get a specific order

### Profile (requires auth)
- GET `/profile/` — Get my profile
- PUT `/profile/update` — Update username/email
- PUT `/profile/update-password` — Change password

### Admin (requires admin auth)
- POST `/admin/add-product` — Create product
- PUT `/admin/update/{product_id}` — Update product
- DELETE `/admin/{product_id}` — Delete product
- POST `/admin/add-category` — Create category
- PUT `/admin/update/{category_id}` — Update category
- DELETE `/admin/{category_id}` — Delete category
- GET `/admin/view-all-orders` — List all orders (filters: user_id, start_date, end_date)
- GET `/admin/orders/{order_id}` — Get single order (with relations)
- GET `/admin/all-users` — List all users
- PUT `/admin/users/{user_id}` — Toggle admin status (query: make_admin=true|false)
- GET `/admin/dashboard-stats` — High-level metrics
- GET `/admin/shipping-info/{order_id}` — Shipping details for order
- PUT `/admin/order/status/{order_id}` — Update order status

---

## Health
- GET `/` — API root
- GET `/ping` — Health check
