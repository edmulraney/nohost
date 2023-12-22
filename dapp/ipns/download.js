import { download as ipfsDownload } from "../ipfs/download.js"
import { resolveIpnsCid } from "../utils/get-ipns-cid.js"

const download = async (location, options) => {
  const name = location.replace("ipns://", "")
  const cid = await resolveIpnsCid(name)
  return ipfsDownload(cid, options)
}

export {
  download,
}
