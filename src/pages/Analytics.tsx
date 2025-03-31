import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FiDownload,
  FiCalendar,
  FiFilter,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

// Type definitions
interface TradeStats {
  totalTrades: number;
  successfulTrades: number;
  failedTrades: number;
  totalVolume: number;
  totalProfit: number;
  totalFees: number;
  averageProfit: number;
  successRate: number;
  profitTrend: number;
  volumeTrend: number;
}

interface ProfitByExchange {
  exchange: string;
  type: 'CEX' | 'DEX';
  trades: number;
  volume: number;
  profit: number;
  fees: number;
  avgProfit: number;
}

interface ProfitByNetwork {
  network: string;
  trades: number;
  volume: number;
  profit: number;
  fees: number;
  avgProfit: number;
}

interface ProfitByAsset {
  asset: string;
  trades: number;
  volume: number;
  profit: number;
  fees: number;
  avgProfit: number;
}

interface Trade {
  id: string;
  timestamp: string;
  type: 'Simple' | 'MultiHop' | 'CrossChain' | 'FlashLoan';
  sourceExchange: string;
  targetExchange: string;
  sourceAsset: string;
  targetAsset: string;
  buyPrice: number;
  sellPrice: number;
  amount: number;
  profit: number;
  profitPercentage: number;
  fees: number;
  status: 'completed' | 'failed';
  executionTime: number;
}

// Mock data
const mockTradeStats: TradeStats = {
  totalTrades: 843,
  successfulTrades: 782,
  failedTrades: 61,
  totalVolume: 1289435.87,
  totalProfit: 12945.32,
  totalFees: 2342.18,
  averageProfit: 16.55,
  successRate: 92.8,
  profitTrend: 8.4,
  volumeTrend: 12.3
};

const mockProfitByExchange: ProfitByExchange[] = [
  { exchange: 'Binance', type: 'CEX', trades: 215, volume: 428932.45, profit: 5218.43, fees: 643.40, avgProfit: 24.27 },
  { exchange: 'PancakeSwap', type: 'DEX', trades: 187, volume: 312436.78, profit: 3125.67, fees: 625.20, avgProfit: 16.71 },
  { exchange: 'UniswapV3', type: 'DEX', trades: 145, volume: 215438.90, profit: 1890.43, fees: 432.65, avgProfit: 13.04 },
  { exchange: 'KuCoin', type: 'CEX', trades: 98, volume: 123546.32, profit: 985.21, fees: 210.34, avgProfit: 10.05 },
  { exchange: 'Raydium', type: 'DEX', trades: 78, volume: 95632.48, profit: 845.32, fees: 190.45, avgProfit: 10.84 },
  { exchange: 'OKX', type: 'CEX', trades: 68, volume: 73456.91, profit: 534.21, fees: 145.30, avgProfit: 7.86 },
  { exchange: 'Orca', type: 'DEX', trades: 52, volume: 39992.03, profit: 346.05, fees: 95.84, avgProfit: 6.65 }
];

const mockProfitByNetwork: ProfitByNetwork[] = [
  { network: 'Ethereum', trades: 312, volume: 523458.32, profit: 4521.32, fees: 1042.45, avgProfit: 14.49 },
  { network: 'BSC', trades: 254, volume: 378432.43, profit: 3864.32, fees: 621.32, avgProfit: 15.21 },
  { network: 'Polygon', trades: 143, volume: 187543.21, profit: 2143.21, fees: 342.65, avgProfit: 14.99 },
  { network: 'Solana', trades: 134, volume: 200001.91, profit: 2416.47, fees: 335.76, avgProfit: 18.03 }
];

const mockProfitByAsset: ProfitByAsset[] = [
  { asset: 'ETH', trades: 213, volume: 387432.54, profit: 3854.32, fees: 743.21, avgProfit: 18.09 },
  { asset: 'BTC', trades: 184, volume: 523487.32, profit: 2987.43, fees: 854.32, avgProfit: 16.24 },
  { asset: 'USDT', trades: 178, volume: 198754.32, profit: 1854.32, fees: 321.43, avgProfit: 10.42 },
  { asset: 'SOL', trades: 134, volume: 98754.32, profit: 1743.21, fees: 198.43, avgProfit: 13.01 },
  { asset: 'BNB', trades: 67, volume: 43218.43, profit: 932.43, fees: 86.43, avgProfit: 13.92 },
  { asset: 'MATIC', trades: 42, volume: 23487.43, profit: 812.32, fees: 57.43, avgProfit: 19.34 },
  { asset: 'USDC', trades: 25, volume: 14301.51, profit: 761.29, fees: 80.93, avgProfit: 30.45 }
];

