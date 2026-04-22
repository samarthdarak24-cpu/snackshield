# 🧪 Dashboard & AI Agent Testing Guide

## Overview
This guide tests all 4 dashboards with their integrated AI agents in the SnackShield system.

---

## 🎯 Test Accounts

| Role | Email | Password | Dashboard Route |
|------|-------|----------|----------------|
| **Admin** | admin@test.com | test123 | `/dashboard` |
| **Manufacturer** | manufacturer@test.com | test123 | `/dashboard` |
| **Distributor** | distributor@test.com | test123 | `/distributor-dashboard` |
| **Retailer** | retailer@test.com | test123 | `/retailer-dashboard` |

---

## 📊 Dashboard 1: Admin/Manufacturer Dashboard

### Location
`/dashboard` (Default for Admin & Manufacturer roles)

### Features to Test
✅ **KPI Cards**
- Total Products (with sparkline chart)
- Active Batches (with sparkline chart)
- Total Scans (with sparkline chart)
- Fraud Alerts (with sparkline chart)

✅ **Main Charts**
- Scan Activity Trends (7-day area chart)
- Regional Distribution (donut chart)

✅ **Data Panels**
- Top Products (most scanned items)
- Recent Activity (latest verifications)
- System Alerts (real-time notifications)

✅ **Role-Specific Messages**
- Admin: "Administrator Dashboard - System-wide overview"
- Manufacturer: "Manufacturer Dashboard - Monitor product batches"

### AI Agent: None (General dashboard)
This dashboard shows overview metrics without a dedicated AI agent.

---

## 📊 Dashboard 2: Distributor Dashboard

### Location
`/distributor-dashboard`

### Features to Test
✅ **KPI Cards**
- Active Shipments (with trend indicator)
- Total Batches (with trend indicator)
- Scans Processed (with trend indicator)
- Fraud Detected (with trend indicator)

✅ **Main Charts**
- Weekly Scan Activity (area chart - genuine vs flagged)
- Journey Stages Distribution (pie chart showing Manufacturer → Distributor → Retailer → Customer)

✅ **Live Shipments Panel**
- Real-time product location tracking
- Status indicators (Verified, In Transit, Delivered, Suspicious)
- Risk scores for each shipment
- Location information

✅ **Tab Navigation**
- Overview
- Shipments
- Analytics

### 🤖 AI Agent: Supply Chain Anomaly Agent

**Location:** Bottom left panel with dark gradient background

**Features:**
1. **Health Score** (0-100)
   - Visual progress bar
   - Color-coded: Green (80+), Yellow (50-79), Red (<50)

2. **Anomaly Detection**
   - Detects products stuck in transit (>3 days no update)
   - Shows product name, location, days since update
   - Provides recommendations

3. **AI Insights**
   - High-risk product detection (risk score > 60)
   - Critical alert monitoring
   - Severity levels: Low, Medium, High, Critical

4. **Real-time Status**
   - "Agent Active" indicator with pulse animation
   - Last analyzed timestamp
   - Total products analyzed count

**Test Cases:**
```
1. Login as distributor@test.com
2. Navigate to /distributor-dashboard
3. Verify AI Agent panel appears (purple/indigo gradient)
4. Check Health Score displays (should show 84 with mock data)
5. Expand/collapse agent panel using chevron button
6. Verify anomalies section shows stuck shipments
7. Verify insights section shows high-risk products
8. Check "Agent Active" status indicator
```

---

## 📊 Dashboard 3: Retailer Dashboard

### Location
`/retailer-dashboard`

### Features to Test
✅ **KPI Cards**
- Products in Store
- Total Scans Today
- Verified Genuine
- Fake Detected

✅ **Main Charts**
- Hourly Scan Activity (bar chart - last 24 hours)
- Top Scanned Products (with progress bars)

✅ **Quick Verify Widget**
- Input field for QR code/Product ID
- Instant verification button
- Result display with color-coded status:
  - Genuine (green)
  - Suspicious (orange)
  - Expired (red)
  - Unknown (gray)
- Shows product details, batch ID, expiry date, risk score

✅ **Verification Rate Badge**
- Displays in header
- Color-coded: Green (90%+), Orange (<90%)

### 🤖 AI Agent: Counterfeit Detection Agent

**Location:** Bottom left panel with dark gradient background (emerald/green theme)

**Features:**
1. **Safety Score** (0-100)
   - Store safety metric
   - Visual progress bar
   - Color-coded: Green (80+), Yellow (50-79), Red (<50)

2. **Threat Detection**
   - Rapid scanning detection (>5 scans in 1 hour)
   - Multiple location scanning patterns
   - Counterfeit probe identification
   - Severity: High, Critical

3. **Recommendations**
   - High fake ratio products (>15% suspicious scans)
   - Expiry risk alerts (products expiring within 7 days)
   - Pull-from-shelf recommendations

4. **Real-time Monitoring**
   - "Agent Active" indicator
   - Total scans analyzed count
   - Last scan timestamp

**Test Cases:**
```
1. Login as retailer@test.com
2. Navigate to /retailer-dashboard
3. Verify AI Agent panel appears (emerald/green gradient)
4. Check Safety Score displays (should show 91 with mock data)
5. Expand/collapse agent panel
6. Verify recommendations section (should show expiry risk)
7. Test Quick Verify widget:
   - Enter "BCH-001-001"
   - Click Verify
   - Check result display
8. Verify "Agent Active" status indicator
```

---

## 📊 Dashboard 4: General Dashboard (Fallback)

