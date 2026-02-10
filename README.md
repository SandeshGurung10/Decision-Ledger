# Decision Ledger System

A platform for organizations to document, track, and analyze decisions with full transparency and accountability. Built with the MERN stack.

## Tech Stack
- **Backend:** Node.js, Express, MongoDB (Atlas), Mongoose, JWT
- **Frontend:** React, Vite, Tailwind CSS, React Router, React Hook Form, Axios

## Features
- **Authentication:** Secure JWT-based registration and login.
- **RBAC:** Role-Based Access Control (Admin, Decision-Maker, Viewer).
- **Decision Tracking:** Complete CRUD for decisions with status, category, priority, and rationale.
- **Dashboard:** Real-time metrics and recently added decisions.
- **Responsive:** Optimized for mobile and desktop views.

## Setup Instructions

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file from the following template:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
   ```
4. Start the server: `npm run dev`

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev`
4. Access the app at `http://localhost:5173`

## Development Timeline
This project was developed over 12 weeks (Dec 2025 - Feb 2026). The commit history reflects this timeline with backdated entries.
