# 🌿 Vital Green - Natural Juice E-commerce

Welcome to Vital Green! This is the repository for a Full-Stack e-commerce project built with Node.js, Express, MongoDB, and vanilla JavaScript for the frontend. The application allows users to purchase natural juices and enables administrators to manage products and orders through a dedicated admin panel.

![Vital Green Logo](https://raw.githubusercontent.com/leftv13/vital-green/main/imgs/VITALGREEN-SINFONDO.png) 
<!-- Replace 'your-github-username/vital-green' with the actual URL of your repository once you upload it to GitHub -->

---

## ✨ Key Features

### For Customers:
-   **🏠 Attractive Homepage:** A showcase of the brand, featured products, and testimonials.
-   **🛍️ Product Store:** A complete catalog with a real-time search feature.
-   **🛒 Interactive Shopping Cart:** Add, remove, and view products in a persistent cart (using `localStorage`).
-   **🔐 User Authentication:** Secure registration and login system using JWT cookies.
-   **✅ Checkout Process:** Finalize purchases and generate a PDF receipt.
-   **📄 Order History:** Users can view their past orders.

### For Administrators:
-   **🔒 Protected Admin Panel:** Exclusive access for users with the 'admin' role.
-   **📦 Product Management (CRUD):** Create, read, update, and delete products from the inventory.
-   **📋 Order Management:** View all system orders, update their status (Pending, Shipped, etc.), and see the details of each one.
-   **📉 Automatic Stock Reduction:** Product stock is automatically deducted when an order is processed.

---

## 🛠️ Tech Stack

### Backend
-   **Node.js:** JavaScript runtime environment.
-   **Express.js:** Framework for building the REST API.
-   **MongoDB:** NoSQL database for storing products, users, and orders.
-   **Mongoose:** ODM for modeling and interacting with MongoDB easily.
-   **JSON Web Tokens (JWT):** For secure authentication and session management.
-   **bcrypt.js:** For secure password hashing.
-   **Dotenv:** For managing environment variables.

### Frontend
-   **HTML5 & CSS3:** Application structure and styling.
-   **JavaScript (Vanilla JS):** Client-side logic, DOM manipulation, and API consumption.
-   **Axios:** HTTP client for making requests to the backend API.
-   **jsPDF & jsPDF-AutoTable:** For client-side generation of PDF receipts.

---

## 🚀 Installation and Setup

Follow these steps to run the project in your local environment.

### Prerequisites
-   Node.js installed (version 16 or higher).
-   MongoDB installed and the service running.

### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-github-username/vital-green.git
    cd vital-green
    ```

2.  **Install project dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the project root and add the following variables. Replace the values with your own configuration.

    ```env
    # Connection URL for your MongoDB database
    MONGO_URI=mongodb://localhost:27017/vitalgreen

    # Secret key for signing JWTs (you can use a secure password generator)
    JWT_SECRET=your_super_secret_key

    # Frontend URL (for CORS configuration)
    PAGE_URL=http://localhost:3000
    ```

4.  **Run the server:**
    ```bash
    npm run start //FOR DEVELOPMENT
    npm run start //FOR PRODUCTION
    ```

5.  **All set!** Open your browser and visit `http://localhost:3000`.

---

## 📂 Project Structure

The project is organized as follows to maintain a clear separation of concerns:

 ```bash

├── controllers/ # Brain of the project, CRUD methods
│   ├── login.js
│   ├── logout.js
│   ├── orders.js
│   ├── products.js
│   └── users.js        
├── img/ # Contains all the project images
│   └── VITALGREEN-SINFONDO.png  
├── models/ # Database logic
│   ├── todo.js          
│   ├── order.js          
│   └── user.js
├── views/ # Styles & FrontEnd logic
│   ├── components/           
│   │      └── notification.js
│   ├── home/           
│   │      └── index.html
│   │      └── index.js
│   ├── login/
│   │      └── index.html
│   │      └── index.js
│   ├── signup/           
│   │      └── index.html
│   │      └── index.js
│   ├── store/           
│   │      └── index.html
│   │      └── index.js
│   ├── styles/           
│   │      └── l&r.css
│   │      └── output.css
│   │      └── store.css
│   │      └── style.css
│   ├── verify/           
│   │      └── index.html
│   └──    └── index.js
├── .gitignore               
├── app.js
├── config.js
├── index.js
├── input.js
├── package-lock.json
├── package.json
├── config.js
├── README.md
└── tailwind.config.js

 ```
---

## 🤝 Contributing

Contributions are welcome. If you wish to improve the project, please follow these steps:
1.  Fork the project.
2.  Create a new branch (`git checkout -b feature/new-feature`).
3.  Make your changes and commit them (`git commit -m 'Add new feature'`).
4.  Push to the branch (`git push origin feature/new-feature`).
5.  Open a Pull Request.

---

## 📄 License

MIT License

Copyright (c) [2025] [Andres Abreu]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


