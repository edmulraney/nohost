import { untar } from "./untar.js"
import { unzip } from "./unzip.js"

const unpackers = [
  ["tar.gz", untar],
  ["zip", unzip],
]

const getUnpacker = (url) => unpackers.find(unpacker => url.endsWith(unpacker[0]))[1]

const unpack = async (asset, type, options) => {
  const unpacker = getUnpacker(type)
  if (!unpacker) throw new Error("No unpacker found")
  const files = await unpacker(asset, options)

  return {
    files,
    version: "TODO" // TODO
  }
}

export {
  unpack,
}