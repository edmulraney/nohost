import { getHelia } from "./helia.js"
import { ipns as createIpns } from "https://esm.sh/@helia/ipns@4.0.0"
import { dnsOverHttps } from "https://esm.sh/@helia/ipns@4.0.0/dns-resolvers"
import { dnsJsonOverHttps } from "https://esm.sh/@helia/ipns@4.0.0/dns-resolvers"

const extractIpnsKey = (nameOrKey) => {
	const match = nameOrKey.match(/k[0-9a-z]{45,}/i)
	return match ? match[0] : undefined
}

// TODO: determine which resolvers to use
const resolvers = [
	dnsJsonOverHttps("https://mozilla.cloudflare-dns.com/dns-query"),
	// dnsOverHttps("https://mozilla.cloudflare-dns.com/dns-query"),
	// dnsOverHttps("https://cloudflare-dns.com/dns-query"),
	// dnsOverHttps("https://dns.google/dns-query"),
	// dnsOverHttps("https://dns.google/resolve"),
	// dnsOverHttps("dns.quad9.net/dns-query")
]

let ipns = undefined

const getIpns = async () => {
	if (ipns) return ipns

	const helia = await getHelia()
	ipns = createIpns(helia, {})

	return ipns
}

const resolveIpns = async (keyOrName) => {
	const ipnsKey = extractIpnsKey(keyOrName)
	if (ipnsKey) return resolveIpfsCid(ipnsKey)

	const ipns = await getIpns()
	const cid = await ipns.resolveDns(keyOrName, {
		resolvers,
	})
	console.log({ cid })
	return cid.toString()
}

export { resolveIpns }
