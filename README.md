<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# IntelliGrade - AI Dependency Analytics Platform

IntelliGrade is an educational analytics web application designed for Laguna State Polytechnic University (LSPU) to analyze and monitor AI dependency patterns among students across different colleges and academic levels.

## 🚀 Features

- **Student Analytics Dashboard** - Comprehensive overview of AI dependency metrics
- **Multi-College Support** - Track data across all LSPU colleges (CCS, CED, CEng, etc.)
- **Dependency Breakdown** - Analyze Reading, Writing, and Numeracy AI dependency scores
- **Student Directory** - Individual student records with detailed metrics
- **AI Prediction Tool** - Predict student dependency levels using AI
- **Role-Based Access** - Admin and Faculty roles with different permissions
- **Real-time Reports** - Generate PDF reports with analytics data
- **Firebase Authentication** - Secure email/password authentication with verification
- **MongoDB Integration** - Scalable database for student and user data

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB Atlas Account** (free tier) - [Sign up here](https://www.mongodb.com/cloud/atlas)
- **Firebase Project** - [Create here](https://console.firebase.google.com/)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ELCRISHT/final-intelligrade.git
cd final-intelligrade
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 4. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable **Authentication** → **Email/Password** sign-in method
4. Go to Project Settings → General → Your apps
5. Register a web app and copy the Firebase configuration

6. Create `src/config/firebase.ts` with your Firebase config:

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

### 5. Configure MongoDB

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a new cluster (free M0 tier is sufficient)
3. Create a database user with password
4. Add your IP to Network Access (or allow from anywhere: 0.0.0.0/0)
5. Get your connection string

6. Create `server/.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intelligrade?retryWrites=true&w=majority
PORT=5000
```

### 6. Optional: Configure Gemini AI (for iPredict feature)

Create `.env.local` in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from [Google AI Studio](https://ai.google.dev/)

## 🚀 Running Locally

### Option 1: Run Both Frontend and Backend Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Access at: http://localhost:3000

**Terminal 2 - Backend:**
```bash
cd server
node index.js
```
Backend runs on: http://localhost:5000

### Option 2: Quick Start (PowerShell)

```powershell
# Terminal 1
npm run dev

# Terminal 2
npm run server:dev
```

## 👤 First Time Setup

### Create Admin Account

1. Go to http://localhost:3000
2. Click **Sign Up**
3. Fill in your details:
   - First Name, Last Name, Contact Number
   - Email (use your institutional email)
   - Password (minimum 6 characters)
   - Select **Administrator** role
4. Check your email for verification link
5. Verify your email and log in

### Import Student Data (Optional)

1. Login as Admin
2. Go to **Student Directory**
3. Click **Import Students** (if implemented)
4. Upload CSV file with student data

Sample CSV format:
```csv
Student_ID,College,Year_Level,Reading_Dependency_Score,Writing_Dependency_Score,Numeracy_Dependency_Score,Motivation_Score,AI_Tools_Count,Primary_AI_Tool,Usage_Purpose
12345678,CCS,3,4.5,5.2,3.8,6.0,3,ChatGPT,Research
```

## 📖 Usage Guide

### For Faculty Users

1. **Login** with your verified account
2. **Dashboard** - View overall analytics for your college
3. **Student Directory** - Browse and search individual students
4. **Reports** - Generate and download PDF reports
5. **Settings** - Change password or update profile

### For Administrators

All faculty features plus:
- **Admin Panel** - Manage users and permissions
- **Cross-College Analytics** - View data from all colleges
- **User Management** - Create, edit, delete users
- **Role Assignment** - Grant/revoke admin privileges

## 📁 Project Structure

```
intelligrade/
├── api/                    # Vercel serverless functions
│   ├── users/             # User management endpoints
│   ├── students/          # Student data endpoints
│   ├── analytics/         # Analytics endpoints
│   └── lib/               # Shared utilities and models
├── pages/                 # Application pages
│   ├── Auth.tsx          # Login/Signup
│   ├── Dashboard.tsx     # Analytics dashboard
│   ├── StudentDirectory.tsx
│   ├── Admin.tsx         # Admin panel
│   └── Settings.tsx      # User settings
├── components/           # Reusable components
├── server/               # Express.js backend (local dev)
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── index.js         # Server entry point
├── src/
│   ├── config/          # Firebase configuration
│   ├── services/        # API service functions
│   └── utils/           # Helper utilities
└── public/              # Static assets
```

## 🔒 Security Notes

- **Never commit** `.env` or `.env.local` files
- **Keep** Firebase API keys and MongoDB credentials secure
- **Enable** email verification for all users
- **Use** strong passwords for database users
- **Restrict** MongoDB Network Access in production

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Verify `MONGODB_URI` in `server/.env`
- Check MongoDB Atlas Network Access allows your IP
- Ensure database user credentials are correct
- Confirm cluster is not paused

### Firebase Authentication Error
- Verify Firebase config in `src/config/firebase.ts`
- Enable Email/Password auth in Firebase Console
- Check email verification is sent (check spam folder)

### Port Already in Use
```bash
# Find process using port 3000 or 5000
netstat -ano | findstr :3000
# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel --prod
```

Add environment variables in Vercel Dashboard:
- `MONGODB_URI`
- Firebase config variables (if needed)

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is developed for Laguna State Polytechnic University (LSPU).

## 📧 Support

For issues or questions:
- Create an issue on GitHub
- Contact: LSPU IT Department

---

Made with ❤️ for LSPU by ELCRISHT
