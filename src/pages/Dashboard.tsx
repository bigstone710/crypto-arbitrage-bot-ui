import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  SimpleGrid, 
  Heading, 
  Text, 
  useToast,
  Card,
  CardBody,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  Button,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiBarChart2, 
  FiActivity,
  FiRefreshCw
} from 'react-icons/fi';

import BotControlPanel from '../components/dashboard/BotControlPanel';
import ArbitrageTable from '../components/dashboard/ArbitrageTable';

// Mock data
const exchanges = [
  { name: 'Binance', status: 'connected' as const, lastSync: '2 min ago' },
  { name: 'Coinbase', status: 'connected' as const, lastSync: '5 min ago' },
  { name: 'Kraken', status: 'disconnected' as const },
  { name: 'Kucoin', status: 'error' as const },
  { name: 'Bitfinex', status: 'connected' as const, lastSync: '1 min ago' },
  { name: 'OKX', status: 'connected' as const, lastSync: '3 min ago' },
];

const mockOpportunities = [
  {
    id: '1',
    tradingPair: 'BTC/USDT',
    buyExchange: 'Binance',
    sellExchange: 'Coinbase',
    profitPercentage: 1.25,
    timestamp: '2023-06-15T10:30:00Z',
  },
  {
    id: '2',
    tradingPair: 'ETH/USDT',
    buyExchange: 'Kraken',
    sellExchange: 'Binance',
    profitPercentage: 2.87,
    timestamp: '2023-06-15T10:32:00Z',
  },
  {
    id: '3',
    tradingPair: 'SOL/USDT',
    buyExchange: 'Kucoin',
    sellExchange: 'Binance',
    profitPercentage: 3.42,
    timestamp: '2023-06-15T10:35:00Z',
  },
  {
    id: '4',
    tradingPair: 'ADA/USDT',
    buyExchange: 'Binance',
    sellExchange: 'OKX',
    profitPercentage: 1.05,
    timestamp: '2023-06-15T10:38:00Z',
  },
  {
    id: '5',
    tradingPair: 'XRP/USDT',
    buyExchange: 'Bitfinex',
    sellExchange: 'Kraken',
    profitPercentage: 4.21,
    timestamp: '2023-06-15T10:40:00Z',
  },
];

const Dashboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'running' | 'error' | 'syncing'>('idle');
  const [opportunities, setOpportunities] = useState(mockOpportunities);
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const statBg = useColorModeValue('gray.50', 'gray.700');

  const handleStart = () => {
    setIsRunning(true);
    setStatus('running');
    toast({
      title: 'Bot Started',
      description: 'The arbitrage bot is now running.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    setStatus('idle');
    toast({
      title: 'Bot Stopped',
      description: 'The arbitrage bot has been stopped.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRefresh = () => {
    setStatus('syncing');
    toast({
      title: 'Refreshing Data',
      description: 'Fetching latest exchange data and opportunities...',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    
    // Simulate data refresh
    setTimeout(() => {
      setStatus(isRunning ? 'running' : 'idle');
      // Add a new random opportunity for demonstration
      const newOpportunity = {
        id: `${Date.now()}`,
        tradingPair: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'ADA/USDT'][Math.floor(Math.random() * 4)],
        buyExchange: ['Binance', 'Coinbase', 'Kraken'][Math.floor(Math.random() * 3)],
        sellExchange: ['Kucoin', 'Bitfinex', 'OKX'][Math.floor(Math.random() * 3)],
        profitPercentage: Math.random() * 5 + 0.5,
        timestamp: new Date().toISOString(),
      };
      setOpportunities([newOpportunity, ...opportunities.slice(0, 4)]);
      
      toast({
        title: 'Data Refreshed',
        description: 'Latest exchange data and opportunities have been loaded.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
  };

  const handleViewDetails = (id: string) => {
    toast({
      title: 'Viewing Details',
      description: `Showing details for opportunity #${id}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleExecuteTrade = (id: string) => {
    const opportunity = opportunities.find(o => o.id === id);
    if (!opportunity) return;
    
    toast({
      title: 'Trade Executed',
      description: `Executing ${opportunity.tradingPair} trade between ${opportunity.buyExchange} and ${opportunity.sellExchange}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box pt={5} pb={10}>
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5}>
          <Card bg={bgColor}>
            <CardBody>
              <Flex justifyContent="space-between">
                <Box>
                  <StatLabel>Total Profit</StatLabel>
                  <StatNumber>$3,245.89</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    23.36%
                  </StatHelpText>
                </Box>
                <Box
                  bg={statBg}
                  p={2}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiDollarSign} boxSize={6} />
                </Box>
              </Flex>
            </CardBody>
          </Card>
          
          <Card bg={bgColor}>
            <CardBody>
              <Flex justifyContent="space-between">
                <Box>
                  <StatLabel>Opportunities</StatLabel>
                  <StatNumber>57</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    12%
                  </StatHelpText>
                </Box>
                <Box
                  bg={statBg}
                  p={2}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiTrendingUp} boxSize={6} />
                </Box>
              </Flex>
            </CardBody>
          </Card>
          
          <Card bg={bgColor}>
            <CardBody>
              <Flex justifyContent="space-between">
                <Box>
                  <StatLabel>Success Rate</StatLabel>
                  <StatNumber>86.3%</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    5.2%
                  </StatHelpText>
                </Box>
                <Box
                  bg={statBg}
                  p={2}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiBarChart2} boxSize={6} />
                </Box>
              </Flex>
            </CardBody>
          </Card>
          
          <Card bg={bgColor}>
            <CardBody>
              <Flex justifyContent="space-between">
                <Box>
                  <StatLabel>Active Exchanges</StatLabel>
                  <StatNumber>4</StatNumber>
                  <StatHelpText>
                    <StatArrow type="decrease" />
                    2 offline
                  </StatHelpText>
                </Box>
                <Box
                  bg={statBg}
                  p={2}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiActivity} boxSize={6} />
                </Box>
              </Flex>
            </CardBody>
          </Card>
        </SimpleGrid>

        <BotControlPanel
          isRunning={isRunning}
          status={status}
          exchanges={exchanges}
          onStart={handleStart}
          onStop={handleStop}
          onRefresh={handleRefresh}
        />

        <ArbitrageTable
          opportunities={opportunities}
          onViewDetails={handleViewDetails}
          onExecuteTrade={handleExecuteTrade}
        />
        
        <Box textAlign="center" mt={4}>
          <Button
            leftIcon={<FiRefreshCw />}
            colorScheme="blue"
            variant="outline"
            onClick={handleRefresh}
          >
            Refresh Data
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default Dashboard;