### Location
`/dashboard` (for any authenticated user)

### Features
Same as Dashboard 1 (Admin/Manufacturer) but adapts message based on user role.

**Role Messages:**
- Admin: "Administrator Dashboard"
- Manufacturer: "Manufacturer Dashboard"
- Distributor: "Distributor Dashboard"
- Retailer: "Retailer Dashboard"

---

## 🧠 AI Agent Summary

### Agent 1: Supply Chain Anomaly Agent (Distributor)
**Purpose:** Monitor supply chain health and detect logistics anomalies
**Key Metrics:**
- Health Score (0-100)
- Anomalies detected
- Products analyzed

**Detection Capabilities:**
- Stuck shipments (>3 days no movement)
- High-risk products (risk score > 60)
- Critical unresolved alerts

**Backend:** `/api/distributor/dashboard` → `runSupplyChainAgent()`

---

### Agent 2: Counterfeit Detection Agent (Retailer)
**Purpose:** Detect counterfeit products and protect customers
**Key Metrics:**
- Safety Score (0-100)
- Threats detected
- Scans analyzed

**Detection Capabilities:**
- Rapid scanning patterns (>5 scans/hour)
- High fake ratio products (>15% suspicious)
- Expiry risk detection (within 7 days)

**Backend:** `/api/retailer/dashboard` → `runCounterfeitAgent()`

---

## 🔄 Testing Workflow

### Step 1: Start Backend Server
```bash
cd snackshield-mern/server
npm start
```
Server should run on `http://localhost:5000`

### Step 2: Start Frontend
```bash
cd snackshield-mern/client
npm run dev
```
Client should run on `http://localhost:5173`

### Step 3: Test Each Dashboard

#### Test Distributor Dashboard
1. Navigate to `http://localhost:5173/login`
2. Login with `distributor@test.com` / `test123`
3. Navigate to `/distributor-dashboard`
4. Verify all KPI cards load
5. Check AI Supply Chain Agent panel
6. Verify Health Score displays
7. Check anomalies and insights
8. Test Live Shipments panel
9. Click Refresh button

#### Test Retailer Dashboard
1. Logout and login with `retailer@test.com` / `test123`
2. Navigate to `/retailer-dashboard`
3. Verify all KPI cards load
4. Check AI Counterfeit Agent panel
5. Verify Safety Score displays
6. Check threats and recommendations
7. Test Quick Verify widget with sample QR codes
8. Click Refresh button

#### Test Admin Dashboard
1. Logout and login with `admin@test.com` / `test123`
2. Navigate to `/dashboard`
3. Verify role-specific message shows "Administrator Dashboard"
4. Check all charts and panels load

#### Test Manufacturer Dashboard
1. Logout and login with `manufacturer@test.com` / `test123`
2. Navigate to `/dashboard`
3. Verify role-specific message shows "Manufacturer Dashboard"
4. Check all features work

---

## ✅ Success Criteria

### All Dashboards
- [ ] No console errors
- [ ] All KPI cards display correctly
- [ ] Charts render without issues
- [ ] Refresh button works
- [ ] Role-specific messages display
- [ ] Navigation works smoothly

### Distributor Dashboard
- [ ] AI Supply Chain Agent panel visible
- [ ] Health Score displays (0-100)
- [ ] Anomalies section shows data
- [ ] Insights section shows recommendations
- [ ] Agent Active indicator pulses
- [ ] Live Shipments panel shows 5 items
- [ ] Risk scores display correctly

### Retailer Dashboard
- [ ] AI Counterfeit Agent panel visible
- [ ] Safety Score displays (0-100)
- [ ] Threats section shows data
- [ ] Recommendations section shows alerts
- [ ] Quick Verify widget functional
- [ ] Verification rate badge shows in header
- [ ] Top Scanned products display

---

## 🐛 Troubleshooting

### Issue: AI Agent shows "No data"
**Solution:** Backend may not be running. Check mock data fallback is working.

### Issue: Dashboard not loading
**Solution:** Verify user is logged in and has correct role.

### Issue: Charts not rendering
**Solution:** Check recharts library is installed: `npm install recharts`

### Issue: Quick Verify returns error
**Solution:** Backend API may be down. Widget should show error message gracefully.

---

## 📝 Notes

- All dashboards use **mock data fallback** if backend is unavailable
- AI agents run **real-time analysis** when backend is connected
- Dashboards auto-refresh data every time Refresh button is clicked
- All animations use **Framer Motion** for smooth transitions
- Color schemes are role-specific:
  - Distributor: Purple/Cyan
  - Retailer: Emerald/Cyan
  - Admin/Manufacturer: Purple/Cyan/Emerald mix

---

## 🎨 Visual Indicators

### AI Agent Status
- 🟢 **Green pulse** = Agent Active
- 🔄 **Spinning icon** = Analyzing/Loading
- 🔴 **Red** = Critical severity
- 🟠 **Orange** = High/Medium severity
- 🔵 **Cyan** = Info/Low severity

### Risk Scores
- **0-30**: Green (Low risk)
- **31-60**: Orange (Medium risk)
- **61-100**: Red (High risk)

---

## 🚀 Next Steps

After testing all 4 dashboards:
1. Document any bugs found
2. Test with real backend data
3. Verify AI agent accuracy
4. Test on different screen sizes
5. Check mobile responsiveness
6. Performance testing with large datasets

---

**Last Updated:** $(date)
**Version:** 1.0.0
**Status:** ✅ Ready for Testing
