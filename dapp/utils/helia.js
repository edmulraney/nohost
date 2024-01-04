import { createHelia } from 'https://esm.sh/helia@2.1.0'
import { unixfs } from 'https://esm.sh/@helia/unixfs@1.4.3'
import { trustlessGateway } from 'https://esm.sh/helia@2.1.0/block-brokers'

let helia = undefined

const getHelia = async () => {
  if (helia) return helia

  return helia = createHelia({
    blockBrokers: [
      trustlessGateway({
        gateways: [
          'https://dweb.link',
          'https://cf-ipfs.com',
        ]
      })
    ],
    libp2p: {
      start: false,
    }
  })
}

let heliaFs = undefined

const getHeliaFs = async () => {
  if (heliaFs) return heliaFs

  return heliaFs = unixfs(await getHelia())
}

export {
  getHeliaFs,
}
