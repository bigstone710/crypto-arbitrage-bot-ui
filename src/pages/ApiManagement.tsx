import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  FormHelperText,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue
} from '@chakra-ui/react';
import {
  FiEye,
  FiEyeOff,
  FiPlus,
  FiRefreshCw,
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiCheckCircle,
  FiXCircle,
  FiCopy,
  FiLock
} from 'react-icons/fi';

// Types
interface ApiKey {
  id: string;
  name: string;
  type: 'read' | 'write' | 'admin';
  key: string;
  createdAt: string;
  lastUsed: string | null;
  status: 'active' | 'expired' | 'revoked';
  expiresAt: string | null;
}

interface ExternalApi {
  id: string;
  name: string;
  type: 'price' | 'market' | 'chain';
  apiKey: string;
  url: string;
  status: 'active' | 'inactive' | 'error';
  usageCount: number;
  lastChecked: string;
}

// Mock data
const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Trading Bot API Key',
    type: 'admin',
    key: 'arb_bot_5f2c83a1b7e942d5a1e7e8e6c8f3b9a2',
    createdAt: '2025-02-15T12:00:00Z',
    lastUsed: '2025-03-30T18:24:12Z',
    status: 'active',
    expiresAt: '2025-06-15T12:00:00Z'
  },
  {
    id: '2',
    name: 'Monitoring API Key',
    type: 'read',
    key: 'arb_bot_3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p',
    createdAt: '2025-03-01T10:30:00Z',
    lastUsed: '2025-03-29T09:12:35Z',
    status: 'active',
    expiresAt: null
  },
  {
    id: '3',
    name: 'Old Webhook API',
    type: 'write',
    key: 'arb_bot_9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k',
    createdAt: '2024-10-12T14:22:00Z',
    lastUsed: '2025-01-15T08:45:21Z',
    status: 'revoked',
    expiresAt: '2025-04-12T14:22:00Z'
  }
];

const mockExternalApis: ExternalApi[] = [
  {
    id: '1',
    name: 'CoinGecko',
    type: 'price',
    apiKey: 'cg_api_123456789abcdef0123456789abcdef0',
    url: 'https://api.coingecko.com/api/v3',
    status: 'active',
    usageCount: 23742,
    lastChecked: '2025-03-30T23:45:12Z'
  },
  {
    id: '2',
    name: 'CoinMarketCap',
    type: 'market',
    apiKey: 'cmc_pro_api_a1b2c3d4e5f6g7h8i9j0',
    url: 'https://pro-api.coinmarketcap.com/v1',
    status: 'active',
    usageCount: 12584,
    lastChecked: '2025-03-30T22:15:05Z'
  },
  {
    id: '3',
    name: 'Infura Ethereum',
    type: 'chain',
    apiKey: 'inf_1234abcdef5678ghijkl',
    url: 'https://mainnet.infura.io/v3/{API_KEY}',
    status: 'active',
    usageCount: 89372,
    lastChecked: '2025-03-30T23:58:30Z'
  },
  {
    id: '4',
    name: 'Alchemy Polygon',
    type: 'chain',
    apiKey: 'alc_7890abcdef1234ghijkl',
    url: 'https://polygon-mainnet.g.alchemy.com/v2/{API_KEY}',
    status: 'error',
    usageCount: 43218,
    lastChecked: '2025-03-30T18:12:45Z'
  }
];

