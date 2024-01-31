import { getSourceCodeLocation } from "../utils/ens.js"
import { download as downloadInner } from "../download.js"

const download = async (ens, options) => {
  const fullEnsName = ens.endsWith(".eth") ? ens : `${ens}.eth`
  const { protocol, path } = await getSourceCodeLocation(fullEnsName)

  if (!protocol || !path) {
    throw new Error(
      `No source code location records found for ENS: ${fullEnsName}`,
    )
  }

  return downloadInner(`${protocol}://${path}`, options)
}

export { download }
