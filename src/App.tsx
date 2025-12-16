import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MaterialPassport from './pages/MaterialPassport';
import SupplyChain from './pages/SupplyChain';
import SmartProcurement from './pages/SmartProcurement';
import GreenRoute from './pages/GreenRoute';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'passport':
        return <MaterialPassport />;
      case 'green-route':
        return <GreenRoute />;
      case 'supply-chain':
        return <SupplyChain />;
      case 'procurement':
        return <SmartProcurement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