const mockRecentTrades: Trade[] = [
  {
    id: 'T-38472',
    timestamp: '2025-03-30T23:15:32Z',
    type: 'Simple',
    sourceExchange: 'Binance',
    targetExchange: 'KuCoin',
    sourceAsset: 'ETH',
    targetAsset: 'ETH',
    buyPrice: 4521.43,
    sellPrice: 4543.21,
    amount: 2.5,
    profit: 54.45,
    profitPercentage: 0.48,
    fees: 12.32,
    status: 'completed',
    executionTime: 3.2
  },
  {
    id: 'T-38471',
    timestamp: '2025-03-30T22:42:15Z',
    type: 'MultiHop',
    sourceExchange: 'UniswapV3',
    targetExchange: 'UniswapV3',
    sourceAsset: 'ETH',
    targetAsset: 'ETH',
    buyPrice: 4518.27,
    sellPrice: 4538.92,
    amount: 1.8,
    profit: 37.17,
    profitPercentage: 0.46,
    fees: 8.75,
    status: 'completed',
    executionTime: 4.1
  },
  {
    id: 'T-38470',
    timestamp: '2025-03-30T21:37:42Z',
    type: 'FlashLoan',
    sourceExchange: 'Aave',
    targetExchange: 'PancakeSwap',
    sourceAsset: 'USDT',
    targetAsset: 'USDT',
    buyPrice: 1.0,
    sellPrice: 1.0047,
    amount: 5000,
    profit: 23.5,
    profitPercentage: 0.47,
    fees: 13.42,
    status: 'completed',
    executionTime: 5.3
  },
  {
    id: 'T-38469',
    timestamp: '2025-03-30T21:14:08Z',
    type: 'CrossChain',
    sourceExchange: 'UniswapV3',
    targetExchange: 'PancakeSwap',
    sourceAsset: 'ETH',
    targetAsset: 'ETH',
    buyPrice: 4512.87,
    sellPrice: 4537.65,
    amount: 3.2,
    profit: 79.29,
    profitPercentage: 0.55,
    fees: 28.43,
    status: 'completed',
    executionTime: 38.4
  },
  {
    id: 'T-38468',
    timestamp: '2025-03-30T20:43:51Z',
    type: 'Simple',
    sourceExchange: 'OKX',
    targetExchange: 'Binance',
    sourceAsset: 'BTC',
    targetAsset: 'BTC',
    buyPrice: 63218.43,
    sellPrice: 63297.32,
    amount: 0.25,
    profit: 19.72,
    profitPercentage: 0.12,
    fees: 5.32,
    status: 'completed',
    executionTime: 2.8
  },
  {
    id: 'T-38467',
    timestamp: '2025-03-30T19:32:27Z',
    type: 'MultiHop',
    sourceExchange: 'PancakeSwap',
    targetExchange: 'PancakeSwap',
    sourceAsset: 'USDT',
    targetAsset: 'USDT',
    buyPrice: 1.0,
    sellPrice: 1.0032,
    amount: 10000,
    profit: 32.0,
    profitPercentage: 0.32,
    fees: 8.75,
    status: 'failed',
    executionTime: 3.5
  }
];

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [exchangeFilter, setExchangeFilter] = useState<string>('all');
  const [assetFilter, setAssetFilter] = useState<string>('all');
  const [networkFilter, setNetworkFilter] = useState<string>('all');
  
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  };

  const handleExchangeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExchangeFilter(e.target.value);
  };

  const handleAssetFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAssetFilter(e.target.value);
  };

  const handleNetworkFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNetworkFilter(e.target.value);
  };
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Calculation helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatNumber = (value: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <Box pt={5} pb={10}>
      <VStack spacing={6} align="stretch">
        <HStack justifyContent="space-between">
          <Heading size="lg">Analytics Dashboard</Heading>
          <HStack>
            <FormControl width="auto">
              <Select 
                value={timeRange} 
                onChange={handleTimeRangeChange}
                size="sm"
                width="120px"
              >
                <option value="24h">Last 24h</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </Select>
            </FormControl>
            <Button 
              leftIcon={<FiDownload />} 
              size="sm" 
              variant="outline"
              onClick={() => {
                alert('Export functionality would be implemented here');
              }}
            >
              Export
            </Button>
          </HStack>
        </HStack>
        
        {/* Key Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card bg={cardBg} borderColor={borderColor} variant="outline">
            <CardBody>
              <Stat>
                <StatLabel>Total Profit</StatLabel>
                <StatNumber>{formatCurrency(mockTradeStats.totalProfit)}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {mockTradeStats.profitTrend}% from previous period
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg} borderColor={borderColor} variant="outline">
            <CardBody>
              <Stat>
                <StatLabel>Trading Volume</StatLabel>
                <StatNumber>{formatCurrency(mockTradeStats.totalVolume)}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {mockTradeStats.volumeTrend}% from previous period
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg} borderColor={borderColor} variant="outline">
            <CardBody>
              <Stat>
                <StatLabel>Success Rate</StatLabel>
                <StatNumber>{formatNumber(mockTradeStats.successRate)}%</StatNumber>
                <StatHelpText>
                  {mockTradeStats.successfulTrades} of {mockTradeStats.totalTrades} trades
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg} borderColor={borderColor} variant="outline">
            <CardBody>
              <Stat>
                <StatLabel>Average Profit/Trade</StatLabel>
                <StatNumber>{formatCurrency(mockTradeStats.averageProfit)}</StatNumber>
                <StatHelpText>
                  After fees ({formatCurrency(mockTradeStats.totalFees)})
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
        
        <Tabs variant="enclosed">
          <TabList>
            <Tab>By Exchange</Tab>
            <Tab>By Network</Tab>
            <Tab>By Asset</Tab>
            <Tab>Recent Trades</Tab>
          </TabList>
          
          <TabPanels>
            {/* By Exchange Tab */}
            <TabPanel p={4}>
              <HStack mb={4} justifyContent="space-between">
                <FormControl maxW="200px">
                  <FormLabel>Filter by Type</FormLabel>
                  <Select 
                    value={exchangeFilter} 
                    onChange={handleExchangeFilterChange}
                  >
                    <option value="all">All Exchanges</option>
                    <option value="cex">CEX Only</option>
                    <option value="dex">DEX Only</option>
                  </Select>
                </FormControl>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Showing data for {timeRange === '24h' ? 'the last 24 hours' : 
                      timeRange === '7d' ? 'the last 7 days' : 
                      timeRange === '30d' ? 'the last 30 days' : 
                      'the last 90 days'}
                  </Text>
                </Box>
              </HStack>
              
              <Card variant="outline">
                <CardBody>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Exchange</Th>
                        <Th>Type</Th>
                        <Th isNumeric>Trades</Th>
                        <Th isNumeric>Volume</Th>
                        <Th isNumeric>Profit</Th>
                        <Th isNumeric>Fees</Th>
                        <Th isNumeric>Avg. Profit</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockProfitByExchange
                        .filter(item => 
                          exchangeFilter === 'all' || 
                          (exchangeFilter === 'cex' && item.type === 'CEX') ||
                          (exchangeFilter === 'dex' && item.type === 'DEX')
                        )
                        .map(item => (
                        <Tr key={item.exchange}>
                          <Td>{item.exchange}</Td>
                          <Td>
                            <Badge 
                              colorScheme={item.type === 'CEX' ? 'blue' : 'green'}
                            >
                              {item.type}
                            </Badge>
                          </Td>
                          <Td isNumeric>{item.trades}</Td>
                          <Td isNumeric>{formatCurrency(item.volume)}</Td>
                          <Td isNumeric>{formatCurrency(item.profit)}</Td>
                          <Td isNumeric>{formatCurrency(item.fees)}</Td>
                          <Td isNumeric>{formatCurrency(item.avgProfit)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* By Network Tab */}
            <TabPanel p={4}>
              <HStack mb={4} justifyContent="space-between">
                <FormControl maxW="200px">
                  <FormLabel>Filter by Network</FormLabel>
                  <Select 
                    value={networkFilter} 
                    onChange={handleNetworkFilterChange}
                  >
                    <option value="all">All Networks</option>
                    <option value="ethereum">Ethereum</option>
                    <option value="bsc">BSC</option>
                    <option value="polygon">Polygon</option>
                    <option value="solana">Solana</option>
                  </Select>
                </FormControl>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Showing data for {timeRange === '24h' ? 'the last 24 hours' : 
                      timeRange === '7d' ? 'the last 7 days' : 
                      timeRange === '30d' ? 'the last 30 days' : 
                      'the last 90 days'}
                  </Text>
                </Box>
              </HStack>
              
              <Card variant="outline">
                <CardBody>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Network</Th>
                        <Th isNumeric>Trades</Th>
                        <Th isNumeric>Volume</Th>
                        <Th isNumeric>Profit</Th>
                        <Th isNumeric>Fees</Th>
                        <Th isNumeric>Avg. Profit</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockProfitByNetwork
                        .filter(item => 
                          networkFilter === 'all' || 
                          networkFilter.toLowerCase() === item.network.toLowerCase()
                        )
                        .map(item => (
                        <Tr key={item.network}>
                          <Td>{item.network}</Td>
                          <Td isNumeric>{item.trades}</Td>
                          <Td isNumeric>{formatCurrency(item.volume)}</Td>
                          <Td isNumeric>{formatCurrency(item.profit)}</Td>
                          <Td isNumeric>{formatCurrency(item.fees)}</Td>
                          <Td isNumeric>{formatCurrency(item.avgProfit)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* By Asset Tab */}
            <TabPanel p={4}>
              <HStack mb={4} justifyContent="space-between">
                <FormControl maxW="200px">
                  <FormLabel>Filter by Asset</FormLabel>
                  <Select 
                    value={assetFilter} 
                    onChange={handleAssetFilterChange}
                  >
                    <option value="all">All Assets</option>
                    <option value="btc">BTC</option>
                    <option value="eth">ETH</option>
                    <option value="usdt">USDT</option>
                    <option value="usdc">USDC</option>
                    <option value="sol">SOL</option>
                  </Select>
                </FormControl>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Showing data for {timeRange === '24h' ? 'the last 24 hours' : 
                      timeRange === '7d' ? 'the last 7 days' : 
                      timeRange === '30d' ? 'the last 30 days' : 
                      'the last 90 days'}
                  </Text>
                </Box>
              </HStack>
              
              <Card variant="outline">
                <CardBody>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Asset</Th>
                        <Th isNumeric>Trades</Th>
                        <Th isNumeric>Volume</Th>
                        <Th isNumeric>Profit</Th>
                        <Th isNumeric>Fees</Th>
                        <Th isNumeric>Avg. Profit</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockProfitByAsset
                        .filter(item => 
                          assetFilter === 'all' || 
                          assetFilter.toLowerCase() === item.asset.toLowerCase()
                        )
                        .map(item => (
                        <Tr key={item.asset}>
                          <Td>{item.asset}</Td>
                          <Td isNumeric>{item.trades}</Td>
                          <Td isNumeric>{formatCurrency(item.volume)}</Td>
                          <Td isNumeric>{formatCurrency(item.profit)}</Td>
                          <Td isNumeric>{formatCurrency(item.fees)}</Td>
                          <Td isNumeric>{formatCurrency(item.avgProfit)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Recent Trades Tab */}
            <TabPanel p={4}>
              <Card variant="outline">
                <CardBody>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Time</Th>
                        <Th>Type</Th>
                        <Th>Route</Th>
                        <Th>Asset</Th>
                        <Th isNumeric>Amount</Th>
                        <Th isNumeric>Profit</Th>
                        <Th isNumeric>%</Th>
                        <Th>Status</Th>
                        <Th isNumeric>Speed</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockRecentTrades.map(trade => (
                        <Tr key={trade.id}>
                          <Td>{trade.id}</Td>
                          <Td>{formatDate(trade.timestamp)}</Td>
                          <Td>
                            <Badge 
                              colorScheme={
                                trade.type === 'Simple' ? 'blue' : 
                                trade.type === 'MultiHop' ? 'green' : 
                                trade.type === 'CrossChain' ? 'purple' : 
                                'orange'
                              }
                            >
                              {trade.type}
                            </Badge>
                          </Td>
                          <Td>{trade.sourceExchange} → {trade.targetExchange}</Td>
                          <Td>{trade.sourceAsset}</Td>
                          <Td isNumeric>{formatNumber(trade.amount, 4)}</Td>
                          <Td isNumeric>{formatCurrency(trade.profit)}</Td>
                          <Td isNumeric>
                            <Text color={trade.profitPercentage > 0 ? 'green.500' : 'red.500'}>
                              {formatNumber(trade.profitPercentage * 100, 2)}%
                            </Text>
                          </Td>
                          <Td>
                            <Flex align="center">
                              {trade.status === 'completed' ? (
                                <Badge colorScheme="green">Completed</Badge>
                              ) : (
                                <Badge colorScheme="red">Failed</Badge>
                              )}
                            </Flex>
                          </Td>
                          <Td isNumeric>{trade.executionTime.toFixed(1)}s</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        <HStack justifyContent="flex-end">
          <Text fontSize="sm" color="gray.500">
            Data refreshes automatically every 30 seconds.
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Analytics;