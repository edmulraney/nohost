import { getSourceCodeRecord, getContentHashRecord } from "../utils/ens.js"
import { download as downloadInner } from "../download.js"

const download = async (ens, options) => {
  const contenthash = await getContentHashRecord(ens)
  if (contenthash) return downloadInner(contenthash.protocolType + "://" + contenthash.decoded, options)


  const sourceCode = await getSourceCodeRecord(ens)
  if (sourceCode) return downloadInner(sourceCode.protocolType + "://" + sourceCode.path, options)

  throw new Error("ENS contenthash not found")
}

export {
  download,
}