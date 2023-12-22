import { getHelia } from "../utils/get-helia.js"
import { unixfs } from 'https://esm.sh/@helia/unixfs@latest'

let heliaFs = undefined

const getHeliaFs = async () => {
  if (heliaFs) return helia

  return heliaFs = unixfs(await getHelia())
}

export {
  getHeliaFs,
}
