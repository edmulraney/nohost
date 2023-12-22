import { download as ipfsDownload } from "./ipfs/download.js"
import { download as ipnsDownload } from "./ipns/download.js"
import { download as ensDownload } from "./ens/download.js"

const protocolDownloaders = {
  "ipfs": ipfsDownload,
  "ipns": ipnsDownload,
  "ens": ensDownload,
  "github": () => { }, // TODO
}

const downloadViaProtocolAndPath = async (protocol, path, options) => {
  const downloader = protocolDownloaders[protocol]
  if (downloader) return downloader(path, options)
  throw new Error(`Unsupported protocol ${protocol}`)
}

const download = async (location, options) => {
  const [protocol, path] = location.split("://")
  return downloadViaProtocolAndPath(protocol, path, options)
}

export {
  download,
  downloadViaProtocolAndPath
}