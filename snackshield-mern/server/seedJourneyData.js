/**
 * Seed script: Populates realistic Product Journey data
 * Run with: node seedJourneyData.js
 */
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Batch = require('./models/Batch');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/snackshield';

const journeyProducts = [
  {
    productName: 'Legacy Protein Shake',
    company: 'FitBite Nutrition',
    batchId: 'BCH-LEG-000',
    qrCode: 'SCAN_ID_000000',
    manufactureDate: new Date('2026-01-01'),
    expiryDate: new Date('2027-01-01'),
    status: 'Active',
    totalScans: 1,
    riskScore: 0,
    journeyHistory: [
      {
        role: 'Manufacturer',
        location: 'FitBite Plant, Pune',
        city: 'Pune',
        country: 'India',
        timestamp: new Date('2026-01-01T08:00:00Z'),
        status: 'Verified',
        user: 'FitBite Nutrition',
        notes: 'Initial production for verification testing.'
      }
    ]
  },
  {
    productName: 'Premium Organic Trail Mix',
    company: 'NutriCrunch Foods',
    batchId: 'BCH-NTR-2026A',
    qrCode: 'SNK-A01-1122',
    manufactureDate: new Date('2026-03-10'),
    expiryDate: new Date('2027-03-10'),
    status: 'Active',
    totalScans: 14,
    riskScore: 8,
    journeyHistory: [
      {
        role: 'Manufacturer',
        location: 'NutriCrunch Factory, Pune',
        city: 'Pune',
        country: 'India',
        timestamp: new Date('2026-03-10T06:00:00Z'),
        status: 'Verified',
        user: 'NutriCrunch Foods',
        notes: 'Batch BCH-NTR-2026A produced. 500 units sealed and QR-tagged at factory floor.'
      },
      {
        role: 'Distributor',
        location: 'SpeedLink Logistics Hub, Mumbai',
        city: 'Mumbai',
        country: 'India',
        timestamp: new Date('2026-03-12T14:30:00Z'),
        status: 'Verified',
        user: 'SpeedLink Logistics',
        notes: 'Shipment received at Mumbai cold-chain warehouse. Temperature integrity confirmed at 18°C.'
      },
      {
        role: 'Retailer',
        location: 'FreshMart Superstore, Bandra',
        city: 'Mumbai',
        country: 'India',
        timestamp: new Date('2026-03-14T09:15:00Z'),
        status: 'Verified',
        user: 'FreshMart Retail',
        notes: 'Product shelved in Organic Snacks aisle. Shelf-life validation passed.'
      },
      {
        role: 'Customer',
        location: 'Consumer Scan, Andheri West',
        city: 'Mumbai',
        country: 'India',
        timestamp: new Date('2026-03-15T18:45:00Z'),
        status: 'Verified',
        user: 'End Consumer',
        notes: 'Customer scanned QR at point of purchase. Authenticity confirmed.'
      }
    ]
  },
  {
    productName: 'Spicy Masala Chips (150g)',
    company: 'CrispKing Industries',
    batchId: 'BCH-CRK-4490',
    qrCode: 'SNK-B07-3344',
    manufactureDate: new Date('2026-03-20'),
    expiryDate: new Date('2026-09-20'),
    status: 'Active',
    totalScans: 9,
    riskScore: 12,
    journeyHistory: [
      {
        role: 'Manufacturer',
        location: 'CrispKing Plant, Noida',
        city: 'Noida',
        country: 'India',
        timestamp: new Date('2026-03-20T05:30:00Z'),
        status: 'Verified',
        user: 'CrispKing Industries',
        notes: 'Production line #4. Batch sealed with nitrogen-flush packaging.'
      },
      {
        role: 'Distributor',
        location: 'TransIndia Freight, Delhi NCR',
        city: 'New Delhi',
        country: 'India',
        timestamp: new Date('2026-03-22T11:00:00Z'),
        status: 'Verified',
        user: 'TransIndia Freight',
        notes: 'Loaded onto refrigerated truck DL-14-AB-7821. GPS tracking enabled.'
      },
      {
        role: 'Retailer',
        location: 'BigBasket Warehouse, Bengaluru',
        city: 'Bengaluru',
        country: 'India',
        timestamp: new Date('2026-03-25T08:40:00Z'),
        status: 'Verified',
        user: 'BigBasket Retail',
        notes: 'Received at Bengaluru fulfillment center. 248/250 units intact.'
      }
    ]
  },
  {
    productName: 'Dark Chocolate Protein Bar',
    company: 'FitBite Nutrition',
    batchId: 'BCH-FBN-7710',
    qrCode: 'SNK-C12-5566',
    manufactureDate: new Date('2026-04-01'),
    expiryDate: new Date('2027-01-01'),
    status: 'Active',
    totalScans: 22,
    riskScore: 45,
    suspiciousScans: 3,
    journeyHistory: [
      {
        role: 'Manufacturer',
        location: 'FitBite Factory, Ahmedabad',
        city: 'Ahmedabad',
        country: 'India',
        timestamp: new Date('2026-04-01T07:00:00Z'),
        status: 'Verified',
        user: 'FitBite Nutrition',
        notes: 'Premium batch. Cocoa sourced from certified organic farms in Kerala.'
      },
      {
        role: 'Distributor',
        location: 'BlueDart Express, Surat Hub',
        city: 'Surat',
        country: 'India',
        timestamp: new Date('2026-04-03T16:20:00Z'),
        status: 'In Transit',
        user: 'BlueDart Express',
        notes: 'In transit to Mumbai distribution center. ETA: 48 hours.'
      }
    ]
  },
  {
    productName: 'Roasted Cashew Mix (250g)',
    company: 'NutriCrunch Foods',
    batchId: 'BCH-NTR-2026A',
    qrCode: 'SNK-D05-7788',
    manufactureDate: new Date('2026-03-10'),
    expiryDate: new Date('2027-03-10'),
    status: 'Active',
    totalScans: 6,
    riskScore: 5,
    journeyHistory: [
      {
        role: 'Manufacturer',
        location: 'NutriCrunch Factory, Pune',
        city: 'Pune',
        country: 'India',
        timestamp: new Date('2026-03-10T06:30:00Z'),
        status: 'Verified',
        user: 'NutriCrunch Foods',
        notes: 'Unit 5 of Batch BCH-NTR-2026A. Quality inspection grade: A+.'
      },
      {
        role: 'Distributor',
        location: 'SpeedLink Logistics Hub, Mumbai',
        city: 'Mumbai',
        country: 'India',
        timestamp: new Date('2026-03-12T15:00:00Z'),
        status: 'Verified',
        user: 'SpeedLink Logistics',
        notes: 'Palletized and cross-docked for regional distribution.'
      },
      {
        role: 'Retailer',
        location: 'DMart Hypermarket, Thane',
        city: 'Thane',
        country: 'India',
        timestamp: new Date('2026-03-13T10:30:00Z'),
        status: 'Verified',
        user: 'DMart Retail',
        notes: 'Stocked in premium dry fruits section. FIFO compliance verified.'
      },
      {
        role: 'Customer',
        location: 'Consumer Scan, Thane',
        city: 'Thane',
        country: 'India',
        timestamp: new Date('2026-03-14T20:10:00Z'),
        status: 'Verified',
        user: 'End Consumer',
        notes: 'Verified authentic via SnackShield mobile app scan.'
      }
    ]
  },
  {
    productName: 'Quinoa Puffs – Sea Salt',
    company: 'GreenBowl Organics',
    batchId: 'BCH-GBO-9921',
    qrCode: 'SNK-E18-9900',
    manufactureDate: new Date('2026-04-05'),
    expiryDate: new Date('2026-10-05'),
    status: 'Active',
    totalScans: 3,
    riskScore: 62,
    suspiciousScans: 2,
    journeyHistory: [
      {
        role: 'Manufacturer',
        location: 'GreenBowl Organic Mill, Jaipur',
        city: 'Jaipur',
        country: 'India',
        timestamp: new Date('2026-04-05T08:00:00Z'),
        status: 'Verified',
        user: 'GreenBowl Organics',
        notes: 'Produced using solar-powered facility. Zero-waste packaging applied.'
      },
      {
        role: 'Distributor',
        location: 'Unknown Warehouse Scan',
        city: 'Udaipur',
        country: 'India',
        timestamp: new Date('2026-04-08T03:15:00Z'),
        status: 'Suspicious',
        user: 'Unverified Scanner',
        notes: 'WARNING: Scanned at 3:15 AM from an unregistered device. Location mismatch detected.'
      }
    ]
  }
];

