import { contractInfos, getContract } from '@/services/contracts'
import { Skeleton, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useCall, useCalls, useEthers } from '@usedapp/core'
import { BigNumber } from 'ethers'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

type Props = {
    supply: BigNumber
}


function NFTRow({index}: {index: number}) {
    const contract = getContract(contractInfos.fakeNefturians)
    const [value, setValue] = useState<any>()

    const uri = useCall({
        contract,
        method: 'tokenURI',
        args: [index]
    })

    console.log(uri)

    const fetchData = async () => {
        if(uri?.value) {
            const { data } = await axios.get(uri.value[0])
            console.log(data)
            setValue(data)
        }
    }

    useEffect(() => {
        fetchData()
    }, [uri])
    
    return value ? <Tr>
        <Td>
            <img 
                src={value.image} 
                alt={value.name} 
                style={{width: '100px'}}
            />
        </Td>
        <Td>
            {value.name}
        </Td>
    </Tr> : <Tr>
        <Td>
            <Skeleton>
                <p>test</p>
            </Skeleton>
        </Td>
        <Td>
            <Skeleton>
                <p>test</p>
            </Skeleton>
        </Td>
    </Tr>

}

function NFTList({supply}: Props) {
    // From bignumber to integer
    const supplyInt = supply.toNumber()
    const contract = getContract(contractInfos.fakeNefturians)

    // Create array of size supply
    const nftArray = Array(supplyInt).fill(0).map((_, index) => ({
        contract,
        method: 'ownerOf',
        args: [index]
    }))

    // Get owner of each NFT
    const results = useCalls(nftArray)

    const router = useRouter()

    const { address } = router.query

    return <Table>
        <Thead>
            <Tr>
                <Th>Nefturian</Th>
                <Th>Name</Th>
            </Tr>
        </Thead>
        <Tbody>
            {results.map((result, index) => {
                if (result?.value?.[0] === address) {
                    return <NFTRow key={index} index={index} />
                }
            })}
        </Tbody>
    </Table>
}

export default function Address() {

    const contract = getContract(contractInfos.fakeNefturians)

    const totalSupply = useCall({
        contract,
        method: 'totalSupply',
        args: []
    }) 

    if (totalSupply?.value) {
        return <NFTList 
            supply={totalSupply.value[0]}
        />
    }

    return (
        <div>Loading...</div>
    )
}
