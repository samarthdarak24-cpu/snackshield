#!/usr/bin/env python
"""
Setup script to populate the database with sample data for the SnackShield application.
This will create test data for companies, products, scan history, and more.
"""

import os
import sys
from datetime import datetime, timedelta

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app import app, db
from models import (
    User, Company, Product, ScanHistory, BatchAuditLog, 
    FraudCluster, RiskHistory, DistributorScore
)

def setup_database():
    """Initialize the database and add sample data."""
    
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Check if admin user exists
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(username='admin', email='admin@snackshield.com', role='admin')
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("✓ Created admin user")
        
        # Create sample company if not exists
        company = Company.query.filter_by(factory_code='FACT-001').first()
        if not company:
            company = Company(
                company_name='SnackCorp Industries',
                license_number='LIC-2024-001',
                factory_code='FACT-001'
            )
            db.session.add(company)
            db.session.commit()
            print("✓ Created sample company")
        
        # Create sample products
        product_data = [
            {'product_id': 'SNACK-2024-001', 'product_name': 'Crispy Chips', 'batch': 'BATCH-001'},
            {'product_id': 'SNACK-2024-002', 'product_name': 'Sweet Biscuits', 'batch': 'BATCH-002'},
            {'product_id': 'SNACK-2024-003', 'product_name': 'Savory Crackers', 'batch': 'BATCH-003'},
            {'product_id': 'SNACK-2024-004', 'product_name': 'Premium Nuts', 'batch': 'BATCH-004'},
            {'product_id': 'SNACK-2024-005', 'product_name': 'Fruit Bars', 'batch': 'BATCH-005'},
        ]
        
        for p_data in product_data:
            product = Product.query.filter_by(product_id=p_data['product_id']).first()
            if not product:
                product = Product(
                    product_id=p_data['product_id'],
                    company_id=company.id,
                    product_name=p_data['product_name'],
                    batch_number=p_data['batch'],
                    mfg_date=datetime.utcnow().date(),
                    exp_date=(datetime.utcnow() + timedelta(days=365)).date(),
                    allowed_region='USA',
                    trust_score=95,
                    status='active'
                )
                db.session.add(product)
        db.session.commit()
        print("✓ Created sample products")
        
        # Create sample scan history
        products = Product.query.all()
        for idx, product in enumerate(products):
            scans = ScanHistory.query.filter_by(product_id=product.product_id).all()
            if len(scans) < 3:
                for i in range(3):
                    scan = ScanHistory(
                        product_id=product.product_id,
                        scan_time=datetime.utcnow() - timedelta(hours=i),
                        location='New York, USA',
                        device_fingerprint=f'DEVICE-{idx}-{i}',
                        risk_score=5+i,
                        confidence=98-i,
                        result=['Genuine', 'Genuine', 'Suspicious'][i % 3]
                    )
                    db.session.add(scan)
        db.session.commit()
        print("✓ Created sample scan history")
        
        # Create sample fraud clusters
        cluster = FraudCluster.query.filter_by(batch_id='BATCH-001').first()
        if not cluster:
            cluster = FraudCluster(
                batch_id='BATCH-001',
                region='East Coast',
                cluster_size=3,
                detect_time=datetime.utcnow()
            )
            db.session.add(cluster)
        db.session.commit()
        print("✓ Created sample fraud clusters")
        
        # Create sample distributor scores
        dist = DistributorScore.query.filter_by(distributor_id='DIST-001').first()
        if not dist:
            dist = DistributorScore(
                distributor_id='DIST-001',
                distributor_name='Main Distributor Inc',
                trust_score=87,
                geo_violations=0,
                suspicious_scans=1,
                last_updated=datetime.utcnow()
            )
            db.session.add(dist)
        db.session.commit()
        print("✓ Created sample distributor scores")
        
        print("\n✓ Database setup complete!")
        print("\nYou can now log in with:")
        print("  Username: admin")
        print("  Password: admin123")

if __name__ == '__main__':
    try:
        setup_database()
    except Exception as e:
        print(f"✗ Error during setup: {e}")
        sys.exit(1)
