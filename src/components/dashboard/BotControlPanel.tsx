import React from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
  useColorModeValue,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import {
  FiPlay,
  FiPause,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiExternalLink,
} from 'react-icons/fi';

interface Exchange {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
}

interface BotControlPanelProps {
  isRunning?: boolean;
  status?: 'idle' | 'running' | 'error' | 'syncing';
  exchanges?: Exchange[];
  onStart?: () => void;
  onStop?: () => void;
  onRefresh?: () => void;
}

const BotControlPanel: React.FC<BotControlPanelProps> = ({
  isRunning = false,
  status = 'idle',
  exchanges = [],
  onStart,
  onStop,
  onRefresh,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const statusIcons = {
    idle: null,
    running: <FiRefreshCw className="animate-spin" />,
    error: <FiAlertCircle />,
    syncing: <FiRefreshCw className="animate-spin" />,
  };

  const statusColors = {
    idle: 'gray',
    running: 'green',
    error: 'red',
    syncing: 'blue',
  };

  const exchangeStatusColors = {
    connected: 'green',
    disconnected: 'gray',
    error: 'red',
  };

  return (
    <Card bg={bgColor} borderColor={borderColor} shadow="sm" borderRadius="lg">
      <CardHeader pb={0}>
        <Flex justifyContent="space-between" alignItems="center">
          <HStack>
            <Heading size="md">Crypto Arbitrage Bot</Heading>
            <Badge
              colorScheme={statusColors[status]}
              variant="subtle"
              px={2}
              py={1}
              borderRadius="md"
            >
              <Flex alignItems="center" gap={1}>
                {statusIcons[status] && (
                  <Box mr={1}>
                    <Icon as={
                      status === 'error' 
                        ? FiAlertCircle 
                        : FiRefreshCw
                    } boxSize={3} className={status !== 'idle' ? 'animate-spin' : ''} />
                  </Box>
                )}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Flex>
            </Badge>
          </HStack>
          <HStack>
            <Button
              size="sm"
              leftIcon={<FiRefreshCw />}
              onClick={onRefresh}
              variant="outline"
            >
              Refresh
            </Button>
            {isRunning ? (
              <Button
                size="sm"
                colorScheme="red"
                leftIcon={<FiPause />}
                onClick={onStop}
              >
                Stop Bot
              </Button>
            ) : (
              <Button
                size="sm"
                colorScheme="green"
                leftIcon={<FiPlay />}
                onClick={onStart}
              >
                Start Bot
              </Button>
            )}
          </HStack>
        </Flex>
      </CardHeader>

      <CardBody>
        <Flex direction="column" gap={4}>
          <Box
            borderRadius="md"
            bg={useColorModeValue('gray.50', 'gray.700')}
            p={4}
          >
            <Heading size="sm" mb={3}>
              Active Exchanges
            </Heading>
            <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={3}>
              {exchanges.map((exchange) => (
                <GridItem key={exchange.name}>
                  <Flex
                    borderRadius="md"
                    bg={bgColor}
                    borderWidth="1px"
                    borderColor={borderColor}
                    p={3}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <HStack>
                      <Box
                        w={2}
                        h={2}
                        borderRadius="full"
                        bg={
                          exchange.status === 'connected'
                            ? 'green.500'
                            : exchange.status === 'error'
                            ? 'red.500'
                            : 'gray.400'
                        }
                      />
                      <Text fontWeight="medium">{exchange.name}</Text>
                    </HStack>
                    <HStack>
                      <Badge
                        colorScheme={exchangeStatusColors[exchange.status]}
                        variant="subtle"
                        fontSize="xs"
                      >
                        <Flex alignItems="center">
                          {exchange.status === 'connected' && (
                            <Icon as={FiCheckCircle} boxSize={3} mr={1} />
                          )}
                          {exchange.status === 'error' && (
                            <Icon as={FiAlertCircle} boxSize={3} mr={1} />
                          )}
                          {exchange.status.charAt(0).toUpperCase() + exchange.status.slice(1)}
                        </Flex>
                      </Badge>
                      <Tooltip label="View Exchange Details">
                        <Button size="xs" variant="ghost" p={1}>
                          <Icon as={FiExternalLink} boxSize={3} />
                        </Button>
                      </Tooltip>
                    </HStack>
                  </Flex>
                </GridItem>
              ))}
            </Grid>
          </Box>

          <Box
            borderRadius="md"
            bg={useColorModeValue('gray.50', 'gray.700')}
            p={4}
          >
            <Heading size="sm" mb={3}>
              Bot Statistics
            </Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={4} sm={{ templateColumns: "repeat(4, 1fr)" }}>
              <GridItem>
                <Card>
                  <CardBody>
                    <Stat>
                      <StatLabel color="gray.500">Opportunities</StatLabel>
                      <StatNumber>24</StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <Card>
                  <CardBody>
                    <Stat>
                      <StatLabel color="gray.500">Executed</StatLabel>
                      <StatNumber>18</StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <Card>
                  <CardBody>
                    <Stat>
                      <StatLabel color="gray.500">Success Rate</StatLabel>
                      <StatNumber>75%</StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <Card>
                  <CardBody>
                    <Stat>
                      <StatLabel color="gray.500">Profit</StatLabel>
                      <StatNumber color="green.500">+$142.58</StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default BotControlPanel;