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
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Switch,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  InputGroup,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  Select,
  Textarea,
  useToast,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Badge
} from '@chakra-ui/react';
import { FiSave, FiInfo, FiAlertTriangle } from 'react-icons/fi';

interface StrategySettings {
  minProfitPercentage: number;
  maxOrderSize: number;
  minOrderSize: number;
  maxSlippage: number;
  maxDailyTrades: number;
  useFlashLoans: boolean;
  maxFlashLoanAmount: number;
  gasPrice: number;
  gasMultiplier: number;
}

interface NotificationSettings {
  telegramEnabled: boolean;
  telegramBotToken: string;
  telegramChatId: string;
  notifyOnTrade: boolean;
  notifyOnError: boolean;
  notifyOnProfit: boolean;
  profitThreshold: number;
}

interface UISettings {
  theme: 'light' | 'dark' | 'system';
  refreshInterval: number;
  showTestnetChains: boolean;
  confirmTrades: boolean;
}

interface LogSettings {
  logLevel: 'debug' | 'info' | 'warning' | 'error';
  logToFile: boolean;
  logFilePath: string;
  maxLogSize: number;
  logRetentionDays: number;
}

const Settings: React.FC = () => {
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Initial settings state
  const [strategySettings, setStrategySettings] = useState<StrategySettings>({
    minProfitPercentage: 0.5,
    maxOrderSize: 1000,
    minOrderSize: 50,
    maxSlippage: 0.5,
    maxDailyTrades: 10,
    useFlashLoans: true,
    maxFlashLoanAmount: 5000,
    gasPrice: 30,
    gasMultiplier: 1.1
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    telegramEnabled: false,
    telegramBotToken: '',
    telegramChatId: '',
    notifyOnTrade: true,
    notifyOnError: true,
    notifyOnProfit: true,
    profitThreshold: 10
  });

  const [uiSettings, setUiSettings] = useState<UISettings>({
    theme: 'system',
    refreshInterval: 30,
    showTestnetChains: false,
    confirmTrades: true
  });

  const [logSettings, setLogSettings] = useState<LogSettings>({
    logLevel: 'info',
    logToFile: true,
    logFilePath: '/var/log/crypto-arbitrage-bot',
    maxLogSize: 10,
    logRetentionDays: 7
  });

  // Handlers for updating settings
  const handleStrategyChange = (field: keyof StrategySettings, value: any) => {
    setStrategySettings({
      ...strategySettings,
      [field]: value
    });
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: any) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: value
    });
  };

  const handleUiChange = (field: keyof UISettings, value: any) => {
    setUiSettings({
      ...uiSettings,
      [field]: value
    });
  };

  const handleLogChange = (field: keyof LogSettings, value: any) => {
    setLogSettings({
      ...logSettings,
      [field]: value
    });
  };

  // Save settings
  const saveSettings = (type: string) => {
    toast({
      title: 'Settings Saved',
      description: `${type} settings have been updated successfully.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box pt={5} pb={10}>
      <VStack spacing={6} align="stretch">
        <HStack justifyContent="space-between">
          <Heading size="lg">Settings</Heading>
        </HStack>

        <Tabs variant="enclosed">
          <TabList>
            <Tab>Strategy</Tab>
            <Tab>Notifications</Tab>
            <Tab>User Interface</Tab>
            <Tab>Logging</Tab>
          </TabList>

          <TabPanels>
            {/* Strategy Settings Tab */}
            <TabPanel p={4}>
              <Card variant="outline" mb={4}>
                <CardHeader>
                  <Heading size="md">Trading Strategy Settings</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <HStack spacing={8}>
                      <FormControl>
                        <FormLabel>Minimum Profit Percentage</FormLabel>
                        <InputGroup>
                          <NumberInput
                            value={strategySettings.minProfitPercentage}
                            onChange={(valueString) => handleStrategyChange('minProfitPercentage', parseFloat(valueString))}
                            min={0.1}
                            max={10}
                            step={0.1}
                            precision={2}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <InputRightAddon>%</InputRightAddon>
                        </InputGroup>
                        <FormHelperText>
                          Minimum profit required to execute a trade
                        </FormHelperText>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Maximum Slippage</FormLabel>
                        <InputGroup>
                          <NumberInput
                            value={strategySettings.maxSlippage}
                            onChange={(valueString) => handleStrategyChange('maxSlippage', parseFloat(valueString))}
                            min={0.1}
                            max={3}
                            step={0.1}
                            precision={2}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <InputRightAddon>%</InputRightAddon>
                        </InputGroup>
                        <FormHelperText>
                          Maximum acceptable slippage for trades
                        </FormHelperText>
                      </FormControl>
                    </HStack>

                    <HStack spacing={8}>
                      <FormControl>
                        <FormLabel>Minimum Order Size</FormLabel>
                        <InputGroup>
                          <NumberInput
                            value={strategySettings.minOrderSize}
                            onChange={(valueString) => handleStrategyChange('minOrderSize', parseFloat(valueString))}
                            min={10}
                            max={1000}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <InputRightAddon>USD</InputRightAddon>
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Maximum Order Size</FormLabel>
                        <InputGroup>
                          <NumberInput
                            value={strategySettings.maxOrderSize}
                            onChange={(valueString) => handleStrategyChange('maxOrderSize', parseFloat(valueString))}
                            min={100}
                            max={10000}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <InputRightAddon>USD</InputRightAddon>
                        </InputGroup>
                      </FormControl>
                    </HStack>

                    <FormControl>
                      <FormLabel>Maximum Daily Trades</FormLabel>
                      <NumberInput
                        value={strategySettings.maxDailyTrades}
                        onChange={(valueString) => handleStrategyChange('maxDailyTrades', parseInt(valueString))}
                        min={1}
                        max={100}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormHelperText>
                        Limit the number of trades per day (0 for unlimited)
                      </FormHelperText>
                    </FormControl>

                    <Divider />

                    <Heading size="sm">Flash Loan Settings</Heading>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="use-flash-loans" mb="0">
                        Enable Flash Loans
                      </FormLabel>
                      <Switch
                        id="use-flash-loans"
                        isChecked={strategySettings.useFlashLoans}
                        onChange={(e) => handleStrategyChange('useFlashLoans', e.target.checked)}
                      />
                    </FormControl>

                    <FormControl isDisabled={!strategySettings.useFlashLoans}>
                      <FormLabel>Maximum Flash Loan Amount</FormLabel>
                      <InputGroup>
                        <NumberInput
                          value={strategySettings.maxFlashLoanAmount}
                          onChange={(valueString) => handleStrategyChange('maxFlashLoanAmount', parseFloat(valueString))}
                          min={1000}
                          max={50000}
                          step={500}
                          isDisabled={!strategySettings.useFlashLoans}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <InputRightAddon>USD</InputRightAddon>
                      </InputGroup>
                    </FormControl>

                    <Divider />

                    <Heading size="sm">Gas Settings</Heading>

                    <HStack spacing={8}>
                      <FormControl>
                        <FormLabel>Default Gas Price (Gwei)</FormLabel>
                        <NumberInput
                          value={strategySettings.gasPrice}
                          onChange={(valueString) => handleStrategyChange('gasPrice', parseFloat(valueString))}
                          min={1}
                          max={200}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <FormHelperText>
                          Base gas price for EVM chains
                        </FormHelperText>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Gas Price Multiplier</FormLabel>
                        <NumberInput
                          value={strategySettings.gasMultiplier}
                          onChange={(valueString) => handleStrategyChange('gasMultiplier', parseFloat(valueString))}
                          min={1}
                          max={3}
                          step={0.1}
                          precision={2}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <FormHelperText>
                          Multiplier relative to network-recommended gas price
                        </FormHelperText>
                      </FormControl>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              <Button
                leftIcon={<FiSave />}
                colorScheme="blue"
                onClick={() => saveSettings('Strategy')}
              >
                Save Strategy Settings
              </Button>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel p={4}>
              <Card variant="outline" mb={4}>
                <CardHeader>
                  <Heading size="md">Notification Settings</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Heading size="sm">Telegram Notifications</Heading>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="telegram-enabled" mb="0">
                        Enable Telegram Notifications
                      </FormLabel>
                      <Switch
                        id="telegram-enabled"
                        isChecked={notificationSettings.telegramEnabled}
                        onChange={(e) => handleNotificationChange('telegramEnabled', e.target.checked)}
                      />
                    </FormControl>

                    <FormControl isDisabled={!notificationSettings.telegramEnabled}>
                      <FormLabel>Telegram Bot Token</FormLabel>
                      <Input
                        type="password"
                        value={notificationSettings.telegramBotToken}
                        onChange={(e) => handleNotificationChange('telegramBotToken', e.target.value)}
                      />
                      <FormHelperText>
                        Token for your Telegram bot (@BotFather)
                      </FormHelperText>
                    </FormControl>

                    <FormControl isDisabled={!notificationSettings.telegramEnabled}>
                      <FormLabel>Telegram Chat ID</FormLabel>
                      <Input
                        value={notificationSettings.telegramChatId}
                        onChange={(e) => handleNotificationChange('telegramChatId', e.target.value)}
                      />
                      <FormHelperText>
                        Chat ID to send notifications to
                      </FormHelperText>
                    </FormControl>

                    <Divider />

                    <Heading size="sm">Notification Triggers</Heading>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="notify-trade" mb="0">
                        Notify on Trade Execution
                      </FormLabel>
                      <Switch
                        id="notify-trade"
                        isChecked={notificationSettings.notifyOnTrade}
                        onChange={(e) => handleNotificationChange('notifyOnTrade', e.target.checked)}
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="notify-error" mb="0">
                        Notify on Error
                      </FormLabel>
                      <Switch
                        id="notify-error"
                        isChecked={notificationSettings.notifyOnError}
                        onChange={(e) => handleNotificationChange('notifyOnError', e.target.checked)}
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="notify-profit" mb="0">
                        Notify on Significant Profit
                      </FormLabel>
                      <Switch
                        id="notify-profit"
                        isChecked={notificationSettings.notifyOnProfit}
                        onChange={(e) => handleNotificationChange('notifyOnProfit', e.target.checked)}
                      />
                    </FormControl>

                    <FormControl isDisabled={!notificationSettings.notifyOnProfit}>
                      <FormLabel>Profit Notification Threshold</FormLabel>
                      <InputGroup>
                        <NumberInput
                          value={notificationSettings.profitThreshold}
                          onChange={(valueString) => handleNotificationChange('profitThreshold', parseFloat(valueString))}
                          min={1}
                          max={100}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <InputRightAddon>USD</InputRightAddon>
                      </InputGroup>
                      <FormHelperText>
                        Minimum profit amount to trigger notification
                      </FormHelperText>
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              <Button
                leftIcon={<FiSave />}
                colorScheme="blue"
                onClick={() => saveSettings('Notification')}
              >
                Save Notification Settings
              </Button>
            </TabPanel>

            {/* UI Settings Tab */}
            <TabPanel p={4}>
              <Card variant="outline" mb={4}>
                <CardHeader>
                  <Heading size="md">User Interface Settings</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel>Theme</FormLabel>
                      <Select
                        value={uiSettings.theme}
                        onChange={(e) => handleUiChange('theme', e.target.value)}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Data Refresh Interval</FormLabel>
                      <HStack spacing={4}>
                        <Slider
                          flex="1"
                          min={5}
                          max={60}
                          step={5}
                          value={uiSettings.refreshInterval}
                          onChange={(val) => handleUiChange('refreshInterval', val)}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                        <InputGroup size="sm" width="100px">
                          <NumberInput
                            value={uiSettings.refreshInterval}
                            onChange={(valueString) => handleUiChange('refreshInterval', parseInt(valueString))}
                            min={5}
                            max={60}
                            step={5}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <InputRightAddon>sec</InputRightAddon>
                        </InputGroup>
                      </HStack>
                      <FormHelperText>
                        How often to refresh dashboard data
                      </FormHelperText>
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="show-testnets" mb="0">
                        Show Testnet Networks
                      </FormLabel>
                      <Switch
                        id="show-testnets"
                        isChecked={uiSettings.showTestnetChains}
                        onChange={(e) => handleUiChange('showTestnetChains', e.target.checked)}
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="confirm-trades" mb="0">
                        Confirm Trades Before Execution
                      </FormLabel>
                      <Switch
                        id="confirm-trades"
                        isChecked={uiSettings.confirmTrades}
                        onChange={(e) => handleUiChange('confirmTrades', e.target.checked)}
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              <Button
                leftIcon={<FiSave />}
                colorScheme="blue"
                onClick={() => saveSettings('UI')}
              >
                Save UI Settings
              </Button>
            </TabPanel>

            {/* Logging Tab */}
            <TabPanel p={4}>
              <Card variant="outline" mb={4}>
                <CardHeader>
                  <Heading size="md">Logging Settings</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel>Log Level</FormLabel>
                      <Select
                        value={logSettings.logLevel}
                        onChange={(e) => handleLogChange('logLevel', e.target.value)}
                      >
                        <option value="debug">Debug (Most Verbose)</option>
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error (Least Verbose)</option>
                      </Select>
                      <FormHelperText>
                        Controls the detail level of logs
                      </FormHelperText>
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="log-to-file" mb="0">
                        Save Logs to File
                      </FormLabel>
                      <Switch
                        id="log-to-file"
                        isChecked={logSettings.logToFile}
                        onChange={(e) => handleLogChange('logToFile', e.target.checked)}
                      />
                    </FormControl>

                    <FormControl isDisabled={!logSettings.logToFile}>
                      <FormLabel>Log File Path</FormLabel>
                      <Input
                        value={logSettings.logFilePath}
                        onChange={(e) => handleLogChange('logFilePath', e.target.value)}
                      />
                    </FormControl>

                    <HStack spacing={8}>
                      <FormControl isDisabled={!logSettings.logToFile}>
                        <FormLabel>Maximum Log File Size</FormLabel>
                        <InputGroup>
                          <NumberInput
                            value={logSettings.maxLogSize}
                            onChange={(valueString) => handleLogChange('maxLogSize', parseInt(valueString))}
                            min={1}
                            max={100}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <InputRightAddon>MB</InputRightAddon>
                        </InputGroup>
                      </FormControl>

                      <FormControl isDisabled={!logSettings.logToFile}>
                        <FormLabel>Log Retention Period</FormLabel>
                        <InputGroup>
                          <NumberInput
                            value={logSettings.logRetentionDays}
                            onChange={(valueString) => handleLogChange('logRetentionDays', parseInt(valueString))}
                            min={1}
                            max={90}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <InputRightAddon>days</InputRightAddon>
                        </InputGroup>
                      </FormControl>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              <Button
                leftIcon={<FiSave />}
                colorScheme="blue"
                onClick={() => saveSettings('Logging')}
              >
                Save Logging Settings
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default Settings;