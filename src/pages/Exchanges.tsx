import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  Heading,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Icon,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';

import ExchangeTable, { Exchange } from '../components/exchanges/ExchangeTable';
import ExchangeForm, { ExchangeFormValues } from '../components/exchanges/ExchangeForm';

// Mock data for exchanges
const mockExchanges: Exchange[] = [
  {
    id: '1',
    name: 'Binance',
    type: 'CEX',
    status: 'connected',
    tradingPairsCount: 8,
    enabled: true,
    apiKeyConfigured: true,
    lastSyncTime: '2 min ago'
  },
  {
    id: '2',
    name: 'Coinbase',
    type: 'CEX',
    status: 'connected',
    tradingPairsCount: 5,
    enabled: true,
    apiKeyConfigured: true,
    lastSyncTime: '5 min ago'
  },
  {
    id: '3',
    name: 'Kraken',
    type: 'CEX',
    status: 'disconnected',
    tradingPairsCount: 4,
    enabled: false,
    apiKeyConfigured: true,
    lastSyncTime: '1 hour ago'
  },
  {
    id: '4',
    name: 'Kucoin',
    type: 'CEX',
    status: 'error',
    tradingPairsCount: 6,
    enabled: true,
    apiKeyConfigured: true,
    lastSyncTime: '30 min ago'
  },
  {
    id: '5',
    name: 'Uniswap',
    type: 'DEX',
    chainId: 'ethereum',
    status: 'connected',
    tradingPairsCount: 3,
    enabled: true,
    apiKeyConfigured: false,
    lastSyncTime: '10 min ago'
  },
  {
    id: '6',
    name: 'PancakeSwap',
    type: 'DEX',
    chainId: 'bsc',
    status: 'connected',
    tradingPairsCount: 4,
    enabled: true,
    apiKeyConfigured: false,
    lastSyncTime: '15 min ago'
  }
];

const Exchanges: React.FC = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>(mockExchanges);
  const [selectedExchange, setSelectedExchange] = useState<Exchange | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [exchangeToDelete, setExchangeToDelete] = useState<string | null>(null);
  
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleAddExchange = () => {
    setSelectedExchange(undefined);
    setIsEditing(false);
    onFormOpen();
  };

  const handleEditExchange = (id: string) => {
    const exchange = exchanges.find(e => e.id === id);
    if (exchange) {
      setSelectedExchange(exchange);
      setIsEditing(true);
      onFormOpen();
    }
  };

  const handleDeleteExchange = (id: string) => {
    setExchangeToDelete(id);
    onDeleteDialogOpen();
  };

  const confirmDeleteExchange = () => {
    if (exchangeToDelete) {
      setExchanges(exchanges.filter(e => e.id !== exchangeToDelete));
      toast({
        title: 'Exchange deleted',
        description: 'The exchange has been removed successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setExchangeToDelete(null);
      onDeleteDialogClose();
    }
  };

  const handleToggleStatus = (id: string, enabled: boolean) => {
    setExchanges(exchanges.map(e => 
      e.id === id ? { ...e, enabled, status: enabled ? (e.status === 'disconnected' ? 'connected' : e.status) : 'disconnected' } : e
    ));
    
    toast({
      title: enabled ? 'Exchange enabled' : 'Exchange disabled',
      description: `The exchange has been ${enabled ? 'enabled' : 'disabled'} successfully.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRefreshExchange = (id: string) => {
    // This would make an API call to refresh exchange data in a real app
    console.log(`Refreshing exchange ${id}`);
  };

  const handleViewTradingPairs = (id: string) => {
    const exchange = exchanges.find(e => e.id === id);
    if (exchange) {
      toast({
        title: 'Trading Pairs',
        description: `Viewing trading pairs for ${exchange.name}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFormSubmit = (values: ExchangeFormValues) => {
    if (isEditing && selectedExchange) {
      // Update existing exchange
      setExchanges(exchanges.map(e => 
        e.id === selectedExchange.id 
          ? { 
              ...e, 
              name: values.name,
              type: values.type,
              chainId: values.chainId,
              enabled: values.enabled,
              apiKeyConfigured: !!(values.apiKey && values.apiSecret),
              tradingPairsCount: values.tradingPairs.length
            } 
          : e
      ));
      
      toast({
        title: 'Exchange updated',
        description: `${values.name} has been updated successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Add new exchange
      const newExchange: Exchange = {
        id: `${Date.now()}`,
        name: values.name,
        type: values.type,
        chainId: values.chainId,
        status: 'disconnected',
        tradingPairsCount: values.tradingPairs.length,
        enabled: values.enabled,
        apiKeyConfigured: !!(values.apiKey && values.apiSecret),
        lastSyncTime: 'Never'
      };
      
      setExchanges([...exchanges, newExchange]);
      
      toast({
        title: 'Exchange added',
        description: `${values.name} has been added successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    
    onFormClose();
  };

  return (
    <Box pt={5} pb={10}>
      <VStack spacing={6} align="stretch">
        <Box
          bg={bgColor}
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          shadow="sm"
        >
          <HStack justifyContent="space-between" mb={4}>
            <Heading size="md">Exchange Management</Heading>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={handleAddExchange}
            >
              Add Exchange
            </Button>
          </HStack>
          
          <Text color="gray.600" mb={6}>
            Manage your exchange connections, API keys, and trading pairs.
          </Text>
          
          <Flex justifyContent="flex-end" mb={4} gap={2}>
            <Button leftIcon={<FiFilter />} variant="outline" size="sm">
              Filter
            </Button>
            <Button leftIcon={<FiSearch />} variant="outline" size="sm">
              Search
            </Button>
          </Flex>
          
          <ExchangeTable
            exchanges={exchanges}
            onEdit={handleEditExchange}
            onDelete={handleDeleteExchange}
            onToggleStatus={handleToggleStatus}
            onRefresh={handleRefreshExchange}
            onViewTradingPairs={handleViewTradingPairs}
          />
        </Box>
      </VStack>
      
      {/* Exchange Form Modal */}
      <Modal isOpen={isFormOpen} onClose={onFormClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditing ? 'Edit Exchange' : 'Add New Exchange'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ExchangeForm
              exchange={selectedExchange}
              isEditing={isEditing}
              onSubmit={handleFormSubmit}
              onCancel={onFormClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Exchange
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this exchange? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteDialogClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDeleteExchange} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Exchanges;