import React from 'react';
import { 
  Box, 
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const NotFound: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box 
      minH="80vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      bg={bgColor}
    >
      <Container maxW="container.md" py={10}>
        <VStack spacing={8} textAlign="center">
          <Icon as={FiAlertTriangle} w={20} h={20} color="orange.500" />
          
          <VStack spacing={3}>
            <Heading size="4xl">404</Heading>
            <Heading size="xl">Page Not Found</Heading>
            <Text fontSize="lg" color={textColor} maxW="md" mx="auto">
              The page you are looking for might have been removed, had its name changed,
              or is temporarily unavailable.
            </Text>
          </VStack>
          
          <HStack spacing={4} pt={4}>
            <Button
              as={RouterLink}
              to="/"
              colorScheme="blue"
              leftIcon={<FiHome />}
              size="lg"
            >
              Return Home
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default NotFound;