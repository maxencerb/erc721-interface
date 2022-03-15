import { Config, Rinkeby } from '@usedapp/core'

export const useDappConfig: Config = {
    readOnlyChainId: Rinkeby.chainId,
    readOnlyUrls: {
        [Rinkeby.chainId]: 'https://mainnet.infura.io/v3/3f35c3c5f5f74c469965a500c3ba4965',
    },
}