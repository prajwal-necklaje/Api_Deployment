# 🛠️ User Management API

Welcome to the **User Management API** – a simple Node.js + Express RESTful API connected to MongoDB Atlas for managing user data.

🌐 **Live API**: [https://api-deployment-jq90.onrender.com/](https://api-deployment-jq90.onrender.com/)

---

## 📦 Features

- Create, read, update, and delete (CRUD) users
- Register and login with hashed passwords
- JWT-based authentication
- Middleware support for request logging
- MongoDB Atlas database integration
- Deployed on Render

---

## 🚀 API Endpoints

### 🔓 Public Endpoints

| Method | Route            | Description            |
|--------|------------------|------------------------|
| GET    | `/`              | Welcome message        |
| POST   | `/users/register`| Register a new user    |
| POST   | `/users/login`   | Login and receive token|

### 🔐 Protected Routes (Require JWT)

You must include the JWT token in headers:  
`Authorization: Bearer <token>`

| Method | Route            | Description                  |
|--------|------------------|------------------------------|
| GET    | `/users`         | Get all users                |
| GET    | `/users/:id`     | Get single user by ID        |
| POST   | `/users`         | Create one or multiple users |
| PATCH  | `/users/:id`     | Update a user by ID          |
| DELETE | `/users/:id`     | Delete a user by ID          |

---

## 🧪 Sample JSON for Bulk POST

```json
[
  {
    "name": "Alice",
    "email": "alice@example.com"
  },
  {
    "name": "Bob",
    "email": "bob@example.com"
  }
]