const ApiManagement: React.FC = () => {
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // State
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [externalApis, setExternalApis] = useState<ExternalApi[]>(mockExternalApis);
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null);
  const [selectedExternalApi, setSelectedExternalApi] = useState<ExternalApi | null>(null);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  
  // Modal controls
  const {
    isOpen: isAddApiKeyOpen,
    onOpen: onAddApiKeyOpen,
    onClose: onAddApiKeyClose
  } = useDisclosure();
  
  const {
    isOpen: isAddExternalApiOpen,
    onOpen: onAddExternalApiOpen,
    onClose: onAddExternalApiClose
  } = useDisclosure();
  
  const {
    isOpen: isDeleteConfirmationOpen,
    onOpen: onDeleteConfirmationOpen,
    onClose: onDeleteConfirmationClose
  } = useDisclosure();
  
  // Handlers
  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleEditApiKey = (apiKey: ApiKey) => {
    setSelectedApiKey(apiKey);
    onAddApiKeyOpen();
  };
  
  const handleEditExternalApi = (api: ExternalApi) => {
    setSelectedExternalApi(api);
    onAddExternalApiOpen();
  };
  
  const handleDeleteApiKey = (apiKey: ApiKey) => {
    setSelectedApiKey(apiKey);
    onDeleteConfirmationOpen();
  };
  
  const handleDeleteExternalApi = (api: ExternalApi) => {
    setSelectedExternalApi(api);
    onDeleteConfirmationOpen();
  };
  
  const confirmDelete = () => {
    if (selectedApiKey) {
      setApiKeys(apiKeys.filter(key => key.id !== selectedApiKey.id));
      toast({
        title: 'API Key Deleted',
        description: `The API key "${selectedApiKey.name}" has been deleted.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else if (selectedExternalApi) {
      setExternalApis(externalApis.filter(api => api.id !== selectedExternalApi.id));
      toast({
        title: 'External API Deleted',
        description: `The external API "${selectedExternalApi.name}" has been deleted.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    onDeleteConfirmationClose();
  };
  
  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: 'API Key Copied',
      description: 'The API key has been copied to your clipboard.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };
  
  const testExternalApi = (apiId: string) => {
    toast({
      title: 'Testing API Connection',
      description: 'Attempting to connect to the API...',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    
    // Simulate API test
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;
      
      setExternalApis(externalApis.map(api => {
        if (api.id === apiId) {
          return {
            ...api,
            status: isSuccess ? 'active' : 'error',
            lastChecked: new Date().toISOString()
          };
        }
        return api;
      }));
      
      toast({
        title: isSuccess ? 'Connection Successful' : 'Connection Failed',
        description: isSuccess 
          ? 'Successfully connected to the external API.' 
          : 'Failed to connect to the external API. Please check your credentials.',
        status: isSuccess ? 'success' : 'error',
        duration: 3000,
        isClosable: true,
      });
    }, 1500);
  };
  
  const revokeApiKey = (apiKeyId: string) => {
    setApiKeys(apiKeys.map(key => {
      if (key.id === apiKeyId) {
        return {
          ...key,
          status: 'revoked',
        };
      }
      return key;
    }));
    
    toast({
      title: 'API Key Revoked',
      description: 'The API key has been revoked and can no longer be used.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const regenerateApiKey = (apiKeyId: string) => {
    // In a real app, you would call your backend to generate a new key
    const newKey = 'arb_bot_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    setApiKeys(apiKeys.map(key => {
      if (key.id === apiKeyId) {
        return {
          ...key,
          key: newKey,
          status: 'active',
          createdAt: new Date().toISOString(),
          lastUsed: null,
        };
      }
      return key;
    }));
    
    toast({
      title: 'API Key Regenerated',
      description: 'A new API key has been generated. Please copy it now.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    // Automatically show the new key
    setShowApiKeys(prev => ({
      ...prev,
      [apiKeyId]: true
    }));
  };
  
  // Utility function to format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Status colors
  const statusColors = {
    active: 'green',
    inactive: 'yellow',
    error: 'red',
    expired: 'orange',
    revoked: 'red'
  };
  
  const apiTypeColors = {
    admin: 'purple',
    write: 'blue',
    read: 'green',
    price: 'teal',
    market: 'cyan',
    chain: 'orange'
  };
  
  return (
    <Box pt={5} pb={10}>
      <VStack spacing={8} align="stretch">
        {/* Internal API Keys Section */}
        <VStack align="stretch" spacing={4}>
          <HStack justifyContent="space-between">
            <Heading size="lg">Bot API Keys</Heading>
            <Button 
              leftIcon={<FiPlus />} 
              colorScheme="blue"
              onClick={onAddApiKeyOpen}
            >
              Generate New API Key
            </Button>
          </HStack>
          
          <Text>Manage API keys for accessing the crypto arbitrage bot's API endpoints.</Text>
          
          <Card variant="outline">
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Type</Th>
                    <Th>API Key</Th>
                    <Th>Created</Th>
                    <Th>Last Used</Th>
                    <Th>Status</Th>
                    <Th>Expires</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {apiKeys.map(apiKey => (
                    <Tr key={apiKey.id}>
                      <Td>{apiKey.name}</Td>
                      <Td>
                        <Badge colorScheme={apiTypeColors[apiKey.type]}>
                          {apiKey.type.toUpperCase()}
                        </Badge>
                      </Td>
                      <Td>
                        <InputGroup size="sm">
                          <Input
                            value={apiKey.key}
                            type={showApiKeys[apiKey.id] ? 'text' : 'password'}
                            readOnly
                            isDisabled={apiKey.status === 'revoked'}
                            maxW="220px"
                          />
                          <InputRightElement width="4.5rem">
                            <HStack spacing={1}>
                              <IconButton
                                h="1.75rem"
                                size="sm"
                                aria-label={showApiKeys[apiKey.id] ? 'Hide' : 'Show'}
                                icon={showApiKeys[apiKey.id] ? <FiEyeOff /> : <FiEye />}
                                onClick={() => toggleApiKeyVisibility(apiKey.id)}
                                isDisabled={apiKey.status === 'revoked'}
                              />
                              <IconButton
                                h="1.75rem"
                                size="sm"
                                aria-label="Copy"
                                icon={<FiCopy />}
                                onClick={() => copyApiKey(apiKey.key)}
                                isDisabled={apiKey.status === 'revoked'}
                              />
                            </HStack>
                          </InputRightElement>
                        </InputGroup>
                      </Td>
                      <Td>{formatDate(apiKey.createdAt)}</Td>
                      <Td>{formatDate(apiKey.lastUsed)}</Td>
                      <Td>
                        <Badge colorScheme={statusColors[apiKey.status]}>
                          {apiKey.status.toUpperCase()}
                        </Badge>
                      </Td>
                      <Td>{apiKey.expiresAt ? formatDate(apiKey.expiresAt) : 'Never'}</Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<FiMoreVertical />}
                            variant="ghost"
                            size="sm"
                          />
                          <MenuList>
                            <MenuItem icon={<FiEdit />} onClick={() => handleEditApiKey(apiKey)}>
                              Edit
                            </MenuItem>
                            {apiKey.status !== 'revoked' && (
                              <MenuItem 
                                icon={<FiLock />} 
                                onClick={() => revokeApiKey(apiKey.id)}
                              >
                                Revoke
                              </MenuItem>
                            )}
                            <MenuItem 
                              icon={<FiRefreshCw />} 
                              onClick={() => regenerateApiKey(apiKey.id)}
                            >
                              Regenerate
                            </MenuItem>
                            <MenuItem 
                              icon={<FiTrash2 />} 
                              onClick={() => handleDeleteApiKey(apiKey)}
                              color="red.500"
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              
              {apiKeys.length === 0 && (
                <Alert status="info" mt={4}>
                  <AlertIcon />
                  <AlertTitle mr={2}>No API Keys</AlertTitle>
                  <AlertDescription>
                    You haven't created any API keys yet. Generate a new key to get started.
                  </AlertDescription>
                </Alert>
              )}
            </CardBody>
          </Card>
        </VStack>
        
        <Divider />
        
        {/* External APIs Section */}
        <VStack align="stretch" spacing={4}>
          <HStack justifyContent="space-between">
            <Heading size="lg">External APIs</Heading>
            <Button 
              leftIcon={<FiPlus />} 
              colorScheme="blue"
              onClick={onAddExternalApiOpen}
            >
              Add External API
            </Button>
          </HStack>
          
          <Text>Configure external API integrations for price data, blockchain access, and market information.</Text>
          
          <Card variant="outline">
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Type</Th>
                    <Th>API Key</Th>
                    <Th>URL</Th>
                    <Th>Status</Th>
                    <Th>Usage Count</Th>
                    <Th>Last Checked</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {externalApis.map(api => (
                    <Tr key={api.id}>
                      <Td>{api.name}</Td>
                      <Td>
                        <Badge colorScheme={apiTypeColors[api.type]}>
                          {api.type.toUpperCase()}
                        </Badge>
                      </Td>
                      <Td>
                        <InputGroup size="sm">
                          <Input
                            value={api.apiKey}
                            type={showApiKeys[api.id] ? 'text' : 'password'}
                            readOnly
                            maxW="220px"
                          />
                          <InputRightElement width="4.5rem">
                            <HStack spacing={1}>
                              <IconButton
                                h="1.75rem"
                                size="sm"
                                aria-label={showApiKeys[api.id] ? 'Hide' : 'Show'}
                                icon={showApiKeys[api.id] ? <FiEyeOff /> : <FiEye />}
                                onClick={() => toggleApiKeyVisibility(api.id)}
                              />
                              <IconButton
                                h="1.75rem"
                                size="sm"
                                aria-label="Copy"
                                icon={<FiCopy />}
                                onClick={() => copyApiKey(api.apiKey)}
                              />
                            </HStack>
                          </InputRightElement>
                        </InputGroup>
                      </Td>
                      <Td maxW="200px" isTruncated>{api.url}</Td>
                      <Td>
                        <Badge colorScheme={statusColors[api.status]}>
                          {api.status.toUpperCase()}
                        </Badge>
                      </Td>
                      <Td>{api.usageCount.toLocaleString()}</Td>
                      <Td>{formatDate(api.lastChecked)}</Td>
                      <Td>
                        <HStack spacing={1}>
                          <IconButton
                            aria-label="Test Connection"
                            icon={<FiRefreshCw />}
                            size="sm"
                            onClick={() => testExternalApi(api.id)}
                          />
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<FiMoreVertical />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem icon={<FiEdit />} onClick={() => handleEditExternalApi(api)}>
                                Edit
                              </MenuItem>
                              <MenuItem 
                                icon={<FiTrash2 />} 
                                onClick={() => handleDeleteExternalApi(api)}
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
              
              {externalApis.length === 0 && (
                <Alert status="info" mt={4}>
                  <AlertIcon />
                  <AlertTitle mr={2}>No External APIs</AlertTitle>
                  <AlertDescription>
                    You haven't added any external API integrations yet.
                  </AlertDescription>
                </Alert>
              )}
            </CardBody>
          </Card>
        </VStack>
      </VStack>
      
      {/* Add/Edit API Key Modal - Placeholder */}
      <Modal isOpen={isAddApiKeyOpen} onClose={onAddApiKeyClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedApiKey ? 'Edit API Key' : 'Generate New API Key'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>API Key Name</FormLabel>
                <Input placeholder="Enter a descriptive name for this API key" />
                <FormHelperText>
                  Choose a name that describes how this key will be used
                </FormHelperText>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>API Key Type</FormLabel>
                <SimpleGrid columns={3} spacing={4}>
                  <Button variant="outline" colorScheme="green">
                    Read-Only
                  </Button>
                  <Button variant="outline" colorScheme="blue">
                    Write
                  </Button>
                  <Button variant="outline" colorScheme="purple">
                    Admin
                  </Button>
                </SimpleGrid>
                <FormHelperText>
                  Choose the permission level for this API key
                </FormHelperText>
              </FormControl>
              
              <FormControl>
                <FormLabel>Expiration</FormLabel>
                <SimpleGrid columns={4} spacing={4}>
                  <Button variant="outline">
                    30 Days
                  </Button>
                  <Button variant="outline">
                    90 Days
                  </Button>
                  <Button variant="outline">
                    1 Year
                  </Button>
                  <Button variant="outline">
                    Never
                  </Button>
                </SimpleGrid>
                <FormHelperText>
                  For security, consider setting an expiration date
                </FormHelperText>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onAddApiKeyClose} mr={3}>Cancel</Button>
            <Button 
              colorScheme="blue" 
              onClick={() => {
                onAddApiKeyClose();
                toast({
                  title: 'Not Implemented',
                  description: 'This functionality is just a mockup for UI demonstration.',
                  status: 'info',
                  duration: 3000,
                  isClosable: true,
                });
              }}
            >
              {selectedApiKey ? 'Save Changes' : 'Generate Key'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Add/Edit External API Modal - Placeholder */}
      <Modal isOpen={isAddExternalApiOpen} onClose={onAddExternalApiClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedExternalApi ? 'Edit External API' : 'Add External API'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>API Name</FormLabel>
                <Input placeholder="Enter a name for this API" />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>API Type</FormLabel>
                <SimpleGrid columns={3} spacing={4}>
                  <Button variant="outline" colorScheme="teal">
                    Price Data
                  </Button>
                  <Button variant="outline" colorScheme="cyan">
                    Market Data
                  </Button>
                  <Button variant="outline" colorScheme="orange">
                    Blockchain
                  </Button>
                </SimpleGrid>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>API Key</FormLabel>
                <Input placeholder="Enter the API key" />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>API URL</FormLabel>
                <Input placeholder="Enter the base URL for the API" />
                <FormHelperText>
                  Include {'{API_KEY}'} where the key should be inserted in the URL if applicable
                </FormHelperText>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onAddExternalApiClose} mr={3}>Cancel</Button>
            <Button 
              colorScheme="blue" 
              onClick={() => {
                onAddExternalApiClose();
                toast({
                  title: 'Not Implemented',
                  description: 'This functionality is just a mockup for UI demonstration.',
                  status: 'info',
                  duration: 3000,
                  isClosable: true,
                });
              }}
            >
              {selectedExternalApi ? 'Save Changes' : 'Add API'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteConfirmationOpen} onClose={onDeleteConfirmationClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error">
              <AlertIcon />
              <VStack align="start" spacing={2}>
                <AlertTitle>Are you sure?</AlertTitle>
                <AlertDescription>
                  You are about to delete {selectedApiKey ? `API key "${selectedApiKey.name}"` : 
                  selectedExternalApi ? `external API "${selectedExternalApi.name}"` : "this item"}.
                  This action cannot be undone.
                </AlertDescription>
              </VStack>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onDeleteConfirmationClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={confirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ApiManagement;