const batchData = [
  {
    batchId: 'BCH-NTR-2026A',
    productName: 'Premium Organic Trail Mix',
    manufactureDate: new Date('2026-03-10'),
    expiryDate: new Date('2027-03-10'),
    quantity: 500
  },
  {
    batchId: 'BCH-CRK-4490',
    productName: 'Spicy Masala Chips (150g)',
    manufactureDate: new Date('2026-03-20'),
    expiryDate: new Date('2026-09-20'),
    quantity: 250
  },
  {
    batchId: 'BCH-FBN-7710',
    productName: 'Dark Chocolate Protein Bar',
    manufactureDate: new Date('2026-04-01'),
    expiryDate: new Date('2027-01-01'),
    quantity: 300
  },
  {
    batchId: 'BCH-GBO-9921',
    productName: 'Quinoa Puffs – Sea Salt',
    manufactureDate: new Date('2026-04-05'),
    expiryDate: new Date('2026-10-05'),
    quantity: 200
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Remove old journey demo products (by their specific qrCodes) to avoid duplicates
    const demoCodes = journeyProducts.map(p => p.qrCode);
    await Product.deleteMany({ qrCode: { $in: demoCodes } });
    console.log('Cleared previous demo journey products.');

    // Upsert batches (don't delete existing user batches)
    for (const b of batchData) {
      await Batch.findOneAndUpdate(
        { batchId: b.batchId },
        b,
        { upsert: true, new: true }
      );
    }
    console.log(`Upserted ${batchData.length} batches.`);

    // Insert journey products
    await Product.insertMany(journeyProducts);
    console.log(`Inserted ${journeyProducts.length} products with journey data.`);

    console.log('\n--- Demo Product IDs for Journey Tracking ---');
    journeyProducts.forEach(p => {
      const stages = p.journeyHistory.length;
      const lastStatus = p.journeyHistory[stages - 1].status;
      console.log(`  ${p.qrCode}  |  ${p.productName}  |  ${stages}/4 stages  |  ${lastStatus}`);
    });
    console.log('\nYou can search any of these IDs on the Product Journey page.');

    await mongoose.disconnect();
    console.log('Done. Database disconnected.');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
