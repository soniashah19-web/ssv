# Serviced Offices CRM System

A comprehensive Customer Relationship Management (CRM) system built specifically for serviced offices businesses. Track customers, bookings, invoices, and communications all in one place.

## Features

### 1. Customer Management
- Complete customer database with company and contact information
- Customer type classification (Serviced Office, Virtual Office, Meeting Room, Mixed)
- Payment status tracking (Good, Warning, Blocked)
- Outstanding balance monitoring
- Search and filter capabilities

### 2. Booking System with Payment Validation
- Create bookings for:
  - Serviced offices
  - Virtual offices
  - Meeting rooms (hourly/daily)
- **Automatic payment status validation** - prevents bookings for customers with blocked status
- Warning alerts for customers with outstanding payments
- Booking status tracking (Pending, Confirmed, Cancelled, Completed)
- Payment tracking for each booking

### 3. Invoice & Payment Tracking
- Create and manage invoices
- Automatic overdue detection
- Mark invoices as paid
- **Automatic customer payment status updates** based on outstanding invoices
- Invoice filtering by status
- Link invoices to specific bookings

### 4. Communication Hub
- Log all customer interactions (phone calls, emails, meetings, notes)
- Complete communication history for each customer
- Mark important communications
- Filter by communication type
- **All employees can see the latest communication** - solving the problem of being out of sync

### 5. Dashboard
- Real-time statistics overview
- Customers needing attention (payment warnings/blocked)
- Upcoming bookings with payment status warnings
- Recent communications
- Outstanding balance totals
- Overdue invoice alerts

### 6. User Management & Authentication
- Secure JWT-based authentication
- Role-based access (Admin, Manager, Staff)
- User profiles

## Technology Stack

### Backend
- **Node.js** with **Express** - REST API server
- **TypeScript** - Type-safe code
- **PostgreSQL** - Relational database
- **Sequelize ORM** - Database modeling and queries
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Modern styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **date-fns** - Date formatting
- **Vite** - Fast build tool

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ssv
```

### 2. Database Setup
Create a PostgreSQL database:
```bash
createdb serviced_offices_crm
```

### 3. Backend Setup
```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env and configure your database credentials:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=serviced_offices_crm
# DB_USER=your_postgres_user
# DB_PASSWORD=your_postgres_password
# JWT_SECRET=your_secret_key_here

# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Start the backend server (development mode)
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup
```bash
cd ../frontend

# Copy environment file
cp .env.example .env

# Edit .env if needed (default should work)
# VITE_API_URL=http://localhost:5000/api

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 5. Access the Application
1. Open your browser and navigate to `http://localhost:3000`
2. Register a new account (first user should be admin)
3. Start using the CRM system!

## Running Both Services Together

From the root directory:
```bash
# Install all dependencies
npm run install:all

# Run both backend and frontend concurrently
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile

### Customers
- `GET /api/customers` - Get all customers (with filters)
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/customers/:id/payment-status` - Check payment status

### Bookings
- `GET /api/bookings` - Get all bookings (with filters)
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create booking (validates payment status)
- `PUT /api/bookings/:id` - Update booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking

### Invoices
- `GET /api/invoices` - Get all invoices (with filters)
- `GET /api/invoices/overdue` - Get overdue invoices
- `GET /api/invoices/:id` - Get invoice details
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `PATCH /api/invoices/:id/mark-paid` - Mark invoice as paid

### Communications
- `GET /api/communications` - Get all communications (with filters)
- `GET /api/communications/recent` - Get recent communications
- `GET /api/communications/:id` - Get communication details
- `POST /api/communications` - Log communication
- `PUT /api/communications/:id` - Update communication
- `DELETE /api/communications/:id` - Delete communication

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Key Features That Solve Your Problems

### Problem 1: Booking customers who haven't paid invoices
**Solution:**
- The system automatically checks payment status when creating bookings
- Customers with "blocked" status (outstanding balance > $1000) cannot be booked
- You'll see a clear error message preventing the booking
- Customers with "warning" status can be booked but you'll get an alert

### Problem 2: Employees not up to date with latest communications
**Solution:**
- All communications are logged in a central hub
- Every employee can see the complete communication history for any customer
- Communications appear on the customer detail page
- Recent communications show on the dashboard
- Filter communications by type, date, or customer

### How Payment Status Works
1. **Good** - No outstanding invoices, can book freely
2. **Warning** - Outstanding balance between $0-$1000, can book with warning
3. **Blocked** - Outstanding balance > $1000, booking prevented

When invoices are marked as paid, the customer's payment status automatically updates!

## Database Schema

### Key Models
- **Users** - Staff accounts with roles
- **Customers** - Customer/company information with payment tracking
- **Bookings** - Office and meeting room reservations
- **Invoices** - Billing and payment tracking
- **Communications** - Interaction logs

## Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with hot reload
npm run build  # Compile TypeScript
npm start  # Run production build
```

### Frontend Development
```bash
cd frontend
npm run dev  # Development server with hot reload
npm run build  # Production build
npm run preview  # Preview production build
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Configure production database
3. Set strong `JWT_SECRET`
4. Build: `npm run build`
5. Start: `npm start`

### Frontend
1. Configure production API URL in `.env`
2. Build: `npm run build`
3. Deploy `dist` folder to static hosting (Netlify, Vercel, etc.)

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=serviced_offices_crm
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- CORS configuration
- SQL injection prevention via Sequelize ORM
- Input validation

## Future Enhancements
- Email notifications for overdue invoices
- PDF invoice generation
- Calendar view for bookings
- Advanced reporting and analytics
- Customer portal for self-service
- Integration with payment gateways
- SMS notifications
- Document management
- Contract management
- Automated payment reminders

## Support
For issues, questions, or feature requests, please contact your development team.

## License
Proprietary - All rights reserved
