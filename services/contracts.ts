import { Contract } from '@ethersproject/contracts'

type contractInfos = {
    abi: any
    address: string
}

export const contractInfos: {
    [contractName: string]: contractInfos
} = {
    fakeBayc: {
        address: '0x6b740C7a965d75A4801642Fabc650DA92CeA47ef',
        abi: require('@/constants/abis/fakeBayc.json'),
    },
    fakeNefturians: {
        address: '0x14e68d0ba29c07478bd68f4a479a0211bd48ca4e',
        abi: require('@/constants/abis/fakeNefturians.json'),
    },
    fakeMeebits: {
        address: '0x66e0f56e86906fd7ee186d29a1a25dc12019c7f3',
        abi: require('@/constants/abis/fakeMeebits.json'),
    },
    fakeMeebitsClaimer: {
        address: '0x656ec82544a3464f07bb86bea3447a4fdf489c1b',
        abi: require('@/constants/abis/fakeMeebitsClaimer.json'),
    }
}

export const getContract = ({abi, address}: contractInfos) => {
    return new Contract(address, abi)
}