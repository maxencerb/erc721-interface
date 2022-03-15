import React from 'react'
import { useEthers, useEtherBalance, useBlockNumber } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { Box, Center, Heading, Stat, StatGroup, StatHelpText, StatLabel, StatNumber, VStack } from '@chakra-ui/react';

export default function ChainInfo() {
    const { chainId, account } = useEthers();
    const etherBalance = useEtherBalance(account);
    const blockNumber = useBlockNumber();

    return (
        <Center>
            <VStack spacing={10}>
                <Heading>Chain Informations</Heading>
                <Box maxW='sm' minW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' p='4'>
                    <StatGroup>
                        <Stat>
                            <StatLabel>Chain ID</StatLabel>
                            <StatNumber>{chainId}</StatNumber>
                            <StatHelpText>
                                Rinkeby network
                            </StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel>Block Number</StatLabel>
                            <StatNumber>{blockNumber}</StatNumber>
                            <StatHelpText>Since Genesis</StatHelpText>
                        </Stat>
                    </StatGroup>
                </Box>
            </VStack>
        </Center>
    )
}
