import React from 'react'
import { useContractFunction } from '@usedapp/core'
import { getContract, contractInfos } from '@/services/contracts'
import NFTPage from '@/components/NFTPage'

export default function FakeBayc() {

  const contract = getContract(contractInfos.fakeBayc)

  const { state, send } = useContractFunction(contract, 'claimAToken', { transactionName: 'ClaimToken' })
  
  return (
    <NFTPage
      contract={contract}
      state={state}
      send={send}
      tokenOptions={{
        unit: 'Apes',
        searchTitle: 'Search for an APES',
        searchPlaceholder: 'Ape index',
        searchSubmitText: 'Search through APES',
      }}
    />
  )
}
