import { getIpnsResolver } from "./get-ipns-resolver.js"
import { extractCidV0, extractCidV1 } from "./extract-cid.js"

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

  return await resolveDnsLink(name)
}

export {
  resolveIpnsCid
}