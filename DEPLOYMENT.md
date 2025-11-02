# Deployment Guide

## Netlify Deployment (Frontend)

### Quick Deploy to Netlify

1. **Connect your repository to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect to your Git provider and select this repository

2. **Configure Build Settings**

   The `netlify.toml` file is already configured, but you can verify these settings:

   - **Base directory**: `/`
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Publish directory**: `frontend/dist`
   - **Node version**: `18`

3. **Set Environment Variables**

   In Netlify Dashboard → Site settings → Environment variables, add:

   ```
   VITE_API_URL=https://your-backend-api.com/api
   ```

   **Important**: Replace with your actual backend API URL

4. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete
   - Your site will be live at a Netlify URL (e.g., `your-site.netlify.app`)

### For Preview/Demo Without Backend

If you want to see the UI without a backend, you can use a mock backend or just view the frontend:

1. The app will try to connect to the backend, but you can still see:
   - Login/Register pages
   - UI layout and design
   - Navigation structure

2. To actually use the app, you'll need to deploy the backend first.

## Backend Deployment Options

### Option 1: Heroku (Recommended for Quick Deploy)

1. **Create a Heroku account** at [heroku.com](https://heroku.com)

2. **Install Heroku CLI** and login:
   ```bash
   heroku login
   ```

3. **Create a new app**:
   ```bash
   heroku create your-crm-api
   ```

4. **Add PostgreSQL addon**:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

5. **Set environment variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_super_secret_key_here
   heroku config:set CORS_ORIGIN=https://your-netlify-site.netlify.app
   ```

6. **Deploy**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

7. **Run migrations**:
   ```bash
   heroku run npm run db:migrate
   ```

8. **Get your API URL**:
   ```bash
   heroku info
   ```
   Use this URL in your Netlify environment variables.

### Option 2: Railway (Modern Alternative)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect the backend
5. Add PostgreSQL database
6. Set environment variables in Railway dashboard
7. Deploy

### Option 3: Render (Free Tier Available)

1. Go to [render.com](https://render.com)
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Create a PostgreSQL database
6. Link database to web service
7. Set environment variables
8. Deploy

### Option 4: DigitalOcean App Platform

1. Go to DigitalOcean App Platform
2. Create new app from GitHub
3. Configure backend service
4. Add managed PostgreSQL database
5. Set environment variables
6. Deploy

### Option 5: AWS (EC2 + RDS)

For production-grade deployment:
1. Set up EC2 instance
2. Configure RDS PostgreSQL database
3. Set up security groups and networking
4. Deploy Node.js app to EC2
5. Use PM2 for process management
6. Configure Nginx as reverse proxy

## Environment Variables Checklist

### Backend (.env)
```
PORT=5000
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=serviced_offices_crm
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-netlify-site.netlify.app
```

### Frontend (Netlify Environment Variables)
```
VITE_API_URL=https://your-backend-api.com/api
```

## Post-Deployment Checklist

- [ ] Backend is deployed and accessible
- [ ] Database is created and migrations are run
- [ ] Environment variables are set correctly
- [ ] Frontend is deployed to Netlify
- [ ] Frontend can connect to backend (check CORS)
- [ ] Test login/register functionality
- [ ] Test creating a customer
- [ ] Test creating a booking
- [ ] Test invoice creation
- [ ] Test communication logging

## Troubleshooting

### CORS Errors
- Make sure `CORS_ORIGIN` in backend matches your Netlify URL exactly
- Include `https://` in the URL
- No trailing slash

### Database Connection Errors
- Verify database credentials
- Check if database allows connections from your hosting IP
- Ensure migrations have been run

### Build Failures
- Check Node.js version (should be 18+)
- Clear build cache and retry
- Check for TypeScript errors
- Ensure all dependencies are in package.json

### API Connection Errors
- Verify `VITE_API_URL` in Netlify
- Make sure backend is running and accessible
- Check API endpoint URLs (should include `/api`)
- Test backend health endpoint: `GET /health`

## Testing the Deployment

1. **Test Backend Health**:
   ```bash
   curl https://your-backend-api.com/health
   ```
   Should return: `{"status":"ok","message":"CRM API is running"}`

2. **Test Frontend**:
   - Visit your Netlify URL
   - Try to register a new account
   - Check browser console for any errors

3. **Test Full Flow**:
   - Register/Login
   - Create a customer
   - Create a booking
   - Create an invoice
   - Log a communication

## Security Best Practices

1. **Use strong JWT secrets** (generate with: `openssl rand -base64 32`)
2. **Enable HTTPS** (automatic with Netlify and most hosting)
3. **Set secure CORS origins** (don't use wildcard in production)
4. **Use environment variables** for all secrets
5. **Enable database SSL** in production
6. **Implement rate limiting** (consider adding express-rate-limit)
7. **Keep dependencies updated** (run `npm audit` regularly)

## Monitoring and Maintenance

1. **Set up error monitoring** (Sentry, LogRocket, etc.)
2. **Monitor database performance**
3. **Set up automated backups** for database
4. **Monitor API response times**
5. **Set up uptime monitoring** (UptimeRobot, Pingdom)

## Scaling Considerations

As your business grows:
1. **Database**: Upgrade to larger PostgreSQL instance
2. **Backend**: Scale horizontally with load balancer
3. **Caching**: Add Redis for session management
4. **CDN**: Use Cloudflare or similar for static assets
5. **Database Optimization**: Add indexes, optimize queries
6. **Background Jobs**: Use Bull or similar for async tasks
