import { extractCidV1, extractCidV0 } from "../utils/extract-cid.js"
import { download as ipfsDownload } from "../ipfs/download.js"

const assetNames = ["app.tar.gz", "app.zip"]

const download = async (path, options) => {
	const [owner, repo] = path.split("/")
	const releases = await window
		.fetch(`https://api.github.com/repos/${owner}/${repo}/releases`)
		.then((res) => res.json())
	const latestRelease = options?.github?.assetName
		? releases.find((release) =>
				release.name.includes(options.github.assetName),
		  )
		: releases[0]

	if (options?.github?.ipfsScrape) {
		let cid = extractCidV1(latestRelease.body)
		if (cid) return ipfsDownload(cid, options)

		cid = extractCidV0(latestRelease.body)
		if (cid) return ipfsDownload(cid, options)

		throw new Error("No IPFS CID found in release body")
	}

	const asset = latestRelease.assets.find((_asset) =>
		assetNames.includes(_asset.name),
	)
	const assetUrl = asset?.browser_download_url
	if (!assetUrl) throw new Error("No asset found in release")

	// Redirect to specialized Github installer page (unfortunately requires user to download then upload the asset)
	const optionsString = JSON.stringify(options)
	window.location.href = `./dapp/github/installer.html?target=${assetUrl}&options=${optionsString}`
}

export { download }
