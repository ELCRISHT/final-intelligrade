# IntelliGrade - AI Dependency Dashboard

IntelliGrade is an educational analytics web application designed for Laguna State Polytechnic University (LSPU) to analyze and monitor AI dependency patterns among students across different colleges.

## Table of Contents

1. [System Features](#system-features)
2. [Prerequisites](#prerequisites)
3. [Installation and Setup](#installation-and-setup)
4. [Running the Application](#running-the-application)
5. [First Time Setup](#first-time-setup)
6. [Usage Guide](#usage-guide)
7. [Project Structure](#project-structure)
8. [Security Best Practices](#security-best-practices)
9. [Troubleshooting](#troubleshooting)
10. [Deployment](#deployment)
11. [Contributing](#contributing)
12. [Support](#support)

## System Features

- **Student Analytics Dashboard** - Comprehensive overview of AI dependency metrics
- **Multi-College Support** - Track data across all LSPU colleges (CCS, CED, CEng, etc.)
- **Dependency Breakdown** - Analyze Reading, Writing, and Numeracy AI dependency scores
- **Student Directory** - Individual student records with detailed metrics
- **AI Prediction Tool** - Predict student dependency levels using AI
- **Role-Based Access** - Admin and Faculty roles with different permissions
- **Real-time Reports** - Generate PDF reports with analytics data
- **Firebase Authentication** - Secure email/password authentication with verification
- **MongoDB Integration** - Scalable database for student and user data

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB Atlas Account** (free tier) - [Sign up here](https://www.mongodb.com/cloud/atlas)
- **Firebase Project** - [Create here](https://console.firebase.google.com/)

## Installation and Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/ELCRISHT/final-intelligrade.git
cd final-intelligrade
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### Step 4: Configure Firebase

1. Navigate to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Authentication** and then enable **Email/Password** sign-in method
4. Go to Project Settings, then General, and scroll to Your apps
5. Register a web app and copy the Firebase configuration

6. Create a new file at `src/config/firebase.ts` with your Firebase configuration:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

Replace the placeholder values with your actual Firebase configuration.

### Step 5: Configure MongoDB

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a new cluster (the free M0 tier is sufficient for development)
3. Create a database user with a secure password
4. Add your IP address to Network Access (or allow access from anywhere using 0.0.0.0/0 for development only)
5. Obtain your connection string from the cluster dashboard

6. Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intelligrade?retryWrites=true&w=majority
PORT=5000
```

Replace `username`, `password`, and `cluster` with your actual MongoDB credentials.

## Running the Application

### Option 1: Run Frontend and Backend Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```
The frontend will be accessible at: http://localhost:3000

**Terminal 2 - Backend:**
```bash
cd server
node index.js
```
The backend will run on: http://localhost:5000

### Option 2: Quick Start with npm Scripts

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
npm run server:dev
```

## First Time Setup

### Creating an Admin Account

1. Open your browser and navigate to http://localhost:3000
2. Click the **Sign Up** button
3. Fill in the registration form with the following details:
   - First Name
   - Last Name
   - Contact Number
   - Email (preferably your institutional email)
   - Password (minimum 6 characters)
   - Select **Administrator** role
4. Check your email inbox for a verification link
5. Click the verification link to verify your email address
6. Return to the application and log in with your credentials

### Importing Student Data (Optional)

1. Log in as an Administrator
2. Navigate to the **Student Directory** page
3. Click the **Import Students** button (if implemented)
4. Upload a CSV file with student data

**Sample CSV Format:**
```csv
Student_ID,College,Year_Level,Reading_Dependency_Score,Writing_Dependency_Score,Numeracy_Dependency_Score,Motivation_Score,AI_Tools_Count,Primary_AI_Tool,Usage_Purpose
```

## Usage Guide

### For Faculty Users

1. **Login** - Sign in with your verified account credentials
2. **Dashboard** - View overall analytics and metrics for your college
3. **Student Directory** - Browse, search, and view individual student profiles
4. **Reports** - Generate and download PDF reports with analytics data
5. **Settings** - Update your profile information or change your password

### For Administrators

Administrators have access to all faculty features plus the following:

- **Admin Panel** - Manage users and system permissions
- **Cross-College Analytics** - View aggregated data from all colleges
- **User Management** - Create, edit, and delete user accounts
- **Role Assignment** - Grant or revoke administrative privileges

## Project Structure

```
intelligrade/
├── api/                       # Vercel serverless functions
│   ├── users/                 # User management endpoints
│   ├── students/              # Student data endpoints
│   ├── analytics/             # Analytics endpoints
│   └── lib/                   # Shared utilities and models
├── pages/                     # Application pages
│   ├── Auth.tsx               # Login and Signup page
│   ├── Dashboard.tsx          # Analytics dashboard
│   ├── StudentDirectory.tsx   # Student directory page
│   ├── Admin.tsx              # Admin panel
│   └── Settings.tsx           # User settings page
├── components/                # Reusable UI components
├── server/                    # Express.js backend (local development)
│   ├── models/                # MongoDB data models
│   ├── routes/                # API route handlers
│   └── index.js               # Server entry point
├── src/
│   ├── config/                # Configuration files
│   ├── services/              # API service functions
│   └── utils/                 # Helper utilities
└── public/                    # Static assets
```

## Security Best Practices

- **Never commit** `.env` or `.env.local` files to version control
- **Keep** Firebase API keys and MongoDB credentials secure and private
- **Enable** email verification for all new user accounts
- **Use** strong passwords for database users and accounts
- **Restrict** MongoDB Network Access to specific IP addresses in production environments
- **Regularly update** dependencies to patch security vulnerabilities

## Troubleshooting

### MongoDB Connection Failed

**Possible Solutions:**
- Verify the `MONGODB_URI` in your `server/.env` file is correct
- Check that MongoDB Atlas Network Access allows your current IP address
- Ensure database user credentials (username and password) are correct
- Confirm that your cluster is not paused in MongoDB Atlas

### Firebase Authentication Error

**Possible Solutions:**
- Verify that your Firebase configuration in `src/config/firebase.ts` is correct
- Ensure Email/Password authentication is enabled in the Firebase Console
- Check that email verification emails are being sent (check spam/junk folder)
- Confirm your Firebase project has the correct authorized domains

### Port Already in Use

**On Windows:**
```bash
# Find the process using port 3000 or 5000
netstat -ano | findstr :3000

# Kill the process (replace PID with the actual process ID)
taskkill /PID <PID> /F
```

**On macOS/Linux:**
```bash
# Find the process using port 3000 or 5000
lsof -i :3000

# Kill the process (replace PID with the actual process ID)
kill -9 <PID>
```

### Build Errors

**Clear cache and reinstall dependencies:**
```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

## Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Log in to Vercel:
```bash
vercel login
```

3. Deploy to production:
```bash
vercel --prod
```

4. Add environment variables in the Vercel Dashboard:
   - `MONGODB_URI`
   - Firebase configuration variables (if needed)

### Deploy Backend Separately

For the backend API, consider deploying to:
- **Railway** - [railway.app](https://railway.app/)
- **Render** - [render.com](https://render.com/)
- **Heroku** - [heroku.com](https://heroku.com/)

## Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository to your GitHub account
2. Create a feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to your branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request with a clear description of your changes

### Contribution Guidelines

- Write clear and descriptive commit messages.
- Follow the existing code style and conventions.
- Test your changes thoroughly before submitting.
- Update documentation as needed.
- Be respectful and constructive in code reviews.

## Support

For issues, questions, or feature requests:

- **Create an issue** on the [GitHub repository](https://github.com/ELCRISHT/final-intelligrade/issues)
- **Contact us** at: 0322-1518@lspu.edu.ph

---

**IntelliGrade Team - DEVCO-BLV**

Developed with dedication for Laguna State Polytechnic University
