import { getSourceCodeRecord, getContentHashRecord } from "../utils/ens.js"
import { downloadViaProtocolAndPath } from "../download.js"

const download = async (location, options) => {
  const ens = location.replace("ens://", "")
  const contenthash = await getContentHashRecord(ens)
  if (contenthash) return downloadViaProtocolAndPath(contenthash.protocolType, contenthash.decoded, options)


  const sourceCode = await getSourceCodeRecord(ens)
  if (sourceCode) return downloadViaProtocolAndPath(sourceCode.protocolType, sourceCode.path, options)

  throw new Error("ENS contenthash not found")
}

export {
  download,
}