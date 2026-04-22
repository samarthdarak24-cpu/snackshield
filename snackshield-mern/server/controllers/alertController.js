const Alert = require('../models/Alert');

exports.getAlerts = async (req, res) => {
  try {
    const { company, severity, read } = req.query;
    const filter = {};
    
    if (company) filter.company = company;
    if (severity) filter.severity = severity;
    if (read !== undefined) filter.read = read === 'true';

    const alerts = await Alert.find(filter).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Alert.countDocuments({ ...filter, read: false });

    res.json({
      alerts,
      unreadCount,
      total: alerts.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { alertId } = req.params;
    const alert = await Alert.findByIdAndUpdate(
      alertId,
      { read: true },
      { new: true }
    );
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resolveAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const alert = await Alert.findByIdAndUpdate(
      alertId,
      { resolved: true, read: true },
      { new: true }
    );
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAlert = async (req, res) => {
  try {
    const alertData = req.body;
    const alert = await Alert.create(alertData);
    
    // Emit socket event for real-time notification
    if (req.app.get('io')) {
      req.app.get('io').emit('newAlert', alert);
    }
    
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
