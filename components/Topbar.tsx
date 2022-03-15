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
                    {Object.keys(links).map(key => ( <TopbarLink key={key} href={key}>
                            {links[key].label}
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
                        {Object.keys(links).map(key => ( <MenuItem as='a' key={key} href={key}>
                                {links[key].label}
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
