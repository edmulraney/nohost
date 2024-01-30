import { createEnsPublicClient } from "https://esm.sh/@ensdomains/ensjs@3.0.0"
import { http } from "https://esm.sh/viem@1.21.4"
import { mainnet } from "https://esm.sh/viem@1.21.4/chains"
import { getContentHashRecord as _getContentHashRecord } from "https://esm.sh/@ensdomains/ensjs@3.0.0/public"

let client = undefined

const getClient = async () => {
  if (client) return client

  client = createEnsPublicClient({
    chain: mainnet,
    transport: http(),
  })

  return client
}

const getSourceCodeRecord = async (name) => {
  const client = await getClient()
  const result = await getTextRecord(client, { name, key: "sourcecode" })

  if (!result) return undefined

  const [protocolType, path] = result.split("://")

  return {
    protocolType,
    path,
  }
}

const getContentHashRecord = async (name) => {
  const client = await getClient()
  return _getContentHashRecord(client, { name })
}

const getSourceCodeLocation = async (name) => {
  const contenthash = await getContentHashRecord(name)
  if (contenthash)
    return { protocol: contenthash.protocolType, path: contenthash.decoded }

  const sourceCode = await getSourceCodeRecord(name)
  if (sourceCode)
    return { protocol: sourceCode.protocol, path: sourceCode.path }

  return undefined
}

export { getSourceCodeLocation }
