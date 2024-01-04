import { extractCidV0, extractCidV1 } from "./extract-cid.js"
import DnsOverHttpResolver from "https://esm.sh/dns-over-http-resolver@3.0.0"

const resolvers = [
  "https://mozilla.cloudflare-dns.com/dns-query",
  "https://cloudflare-dns.com/dns-query",
  "https://dns.google/dns-query",
  "https://dns.google/resolve",
  "dns.quad9.net/dns-query"
]

let ipnsResolver = undefined

const getIpnsResolver = async () => {
  if (ipnsResolver) return ipnsResolver

  ipnsResolver = new DnsOverHttpResolver()
  ipnsResolver.setServers(resolvers)

  return ipnsResolver
}

const extractIpnsCidV0 = (name) => {
  const match = name.match(/Qm[0-9a-z]{44,}/i)
  return match ? match[0] : undefined
}

const extractIpnsCidV1 = (name) => {
  const match = name.match(/k[0-9a-z]{45,}/i)
  return match ? match[0] : undefined
}

const resolveDnsLink = async (name) => {
  const ipnsResolver = await getIpnsResolver()
  const txt = await ipnsResolver.resolve("_dnslink." + name, "TXT")
  const cid = txt[0][0].replace("dnslink=/ipfs/", "").replace("/", "")
  return cid
}

const resolveIpfsCid = async (key) => {
  const result = await window.fetch("https://ipfs.io/ipns/" + key, {
    headers: { "Accept": "application/vnd.ipfs.ipns-record" }
  }).then(res => res.text())

  let cid = extractCidV0(result)
  if (cid) return cid

  return cid = extractCidV1(result)
}

const resolveIpnsCid = async (name) => {
  let key = extractIpnsCidV1(name)
  if (key) return resolveIpfsCid(key)

  key = extractIpnsCidV0(name)
  if (key) return resolveIpfsCid(key)

  return resolveDnsLink(name)
}

export {
  resolveIpnsCid
}

// import { getHelia } from "./get-helia.js"
// // import { ipns } from "@helia/ipns"
// import { ipns } from "../node_modules/@helia/ipns/dist/index.min.js"
// // import { ipns } from "https://esm.sh/@helia/ipns"
// import { dht, pubsub } from "../node_modules/@helia/ipns/dist/src/routing/index.js"
// // import { dht, pubsub } from "https://esm.sh/@helia/ipns/routing"
// import { dnsJsonOverHttps, dnsOverHttps } from "../node_modules/@helia/ipns/dist/src/dns-resolvers/index.js"
// // import { dnsJsonOverHttps, dnsOverHttps } from "https://esm.sh/@helia/ipns/dns-resolvers"

// const resolvers = [
//   dnsJsonOverHttps("https://mozilla.cloudflare-dns.com/dns-query"),
//   dnsOverHttps("https://mozilla.cloudflare-dns.com/dns-query"),
//   dnsOverHttps("https://cloudflare-dns.com/dns-query"),
//   dnsOverHttps("https://dns.google/dns-query"),
//   dnsOverHttps("https://dns.google/resolve"),
//   dnsOverHttps("dns.quad9.net/dns-query")
// ]

// let ipnsResolver = undefined

// const getIpnsResolver = async () => {
//   if (ipnsResolver) return ipnsResolver

//   const helia = await getHelia()

//   return ipnsResolver = ipns(helia, {
//     routers: [dht(helia), pubsub(helia)],
//     resolvers
//   })
// }