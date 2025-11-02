# Demo Mode - Preview Without Backend

The CRM system now includes a **full-featured demo mode** that allows anyone to preview and interact with the system without needing authentication or a backend API.

## What is Demo Mode?

Demo mode uses realistic mock data to simulate a fully functional CRM system. You can:
- ✅ Browse all pages and features
- ✅ View sample customers, bookings, invoices, and communications
- ✅ See how the payment validation system works
- ✅ Test creating new records (simulated)
- ✅ Experience the full UI/UX
- ✅ No login required - automatic demo user login

## Features in Demo Mode

### Sample Data Included:
- **5 Customers** with different payment statuses (good, warning, blocked)
- **4 Bookings** across different services
- **5 Invoices** including paid and overdue invoices
- **5 Communication logs** with various interaction types
- **Complete Dashboard** with real-time statistics

### Full Functionality:
- **Customer Management**: View, search, filter customers by payment status
- **Booking System**: See payment validation in action (blocked customers can't book)
- **Invoice Tracking**: View overdue invoices, mark as paid (simulated)
- **Communications**: Browse customer interaction history
- **Dashboard**: Real-time stats and alerts

### Demo Scenarios You Can Test:

1. **Good Customer** (Tech Startup Inc)
   - No outstanding balance
   - Can create bookings freely
   - Example of ideal customer relationship

2. **Warning Customer** (Marketing Solutions Ltd)
   - $750 outstanding balance
   - Can still book but with warnings
   - Shows the warning alert system

3. **Blocked Customer** (Legal Associates)
   - $2,500 outstanding (multiple unpaid invoices)
   - **Cannot create bookings** - try it!
   - Demonstrates the payment protection feature

4. **Overdue Invoices**
   - See how the system highlights overdue payments
   - Visual indicators and alert colors
   - Dashboard warnings for attention needed

## How Demo Mode Works

### Automatic Login
- No registration or login required
- Automatically logged in as "Demo User" (Admin role)
- Full access to all features

### Mock Data Service
- All API calls are intercepted
- Returns realistic sample data instantly
- Simulates delays for realistic feel
- Data appears to save but isn't persistent (refresh = reset)

### Visual Indicators
- **Orange banner at top** shows "Demo Mode Active"
- Indicates that changes won't be saved
- Can be dismissed

## Enabling/Disabling Demo Mode

### For Netlify Deployment (Current Setting):
Demo mode is **enabled by default** for preview deployments.

Environment variable in `netlify.toml`:
```toml
[build.environment]
  VITE_DEMO_MODE = "true"
```

### To Disable Demo Mode:
When you deploy with a real backend, set in Netlify:
```
VITE_DEMO_MODE=false
VITE_API_URL=https://your-actual-api.com/api
```

### For Local Development:
Edit `frontend/.env`:
```bash
# Enable demo mode
VITE_DEMO_MODE=true

# Disable demo mode (use real backend)
VITE_DEMO_MODE=false
VITE_API_URL=http://localhost:5000/api
```

## Benefits of Demo Mode

### For Previews:
- ✅ **No backend needed** - Deploy frontend only to Netlify
- ✅ **Instant preview** - See the system immediately
- ✅ **Share easily** - Send link to stakeholders
- ✅ **Test UI/UX** - Validate design and workflows

### For Development:
- ✅ **Frontend development** without backend dependency
- ✅ **UI testing** with consistent data
- ✅ **Quick iterations** on design
- ✅ **Demo presentations** without setup

### For Stakeholders:
- ✅ **Interactive demo** better than screenshots
- ✅ **Self-service** preview anytime
- ✅ **Safe to explore** - no real data affected
- ✅ **Full feature set** visible

## What Works in Demo Mode

| Feature | Demo Mode | Notes |
|---------|-----------|-------|
| Dashboard | ✅ Full | Sample stats and alerts |
| Customer List | ✅ Full | Search and filter working |
| Customer Details | ✅ Full | Related records shown |
| Create Customer | ✅ Simulated | Appears to save |
| Bookings | ✅ Full | Payment validation active |
| Create Booking | ✅ Simulated | Tests payment rules |
| Invoices | ✅ Full | Overdue detection working |
| Mark Paid | ✅ Simulated | Visual update |
| Communications | ✅ Full | Timeline and filtering |
| Log Communication | ✅ Simulated | Appears to save |
| Search & Filters | ✅ Full | All filters functional |
| Navigation | ✅ Full | All pages accessible |

## What Doesn't Work

| Feature | Status | Reason |
|---------|--------|--------|
| Data Persistence | ❌ | Refresh resets to mock data |
| Real Backend API | ❌ | Not connected |
| Database Queries | ❌ | Using mock data |
| User Registration | ❌ | Auto-logged in |
| Multi-user | ❌ | Single demo user |

## Switching to Production

When you're ready to connect to a real backend:

1. **Deploy Backend** (see DEPLOYMENT.md)

2. **Update Environment Variable** in Netlify:
   ```
   VITE_DEMO_MODE=false
   VITE_API_URL=https://your-backend.com/api
   ```

3. **Redeploy Frontend** (Netlify auto-rebuilds)

4. **Full System Active!** Real data, persistence, multi-user

## Demo Data Details

### Customers (5):
1. Tech Startup Inc - Good standing
2. Marketing Solutions Ltd - Warning (£750 outstanding)
3. Legal Associates - Blocked (£2,500 outstanding)
4. Creative Agency Co - Good standing
5. Finance Consultants - Good standing

### Bookings (4):
- Serviced office rentals
- Meeting room (hourly & daily)
- Virtual office services

### Invoices (5):
- 2 Paid invoices
- 3 Overdue invoices
- Mix of amounts and dates

### Communications (5):
- Phone calls, emails, meetings, notes
- Includes follow-ups and feedback
- Shows interaction timeline

## Try These Demo Scenarios

### Scenario 1: View Blocked Customer
1. Go to **Customers**
2. Filter by **"Blocked"** status
3. Click **"Legal Associates"**
4. See **$2,500 outstanding** balance
5. View **multiple overdue invoices**
6. Try creating a booking → **Blocked!**

### Scenario 2: Create Booking with Warning
1. Go to **Bookings**
2. Click **"Create Booking"**
3. Select **"Marketing Solutions Ltd"** (warning status)
4. Fill in booking details
5. Submit → Success with **warning message**

### Scenario 3: Dashboard Overview
1. Go to **Dashboard**
2. See **1 customer with warnings, 1 blocked**
3. View **$3,250 total outstanding**
4. Check **3 overdue invoices**
5. See **"Customers Needing Attention"** section

### Scenario 4: Communication Timeline
1. Go to **Communications**
2. Browse interaction history
3. Filter by type (phone, email, meeting)
4. See how team tracks customer conversations
5. Try logging a new communication

## Perfect For:

- 🎯 **Stakeholder demos** - "See it in action"
- 🎯 **UI/UX feedback** - "Test the interface"
- 🎯 **Feature validation** - "Confirm requirements"
- 🎯 **Quick previews** - "Share the link"
- 🎯 **No-setup testing** - "Just works"

## Current Status

✅ **Demo Mode Active** on Netlify deployment
✅ **Full features available** for preview
✅ **No backend required** for initial deployment
✅ **Ready to share** the preview URL

When you're satisfied with the demo and ready for production, follow the deployment guide in `DEPLOYMENT.md` to connect a real backend!
