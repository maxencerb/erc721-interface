// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export type Data = {
  signature: string,
  isError: false
} | {
  error: string
  isError: true
}

const apiEndpoint = 'https://raw.githubusercontent.com/l-henri/erc721-ux/main/claimerV1-tools/output-sig.json'

type SignatureData = {
  tokenNumber: number,
  signature: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const token = req.query.token as string
  let tokenInt: number
  try {
    tokenInt = parseInt(token)
  } catch (e) {
    res.status(400).json({
      error: 'Invalid token',
      isError: true,
    })
    return
  }

  const data: SignatureData[] = await axios.get<SignatureData[]>(apiEndpoint).then(r => r.data)

  const signature = data.find(d => d.tokenNumber === tokenInt)
  if (!signature) {
    res.status(404).json({
      error: 'Token not found',
      isError: true,
    })
    return
  }
  res.status(200).json({
    signature: signature.signature,
    isError: false
  })
}
