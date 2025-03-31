import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Select,
  Switch,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormErrorMessage,
  Divider,
  Text,
  Heading,
  useColorModeValue,
  Tooltip,
  Icon
} from '@chakra-ui/react';
import { FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { Exchange } from './ExchangeTable';

export interface ExchangeFormValues {
  id?: string;
  name: string;
  type: 'CEX' | 'DEX';
  chainId?: string;
  apiKey?: string;
  apiSecret?: string;
  passphrase?: string; // For exchanges that require it
  rpcUrl?: string; // For DEX exchanges
  enabled: boolean;
  tradingPairs: string[]; // Array of trading pairs
}

interface ExchangeFormProps {
  exchange?: Exchange;
  isEditing?: boolean;
  onSubmit: (values: ExchangeFormValues) => void;
  onCancel: () => void;
}

const dexChains = [
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'bsc', name: 'Binance Smart Chain' },
  { id: 'polygon', name: 'Polygon' },
  { id: 'solana', name: 'Solana' },
  { id: 'avalanche', name: 'Avalanche' },
];

const cexList = [
  { id: 'binance', name: 'Binance' },
  { id: 'coinbase', name: 'Coinbase' },
  { id: 'kucoin', name: 'KuCoin' },
  { id: 'kraken', name: 'Kraken' },
  { id: 'okx', name: 'OKX' },
  { id: 'bitfinex', name: 'Bitfinex' },
  { id: 'huobi', name: 'Huobi' },
  { id: 'bybit', name: 'Bybit' },
  { id: 'custom', name: 'Custom Exchange' }
];

const defaultTradingPairs = [
  'BTC/USDT',
  'ETH/USDT',
  'SOL/USDT',
  'ADA/USDT',
  'XRP/USDT',
  'DOGE/USDT',
  'AVAX/USDT',
];

