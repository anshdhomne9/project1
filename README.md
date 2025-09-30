# Next-Gen Lifestyle & Productivity Platform

This is a full-stack web application designed for Gen Z and Millennials to manage tasks, track habits, and achieve personal goals.

## Features Implemented

- **User Authentication**: JWT-based registration and login.
- **Backend API**: Node.js, Express.js (via Next.js API Routes), and MongoDB.
- **Task Management**: Create, Read, Update, and Delete tasks.
- **Habit Tracking**: Create, complete, and track habit streaks.
- **Frontend**: React (via Next.js) and TailwindCSS.
- **Dashboard**: A central dashboard to view and manage tasks and habits.
- **Productivity Chart**: A bar chart showing the status of tasks.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A MongoDB database and connection string.

### 1. Navigate to Project Directory

Open your terminal and change to the project directory:
```bash
cd C:\Users\anshd\nextgen-platform
```

### 2. Install Dependencies

If you haven't already, install the necessary npm packages:

```bash
npm install
```

### 3. Environment Variables

The `.env.local` file should be configured with your `MONGODB_URI` and `JWT_SECRET`.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
