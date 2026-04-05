# KeyClash - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Clerk Authentication

#### Option A: Create New Clerk Account

1. Go to https://clerk.com and sign up
2. Create a new application named "KeyClash"
3. Go to **API Keys** → Copy your **Publishable Key**
4. Go to **JWT Templates** → Click **"New Template"** → Select **"Convex"**
5. Copy the **Issuer** URL (e.g., `https://your-app.clerk.accounts.dev`)

#### Option B: Use Existing Clerk Account

1. Go to https://dashboard.clerk.com
2. Select your application or create a new one
3. Follow steps 3-5 from Option A above

### 3. Set Up Convex Backend

```bash
# Start Convex development server (this will open browser for setup)
pnpm convex:dev
```

This will:
- Create a Convex account (if you don't have one)
- Initialize a new Convex project
- Give you a deployment URL

Copy the deployment URL (e.g., `https://happy-animal-123.convex.cloud`)

### 4. Create Environment File

Create a file named `.env.local` in the project root:

```bash
# Convex Backend URL (from step 3)
VITE_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk Publishable Key (from step 2)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Connect Clerk to Convex

```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN "your-app.clerk.accounts.dev"
```

Replace `your-app.clerk.accounts.dev` with your actual issuer from step 2.5.

### 6. Start the Application

```bash
# In one terminal, keep Convex running
pnpm convex:dev

# In another terminal, start the app
pnpm dev
```

Open your browser to http://localhost:5173

### 7. Test It Out!

1. Click **"Sign Up"** in the header
2. Create an account
3. Start typing in **Practice Mode** or **Algorithm Mode**
4. Check your **Statistics** page
5. Sign out and sign back in - your data persists!

## 🎉 You're Done!

You now have a fully functional typing practice app with:
- ✅ User authentication
- ✅ Personal statistics tracking
- ✅ Data persistence across devices
- ✅ Secure backend

## 🛠️ Development Commands

```bash
# Start development server
pnpm dev

# Start Convex backend
pnpm convex:dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint
```

## 🐛 Having Issues?

### Can't see the app?
- Make sure both `pnpm dev` AND `pnpm convex:dev` are running
- Check that port 5173 isn't in use

### "Missing Publishable Key" error?
- Make sure `.env.local` exists in the project root
- Check that the key starts with `pk_test_` or `pk_live_`
- Restart the dev server after creating `.env.local`

### Sign in not working?
- Make sure you created the JWT template in Clerk
- Verify you ran the `convex env set` command
- Check that `pnpm convex:dev` is running

### Data not saving?
- Sign in first (check for avatar in header)
- Make sure `pnpm convex:dev` is running
- Check browser console for errors

## 📚 Learn More

- See [CLERK_SETUP.md](./CLERK_SETUP.md) for detailed auth setup
- See [AUTH_INTEGRATION_SUMMARY.md](./AUTH_INTEGRATION_SUMMARY.md) for technical details
- See [README.md](./README.md) for project overview

## 🚀 Next Steps

- Customize the app to your liking
- Add more typing challenges
- Deploy to production
- Share with friends!

---

Need help? Open an issue or check the documentation files!

