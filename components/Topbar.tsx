import { Box, Button, Divider, Flex, Heading, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Show, Spacer } from '@chakra-ui/react'
import React from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Metamask from './Metamask'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AiFillHome } from 'react-icons/ai'

const links = {
    '/fakeBayc': {
        label: 'Fake Bayc',
    },
    '/fakeNefturians': {
        label: 'Fake Nefturians',
    },
    '/fakeMeebits': {
        label: 'Fake Meebits',
    },
    '/chain-info': {
        label: 'Chain Info',
    }
}

type TopbarLinkProps = {
    href: string,
    children: string,
}

function TopbarLink({ href, children }: TopbarLinkProps) {
    const router = useRouter()
    const isActive = router.pathname === href
    return (
        <Button
            as='a'
            href={href}
            // _hover={{
            //     bg: 'gray.200',
            //     color: 'blue.800',
            // }}
            fontWeight='medium'
            variant='ghost'
            bg={isActive ? 'gray.700' : 'transparent'}
        >
            {children}
        </Button>
    )
}

export default function Topbar() {

    const router = useRouter()

    return (
        <>
        <Flex
            w='100%'
            p='3'
        >
            <HStack
                spacing={4}
            >
                <IconButton
                    icon={<AiFillHome />}
                    aria-label='Home'
                    as='a'
                    href='/'
                    variant='ghost'
                    bg={router.pathname === '/' ? 'gray.700' : 'transparent'}
                />
                <Show breakpoint='(min-width: 1100px)'>
                    {Object.entries(links).map(kv => ( <TopbarLink key={kv[0]} href={kv[0]}>
                            {kv[1].label}
                        </TopbarLink>
                        )
                    )} 
                </Show>
            </HStack>
            <Spacer/>
            <HStack
                spacing={4}
            >
                <Metamask/>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<BsThreeDots />}
                        variant='outline'
                    />
                    <MenuList>
                        {Object.entries(links).map(kv => ( <MenuItem as='a' key={kv[0]} href={kv[0]}>
                                {kv[1].label}
                            </MenuItem>
                            )
                        )} 
                    </MenuList>
                </Menu>
            </HStack>
        </Flex>
        <Divider/>
        </>
    )
}
