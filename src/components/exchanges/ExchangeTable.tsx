import React, { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  useColorModeValue,
  Icon,
  Switch,
  Text,
  HStack,
  Tag,
  useToast
} from '@chakra-ui/react';
import {
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiSlash
} from 'react-icons/fi';

export interface Exchange {
  id: string;
  name: string;
  type: 'CEX' | 'DEX';
  chainId?: string; // For DEX
  status: 'connected' | 'disconnected' | 'error';
  tradingPairsCount: number;
  enabled: boolean;
  apiKeyConfigured: boolean;
  lastSyncTime?: string;
}

interface ExchangeTableProps {
  exchanges: Exchange[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, enabled: boolean) => void;
  onRefresh: (id: string) => void;
  onViewTradingPairs: (id: string) => void;
}

const ExchangeTable: React.FC<ExchangeTableProps> = ({
  exchanges,
  onEdit,
  onDelete,
  onToggleStatus,
  onRefresh,
  onViewTradingPairs
}) => {
  const toast = useToast();
  const [refreshing, setRefreshing] = useState<string | null>(null);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const handleRefresh = (id: string) => {
    setRefreshing(id);
    onRefresh(id);
    
    // Simulate refresh completion
    setTimeout(() => {
      setRefreshing(null);
      toast({
        title: 'Exchange refreshed',
        description: 'Latest data has been fetched from the exchange.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 1500);
  };

  const statusColors = {
    connected: 'green',
    disconnected: 'gray',
    error: 'red'
  };

  const statusIcons = {
    connected: FiCheckCircle,
    disconnected: FiSlash,
    error: FiAlertCircle
  };

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="sm"
      overflow="hidden"
    >
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Trading Pairs</Th>
              <Th>API Key</Th>
              <Th>Enabled</Th>
              <Th>Last Sync</Th>
              <Th isNumeric>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {exchanges.map((exchange) => (
              <Tr key={exchange.id} _hover={{ bg: hoverBg }}>
                <Td fontWeight="medium">
                  <HStack spacing={2}>
                    <Text>{exchange.name}</Text>
                    {exchange.chainId && (
                      <Tag size="sm" colorScheme="purple" borderRadius="full">
                        {exchange.chainId}
                      </Tag>
                    )}
                  </HStack>
                </Td>
                <Td>
                  <Badge
                    colorScheme={exchange.type === 'CEX' ? 'blue' : 'orange'}
                  >
                    {exchange.type}
                  </Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={statusColors[exchange.status]}
                    variant="subtle"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    <Flex alignItems="center" gap={1}>
                      <Icon as={statusIcons[exchange.status]} boxSize={3} />
                      <Text fontSize="xs">
                        {exchange.status.charAt(0).toUpperCase() + exchange.status.slice(1)}
                      </Text>
                    </Flex>
                  </Badge>
                </Td>
                <Td>
                  <Button
                    size="xs"
                    variant="link"
                    onClick={() => onViewTradingPairs(exchange.id)}
                  >
                    {exchange.tradingPairsCount} pairs
                  </Button>
                </Td>
                <Td>
                  {exchange.apiKeyConfigured ? (
                    <Badge colorScheme="green">Configured</Badge>
                  ) : (
                    <Badge colorScheme="red">Missing</Badge>
                  )}
                </Td>
                <Td>
                  <Switch
                    isChecked={exchange.enabled}
                    onChange={(e) => onToggleStatus(exchange.id, e.target.checked)}
                    colorScheme="green"
                    size="sm"
                  />
                </Td>
                <Td fontSize="sm" color="gray.500">
                  {exchange.lastSyncTime || 'Never'}
                </Td>
                <Td isNumeric>
                  <HStack spacing={1} justifyContent="flex-end">
                    <IconButton
                      aria-label="Refresh exchange"
                      icon={<FiRefreshCw />}
                      size="sm"
                      variant="ghost"
                      isLoading={refreshing === exchange.id}
                      onClick={() => handleRefresh(exchange.id)}
                    />
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="More options"
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<FiEdit />}
                          onClick={() => onEdit(exchange.id)}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          icon={<FiTrash2 />}
                          onClick={() => onDelete(exchange.id)}
                          color="red.500"
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default ExchangeTable;