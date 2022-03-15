import React from 'react'
import { useEthers, useEtherBalance } from "@usedapp/core";
import { 
    Box, 
    Button, 
    Flex, 
    Heading, 
    Popover, 
    PopoverArrow, 
    PopoverBody, 
    PopoverCloseButton, 
    PopoverContent, 
    PopoverHeader, 
    PopoverTrigger, 
    Portal, 
    Spacer, 
    Text, 
    useColorModeValue,
    Link
} from '@chakra-ui/react';
import { formatEther } from "@ethersproject/units";
import Identicon from './Identicon';
import { IoOpenOutline } from 'react-icons/io5';

export default function Metamask() {

    const { activateBrowserWallet, deactivate, account,  } = useEthers();
    const etherBalance = useEtherBalance(account);

    const handleConnect = () => {
        activateBrowserWallet();
    }

    const accountShort = account && `${account.slice(0, 6)}...${account.slice(
        account.length - 4,
        account.length
        )}`

    const accountBgColor = useColorModeValue('gray.300', 'gray.800');

    return account ? (
        <Popover>
            <PopoverTrigger>
                <Button>
                    <Text display={['none', 'block']}>{etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)} ETH</Text>
                    <Box as="span" px='3' py='2' ml='3' mr='3' bg={accountBgColor} fontSize="sm" rounded='md'>
                        <Text as="span" fontSize="xs">{accountShort && accountShort}</Text>
                    </Box>
                    <Identicon />
                </Button>
            </PopoverTrigger>
            <Portal>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader>
                        <Heading fontSize='2xl'>My Account</Heading>
                    </PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody>
                        <Link color='blue.400' href={account ? `https://rinkeby.etherscan.io/address/${account}` : ''} target='_blank'>
                            <Flex align='center'>
                                <Text mr={['0', '1']}>
                                    {accountShort && accountShort} on Etherscan
                                </Text> 
                                <IoOpenOutline />
                            </Flex>
                        </Link>
                        <Text>{etherBalance && parseFloat(formatEther(etherBalance))} ETH</Text>
                        <Flex>
                            <Spacer />
                            <Button onClick={deactivate} bg='red.400'>Disconnect</Button>
                        </Flex>
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover>
    ) : (
        <Button onClick={handleConnect}>
            <Text>Connect</Text>
        </Button>
    )
}
