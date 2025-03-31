import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';

// Layout components
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

// Pages
import Dashboard from './pages/Dashboard';
import Exchanges from './pages/Exchanges';
import DexNetworks from './pages/DexNetworks';
import ApiManagement from './pages/ApiManagement';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Flex h="100vh" flexDirection="column">
      <TopBar />
      <Flex flex="1" overflow="hidden">
        <Sidebar />
        <Box flex="1" p={4} overflowY="auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/exchanges" element={<Exchanges />} />
            <Route path="/dex-networks" element={<DexNetworks />} />
            <Route path="/api-management" element={<ApiManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Flex>
    </Flex>
  );
};

export default App;