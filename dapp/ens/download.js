import { getSourceCodeRecord, getContentHashRecord } from "../utils/ens.js"
import { download as downloadInner } from "../download.js"

const download = async (ens, options) => {
  const fullEnsName = ens.endsWith(".eth") ? ens : ens + ".eth"
  const contenthash = await getContentHashRecord(fullEnsName)
  if (contenthash) return downloadInner(contenthash.protocolType + "://" + contenthash.decoded, options)


  const sourceCode = await getSourceCodeRecord(fullEnsName)
  if (sourceCode) return downloadInner(sourceCode.protocolType + "://" + sourceCode.path, options)

  throw new Error("ENS contenthash not found")
}

export {
  download,
}