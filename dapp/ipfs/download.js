import { getHeliaFs } from '../utils/helia.js'
import { CID } from 'https://esm.sh/multiformats@latest'
import * as mimeTypes from 'https://cdn.jsdelivr.net/npm/mime-types@2.1.35/+esm'

const id = "__unpack__"

const getFile = async (file, fs, cwd, options) => {
  if (options?.ignorePaths?.find(regex => cwd.match(regex))) return undefined

  // skip map files
  if (file.type === "file" && (file.path.endsWith(".js.map") || file.path.endsWith(".css.map"))) return undefined
  if (file.type === "directory") return getFiles(file.cid.toString(), fs, cwd + "/" + file.name, options)

  const chunks = []
  for await (const chunk of file.content()) {
    chunks.push(chunk)
  }

  const content = new Uint8Array(chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), []))

  return {
    path: cwd + "/" + file.name,
    mime: mimeTypes.lookup(file.name),
    content,
  }
}

const getFiles = async (cidString, fs, cwd = "", options = {}) => {
  const cid = CID.parse(cidString)
  let files = []
  for await (const path of fs.ls(cid, { path: "/" })) {
    console.log(id, "downloading...", { cidString, cwd })
    const file = await getFile(path, fs, cwd, options)
    console.log(id, "downloaded", file)
    if (file === undefined) continue
    if (Array.isArray(file)) {
      file.forEach(f => f && files.push(f))
    } else {
      files.push(file)
    }
  }
  console.log(id, "finished", files)
  return files
}


const unpack = async (cid, options) => {
  console.log(id, "unpacking...", cid)
  const fs = await getHeliaFs()
  return getFiles(cid, fs, undefined, options)
}

const download = async (cid, options = undefined) => {
  const files = await unpack(cid, options)

  return {
    files,
    version: cid,
  }
}

export {
  download,
}