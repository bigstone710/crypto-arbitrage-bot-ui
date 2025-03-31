import React, { useState } from 'react';
import {
  Box,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Badge,
  Switch,
  FormControl,
  FormLabel,
  Input,
  Select,
  Divider,
  Icon,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
  Tooltip,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import {
  FiPlus,
  FiInfo,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiActivity,
  FiRefreshCw,
  FiSliders,
  FiAlertTriangle,
  FiEye,
  FiEyeOff,
  FiCheckCircle
} from 'react-icons/fi';

// Types
interface Dex {
  id: string;
  name: string;
  protocol: string;
  routerAddress?: string;
  programId?: string; // For Solana DEXes
  status: 'active' | 'inactive' | 'error';
  enabled: boolean;
  tradingPairs: number;
}

interface Network {
  id: string;
  name: string;
  type: 'evm' | 'solana';
  rpcUrl: string;
  chainId?: string;
  status: 'connected' | 'disconnected' | 'error';
  gasPrice?: string;
  blockHeight?: number;
  dexes: Dex[];
}

// Mock data
const mockNetworks: Network[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    type: 'evm',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    chainId: '1',
    status: 'connected',
    gasPrice: '35 Gwei',
    blockHeight: 19374284,
    dexes: [
      {
        id: 'uniswap_v2',
        name: 'Uniswap V2',
        protocol: 'UniswapV2',
        routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        status: 'active',
        enabled: true,
        tradingPairs: 12
      },
      {
        id: 'uniswap_v3',
        name: 'Uniswap V3',
        protocol: 'UniswapV3',
        routerAddress: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        status: 'active',
        enabled: true,
        tradingPairs: 8
      },
      {
        id: 'sushiswap',
        name: 'SushiSwap',
        protocol: 'UniswapV2',
        routerAddress: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
        status: 'active',
        enabled: false,
        tradingPairs: 5
      }
    ]
  },
  {
    id: 'bsc',
    name: 'Binance Smart Chain',
    type: 'evm',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    chainId: '56',
    status: 'connected',
    gasPrice: '5 Gwei',
    blockHeight: 35218739,
    dexes: [
      {
        id: 'pancakeswap',
        name: 'PancakeSwap',
        protocol: 'UniswapV2',
        routerAddress: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
        status: 'active',
        enabled: true,
        tradingPairs: 15
      },
      {
        id: 'biswap',
        name: 'Biswap',
        protocol: 'UniswapV2',
        routerAddress: '0x3a6d8cA21D1CF76F653A67577FA0D27453350dD8',
        status: 'inactive',
        enabled: false,
        tradingPairs: 0
      }
    ]
  },
  {
    id: 'solana',
    name: 'Solana',
    type: 'solana',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    status: 'error',
    blockHeight: 239847294,
    dexes: [
      {
        id: 'raydium',
        name: 'Raydium',
        protocol: 'Raydium',
        programId: 'RaYdiumswapV2Prog111111111111111111111111111',
        status: 'error',
        enabled: true,
        tradingPairs: 7
      },
      {
        id: 'orca',
        name: 'Orca',
        protocol: 'Orca',
        programId: 'OrCAswapV2Program111111111111111111111111111',
        status: 'error',
        enabled: true,
        tradingPairs: 4
      }
    ]
  },
  {
    id: 'polygon',
    name: 'Polygon',
    type: 'evm',
    rpcUrl: 'https://polygon-rpc.com',
    chainId: '137',
    status: 'disconnected',
    blockHeight: 52384920,
    dexes: [
      {
        id: 'quickswap',
        name: 'QuickSwap',
        protocol: 'UniswapV2',
        routerAddress: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
        status: 'inactive',
        enabled: true,
        tradingPairs: 0
      }
    ]
  }
];

