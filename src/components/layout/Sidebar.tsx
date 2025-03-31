import React, { useState } from 'react';
import { 
  Box, 
  Flex, 
  VStack, 
  Icon, 
  Text, 
  Tooltip, 
  IconButton, 
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiDollarSign, 
  FiDatabase, 
  FiKey, 
  FiSettings, 
  FiPieChart,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

// Navigation items
const MENU_ITEMS = [
  {
    label: 'Dashboard',
    icon: FiHome,
    to: '/'
  },
  {
    label: 'Exchanges',
    icon: FiDollarSign,
    to: '/exchanges'
  },
  {
    label: 'DEX Networks',
    icon: FiDatabase,
    to: '/dex-networks'
  },
  {
    label: 'API Management',
    icon: FiKey,
    to: '/api-management'
  },
  {
    label: 'Analytics',
    icon: FiPieChart,
    to: '/analytics'
  },
  {
    label: 'Settings',
    icon: FiSettings,
    to: '/settings'
  }
];

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  
  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeColor = useColorModeValue('gray.100', 'gray.700');
  const hoverColor = useColorModeValue('gray.50', 'gray.700');
  
  return (
    <Box
      width={isExpanded ? '240px' : '70px'}
      h="100%"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      transition="width 0.2s ease"
      boxShadow="sm"
      position="relative"
    >
      {/* Logo & Header */}
      <Flex 
        h="16" 
        alignItems="center" 
        justifyContent={isExpanded ? "space-between" : "center"}
        px={isExpanded ? 4 : 0}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Flex alignItems="center">
          <Box 
            w="40px" 
            h="40px" 
            bg="brand.500" 
            borderRadius="md" 
            color="white" 
            fontSize="lg" 
            fontWeight="bold" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
          >
            CA
          </Box>
          {isExpanded && (
            <Text ml={3} fontWeight="semibold" fontSize="md">
              Crypto Arbitrage
            </Text>
          )}
        </Flex>
        {isExpanded && (
          <IconButton
            aria-label="Collapse sidebar"
            icon={<FiChevronLeft />}
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </Flex>

      {/* Navigation Items */}
      <VStack 
        spacing={1} 
        align="stretch" 
        py={4} 
        px={isExpanded ? 3 : 2}
        flex="1"
        overflowY="auto"
      >
        {MENU_ITEMS.map((item) => {
          const isActive = location.pathname === item.to;
          
          return isExpanded ? (
            <Box
              key={item.label}
              as={NavLink}
              to={item.to}
              p={2}
              borderRadius="md"
              bg={isActive ? activeColor : 'transparent'}
              _hover={{ bg: hoverColor }}
              transition="all 0.2s"
              display="flex"
              alignItems="center"
            >
              <Icon as={item.icon} boxSize={5} mr={3} />
              <Text fontSize="sm" fontWeight={isActive ? "semibold" : "normal"}>
                {item.label}
              </Text>
            </Box>
          ) : (
            <Tooltip key={item.label} label={item.label} placement="right" hasArrow>
              <Box
                as={NavLink}
                to={item.to}
                p={2}
                borderRadius="md"
                bg={isActive ? activeColor : 'transparent'}
                _hover={{ bg: hoverColor }}
                transition="all 0.2s"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="100%"
              >
                <Icon as={item.icon} boxSize={5} />
              </Box>
            </Tooltip>
          );
        })}
      </VStack>

      {/* Expand/Collapse Control */}
      <Box 
        p={3} 
        borderTop="1px" 
        borderColor={borderColor} 
        display="flex"
        justifyContent="center"
      >
        {!isExpanded && (
          <IconButton
            aria-label="Expand sidebar"
            icon={<FiChevronRight />}
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(true)}
          />
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;