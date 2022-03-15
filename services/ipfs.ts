import { useQuery } from "react-query"
import axios from "axios"

export const useIPFSUri = <T>(uri: string) => {
    const query = useQuery(uri, async () => {
        const { data } = await axios.get(uri)
        return data as T
    })
    return query
}

export const toIPFSImage = (url: string) => {
    url = url.replace('ipfs://', '')
    return `https://gateway.ipfs.io/ipfs/${url}`
}

export const fromPinataToIPFSUri = (uri: string) => {
    uri = uri.replace('https://gateway.pinata.cloud/ipfs/', 'https://ipfs.io/ipfs/')
    return uri
}