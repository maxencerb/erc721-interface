import { GetServerSideProps } from 'next'
import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Box, Button, Heading, Input, Skeleton, useToast, VStack, Text } from '@chakra-ui/react'
import { useCalls, useContractFunction } from '@usedapp/core'
import { contractInfos, getContract } from '@/services/contracts'
import { Data } from '../api/meebits/[token]'

type Props = {
  maxMeebit: number
}

export default function FakeMeebits({ maxMeebit }: Props) {
  
  const toast = useToast()

  const contract = getContract(contractInfos.fakeMeebitsClaimer)

  const { state, send } = useContractFunction(contract, 'claimAToken', {transactionName: 'Claim a token'})

  const [loadMint, setLoadMint] = useState(false)

  const [tokenToClaim, setTokenToClaim] = useState<number>(0)

  const [token, setToken] = useState<number>(0)

  const [signature, setSignature] = useState({
    loading: true,
    value: '',
  })

  const results = useCalls([
    {
    contract,
    method: 'tokensThatWereClaimed',
    args: [token]
    },
  ])

  const fetchSignature = async (): Promise<void> => {
    setSignature(val => ({
      ...val,
      loading: true,
    }))

    if (tokenToClaim > maxMeebit || tokenToClaim < 0 || tokenToClaim === undefined) {
      return
    }

    try {

      const currentToken = token;
      const { data } = await axios.get<Data>(`/api/meebits/${token}`)
      if (currentToken !== token) {
        return
      }

      if (data.isError) {
        toast({
          title: 'Error',
          description: data.error,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'bottom-right'
        })
        return
      }

      setSignature({
        loading: false,
        value: data.signature,
      })
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to fetch signature',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
      })
    }
    
  }

  useEffect(() => {
    fetchSignature()
  }, [token])

  useEffect(() => {
    const currentToken = tokenToClaim;
    const timeout = setTimeout(() => {
      if (currentToken === tokenToClaim)
        setToken(tokenToClaim)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [tokenToClaim])
  
  const handleSubmit = async () => {
    try {
      setLoadMint(true)
      const currentToken = tokenToClaim
      const { data } = await axios.get<Data>(`/api/meebits/${currentToken}`)
      if (data.isError) {
        throw Error('Failed to fetch signature')
      }

      await send(
        currentToken,
        data.signature
      )
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to fetch signature',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
      })
    } finally {
      setLoadMint(false)
    }
  }

  const shortSignature = useMemo(() => {
    const infoLength = 10;
    // If loading return text of size infoLength * 2 + 3
    if (signature.loading) return '_'.repeat(infoLength * 2 + 3)
    const sigLength = signature.value.length
    return `${signature.value.slice(0, infoLength)}...${signature.value.slice(sigLength - infoLength)}`
  }, [signature])

  useEffect(() => {
    if(!loadMint) {
      if (state.status === 'Success') toast({
        title: 'Success',
        description: 'Minted a token',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      if (state.status === 'Fail' || state.status === 'Exception') toast({
        title: 'Error',
        description: 'Failed to mint a token',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }, [loadMint, state.status])
  
  
  return (
    <VStack spacing={4}>
      <Heading>Fake Meebits Claimer</Heading>
      <Skeleton 
        isLoaded={!signature.loading}
        rounded='md'
      >
        <Box
          p={4}
          bg='gray.700'
          rounded='md'
        >
          <Heading size='sm'>Signature for token {token} : {shortSignature}</Heading>
        </Box>
      </Skeleton>

      <VStack
        p={4}
        spacing={4}
        bg='gray.700'
        rounded='md'
        as='form'
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <Heading size='sm'>Choose Meebit</Heading>
        <Input
          type='number'
          value={tokenToClaim}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setTokenToClaim(parseInt(e.target.value))
          }}
          min={0}
          max={maxMeebit}
          isInvalid={!results[0]?.value || results[0]?.value?.[0]}
          errorBorderColor='crimson'
        />
        <Text
          color={results[0]?.value?.[0] ? 'red.500' : 'inherit'}
        >
          Token #{token} is 
          <Skeleton
            isLoaded={!!results[0]?.value}
            textAlign='center'
            as='span'
          >
            {results[0]?.value?.[0] ? ' unavailable' : ' available'}
          </Skeleton>
        </Text>
        <Button
          width='100%'
          type='submit'
          isLoading={loadMint}
          isDisabled={!results[0]?.value || results[0]?.value?.[0]}
        >
          Claim Meebit #{tokenToClaim}          
        </Button>
      </VStack>
    </VStack>
  )
}

const apiEndpoint = 'https://raw.githubusercontent.com/l-henri/erc721-ux/main/claimerV1-tools/output-sig.json'

type SignatureData = {
  tokenNumber: number,
  signature: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const data: SignatureData[] = await axios.get<SignatureData[]>(apiEndpoint).then(r => r.data)
  const max = data.reduce((max, d) => Math.max(max, d.tokenNumber), 0) 

  return {
    props: {
      maxMeebit: max
    }
  }

}
