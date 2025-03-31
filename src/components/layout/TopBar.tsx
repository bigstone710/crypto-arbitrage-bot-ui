import React from 'react';
import {
  Box,
  Flex,
  IconButton,
  HStack,
  Text,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useColorMode,
  useColorModeValue,
  Tooltip,
  Spacer
} from '@chakra-ui/react';
import { 
  FiMoon, 
  FiSun, 
  FiBell, 
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';

const TopBar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const profitColor = useColorModeValue('green.500', 'green.300');
  const lossColor = useColorModeValue('red.500', 'red.300');
  
  // Mock data for demonstration
  const botStatus = 'running'; // 'idle', 'running', 'error'
  const profitToday = 1.24; // percentage
  const notifications = 3;

  // Status badge color
  const statusColors = {
    running: 'green',
    idle: 'yellow',
    error: 'red'
  };
  
  return (
    <Box
      as="header"
      h="16"
      px={4}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex h="100%" alignItems="center" justifyContent="space-between">
        {/* Left section with page title */}
        <Text fontSize="lg" fontWeight="semibold">
          Crypto Arbitrage Bot
        </Text>
        
        {/* Center section with bot status */}
        <HStack spacing={4}>
          <Flex alignItems="center">
            <Text fontSize="sm" mr={2}>Bot Status:</Text>
            <Badge colorScheme={statusColors[botStatus as keyof typeof statusColors]} px={2} py={1} borderRadius="md">
              {botStatus.toUpperCase()}
            </Badge>
          </Flex>
          
          <Flex alignItems="center">
            <Text fontSize="sm" mr={2}>Today:</Text>
            <Badge 
              colorScheme={profitToday >= 0 ? 'green' : 'red'}
              px={2} 
              py={1} 
              borderRadius="md"
              display="flex"
              alignItems="center"
            >
              {profitToday >= 0 ? (
                <FiArrowUp color={profitColor} style={{ marginRight: '2px' }} />
              ) : (
                <FiArrowDown color={lossColor} style={{ marginRight: '2px' }} />
              )}
              {Math.abs(profitToday).toFixed(2)}%
            </Badge>
          </Flex>
        </HStack>
        
        {/* Right section with actions */}
        <HStack spacing={2}>
          {/* Toggle color mode */}
          <Tooltip label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
              variant="ghost"
              onClick={toggleColorMode}
            />
          </Tooltip>
          
          {/* Notifications */}
          <Menu>
            <Tooltip label="Notifications">
              <Box position="relative">
                <MenuButton
                  as={IconButton}
                  aria-label="Notifications"
                  icon={<FiBell />}
                  variant="ghost"
                />
                {notifications > 0 && (
                  <Badge
                    colorScheme="red"
                    borderRadius="full"
                    position="absolute"
                    top="-5px"
                    right="-5px"
                    fontSize="xs"
                    minW="18px"
                    textAlign="center"
                  >
                    {notifications}
                  </Badge>
                )}
              </Box>
            </Tooltip>
            <MenuList>
              <MenuItem>New arbitrage opportunity detected</MenuItem>
              <MenuItem>API key for Binance expires soon</MenuItem>
              <MenuItem>System update available</MenuItem>
            </MenuList>
          </Menu>
          
          {/* User menu */}
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<FiUser />}
              variant="ghost"
              size="sm"
            >
              Admin
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiSettings />}>Profile Settings</MenuItem>
              <MenuItem icon={<FiHelpCircle />}>Help</MenuItem>
              <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default TopBar;