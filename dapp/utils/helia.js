import { createHelia } from "https://esm.sh/helia@3.0.1"
import { unixfs } from "https://esm.sh/@helia/unixfs@1.4.3"
import { trustlessGateway } from "https://esm.sh/@helia/block-brokers@1.0.0"

let helia = undefined

const getHelia = async () => {
  if (helia) return helia

  helia = createHelia({
    blockBrokers: [
      trustlessGateway({
        gateways: ["https://dweb.link", "https://cf-ipfs.com"],
      }),
    ],
    libp2p: {
      start: false,
    },
  })

  return helia
}

let heliaFs = undefined

const getHeliaFs = async () => {
  if (heliaFs) return heliaFs

  heliaFs = unixfs(await getHelia())

  return heliaFs
}

export { getHelia, getHeliaFs }
