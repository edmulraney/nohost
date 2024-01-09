import { extractCidV1 } from "../utils/extract-cid.js"
import { download as ipfsDownload } from "../ipfs/download.js"

const assetNames = ["app.tar.gz", "app.zip"]

const download = async (path, options) => {
  const [owner, repo] = path.split("/")
  const releases = await window.fetch(`https://api.github.com/repos/${owner}/${repo}/releases`).then(res => res.json())
  const latestRelease = options?.github?.assetName ? releases.find(release => release.name.includes(options.github.assetName)) : releases[0]
  if (options?.github?.ipfsScrape) {
    const cid = extractCidV1(latestRelease.body)
    if (cid) return ipfsDownload(cid, options)
    throw new Error("No IPFS cid found in release body")
  }

  const asset = latestRelease.assets.find(_asset => assetNames.includes(_asset.name))
  const assetUrl = asset.browser_download_url
  if (!assetUrl) throw new Error("No asset found in release")
  window.location.href = "./dapp/github/installer.html?target=" + assetUrl + "&options=" + JSON.stringify(options)
}

export {
  download,
}