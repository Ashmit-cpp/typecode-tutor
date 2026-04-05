# Convex Backend Setup

This application uses Convex as the backend to store typing statistics and user preferences.

## Important Note

⚠️ **You may see TypeScript errors about missing Convex modules until you complete step 2 below.** These errors are expected and will resolve automatically once Convex generates its files.

## Initial Setup

1. **Create a Convex account** (if you don't have one):
   - Visit https://convex.dev
   - Sign up for a free account

2. **Initialize Convex in the project**:
   ```bash
   npx convex dev
   ```
   - This will prompt you to login
   - Select "Create a new project" or choose an existing one
   - The command will generate a `.env.local` file with your `VITE_CONVEX_URL`
   - **This also generates the `convex/_generated/` folder** which resolves TypeScript errors

3. **Run the development servers**:
   
   You'll need to run two terminals:
   
   **Terminal 1 - Convex Backend:**
   ```bash
   npm run convex:dev
   ```
   
   **Terminal 2 - Vite Frontend:**
   ```bash
   npm run dev
   ```

## Data Models

### Test Results
Stores completed typing tests with statistics:
- Mode (practice/algorithm)
- WPM (words per minute)
- Accuracy percentage
- Time elapsed
- Character counts
- Errors
- Text preview
- Algorithm name (for algorithm mode)

### User Settings
Stores user preferences:
- Practice mode selection
- Typing mode selection

## Deployment

To deploy to production:

1. **Deploy Convex backend**:
   ```bash
   npm run convex:deploy
   ```

2. **Update environment variables**:
   - Copy the production `VITE_CONVEX_URL` to your hosting platform
   - Build and deploy your frontend

3. **Build frontend**:
   ```bash
   npm run build
   ```

## Development Workflow

- The Convex backend automatically syncs schema changes
- Hot reload is supported for both Convex functions and React components
- All data is stored in the cloud and persists across sessions
- No need for local database setup

## Troubleshooting

### "VITE_CONVEX_URL is not defined"
- Make sure you've run `npx convex dev` at least once
- Check that `.env.local` exists and contains `VITE_CONVEX_URL`
- Restart your Vite dev server

### Changes not reflecting
- Make sure `convex dev` is running in a separate terminal
- Check the Convex dashboard for any schema errors
- Clear browser cache if needed

## Convex Dashboard

Access your Convex dashboard at: https://dashboard.convex.dev

Here you can:
- View and query your data
- Monitor function performance
- Check deployment status
- View logs and errors

