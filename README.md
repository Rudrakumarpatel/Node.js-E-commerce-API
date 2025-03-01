# E-Commerce Order Management API

This API allows users to place orders, view order history, and for admins to manage orders and track top-selling products.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT-based authentication

---

## Installation

```sh
git clone https://github.com/Rudrakumarpatel/Node.js-E-commerce-API.git
cd Node.js-E-commerce-API
npm install



API Endpoints
Authentication Routes
1. User Registration
URL: POST /api/auth/register
Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
Response:
{
  "message": "User registered successfully",
  "userId": 1
}

2. User Login
URL: POST /api/auth/login
Request Body:
{
  "email": "john@example.com",
  "password": "securepassword"
}
Response:

{
  "token": "your-jwt-token",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}

3. Admin Login
URL: POST /api/auth/admin-login
Request Body:
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
Response:

{
  "token": "admin-jwt-token",
  "admin": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  }
}


User Routes
4. Place an Order
URL: POST /api/orders
Headers:
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
Request Body:
{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}

Response:

{
  "id": 5,
  "userId": 2,
  "status": "pending",
  "totalAmount": 250.5,
  "orderItems": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}

5. View Order History
URL: GET /api/orders
Headers:

{
  "Authorization": "Bearer <token>"
}
Response:

[
  {
    "id": 5,
    "userId": 2,
    "status": "pending",
    "totalAmount": 250.5,
    "orderItems": [
      { "productId": 1, "quantity": 2 },
      { "productId": 3, "quantity": 1 }
    ]
  }
]

Product Routes
6. Get All Products
URL: GET /api/products
Response:

[
  {
    "id": 1,
    "name": "Laptop",
    "price": 1000,
    "stock": 10,
    "categoryId": 1
  }
]

7. Get Product by ID
URL: GET /api/products/:id
Response:

{
  "id": 1,
  "name": "Laptop",
  "price": 1000,
  "stock": 10,
  "categoryId": 1
}

8. Add a Product (Admin)
URL: POST /api/products
Headers:

{
  "Authorization": "Bearer <admin-token>",
  "Content-Type": "application/json"
}
Request Body:

{
  "name": "New Product",
  "price": 500,
  "stock": 20,
  "categoryId": 2
}
Response:

{
  "message": "Product added successfully",
  "productId": 10
}

9. Delete a Product (Admin)
URL: DELETE /api/products/:id
Headers:
{
  "Authorization": "Bearer <admin-token>"
}
Response:
{
  "message": "Product deleted successfully"
}

Category Routes
10. Get All Categories
URL: GET /api/categories
Response:
[
  {
    "id": 1,
    "name": "Electronics"
  }
]
11. Add a Category (Admin)
URL: POST /api/categories
Headers:

{
  "Authorization": "Bearer <admin-token>",
  "Content-Type": "application/json"
}
Request Body:

{
  "name": "Home Appliances"
}
Response:

{
  "message": "Category added successfully",
  "categoryId": 5
}

Admin Routes
12. Get All Orders
URL: GET /api/admin/orders
Headers:

{
  "Authorization": "Bearer <admin-token>"
}
Response:

[
  {
    "id": 5,
    "userId": 2,
    "status": "pending",
    "totalAmount": 250.5,
    "orderItems": [
      { "productId": 1, "quantity": 2 },
      { "productId": 3, "quantity": 1 }
    ]
  }
]

13. Get Top Selling Products
URL: GET /api/admin/top-selling
Headers:

{
  "Authorization": "Bearer <admin-token>"
}
Response:

[
  { "productId": 1, "totalSold": 10 },
  { "productId": 3, "totalSold": 5 }
]

14. Get Top Selling Categories
URL: GET /api/admin/top-selling-categories
Headers:

{
  "Authorization": "Bearer <admin-token>"
}
Response:


Edit
[
  { "categoryId": 1, "totalSold": 50 },
  { "categoryId": 2, "totalSold": 30 }
]
Running the Project

npm start
For development mode:

npm run dev