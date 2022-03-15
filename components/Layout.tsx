import { Container } from '@chakra-ui/react'
import React from 'react'
import Topbar from './Topbar'

type Props = {
    children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Topbar />
      <Container
        p='4'
        maxW='1200px'
      >
        {children}
      </Container>
    </>
  )
}
