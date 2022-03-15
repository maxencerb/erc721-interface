import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, Center, Container } from '@chakra-ui/react'
import { Rinkeby, useEthers } from '@usedapp/core'
import React from 'react'
import Topbar from './Topbar'

type Props = {
    children: React.ReactNode
}

declare global {
  interface Window {
      ethereum: any;
  }
}

function DefaultChildren() {

  const switchNetwork = async () => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x04' }],
    });
  }

  return (
    <Center>
      <Alert
        status='error'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height='300px'
      >
        <AlertIcon boxSize='40px' mr={0} />
        <AlertTitle mt={4} mb={1} fontSize='lg'>
          Connect to rinkeby on metamask
        </AlertTitle>
        <AlertDescription maxWidth='md'>
          First connect to metamask then choose the rinkeby network !
        </AlertDescription>
        <Button m={4} p={2} onClick={switchNetwork}>
          Connect to rinkeby
        </Button>
      </Alert>
    </Center>
  )
}

export default function Layout({ children }: Props) {

  const { account, chainId } = useEthers();

  return (
    <>
      <Topbar />
      <Container
        p='4'
        maxW='1200px'
      >
        {account && chainId === Rinkeby.chainId ? children : <DefaultChildren />}
      </Container>
    </>
  )
}
