# ===========================================
# DEPLOYMENT GUIDE FOR INTELLIGRADE
# ===========================================

## Prerequisites
- Node.js v18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- MongoDB Atlas account with cluster created
- Firebase project created

---

## STEP 1: Configure Firebase

### 1.1 Login to Firebase CLI
```bash
firebase login
```

### 1.2 Initialize Firebase in your project
```bash
firebase init
```
- Select **Hosting**
- Choose your Firebase project
- Set public directory to: `dist`
- Configure as SPA: **Yes**
- Don't overwrite index.html

### 1.3 Get Firebase Config
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → Project Settings → General
3. Scroll to "Your apps" → Web app
4. Copy the config values to `.env.local`

---

## STEP 2: Configure MongoDB Atlas

### 2.1 Get Connection String
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your cluster → Connect → Connect your application
3. Copy the connection string
4. Replace `<password>` with your actual password

### 2.2 Create Server Environment File
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster.mongodb.net/intelligrade?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
```

---

## STEP 3: Deploy Backend (MongoDB API Server)

### Option A: Deploy to Render.com (Recommended - Free)
1. Push your code to GitHub
2. Go to [Render.com](https://render.com/) → New → Web Service
3. Connect your GitHub repo
4. Configure:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variable: `MONGODB_URI`
6. Deploy!

### Option B: Deploy to Railway.app
1. Go to [Railway.app](https://railway.app/)
2. New Project → Deploy from GitHub repo
3. Add `server` as root directory
4. Add `MONGODB_URI` environment variable

### Option C: Deploy to Heroku
```bash
cd server
heroku create intelligrade-api
heroku config:set MONGODB_URI="your_connection_string"
git push heroku main
```

---

## STEP 4: Update Frontend Environment

After deploying backend, update `.env.local`:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## STEP 5: Build & Deploy Frontend

### 5.1 Build the app
```bash
npm run build
```

### 5.2 Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

Your app will be live at: `https://your-project-id.web.app`

---

## STEP 6: Enable Firebase Authentication

1. Go to Firebase Console → Authentication
2. Click "Get Started"
3. Enable **Email/Password** provider
4. (Optional) Enable Google Sign-in

---

## Production Checklist

- [ ] Replace all placeholder API keys in `.env.local`
- [ ] Set up MongoDB Atlas IP Whitelist (allow all: 0.0.0.0/0 for cloud hosting)
- [ ] Enable Firebase Authentication providers
- [ ] Test login/signup flow
- [ ] Test data import/export
- [ ] Set up Firebase Security Rules
- [ ] Configure custom domain (optional)

---

## Useful Commands

```bash
# Run frontend locally
npm run dev

# Run backend locally
cd server && npm run dev

# Build frontend
npm run build

# Preview production build
npm run preview

# Deploy to Firebase
firebase deploy

# View Firebase hosting sites
firebase hosting:sites:list
```

---

## Troubleshooting

### CORS Errors
Make sure your backend allows your frontend domain:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-app.web.app']
}));
```

### MongoDB Connection Issues
- Check IP whitelist in Atlas
- Verify connection string format
- Ensure user has read/write permissions

### Firebase Auth Errors
- Verify Firebase config values
- Check if Auth is enabled in console
- Ensure domain is authorized in Firebase Console
