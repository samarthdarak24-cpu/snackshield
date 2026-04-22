const Batch = require('../models/Batch');
const Product = require('../models/Product');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

exports.createBatch = async (req, res) => {
  try {
    const { batchId, productName, manufactureDate, expiryDate, quantity } = req.body;
    
    // Use authenticated user's company, fall back to body or default
    const company = req.user?.company || req.body.company || 'SnackShield';

    if (!batchId || !productName || !manufactureDate || !expiryDate || !quantity) {
      return res.status(400).json({ message: 'All fields are required: batchId, productName, manufactureDate, expiryDate, quantity' });
    }

    // Check for duplicate batchId
    const existing = await Batch.findOne({ batchId });
    if (existing) {
      return res.status(400).json({ message: `Batch ID "${batchId}" already exists. Please refresh and try again.` });
    }

    // Create batch
    const batch = await Batch.create({
      batchId,
      productName,
      manufactureDate,
      expiryDate,
      quantity
    });

    // Create units (Products)
    const products = [];
    for (let i = 1; i <= quantity; i++) {
        // Unique ID for each unit: BATCHID-UNITINDEX
        const unitQrCode = `${batchId}-${String(i).padStart(3, '0')}`;
        
        products.push({
            productName,
            company,
            batchId,
            qrCode: unitQrCode,
            manufactureDate,
            expiryDate,
            journeyHistory: [{
                role: 'Manufacturer',
                location: 'Factory',
                city: 'Mumbai',
                country: 'India',
                status: 'Verified',
                user: company,
                notes: `Unit ${i} of Batch ${batchId} registered.`
            }]
        });
    }

    // Bulk insert for efficiency
    await Product.insertMany(products);

    // Generate a SINGLE "Master" QR code for the batch summary (backward compatibility)
    const masterQrData = `${batchId}`;
    const uploadsDir = path.join(__dirname, '../../uploads/qrcodes');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const qrCodePath = path.join(uploadsDir, `${masterQrData}.png`);
    await QRCode.toFile(qrCodePath, masterQrData, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' }
    });

    res.status(201).json({
      batch,
      message: `${quantity} units generated successfully.`,
      qrCode: masterQrData,
      qrCodeUrl: `/uploads/qrcodes/${masterQrData}.png`
    });
  } catch (error) {
    console.error('Batch creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBatchUnits = async (req, res) => {
    try {
        const { batchId } = req.params;
        const products = await Product.find({ batchId }).sort({ qrCode: 1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.downloadBatchPDF = async (req, res) => {
    try {
        const { batchId } = req.params;
        const products = await Product.find({ batchId }).sort({ qrCode: 1 });
        
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No units found for this batch.' });
        }

        const doc = new PDFDocument({ margin: 50 });
        const filename = `SnackShield_Batch_${batchId}.pdf`;

        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Length', pdfBuffer.length);
            res.send(pdfBuffer);
            console.log(`PDF binary sent for batch ${batchId} (${pdfBuffer.length} bytes)`);
        });

        // Grid layout for QR codes
        const qrSize = 100;
        const columnWidth = 150;
        const rowHeight = 160;
        const itemsPerRow = 3;
        
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const col = i % itemsPerRow;
            const row = Math.floor((i % (itemsPerRow * 4)) / itemsPerRow); // 4 rows per page

            if (i > 0 && i % (itemsPerRow * 4) === 0) {
                doc.addPage();
            }

            const x = 50 + (col * columnWidth);
            const y = doc.page.margins.top + 100 + (row * rowHeight);

            try {
                const qrBuffer = await QRCode.toBuffer(product.qrCode, { 
                    margin: 1,
                    width: 300,
                    errorCorrectionLevel: 'M'
                });
                
                doc.image(qrBuffer, x + (columnWidth - qrSize) / 2, y, { width: qrSize });
                doc.fillColor('#334155').fontSize(8).text(product.qrCode, x, y + qrSize + 5, { width: columnWidth, align: 'center' });
            } catch (qrErr) {
                console.error(`Failed to generate QR for ${product.qrCode}:`, qrErr);
                doc.fillColor('#ef4444').fontSize(8).text('[QR Error]', x, y + 20, { width: columnWidth, align: 'center' });
            }
        }

        doc.end();
    } catch (error) {
        console.error('PDF Generation Critical Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error generating PDF: ' + error.message });
        }
    }
};
