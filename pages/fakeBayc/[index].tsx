import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { contractInfos, getContract } from '@/services/contracts'
import { encodeCallData, useCall } from '@usedapp/core'
import { Box, Center, Skeleton, useToast, Stat, StatLabel, StatNumber, Table, TableCaption, Thead, Tr, Th, Tbody, Td, VStack, position, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'
import Image from 'next/image'
import axios from 'axios'
import { fromPinataToIPFSUri, toIPFSImage } from '@/services/ipfs'

type BaycAttributes = {
  image: string,
  attributes: {
    trait_type: string,
    value: string
  }[]
}

type Attribute = {
  trait_type: string,
  value: string
}

function AttributeBox({ attribute }: { attribute: Attribute }) {
  return (
    <Box
      p={2}
      rounded='md'
      overflow='hidden'
      height='50px'
      width='100px'
      bg='gray.700'
    >
      <Stat>
        <StatLabel>{attribute.trait_type}</StatLabel>
        <StatNumber>{attribute.value}</StatNumber>
      </Stat>
    </Box>
  )
}

export default function TokenIndex() {

  const router = useRouter()

  const { index } = router.query

  const contract = getContract(contractInfos.fakeBayc)

  const toast = useToast()

  const [isError, setIsError] = useState(false)
  
  const { value, error } = useCall({
    contract,
    method: 'tokenURI',
    args: [parseInt(index as string)],
  }) || {}

  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(true);
  const [data, setData] = useState<BaycAttributes>()

  useEffect(() => {
    if (value) {
      const uri = fromPinataToIPFSUri(value[0])
      console.log(uri)
      axios.get(uri).then(res => {
        setData(res.data)
      })
      setLoading(false)
    } else if (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }, [value, error])

  let test;

  try {
    test = encodeCallData({
      contract,
      method: 'tokenURI',
      args: [parseInt(index as string)],
    })
  } catch (e) {
    console.log(e)
    !isError && setIsError(true)
  }

  if (isError) {
    return (
      <Alert
        status='error'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height='200px'
      >
        <AlertIcon boxSize='40px' mr={0} />
        <AlertTitle mt={4} mb={1} fontSize='lg'>
          Error while retrieving token!
        </AlertTitle>
        <AlertDescription maxWidth='sm'>
          The token you are trying to retrieve may not exist
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <VStack>
      <Center>
        <Skeleton
          isLoaded={!imageLoading}
          rounded='md'
          overflow='hidden'
          height='200px'
          width='200px'
          bg='gray.700'
          position='relative'
        >
          {data &&
            <Image
              src={toIPFSImage(data.image)}
              layout='fill'
              objectFit='cover'
              alt='Bored ape'
              onLoadingComplete={() => setImageLoading(false)}
            />
          }
        </Skeleton>
      </Center>
      <Table variant='simple'>
        <TableCaption>Attributes {JSON.stringify(test)}</TableCaption>
        <Thead>
          <Tr>
            <Th>Trait type</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading &&
          <>
            <Tr>
              <Td>
                <Skeleton
                  isLoaded={false}
                  rounded='md'
                  height='100%'
                  width='100%'
                >
                  Loading text
                </Skeleton>
              </Td>
              <Td>
                <Skeleton
                  isLoaded={false}
                  rounded='md'
                  height='100%'
                  width='100%'
                >
                  Loading text
                </Skeleton>
              </Td>
            </Tr>
             <Tr>
             <Td>
               <Skeleton
                 isLoaded={false}
                 rounded='md'
                 height='100%'
                 width='100%'
               >
                 Loading text
               </Skeleton>
             </Td>
             <Td>
               <Skeleton
                 isLoaded={false}
                 rounded='md'
                 height='100%'
                 width='100%'
               >
                 Loading text
               </Skeleton>
             </Td>
           </Tr>
           </>
          }
          {data && data.attributes.map(attribute => (
            <Tr key={attribute.trait_type}>
              <Td>{attribute.trait_type}</Td>
              <Td>{attribute.value}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  )
}
