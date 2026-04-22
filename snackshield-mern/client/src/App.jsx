import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DistributorDashboard from './pages/DistributorDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import VerifyProduct from './pages/VerifyProduct';
import Login from './pages/Login';
import Register from './pages/Register';
import Analytics from './pages/Analytics';
import ScanHistory from './pages/ScanHistory';
import Companies from './pages/Companies';
import NetworkNodeProfile from './pages/NetworkNodeProfile';
import BatchManagement from './pages/BatchManagement';
import Settings from './pages/Settings';
import ProductJourney from './pages/ProductJourney';
import Alerts from './pages/Alerts';
import PublicVerify from './pages/PublicVerify';
import Test from './Test';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/test"      element={<Test />} />
          <Route path="/"          element={<LandingPage />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/verify-public" element={<PublicVerify />} />
          <Route path="/customer"  element={<CustomerDashboard />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/distributor-dashboard" element={<ProtectedRoute><DistributorDashboard /></ProtectedRoute>} />
          <Route path="/retailer-dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/verify"    element={<ProtectedRoute><VerifyProduct /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/history"   element={<ProtectedRoute><ScanHistory /></ProtectedRoute>} />
          <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
          <Route path="/companies/:companyId" element={<ProtectedRoute><NetworkNodeProfile /></ProtectedRoute>} />
          <Route path="/batches"   element={<ProtectedRoute><BatchManagement /></ProtectedRoute>} />
          <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/journey"   element={<ProtectedRoute><ProductJourney /></ProtectedRoute>} />
          <Route path="/alerts"    element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
          
          <Route path="*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
