import { download as ipfsDownload } from "../ipfs/download.js"
import { resolveIpns } from "../utils/ipns.js"

const download = async (name, options) => {
  const cid = await resolveIpns(name)
  return ipfsDownload(cid, options)
}

export { download }
