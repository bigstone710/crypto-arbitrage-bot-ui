import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';
import theme from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
);