const DexNetworks: React.FC = () => {
  const [networks, setNetworks] = useState<Network[]>(mockNetworks);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [showRpcUrl, setShowRpcUrl] = useState<Record<string, boolean>>({});
  const toast = useToast();
  
  const { isOpen: isAddDexOpen, onOpen: onAddDexOpen, onClose: onAddDexClose } = useDisclosure();
  const { isOpen: isEditNetworkOpen, onOpen: onEditNetworkOpen, onClose: onEditNetworkClose } = useDisclosure();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  
  const toggleNetwork = (networkId: string, enabled: boolean) => {
    setNetworks(networks.map(network => {
      if (network.id === networkId) {
        return {
          ...network,
          status: enabled ? 'connected' : 'disconnected',
          dexes: network.dexes.map(dex => ({
            ...dex,
            status: enabled ? (dex.enabled ? 'active' : 'inactive') : 'inactive'
          }))
        };
      }
      return network;
    }));
    
    toast({
      title: enabled ? 'Network Enabled' : 'Network Disabled',
      description: `${networks.find(n => n.id === networkId)?.name} has been ${enabled ? 'enabled' : 'disabled'}.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const toggleDex = (networkId: string, dexId: string, enabled: boolean) => {
    setNetworks(networks.map(network => {
      if (network.id === networkId) {
        return {
          ...network,
          dexes: network.dexes.map(dex => {
            if (dex.id === dexId) {
              return {
                ...dex,
                enabled,
                status: network.status === 'connected' ? (enabled ? 'active' : 'inactive') : 'inactive'
              };
            }
            return dex;
          })
        };
      }
      return network;
    }));
    
    const dexName = networks
      .find(n => n.id === networkId)
      ?.dexes.find(d => d.id === dexId)?.name;
      
    toast({
      title: enabled ? 'DEX Enabled' : 'DEX Disabled',
      description: `${dexName} has been ${enabled ? 'enabled' : 'disabled'}.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const toggleRpcVisibility = (networkId: string) => {
    setShowRpcUrl(prev => ({
      ...prev,
      [networkId]: !prev[networkId]
    }));
  };
  
  const handleEditNetwork = (network: Network) => {
    setSelectedNetwork(network);
    onEditNetworkOpen();
  };
  
  const handleAddDex = (networkId: string) => {
    setSelectedNetwork(networks.find(n => n.id === networkId) || null);
    onAddDexOpen();
  };
  
  const handleTestConnection = (networkId: string) => {
    toast({
      title: 'Testing Connection',
      description: 'Attempting to connect to RPC endpoint...',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    
    // Simulate connection test
    setTimeout(() => {
      const randomSuccess = Math.random() > 0.3;
      
      toast({
        title: randomSuccess ? 'Connection Successful' : 'Connection Failed',
        description: randomSuccess 
          ? 'Successfully connected to the RPC endpoint.' 
          : 'Failed to connect to the RPC endpoint. Please check the URL and try again.',
        status: randomSuccess ? 'success' : 'error',
        duration: 4000,
        isClosable: true,
      });
      
      if (randomSuccess) {
        setNetworks(networks.map(network => 
          network.id === networkId 
            ? { ...network, status: 'connected' } 
            : network
        ));
      }
    }, 2000);
  };
  
  const networkStatusColors = {
    connected: 'green',
    disconnected: 'gray',
    error: 'red'
  };
  
  const dexStatusColors = {
    active: 'green',
    inactive: 'gray',
    error: 'red'
  };
  
  return (
    <Box pt={5} pb={10}>
      <VStack spacing={6} align="stretch">
        <HStack justifyContent="space-between">
          <Heading size="lg">DEX Networks</Heading>
          <Button 
            leftIcon={<FiPlus />} 
            colorScheme="blue" 
            onClick={() => {
              toast({
                title: "Not Implemented",
                description: "Adding new networks is not yet implemented.",
                status: "info",
                duration: 3000,
                isClosable: true,
              });
            }}
          >
            Add Network
          </Button>
        </HStack>
        
        <Tabs variant="enclosed">
          <TabList>
            {networks.map(network => (
              <Tab key={network.id}>
                <HStack>
                  <Text>{network.name}</Text>
                  <Badge colorScheme={networkStatusColors[network.status]}>
                    {network.status}
                  </Badge>
                </HStack>
              </Tab>
            ))}
          </TabList>
          
          <TabPanels>
            {networks.map(network => (
              <TabPanel key={network.id} p={4}>
                <VStack spacing={6} align="stretch">
                  {/* Network Details */}
                  <Card variant="outline">
                    <CardHeader>
                      <HStack justifyContent="space-between">
                        <Heading size="md">Network Configuration</Heading>
                        <Button 
                          leftIcon={<FiEdit />} 
                          size="sm" 
                          onClick={() => handleEditNetwork(network)}
                        >
                          Edit
                        </Button>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel mb="0">Network Status</FormLabel>
                          <Switch 
                            colorScheme="green" 
                            isChecked={network.status === 'connected'} 
                            onChange={(e) => toggleNetwork(network.id, e.target.checked)}
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Chain ID</FormLabel>
                          <Text>{network.chainId || 'N/A'}</Text>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>RPC URL</FormLabel>
                          <InputGroup>
                            <Input 
                              type={showRpcUrl[network.id] ? "text" : "password"} 
                              value={network.rpcUrl} 
                              isReadOnly
                            />
                            <InputRightElement>
                              <IconButton
                                aria-label="Toggle URL visibility"
                                icon={showRpcUrl[network.id] ? <FiEyeOff /> : <FiEye />}
                                size="sm"
                                onClick={() => toggleRpcVisibility(network.id)}
                              />
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Network Type</FormLabel>
                          <Badge>{network.type === 'evm' ? 'EVM Compatible' : 'Solana'}</Badge>
                        </FormControl>
                        
                        {network.gasPrice && (
                          <FormControl>
                            <FormLabel>Current Gas Price</FormLabel>
                            <Text>{network.gasPrice}</Text>
                          </FormControl>
                        )}
                        
                        <FormControl>
                          <FormLabel>Block Height</FormLabel>
                          <Text>{network.blockHeight?.toLocaleString() || 'Unknown'}</Text>
                        </FormControl>
                        
                        <Button 
                          leftIcon={<FiActivity />} 
                          colorScheme="blue" 
                          variant="outline"
                          onClick={() => handleTestConnection(network.id)}
                        >
                          Test Connection
                        </Button>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                  
                  {/* DEXes */}
                  <Card variant="outline">
                    <CardHeader>
                      <HStack justifyContent="space-between">
                        <Heading size="md">DEXes ({network.dexes.length})</Heading>
                        <Button 
                          leftIcon={<FiPlus />} 
                          size="sm" 
                          colorScheme="blue"
                          onClick={() => handleAddDex(network.id)}
                        >
                          Add DEX
                        </Button>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      {network.dexes.length === 0 ? (
                        <Alert status="info">
                          <AlertIcon />
                          <AlertTitle mr={2}>No DEXes Configured</AlertTitle>
                          <AlertDescription>
                            Add a DEX to start configuring trading pairs.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <VStack spacing={3} align="stretch">
                          {network.dexes.map(dex => (
                            <Card 
                              key={dex.id} 
                              variant="outline" 
                              borderColor={borderColor}
                              bg={cardBg}
                            >
                              <CardBody>
                                <SimpleGrid columns={{ base: 1, md: 12 }} spacing={4} alignItems="center">
                                  <GridItem colSpan={{ base: 1, md: 2 }}>
                                    <Heading size="sm">{dex.name}</Heading>
                                  </GridItem>
                                  
                                  <GridItem colSpan={{ base: 1, md: 2 }}>
                                    <VStack align="start" spacing={1}>
                                      <Text fontSize="xs" color="gray.500">Protocol</Text>
                                      <Text>{dex.protocol}</Text>
                                    </VStack>
                                  </GridItem>
                                  
                                  <GridItem colSpan={{ base: 1, md: 2 }}>
                                    <VStack align="start" spacing={1}>
                                      <Text fontSize="xs" color="gray.500">Status</Text>
                                      <Badge colorScheme={dexStatusColors[dex.status]}>
                                        {dex.status}
                                      </Badge>
                                    </VStack>
                                  </GridItem>
                                  
                                  <GridItem colSpan={{ base: 1, md: 2 }}>
                                    <VStack align="start" spacing={1}>
                                      <Text fontSize="xs" color="gray.500">Trading Pairs</Text>
                                      <Text>{dex.tradingPairs}</Text>
                                    </VStack>
                                  </GridItem>
                                  
                                  <GridItem colSpan={{ base: 1, md: 2 }}>
                                    <Tooltip 
                                      label={network.type === 'evm' ? 'Router Address' : 'Program ID'} 
                                      placement="top"
                                    >
                                      <VStack align="start" spacing={1}>
                                        <Text fontSize="xs" color="gray.500">
                                          {network.type === 'evm' ? 'Router' : 'Program ID'}
                                        </Text>
                                        <Text fontSize="sm" noOfLines={1}>
                                          {dex.routerAddress || dex.programId || 'N/A'}
                                        </Text>
                                      </VStack>
                                    </Tooltip>
                                  </GridItem>
                                  
                                  <GridItem colSpan={{ base: 1, md: 2 }} justifySelf="end">
                                    <HStack spacing={2}>
                                      <FormControl display="flex" alignItems="center" width="auto">
                                        <Switch 
                                          colorScheme="green" 
                                          isChecked={dex.enabled} 
                                          onChange={(e) => toggleDex(network.id, dex.id, e.target.checked)}
                                          isDisabled={network.status !== 'connected'}
                                        />
                                        <FormLabel mb="0" ml={2} fontSize="sm">
                                          {dex.enabled ? 'Enabled' : 'Disabled'}
                                        </FormLabel>
                                      </FormControl>
                                      
                                      <IconButton
                                        aria-label="Edit DEX"
                                        icon={<FiEdit />}
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          toast({
                                            title: "Not Implemented",
                                            description: "Editing DEX is not yet implemented.",
                                            status: "info",
                                            duration: 3000,
                                            isClosable: true,
                                          });
                                        }}
                                      />
                                      
                                      <IconButton
                                        aria-label="View Trading Pairs"
                                        icon={<FiSliders />}
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          toast({
                                            title: "Not Implemented",
                                            description: "Viewing trading pairs is not yet implemented.",
                                            status: "info",
                                            duration: 3000,
                                            isClosable: true,
                                          });
                                        }}
                                      />
                                    </HStack>
                                  </GridItem>
                                </SimpleGrid>
                              </CardBody>
                            </Card>
                          ))}
                        </VStack>
                      )}
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </VStack>
      
      {/* Edit Network Modal - Placeholder */}
      <Modal isOpen={isEditNetworkOpen} onClose={onEditNetworkClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit {selectedNetwork?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Network editing functionality would go here.</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onEditNetworkClose}>Cancel</Button>
            <Button colorScheme="blue" ml={3}>Save Changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Add DEX Modal - Placeholder */}
      <Modal isOpen={isAddDexOpen} onClose={onAddDexClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add DEX to {selectedNetwork?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>DEX creation form would go here.</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onAddDexClose}>Cancel</Button>
            <Button colorScheme="blue" ml={3}>Add DEX</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// GridItem component for SimpleGrid layout
const GridItem: React.FC<{
  children: React.ReactNode;
  colSpan: { base: number; md: number };
  [x: string]: any;
}> = ({ children, colSpan, ...rest }) => {
  return (
    <Box gridColumn={`span ${colSpan.md} / span ${colSpan.md}`} {...rest}>
      {children}
    </Box>
  );
};

export default DexNetworks;