# SnackShield User Guide

## 🎉 Welcome to SnackShield!

Your authentication system is now fully functional with support for all 4 user roles.

---

## 🔐 Test Accounts

You can now login with these pre-created test accounts:

### Administrator
- **Email:** `admin@snackshield.com`
- **Password:** `admin123`
- **Access:** Full system access, analytics, and management

### Manufacturer
- **Email:** `manufacturer@test.com`
- **Password:** `test123`
- **Access:** Product creation, batch management, QR generation

### Distributor
- **Email:** `distributor@test.com`
- **Password:** `test123`
- **Access:** Supply chain tracking, distribution analytics

### Retailer
- **Email:** `retailer@test.com`
- **Password:** `test123`
- **Access:** Product verification, customer scan monitoring

---

## 🚀 Getting Started

### 1. **Create a New Account**
- Go to: http://localhost:5173/register
- Fill in your details
- Select your role (Manufacturer, Distributor, Retailer, or Administrator)
- Click "Create Account"
- You'll be automatically logged in and redirected to your dashboard

### 2. **Login with Existing Account**
- Go to: http://localhost:5173/login
- Enter your email and password
- Click "Sign In"
- Access your role-specific dashboard

### 3. **Explore Your Dashboard**
Each role has a customized dashboard view:
- **Admin Dashboard:** System-wide overview and management
- **Manufacturer Dashboard:** Product batches and authentication metrics
- **Distributor Dashboard:** Supply chain integrity tracking
- **Retailer Dashboard:** Product verification and scan activity

---

## 🎨 New Features

### ✅ Fixed Issues
1. **"User not found" error** - Fixed by adding "Retailer" role to database schema
2. **Registration flow** - Now auto-logs you in after successful registration
3. **All 4 roles supported** - Admin, Manufacturer, Distributor, Retailer

### ✅ Enhanced UI
1. **Professional color scheme** - Purple, Teal, Orange palette
2. **Role-specific dashboards** - Customized views for each user type
3. **Better error handling** - Clear error messages
4. **Improved authentication** - Secure token-based system

---

## 📊 Dashboard Features

### Stats Cards
- **Total Products** - Track your product inventory
- **Active Batches** - Monitor production batches
- **Total Scans** - View authentication attempts
- **Fraud Alerts** - Detect counterfeit products

### Analytics Chart
- 7-day scan activity visualization
- Genuine vs Flagged product tracking
- Interactive tooltips with detailed data

### Recent Activity
- Real-time product verification feed
- Status indicators (Genuine/Flagged)
- Timestamp tracking

---

## 🛠️ Technical Details

### Backend (Port 5000)
- **Framework:** Express.js + MongoDB
- **Authentication:** JWT tokens
- **Password Security:** bcrypt hashing
- **API Endpoints:** RESTful architecture

### Frontend (Port 5173)
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Charts:** Recharts

### Database
- **MongoDB:** Local instance at `mongodb://127.0.0.1:27017/snackshield`
- **Collections:** Users, Products, Batches, Scans

---

## 🔧 Useful Commands

### Seed Test Users
```bash
cd snackshield-mern/server
npm run seed
```

### Start Backend
```bash
cd snackshield-mern/server
npm run dev
```

### Start Frontend
```bash
cd snackshield-mern/client
npm run dev
```

---

## 🎯 Next Steps

1. **Test all 4 roles** - Login with each test account to see role-specific views
2. **Create products** - Use the Manufacturer account to add products
3. **Verify products** - Use the Retailer account to scan and verify
4. **View analytics** - Check the Analytics page for fraud detection insights
5. **Manage batches** - Create and track product batches

---

## 🐛 Troubleshooting

### Can't login?
- Make sure MongoDB is running
- Check that the server is running on port 5000
- Verify your email/password is correct
- Try running `npm run seed` to recreate test accounts

### "User not found" error?
- This has been fixed! The Retailer role is now supported
- Run `npm run seed` to create test accounts
- Or register a new account with any role

### Dashboard not loading?
- Check browser console for errors
- Verify you're logged in (check localStorage for token)
- Make sure the backend API is responding

---

## 📞 Support

If you encounter any issues:
1. Check the browser console (F12)
2. Check the server terminal for errors
3. Verify MongoDB is running
4. Clear browser cache and localStorage

---

## 🎨 Color Scheme

The new professional color palette:
- **Primary:** Purple (#7c3aed) - Main brand color
- **Secondary:** Teal (#14b8a6) - Complementary accent
- **Accent:** Orange (#f97316) - Highlights and CTAs
- **Success:** Emerald (#10b981) - Positive states
- **Danger:** Red (#ef4444) - Alerts and warnings

---

**Enjoy using SnackShield! 🛡️**
