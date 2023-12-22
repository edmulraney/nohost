import { createEnsPublicClient } from "https://esm.sh/@ensdomains/ensjs"
import { http } from 'https://esm.sh/viem'
import { mainnet } from 'https://esm.sh/viem/chains'
import { getContentHashRecord as _getContentHashRecord } from 'https://esm.sh/@ensdomains/ensjs/public'

let client = undefined

const getClient = async () => {
  if (client) return client

  return client = createEnsPublicClient({
    chain: mainnet,
    transport: http(),
  })
}

const getSourceCodeRecord = async (name) => {
  const client = await getClient()
  const result = await getTextRecord(client, { name, key: 'sourcecode' })

  if (!result) return undefined

  const [protocolType, path] = result.split("://")

  return {
    protocolType,
    path,
  }
}


const getContentHashRecord = async (name) => {
  const client = await getClient()
  const result = await _getContentHashRecord(client, { name })
  console.log("got result", result)
  console.log("got contenhash", result.decoded)
  return result;
}


export {
  getContentHashRecord,
  getSourceCodeRecord,
}