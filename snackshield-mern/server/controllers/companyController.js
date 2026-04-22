const Company = require('../models/Company');
const Product = require('../models/Product');

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    
    // For each company, calculate real stats if possible
    const companyData = await Promise.all(companies.map(async (company) => {
      const productCount = await Product.countDocuments({ company: company.name });
      return {
        ...company.toObject(),
        products: productCount || 0
      };
    }));
    
    res.json(companyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findOne({ name: { $regex: new RegExp(`^${req.params.id.replace(/-/g, ' ')}$`, 'i') } });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    
    const productCount = await Product.countDocuments({ company: company.name });
    res.json({ ...company.toObject(), products: productCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
