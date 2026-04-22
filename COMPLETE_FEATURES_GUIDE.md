# 📘 SnackShield - Complete Features Guide

## 🎯 All 4 Dashboards & Features Explained

This comprehensive guide explains every feature of all 4 user roles and how the entire system works.

---

## 📑 Table of Contents

1. [System Overview](#system-overview)
2. [User Roles](#user-roles)
3. [Dashboard Features (All Roles)](#dashboard-features)
4. [Verify Product Page](#verify-product-page)
5. [Analytics Dashboard](#analytics-dashboard)
6. [Batch Management](#batch-management)
7. [Companies Management](#companies-management)
8. [Scan History](#scan-history)
9. [Settings](#settings)
10. [How Everything Works](#how-everything-works)

---

## 🌐 System Overview

**SnackShield** is an AI-powered product authentication system that uses:
- **Blockchain Technology** - Immutable product records
- **QR Code Verification** - Instant product authentication
- **AI Fraud Detection** - Machine learning to detect counterfeits
- **Real-time Analytics** - Track scans and fraud patterns

### Technology Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB
- **Authentication:** JWT tokens + bcrypt
- **Charts:** Recharts library
- **QR Codes:** html5-qrcode + react-qr-code

---

## 👥 User Roles

### 1. 👑 Administrator
**Access Level:** Full system access

**Capabilities:**
- View system-wide analytics
- Manage all companies and users
- Access all features
- Monitor fraud detection across all partners
- Export comprehensive reports

**Dashboard View:** "Administrator Dashboard - System-wide overview and management controls"

---

### 2. 🏭 Manufacturer
**Access Level:** Product creation and batch management

**Capabilities:**
- Create product batches
- Generate QR codes
- Monitor their products
- Track authentication metrics
- View scan history for their products

**Dashboard View:** "Manufacturer Dashboard - Monitor your product batches and authentication metrics"

---

### 3. 🚚 Distributor
**Access Level:** Supply chain tracking

**Capabilities:**
- Track product distribution
- Monitor supply chain integrity
- View distribution analytics
- Verify products in transit
- Access scan history

**Dashboard View:** "Distributor Dashboard - Track supply chain integrity and distribution analytics"

---

### 4. 🏪 Retailer
**Access Level:** Product verification

**Capabilities:**
- Verify product authenticity
- Scan QR codes
- Monitor customer scans
- View verification history
- Report suspicious products

**Dashboard View:** "Retailer Dashboard - Verify products and monitor customer scan activity"

---

## 📊 Dashboard Features (All Roles)

### Main Dashboard (`/dashboard`)

#### 🎨 Header Section
- **Role-specific title** - Shows your role (Admin, Manufacturer, Distributor, Retailer)
- **Role badge** - Purple badge displaying your role
- **Current date** - Full date display with calendar icon
- **Personalized subtitle** - Custom message based on your role

#### 📈 KPI Cards (4 Cards)

**1. Total Products** 
- **Icon:** Package (Purple)
- **Shows:** Total number of products in system
- **Trend:** Percentage change (+12%)
- **Color:** Purple gradient

**2. Active Batches**
- **Icon:** Layers (Teal)
- **Shows:** Number of active production batches
- **Trend:** Percentage change (+5%)
- **Color:** Teal gradient

**3. Total Scans**
- **Icon:** Scan (Emerald)
- **Shows:** Total verification attempts
- **Trend:** Percentage change (+28%)
- **Color:** Emerald gradient

**4. Fraud Alerts**
- **Icon:** Alert Triangle (Red)
- **Shows:** Number of counterfeit products detected
- **Trend:** Percentage change (-15% is good!)
- **Color:** Red gradient

#### 📉 Scan Activity Chart
**Type:** Area Chart (7-day view)

**Features:**
- **Purple line:** Genuine products verified
- **Red line:** Flagged/fake products detected
- **Interactive tooltips:** Hover to see exact numbers
- **Gradient fill:** Visual depth with transparency
- **X-axis:** Days of the week (Mon-Sun)
- **Y-axis:** Number of scans

**Data Shown:**
- Daily scan volume
- Genuine vs fake ratio
- Weekly trends
- Peak scanning days

#### 🕐 Recent Activity Feed
**Shows last 4 verifications:**

**Each item displays:**
- **Status dot:** Green (Genuine) or Red (Flagged)
- **Product name:** e.g., "Organic Snacks Batch A"
- **Product ID:** e.g., "SNK-001"
- **Timestamp:** e.g., "2 min ago"
- **Hover effect:** Highlights on mouse over

**Features:**
- Real-time updates
- Color-coded status
- Clickable items
- "View All Activity" button at bottom

---

## 🔍 Verify Product Page (`/verify`)

### Purpose
Verify product authenticity using serial numbers or QR codes.

### Main Features

#### 1. **Input Section**
**Serial Number Entry:**
- Large input field with barcode icon
- Monospace font for easy reading
- Placeholder: "SNK-X00-1122"
- Press Enter to verify
- Auto-focus on page load

**Buttons:**
- **Verify Authenticity** (Purple gradient)
  - Shows loading spinner when processing
  - Disabled when empty
  - Displays "Verifying..." during check
  
- **Scan QR Code** (Gray)
  - Opens camera scanner
  - Uses device camera
  - Auto-detects QR codes
  - Closes after successful scan

#### 2. **QR Code Scanner**
**Features:**
- Live camera preview
- Red scanning box overlay
- Auto-detection
- Works on mobile and desktop
- Supports all QR code formats

**How it works:**
1. Click "Scan" button
2. Allow camera access
3. Point at QR code
4. Auto-scans and verifies
5. Shows result immediately

#### 3. **Verification Result Card**

**For GENUINE Products:**
- **Green theme** with emerald colors
- **Large checkmark icon**
- **"Verification Successful"** heading
- **Product details grid:**
  - Product Name (e.g., "Organic Protein Bars")
  - Manufacturer (e.g., "Acme Corporation")
  - Batch ID (e.g., "BCH-A1B2C3")
  - Manufacture Date (formatted date)
- **Success message:** "This product has been verified as authentic"

**For FAKE Products:**
- **Red theme** with danger colors
- **Large X icon**
- **"Verification Failed"** heading
- **Warning message:** "This product serial does not exist in our secure ledger"
- **Alert:** "Do not consume or sell"

#### 4. **Sidebar Widgets**

**Verification Stats:**
- **Authentic count:** Green badge with number (142)
- **Counterfeit count:** Red badge with number (3)
- Visual progress indicators

**Recent Scans:**
- Last 5 scans you performed
- Product ID in monospace font
- Status indicator (green/red dot)
- Timestamp for each scan
- Empty state when no scans

**Location Info:**
- Current location display
- GPS coordinates (if available)
- Note: "Verification location will be recorded"
- Used for fraud pattern detection

---

## 📊 Analytics Dashboard (`/analytics`)

### Purpose
Deep insights into fraud detection and product verification patterns.

### Features

#### 1. **Top Stats Row (4 Cards)**

**Total Scans:**
- Icon: Activity
- Value: 12,847
- Change: +23%
- Color: Purple

**Fraud Detected:**
- Icon: Alert Triangle
- Value: 142
- Change: -8% (good!)
- Color: Red

**Authentic Rate:**
- Icon: Shield Check
- Value: 98.9%
- Change: +2%
- Color: Emerald

**Avg Response Time:**
- Icon: Trending Up
- Value: 0.3s
- Change: -15% (faster!)
- Color: Purple

#### 2. **Monthly Verification Trends (Bar Chart)**

**Features:**
- 6-month view (Jan-Jun)
- **Green bars:** Genuine products
- **Red bars:** Flagged products
- Side-by-side comparison
- Grid background
- Interactive tooltips

**Shows:**
- Monthly scan volume
- Fraud trends over time
- Seasonal patterns
- Growth indicators

#### 3. **Fraud by Region (Pie Chart)**

**Features:**
- Donut chart design
- 4 regions displayed
- Color-coded segments
- Percentage labels
- Interactive legend

**Regions:**
- North America: 35% (Blue)
- Europe: 28% (Purple)
- Asia Pacific: 22% (Green)
- Others: 15% (Orange)

**Use Case:**
- Identify high-risk regions
- Target fraud prevention efforts
- Geographic distribution analysis

#### 4. **Weekly Scan Activity (Area + Line Chart)**

**Features:**
- 7-day view (Mon-Sun)
- **Blue area:** Total scans
- **Red line:** Fraud detections
- Gradient fill
- Dual-axis display

**Shows:**
- Daily scan patterns
- Fraud correlation
- Peak activity days
- Weekly trends

#### 5. **Export Report Button**
- Download icon
- Exports all analytics data
- PDF/CSV format
- Includes all charts and stats

---

## 📦 Batch Management (`/batches`)

### Purpose
Create and manage product batches with QR code generation.

### Features

#### 1. **Top Statistics (3 Cards)**

**Total Batches:**
- Icon: Boxes
- Shows total batch count
- Updates in real-time

**Active Products:**
- Icon: Package
- Shows product count
- Across all batches

**QR Codes Generated:**
- Icon: QR Code
- Total QR codes created
- Lifetime count

#### 2. **Create New Batch Form**

**Form Fields:**

**Product Name:**
- Text input
- Required field
- Example: "Organic Protein Bars"

**Batch ID:**
- Auto-generated
- Format: BCH-XXXXXX
- Read-only field
- Unique identifier

**Manufacture Date:**
- Date picker
- Defaults to today
- Required field

**Expiry Date:**
- Date picker
- Must be after MFG date
- Required field

**Quantity:**
- Number input
- Units count
- Default: 1000

**Generate Button:**
- Purple gradient
- QR code icon
- Creates batch + QR codes

#### 3. **QR Code Generation**

**After Creation:**
- Shows generated QR code
- Large, scannable size
- White background
- Black QR pattern
- Product ID below
- Download option
- "Done" button to close

**QR Code Contains:**
- Batch ID
- Product identifier
- Verification URL
- Encrypted data

#### 4. **Batches Table**

**Columns:**

**Batch ID:**
- Hash icon
- Monospace font
- Purple color
- Clickable

**Product:**
- Product name
- White text
- Bold font

**Quantity:**
- Number with commas
- "units" label
- Example: "5,000 units"

**Expiry Date:**
- Calendar icon
- Formatted date
- Example: "12/31/2025"

**Status:**
- **Active:** Green badge with checkmark
- **Expiring Soon:** Amber badge with clock
- **Expired:** Red badge with X

**Actions:**
- Three-dot menu
- Edit option
- Delete option
- View details

**Features:**
- Sortable columns
- Hover effects
- Row highlighting
- Export button

---

## 🏢 Companies Management (`/companies`)

### Purpose
Manage network of verified manufacturers and distributors.

### Features

#### 1. **Top Statistics (4 Cards)**

**Total Partners:**
- Icon: Building
- Count of companies
- Purple theme

**Verified:**
- Icon: Shield Check
- Verified companies count
- Emerald theme

**Total Products:**
- Icon: Package
- Sum across all companies
- Purple theme

**Total Users:**
- Icon: Users
- Sum of all company users
- Amber theme

#### 2. **Search & Filter**

**Search Bar:**
- Search icon
- Placeholder: "Search companies..."
- Filters by:
  - Company name
  - Industry
  - Status
- Real-time filtering

#### 3. **Company Cards Grid**

**Each Card Shows:**

**Header:**
- Company logo/icon
- Company name
- Industry type
- Verification badge (if verified)

**Stats Row:**
- **Products:** Number of products
- **Users:** Number of users
- **Status:** Active/Pending badge

**User Avatars:**
- Shows first 3 users
- "+X more" indicator
- Circular avatars

**Actions:**
- Edit button (appears on hover)
- Delete button (appears on hover)
- "View Details" link

**Status Badges:**
- **Active:** Green with pulse dot
- **Pending:** Amber with clock icon

#### 4. **Add Company Button**
- Purple gradient
- Plus icon
- Opens creation form
- Top-right corner

---

## 📜 Scan History (`/history`)

### Purpose
View complete history of all product verifications.

### Features

#### 1. **Filter Options**

**Date Range:**
- Start date picker
- End date picker
- Quick filters (Today, Week, Month)

**Status Filter:**
- All scans
- Genuine only
- Flagged only

**Location Filter:**
- Filter by city/region
- Dropdown selection

#### 2. **History Table**

**Columns:**

**Timestamp:**
- Date and time
- Formatted display
- Sortable

**Product ID:**
- Monospace font
- Clickable
- Links to details

**Product Name:**
- Full product name
- Truncated if long

**Status:**
- Green badge: Genuine
- Red badge: Flagged
- Icon indicator

**Location:**
- City, Country
- GPS coordinates
- Map icon

**User:**
- Who performed scan
- User avatar
- Username

**Actions:**
- View details
- Export record
- Report issue

#### 3. **Export Options**
- Export to CSV
- Export to PDF
- Date range selection
- Filter application

---

## ⚙️ Settings (`/settings`)

### Purpose
Manage account and system preferences.

### Tabs

#### 1. **Profile Tab**

**Profile Header:**
- Large avatar (first letter of name)
- Camera icon to change photo
- Name display
- Role badge
- Access level indicator

**Form Fields:**

**Personal Info:**
- Full Name (editable)
- Email Address (with icon)
- Phone Number (with icon)
- Timezone selector

**Organization:**
- Company name (read-only)
- Role display
- Member since date

**Save Button:**
- Purple gradient
- Save icon
- Bottom-right position

#### 2. **Security Tab**

**Change Password:**
- Current password field
- New password field
- Confirm password field
- Update button
- Password strength indicator

**Two-Factor Authentication:**
- Enable/disable toggle
- QR code for setup
- Backup codes
- Status indicator (Enabled/Disabled)

**Active Sessions:**
- List of logged-in devices
- Device type icons
- Location display
- Last active time
- "Sign out all" button

**API Keys:**
- Generate new key
- View existing keys
- Revoke access
- Copy to clipboard

#### 3. **Notifications Tab**

**Notification Types:**

**Fraud Alerts:**
- Toggle switch
- Description: "Get notified when counterfeit products are detected"
- Email + Push options

**Batch Updates:**
- Toggle switch
- Description: "Receive updates about batch status changes"
- Email only

**System Maintenance:**
- Toggle switch
- Description: "Notifications about scheduled maintenance"
- Email only

**Weekly Reports:**
- Toggle switch
- Description: "Receive weekly analytics reports"
- Email option

**Notification Channels:**
- Email notifications
- Push notifications
- SMS alerts (premium)
- Slack integration

---

## 🔧 How Everything Works

### Authentication Flow

#### Registration Process:
1. User visits `/register`
2. Fills in:
   - Full name
   - Email address
   - Company name
   - Role selection (Manufacturer/Distributor/Retailer/Admin)
   - Password
3. Agrees to terms
4. Clicks "Create Account"
5. **Backend:**
   - Validates input
   - Checks if email exists
   - Hashes password with bcrypt
   - Creates user in MongoDB
   - Generates JWT token
6. **Frontend:**
   - Saves token to localStorage
   - Saves user data to localStorage
   - Auto-redirects to dashboard
7. User is logged in!

#### Login Process:
1. User visits `/login`
2. Enters email and password
3. Clicks "Sign In"
4. **Backend:**
   - Finds user by email
   - Compares password hash
   - Generates JWT token
5. **Frontend:**
   - Saves token to localStorage
   - Saves user data to localStorage
   - Redirects to dashboard
6. User is logged in!

#### Token Management:
- **JWT Token:** Stored in localStorage
- **Expiry:** 24 hours
- **Refresh:** Auto-refresh on activity
- **Logout:** Clears localStorage

---

### Product Verification Flow

#### Step-by-Step Process:

**1. Product Creation (Manufacturer):**
- Manufacturer creates batch
- System generates unique IDs
- QR codes are created
- Products stored in database
- Blockchain record created (hash)

**2. QR Code Printing:**
- Manufacturer downloads QR codes
- Prints on product packaging
- Each product gets unique code

**3. Distribution:**
- Products shipped to distributors
- Distributors can verify authenticity
- Scan history tracked

**4. Retail:**
- Retailers receive products
- Can verify before stocking
- Customers can scan at store

**5. Customer Verification:**
- Customer scans QR code
- System checks database
- Returns verification result
- Records scan location and time

**6. Fraud Detection:**
- AI analyzes scan patterns
- Detects suspicious activity:
  - Multiple scans from different locations
  - Rapid scanning (cloning attempt)
  - Scans from unexpected regions
- Alerts sent to manufacturer
- Product flagged in system

---

### Data Flow Architecture

```
┌─────────────┐
│   Client    │ (React Frontend)
│  Browser    │
└──────┬──────┘
       │ HTTP Requests (JWT Token)
       ↓
┌─────────────┐
│   Express   │ (Node.js Backend)
│   Server    │
└──────┬──────┘
       │
       ├─→ MongoDB (User Data, Products, Scans)
       │
       ├─→ AI Engine (Fraud Detection)
       │
       └─→ Blockchain (Product Hashes)
```

---

### Database Schema

#### Users Collection:
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['Admin', 'Manufacturer', 'Distributor', 'Retailer'],
  company: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Products Collection:
```javascript
{
  _id: ObjectId,
  productName: String,
  company: String,
  batchId: String,
  qrCode: String (unique),
  manufactureDate: Date,
  expiryDate: Date,
  status: String,
  blockchainHash: String,
  createdAt: Date
}
```

#### Batches Collection:
```javascript
{
  _id: ObjectId,
  batchId: String (unique),
  productName: String,
  quantity: Number,
  manufactureDate: Date,
  expiryDate: Date,
  status: String,
  createdBy: ObjectId (User),
  createdAt: Date
}
```

#### Scans Collection:
```javascript
{
  _id: ObjectId,
  productId: String,
  result: String ('Genuine' or 'Fake'),
  location: String,
  user: String,
  timestamp: Date,
  ipAddress: String,
  deviceInfo: Object
}
```

---

### API Endpoints

#### Authentication:
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

#### Products:
- `GET /api/products` - Get all products
- `POST /api/products/create-product` - Create product
- `POST /api/products/verify-product` - Verify authenticity

#### Batches:
- `GET /api/batches` - Get all batches
- `POST /api/batches/create-batch` - Create batch

#### Scans:
- `GET /api/scans/scan-history` - Get scan history
- `POST /api/scans/scan-product` - Record scan

#### Analytics:
- `GET /api/analytics/scan-stats` - Get scan statistics
- `GET /api/analytics/fraud-stats` - Get fraud statistics

---

### Security Features

#### 1. **Password Security:**
- bcrypt hashing (10 rounds)
- Salted passwords
- No plain text storage

#### 2. **JWT Authentication:**
- Signed tokens
- 24-hour expiry
- Secure secret key
- Token validation on each request

#### 3. **API Security:**
- CORS enabled
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

#### 4. **Blockchain Integration:**
- Immutable records
- Cryptographic hashing
- Tamper-proof verification
- Distributed ledger

---

### AI Fraud Detection

#### How It Works:

**1. Data Collection:**
- Every scan is recorded
- Location tracked
- Time stamped
- Device fingerprinted

**2. Pattern Analysis:**
- Scan frequency
- Geographic distribution
- Time patterns
- Device patterns

**3. Anomaly Detection:**
- **Cloning Detection:**
  - Same QR code scanned in multiple locations simultaneously
  - Impossible travel times between scans
  
- **Mass Scanning:**
  - Unusually high scan rate
  - Automated scanning patterns
  
- **Geographic Anomalies:**
  - Scans from unexpected regions
  - Scans outside distribution network

**4. Alert System:**
- Real-time notifications
- Email alerts
- Dashboard warnings
- Automatic flagging

---

### Mobile Responsiveness

#### Breakpoints:
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

#### Mobile Features:
- Touch-optimized buttons
- Swipe gestures
- Camera access for QR scanning
- Responsive charts
- Collapsible sidebar
- Bottom navigation

---

### Performance Optimization

#### Frontend:
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Minification

#### Backend:
- Database indexing
- Query optimization
- Connection pooling
- Response compression
- Caching layer

---

## 🎯 Key Features Summary

### For Administrators:
✅ Full system access
✅ Manage all companies
✅ View global analytics
✅ Export comprehensive reports
✅ User management
✅ System configuration

### For Manufacturers:
✅ Create product batches
✅ Generate QR codes
✅ Track their products
✅ View authentication metrics
✅ Monitor fraud for their products
✅ Export batch reports

### For Distributors:
✅ Verify products in transit
✅ Track supply chain
✅ View distribution analytics
✅ Monitor product flow
✅ Report issues
✅ Access scan history

### For Retailers:
✅ Verify product authenticity
✅ Scan QR codes
✅ Monitor customer scans
✅ View verification history
✅ Report suspicious products
✅ Access verification stats

---

## 🚀 Getting Started

### Quick Start:
1. **Login:** http://localhost:5173/login
2. **Use test account:**
   - Admin: `admin@snackshield.com` / `admin123`
   - Manufacturer: `manufacturer@test.com` / `test123`
   - Distributor: `distributor@test.com` / `test123`
   - Retailer: `retailer@test.com` / `test123`
3. **Explore your role-specific dashboard**
4. **Try verifying a product**
5. **Check analytics**

### Create Your Own Account:
1. Go to http://localhost:5173/register
2. Fill in your details
3. Choose your role
4. Click "Create Account"
5. You're automatically logged in!

---

## 📞 Support

### Need Help?
- Check browser console (F12) for errors
- Verify backend is running (port 5000)
- Check MongoDB connection
- Clear browser cache
- Try different browser

### Common Issues:
- **Can't login:** Check email/password, run seed script
- **QR scanner not working:** Allow camera permissions
- **Charts not loading:** Check API connection
- **Slow performance:** Clear cache, check network

---

**🎉 You now have complete knowledge of all SnackShield features!**

**Enjoy using the system!** 🛡️