const ExchangeForm: React.FC<ExchangeFormProps> = ({
  exchange,
  isEditing = false,
  onSubmit,
  onCancel
}) => {
  const [formValues, setFormValues] = useState<ExchangeFormValues>({
    name: '',
    type: 'CEX',
    enabled: true,
    tradingPairs: [...defaultTradingPairs]
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedCex, setSelectedCex] = useState('binance');
  const [customTradingPair, setCustomTradingPair] = useState('');
  
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    if (exchange) {
      // Simulate fetching exchange details including secret API keys (in a real app these would come from secure storage)
      setFormValues({
        id: exchange.id,
        name: exchange.name,
        type: exchange.type,
        chainId: exchange.chainId,
        enabled: exchange.enabled,
        apiKey: exchange.apiKeyConfigured ? '********' : '',
        apiSecret: exchange.apiKeyConfigured ? '********' : '',
        tradingPairs: new Array(exchange.tradingPairsCount).fill('').map((_, i) => defaultTradingPairs[i % defaultTradingPairs.length])
      });
      
      if (exchange.type === 'CEX') {
        const foundCex = cexList.find(c => c.name === exchange.name);
        if (foundCex) {
          setSelectedCex(foundCex.id);
        } else {
          setSelectedCex('custom');
        }
      }
    }
  }, [exchange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    
    // Clear any error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormValues(prev => ({ ...prev, [name]: checked }));
  };

  const handleCexChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedCex(selectedValue);
    
    if (selectedValue !== 'custom') {
      const selectedExchange = cexList.find(c => c.id === selectedValue);
      if (selectedExchange) {
        setFormValues(prev => ({
          ...prev,
          name: selectedExchange.name,
          type: 'CEX'
        }));
      }
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as 'CEX' | 'DEX';
    setFormValues(prev => ({ 
      ...prev, 
      type,
      // Clear irrelevant fields
      apiKey: type === 'DEX' ? undefined : prev.apiKey,
      apiSecret: type === 'DEX' ? undefined : prev.apiSecret,
      passphrase: type === 'DEX' ? undefined : prev.passphrase,
      chainId: type === 'CEX' ? undefined : prev.chainId,
      rpcUrl: type === 'CEX' ? undefined : prev.rpcUrl
    }));
  };

  const addTradingPair = () => {
    if (customTradingPair && !formValues.tradingPairs.includes(customTradingPair)) {
      setFormValues(prev => ({
        ...prev,
        tradingPairs: [...prev.tradingPairs, customTradingPair]
      }));
      setCustomTradingPair('');
    }
  };

  const removeTradingPair = (pair: string) => {
    setFormValues(prev => ({
      ...prev,
      tradingPairs: prev.tradingPairs.filter(p => p !== pair)
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formValues.name) {
      errors.name = 'Exchange name is required';
    }
    
    if (formValues.type === 'CEX' && !isEditing) {
      if (!formValues.apiKey) {
        errors.apiKey = 'API key is required';
      }
      if (!formValues.apiSecret) {
        errors.apiSecret = 'API secret is required';
      }
    }
    
    if (formValues.type === 'DEX') {
      if (!formValues.chainId) {
        errors.chainId = 'Chain ID is required';
      }
      if (!formValues.rpcUrl) {
        errors.rpcUrl = 'RPC URL is required';
      }
    }
    
    if (formValues.tradingPairs.length === 0) {
      errors.tradingPairs = 'At least one trading pair is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formValues);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={6} align="stretch">
        <Tabs variant="enclosed">
          <TabList>
            <Tab>General Settings</Tab>
            <Tab>API Configuration</Tab>
            <Tab>Trading Pairs</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel p={4}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired isInvalid={!!formErrors.type}>
                  <FormLabel>Exchange Type</FormLabel>
                  <Select 
                    name="type"
                    value={formValues.type}
                    onChange={handleTypeChange}
                  >
                    <option value="CEX">Centralized Exchange (CEX)</option>
                    <option value="DEX">Decentralized Exchange (DEX)</option>
                  </Select>
                  <FormHelperText>
                    Select the type of exchange you want to connect to
                  </FormHelperText>
                </FormControl>
                
                {formValues.type === 'CEX' && (
                  <FormControl isRequired isInvalid={!!formErrors.name}>
                    <FormLabel>Exchange</FormLabel>
                    <Select
                      value={selectedCex}
                      onChange={handleCexChange}
                    >
                      {cexList.map(exchange => (
                        <option key={exchange.id} value={exchange.id}>
                          {exchange.name}
                        </option>
                      ))}
                    </Select>
                    <FormHelperText>
                      Select a centralized exchange or choose "Custom Exchange"
                    </FormHelperText>
                  </FormControl>
                )}
                
                {selectedCex === 'custom' && (
                  <FormControl isRequired isInvalid={!!formErrors.name}>
                    <FormLabel>Custom Exchange Name</FormLabel>
                    <Input
                      name="name"
                      value={formValues.name}
                      onChange={handleInputChange}
                      placeholder="Enter exchange name"
                    />
                    {formErrors.name && (
                      <FormErrorMessage>{formErrors.name}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
                
                {formValues.type === 'DEX' && (
                  <>
                    <FormControl isRequired isInvalid={!!formErrors.name}>
                      <FormLabel>DEX Name</FormLabel>
                      <Input
                        name="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        placeholder="Enter DEX name (e.g., Uniswap, PancakeSwap)"
                      />
                      {formErrors.name && (
                        <FormErrorMessage>{formErrors.name}</FormErrorMessage>
                      )}
                    </FormControl>
                    
                    <FormControl isRequired isInvalid={!!formErrors.chainId}>
                      <FormLabel>Blockchain</FormLabel>
                      <Select
                        name="chainId"
                        value={formValues.chainId || ''}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled>Select blockchain</option>
                        {dexChains.map(chain => (
                          <option key={chain.id} value={chain.id}>
                            {chain.name}
                          </option>
                        ))}
                      </Select>
                      {formErrors.chainId && (
                        <FormErrorMessage>{formErrors.chainId}</FormErrorMessage>
                      )}
                    </FormControl>
                  </>
                )}
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="enabled" mb="0">
                    Enabled
                  </FormLabel>
                  <Switch
                    id="enabled"
                    name="enabled"
                    isChecked={formValues.enabled}
                    onChange={handleSwitchChange}
                    colorScheme="green"
                  />
                </FormControl>
              </VStack>
            </TabPanel>
            
            <TabPanel p={4}>
              {formValues.type === 'CEX' && (
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired={!isEditing} isInvalid={!!formErrors.apiKey}>
                    <FormLabel>API Key</FormLabel>
                    <Input
                      name="apiKey"
                      value={formValues.apiKey || ''}
                      onChange={handleInputChange}
                      placeholder={isEditing ? "Leave unchanged or enter new API key" : "Enter API key"}
                      type="password"
                    />
                    {formErrors.apiKey && (
                      <FormErrorMessage>{formErrors.apiKey}</FormErrorMessage>
                    )}
                  </FormControl>
                  
                  <FormControl isRequired={!isEditing} isInvalid={!!formErrors.apiSecret}>
                    <FormLabel>API Secret</FormLabel>
                    <Input
                      name="apiSecret"
                      value={formValues.apiSecret || ''}
                      onChange={handleInputChange}
                      placeholder={isEditing ? "Leave unchanged or enter new API secret" : "Enter API secret"}
                      type="password"
                    />
                    {formErrors.apiSecret && (
                      <FormErrorMessage>{formErrors.apiSecret}</FormErrorMessage>
                    )}
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>
                      <HStack>
                        <Text>Passphrase</Text>
                        <Tooltip label="Some exchanges like KuCoin require a passphrase">
                          <span>
                            <Icon as={FiInfo} boxSize={4} color="blue.500" />
                          </span>
                        </Tooltip>
                      </HStack>
                    </FormLabel>
                    <Input
                      name="passphrase"
                      value={formValues.passphrase || ''}
                      onChange={handleInputChange}
                      placeholder="Enter passphrase (if required)"
                      type="password"
                    />
                    <FormHelperText>
                      Optional - Required for some exchanges like KuCoin
                    </FormHelperText>
                  </FormControl>
                  
                  <Box p={3} bg="orange.50" color="orange.800" borderRadius="md" mt={2}>
                    <HStack>
                      <Icon as={FiAlertTriangle} boxSize={5} />
                      <Text fontSize="sm">
                        {isEditing ? 
                          "API credentials will be updated only if you enter new values. Leave fields blank to keep existing credentials." :
                          "Ensure your API key has permission for reading balances and creating orders, but limit withdrawal access for security."
                        }
                      </Text>
                    </HStack>
                  </Box>
                </VStack>
              )}
              
              {formValues.type === 'DEX' && (
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired isInvalid={!!formErrors.rpcUrl}>
                    <FormLabel>RPC URL</FormLabel>
                    <Input
                      name="rpcUrl"
                      value={formValues.rpcUrl || ''}
                      onChange={handleInputChange}
                      placeholder="Enter RPC URL (e.g., https://eth-mainnet.alchemyapi.io/v2/YOUR_API_KEY)"
                    />
                    {formErrors.rpcUrl && (
                      <FormErrorMessage>{formErrors.rpcUrl}</FormErrorMessage>
                    )}
                    <FormHelperText>
                      For DEX interactions, a reliable RPC endpoint is required
                    </FormHelperText>
                  </FormControl>
                  
                  <Box p={3} bg="blue.50" color="blue.800" borderRadius="md" mt={2}>
                    <HStack>
                      <Icon as={FiInfo} boxSize={5} />
                      <Text fontSize="sm">
                        For DEX operations, wallet configuration is managed separately in the DEX Networks section.
                      </Text>
                    </HStack>
                  </Box>
                </VStack>
              )}
            </TabPanel>
            
            <TabPanel p={4}>
              <VStack spacing={4} align="stretch">
                <FormControl isInvalid={!!formErrors.tradingPairs}>
                  <FormLabel>Trading Pairs</FormLabel>
                  <Box 
                    border="1px" 
                    borderColor={useColorModeValue('gray.200', 'gray.700')} 
                    borderRadius="md"
                    p={2}
                    maxH="200px"
                    overflowY="auto"
                  >
                    {formValues.tradingPairs.length > 0 ? (
                      <VStack align="stretch" spacing={1}>
                        {formValues.tradingPairs.map(pair => (
                          <HStack key={pair} justify="space-between">
                            <Text fontSize="sm">{pair}</Text>
                            <Button 
                              size="xs" 
                              colorScheme="red" 
                              variant="ghost"
                              onClick={() => removeTradingPair(pair)}
                            >
                              Remove
                            </Button>
                          </HStack>
                        ))}
                      </VStack>
                    ) : (
                      <Text color="gray.500" textAlign="center">
                        No trading pairs selected
                      </Text>
                    )}
                  </Box>
                  {formErrors.tradingPairs && (
                    <FormErrorMessage>{formErrors.tradingPairs}</FormErrorMessage>
                  )}
                </FormControl>
                
                <HStack>
                  <Input
                    placeholder="Add custom pair (e.g. BTC/USDT)"
                    value={customTradingPair}
                    onChange={(e) => setCustomTradingPair(e.target.value)}
                  />
                  <Button onClick={addTradingPair}>Add</Button>
                </HStack>
                
                <Box p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                  <Heading size="xs" mb={2}>Common Trading Pairs</Heading>
                  <HStack wrap="wrap" spacing={2}>
                    {defaultTradingPairs.map(pair => (
                      <Button
                        key={pair}
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          if (!formValues.tradingPairs.includes(pair)) {
                            setFormValues(prev => ({
                              ...prev,
                              tradingPairs: [...prev.tradingPairs, pair]
                            }));
                          }
                        }}
                        isDisabled={formValues.tradingPairs.includes(pair)}
                      >
                        {pair}
                      </Button>
                    ))}
                  </HStack>
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        <Divider />
        
        <HStack justifyContent="flex-end" pt={4}>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button colorScheme="blue" type="submit">
            {isEditing ? 'Update Exchange' : 'Add Exchange'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ExchangeForm;