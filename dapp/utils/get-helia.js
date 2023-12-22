import { createHelia } from 'https://esm.sh/helia@next'
import { trustlessGateway } from 'https://esm.sh/helia@next/block-brokers'

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

export {
  getHelia,
}