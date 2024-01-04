import { download as ipfsDownload } from "../ipfs/download.js"
import { resolveIpnsCid } from "../utils/ipns.js"

const download = async (name, options) => {
  const cid = await resolveIpnsCid(name)
  return ipfsDownload(cid, options)
}

export {
  download,
}
