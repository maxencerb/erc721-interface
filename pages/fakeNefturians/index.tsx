import NFTPage from '@/components/NFTPage'
import { contractInfos, getContract } from '@/services/contracts'
import { useCalls, useContractFunction } from '@usedapp/core'
import React from 'react'

export default function FakeNefturians() {
    const contract = getContract(contractInfos.fakeNefturians)

    const results = useCalls([
      {
        contract,
        method: 'tokenPrice',
        args: []
      }
    ])

    const { state, send } = useContractFunction(contract, 'buyAToken', { transactionName: 'ClaimToken' })

    return (
      <NFTPage
        contract={contract}
        state={state}
        send={send}
        tokenOptions={{
          unit: 'Nefturians',
          searchTitle: 'Search for an Nefturian owner',
          searchPlaceholder: 'Address',
          searchSubmitText: 'Search through owners',
          tokenPrice: results[0]?.value?.[0]
        }}
      />
    )
}
