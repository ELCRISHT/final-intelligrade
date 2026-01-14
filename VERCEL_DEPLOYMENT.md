# Deploy IntelliGrade to Vercel

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- MongoDB Atlas cluster (already configured)
- Firebase project (already configured)

## Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

## Step 2: Install Dependencies
```bash
npm install
```

## Step 3: Login to Vercel
```bash
vercel login
```

## Step 4: Deploy to Vercel
```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Select your account
- **Link to existing project?** No
- **Project name?** intelligrade (or your preferred name)
- **Directory?** ./ (press Enter)
- **Override settings?** No

## Step 5: Add Environment Variables

After initial deployment, add your environment variables in Vercel Dashboard:

1. Go to your project settings: https://vercel.com/[your-username]/intelligrade/settings/environment-variables

2. Add the following variables:

### MongoDB
```
MONGODB_URI=mongodb+srv://[username]:[password]@intelligrade.03melfv.mongodb.net/intelligrade?retryWrites=true&w=majority
```

### Firebase (if needed for admin SDK)
```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
```

## Step 6: Redeploy with Environment Variables
```bash
vercel --prod
```

## Vercel Serverless Functions

The backend API is automatically deployed as serverless functions in the `/api` directory:

- `/api/health` - Health check
- `/api/users` - User management
- `/api/users/[uid]` - Get/Update/Delete user by UID
- `/api/students` - Student records
- `/api/students/[id]` - Get/Update/Delete student by ID
- `/api/students/bulk` - Bulk import students
- `/api/analytics` - Analytics data

## Local Development

### Frontend only:
```bash
npm run dev
```
Access at: http://localhost:3000

### With local backend:
Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
cd server
node index.js
```

The app automatically detects localhost and uses `http://localhost:5000/api` for development.

## Production URL

After deployment, your app will be available at:
```
https://intelligrade.vercel.app
```

Or your custom domain if configured.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) in Network Access
- Verify MONGODB_URI is correctly set in Vercel environment variables
- Check MongoDB Atlas cluster is running

### API Not Working
- Check Vercel function logs: `vercel logs`
- Ensure all environment variables are set
- Verify `/api` routes are accessible

### Build Errors
- Run `npm run build` locally first to catch errors
- Check TypeScript errors: `tsc --noEmit`
- Verify all dependencies are in `package.json`

## Monitoring

View logs in real-time:
```bash
vercel logs --follow
```

Or check the Vercel Dashboard for detailed metrics and logs.
