
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/1e54e967-d100-40fe-8c6b-d73d2fc8ed4a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1e54e967-d100-40fe-8c6b-d73d2fc8ed4a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## How to Deploy to GitHub Pages

This blog can be easily deployed to GitHub Pages for free hosting. Follow these steps:

### Option 1: Automatic Deployment with GitHub Actions (Recommended)

1. **Connect to GitHub** (if not already done):
   - In Lovable, click the GitHub button in the top right
   - Follow the prompts to create a GitHub repository

2. **Enable GitHub Pages**:
   - Go to your GitHub repository
   - Click on "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "GitHub Actions"

3. **Create GitHub Actions Workflow**:
   - In your repository, create `.github/workflows/deploy.yml` with this content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: './dist'
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

4. **Configure Vite for GitHub Pages**:
   - Update your `vite.config.ts` to include the correct base path:
   ```typescript
   export default defineConfig({
     base: '/your-repository-name/',
     // ... rest of config
   });
   ```

5. **Push Changes**:
   - Commit and push your changes
   - GitHub Actions will automatically build and deploy your site
   - Your blog will be available at: `https://yourusername.github.io/your-repository-name/`

### Option 2: Manual Deployment

1. **Build the project locally**:
   ```sh
   npm run build
   ```

2. **Install GitHub Pages CLI** (optional):
   ```sh
   npm install -g gh-pages
   ```

3. **Deploy**:
   ```sh
   gh-pages -d dist
   ```

### Custom Domain (Optional)

If you want to use a custom domain:

1. In your repository, go to Settings > Pages
2. Under "Custom domain", enter your domain name
3. Create a `CNAME` file in your repository root with your domain name
4. Configure your domain's DNS to point to GitHub Pages

### Important Notes

- Make sure your repository is public for free GitHub Pages hosting
- The first deployment might take a few minutes
- Any pushes to the main branch will trigger a new deployment
- Your site URL will be: `https://yourusername.github.io/repository-name/`

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1e54e967-d100-40fe-8c6b-d73d2fc8ed4a) and click on Share -> Publish.

Alternatively, follow the GitHub Pages deployment instructions above for free hosting.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
