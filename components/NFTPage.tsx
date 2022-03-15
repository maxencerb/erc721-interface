import { Button, Heading, Stat, StatGroup, StatHelpText, StatLabel, StatNumber, VStack, useToast, Text, Box, Input, Flex, Spacer } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { TransactionStatus, useCalls, useEthers } from '@usedapp/core'
import { Contract } from '@ethersproject/contracts'
import { useRouter } from 'next/router'
import { formatEther } from '@ethersproject/units'
import { contractInfos } from '@/services/contracts'
import { BigNumber } from 'ethers'

type Props = {
    contract: Contract,
    state: TransactionStatus,
    send: (...args: any[]) => Promise<void>,
    tokenOptions: {
        unit: string,
        searchTitle: string,
        searchPlaceholder?: string,
        searchSubmitText: string,
        tokenPrice?: BigNumber,
    }
}

export default function NFTPage({ contract, state, send, tokenOptions }: Props) {

    const [tokenIndex, setTokenIndex] = useState<any>()

    const router = useRouter()

    const toast = useToast()

    const { account } = useEthers()

    const results = useCalls([
        {
        contract,
        method: 'name',
        args: []
        },
        {
        contract,
        method: 'totalSupply',
        args: []
        },
        {
        contract,
        method: 'balanceOf',
        args: [account]
        }
    ]) || []

    

    const handleClaim = async () => {
        if (tokenOptions.tokenPrice) {
            send({value: tokenOptions.tokenPrice.add(1)})
        } else {
            send()
        }
    }

    useEffect(() => {
        if (state.status === 'Success') {
        toast({
            title: 'Claimed successfully',
            variant: 'success',
            duration: 4000,
            isClosable: true
        })
        } else if (state.status === 'Fail') {
        toast({
            title: 'Claim failed',
            variant: 'error',
            duration: 4000,
            isClosable: true
        })
        }
    }, [state.status])
    

    return (
        <VStack
        spacing={8}
        >
        <Heading textAlign='center'>
            {results[0] ? results[0].value : 'Loading...'}
        </Heading>

        <StatGroup>
            <Stat>
                <StatLabel>Total Supply</StatLabel>
                <StatNumber>{results[1] ? results[1].value?.toString() : 'Loading...'}</StatNumber>
                <StatHelpText>
                    {tokenOptions.unit}
                </StatHelpText>
            </Stat>

            <Stat>
                <StatLabel>Your Supply</StatLabel>
                <StatNumber>{results[2] ? results[2].value?.toString() : 'Loading...'}</StatNumber>
                <StatHelpText>
                    {tokenOptions.unit}
                </StatHelpText>
            </Stat>
        </StatGroup>

        <Button
            size='lg'
            onClick={handleClaim}
            isDisabled={state.status === 'PendingSignature' || state.status === 'Mining'}
            isLoading={state.status === 'PendingSignature' || state.status === 'Mining'}
        >
            Claim Token {tokenOptions.tokenPrice && `for ${formatEther(tokenOptions.tokenPrice)} ETH`}
        </Button>
        <Box
            rounded='md'
            bg='gray.700'
            p='4'
            maxW='100%'
            minW='lg'
        >
            <VStack
            spacing={4}
            >
            <Heading
                size='md'
            >
                {tokenOptions.searchTitle}
            </Heading>
            <Input
                placeholder={tokenOptions.searchPlaceholder}
                value={tokenIndex || ''}
                onChange={(e) => {
                // if (e.target.value === '0') {
                //     setTokenIndex(0)
                // }
                // setTokenIndex(parseInt(e.target.value))
                    setTokenIndex(e.target.value)
                }}
            />
            <Flex>
                <Spacer/>
                <Button
                    disabled={!tokenIndex}
                    onClick={() => {
                        tokenIndex && router.push(`${router.pathname}/${tokenIndex.toString()}`)
                    }}
                >{tokenOptions.searchSubmitText}</Button>
            </Flex>
            </VStack>
        </Box>
        </VStack>
    )
}
