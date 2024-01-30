import { download as ipfsDownload } from "./ipfs/download.js"
import { download as ipnsDownload } from "./ipns/download.js"
import { download as ensDownload } from "./ens/download.js"
import { download as githubDownload } from "./github/download.js"

const downloaders = {
	ipfs: ipfsDownload,
	ipns: ipnsDownload,
	ens: ensDownload,
	github: githubDownload,
}

const getDownloader = (protocol) => {
	const downloader = downloaders[protocol]
	if (!downloader) throw new Error(`Unsupported protocol ${protocol}`)
	return downloader
}

const download = async (location, options) => {
	const [protocol, path] = location.split("://")
	const downloader = getDownloader(protocol)
	return downloader(path, options)
}

export { download }
