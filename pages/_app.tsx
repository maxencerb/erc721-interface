import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { DAppProvider } from '@usedapp/core'
import { useDappConfig } from '@/constants/config'
import Layout from '@/components/Layout'
import { QueryClientProvider, QueryClient } from 'react-query'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return <ChakraProvider>
    <DAppProvider config={useDappConfig}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </DAppProvider>
  </ChakraProvider>
}

export default MyApp
