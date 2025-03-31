import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Text,
  Heading,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import {
  FiArrowUp,
  FiArrowDown,
  FiMoreVertical,
  FiTrendingUp,
  FiZap,
  FiInfo,
} from 'react-icons/fi';

interface ArbitrageOpportunity {
  id: string;
  tradingPair: string;
  buyExchange: string;
  sellExchange: string;
  profitPercentage: number;
  timestamp: string;
}

interface ArbitrageTableProps {
  opportunities: ArbitrageOpportunity[];
  onViewDetails?: (id: string) => void;
  onExecuteTrade?: (id: string) => void;
}

const ArbitrageTable: React.FC<ArbitrageTableProps> = ({
  opportunities,
  onViewDetails,
  onExecuteTrade,
}) => {
  const [sortColumn, setSortColumn] = useState<string>('profitPercentage');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const sortedOpportunities = useMemo(() => {
    return [...opportunities].sort((a, b) => {
      const aValue = a[sortColumn as keyof ArbitrageOpportunity];
      const bValue = b[sortColumn as keyof ArbitrageOpportunity];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [opportunities, sortColumn, sortDirection]);

  const toggleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  return (
    <Box bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor} shadow="sm">
      <Box p={4} borderBottomWidth="1px" borderColor={borderColor}>
        <Heading size="md">Arbitrage Opportunities</Heading>
      </Box>
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('tradingPair')}
                  rightIcon={
                    sortColumn === 'tradingPair' ? (
                      sortDirection === 'asc' ? (
                        <FiArrowUp />
                      ) : (
                        <FiArrowDown />
                      )
                    ) : undefined
                  }
                >
                  Trading Pair
                </Button>
              </Th>
              <Th>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('buyExchange')}
                  rightIcon={
                    sortColumn === 'buyExchange' ? (
                      sortDirection === 'asc' ? (
                        <FiArrowUp />
                      ) : (
                        <FiArrowDown />
                      )
                    ) : undefined
                  }
                >
                  Buy Exchange
                </Button>
              </Th>
              <Th>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('sellExchange')}
                  rightIcon={
                    sortColumn === 'sellExchange' ? (
                      sortDirection === 'asc' ? (
                        <FiArrowUp />
                      ) : (
                        <FiArrowDown />
                      )
                    ) : undefined
                  }
                >
                  Sell Exchange
                </Button>
              </Th>
              <Th>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('profitPercentage')}
                  rightIcon={
                    sortColumn === 'profitPercentage' ? (
                      sortDirection === 'asc' ? (
                        <FiArrowUp />
                      ) : (
                        <FiArrowDown />
                      )
                    ) : undefined
                  }
                >
                  Profit %
                </Button>
              </Th>
              <Th isNumeric>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedOpportunities.map((opportunity) => (
              <Tr key={opportunity.id} _hover={{ bg: hoverBg }}>
                <Td fontWeight="medium">{opportunity.tradingPair}</Td>
                <Td>{opportunity.buyExchange}</Td>
                <Td>{opportunity.sellExchange}</Td>
                <Td>
                  <Flex alignItems="center">
                    <Icon
                      as={FiTrendingUp}
                      mr={2}
                      color={opportunity.profitPercentage >= 3 ? 'green.500' : 'gray.500'}
                    />
                    <Text
                      color={opportunity.profitPercentage >= 3 ? 'green.500' : undefined}
                      fontWeight={opportunity.profitPercentage >= 3 ? 'medium' : undefined}
                    >
                      {opportunity.profitPercentage.toFixed(2)}%
                    </Text>
                  </Flex>
                </Td>
                <Td isNumeric>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem 
                        icon={<FiInfo />} 
                        onClick={() => onViewDetails?.(opportunity.id)}
                      >
                        View Details
                      </MenuItem>
                      <MenuItem 
                        icon={<FiZap />} 
                        onClick={() => onExecuteTrade?.(opportunity.id)}
                      >
                        Execute Trade
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td colSpan={3} fontWeight="semibold">Average Profit</Td>
              <Td colSpan={2}>
                <Badge colorScheme="green" fontSize="sm" p={1}>
                  {(
                    sortedOpportunities.reduce(
                      (sum, opp) => sum + opp.profitPercentage,
                      0
                    ) / (sortedOpportunities.length || 1)
                  ).toFixed(2)}%
                </Badge>
              </Td>
            </Tr>
          </Tfoot>
        </Table>
      </Box>
    </Box>
  );
};

export default ArbitrageTable;