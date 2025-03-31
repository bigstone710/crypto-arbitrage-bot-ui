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
      <Text>DEX Networks page</Text>
    </Box>
  );
};

export default DexNetworks;