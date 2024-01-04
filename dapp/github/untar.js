import pako from "https://esm.sh/pako@2.1.0"
import jsUntar from "https://esm.sh/js-untar@2.0.0"
import * as mimeTypes from 'https://cdn.jsdelivr.net/npm/mime-types@2.1.35/+esm'

const cleanPath = (uncleanPath, options) => {
  let cleanPath = uncleanPath

  if (cleanPath.startsWith("./")) {
    cleanPath = cleanPath.substring(1)
  }

  if (options.github.buildPath && cleanPath.startsWith(options.github.buildPath)) {
    cleanPath = cleanPath.replace(options.github.buildPath, "")
  }
  else if (options.github.buildPath && cleanPath.startsWith("/" + options.github.buildPath)) {
    cleanPath = cleanPath.replace("/" + options.github.buildPath, "")
  }

  return cleanPath
}

const untar = async (tar, options) => {
  const tarBuffer = await tar.arrayBuffer()
  const decompressed = await pako.ungzip(tarBuffer)
  const entries = await jsUntar(decompressed.buffer).catch(error => {
    console.error("Error untarring:", error)
  })
  const files = []
  entries.forEach(entry => {
    // TODO options.ignorePaths
    const isDirectory = entry.type === "5"
    if (isDirectory) return
    files.push({
      path: cleanPath(entry.name, options),
      mime: mimeTypes.lookup(entry.name),
      content: entry.buffer,
    })
  })
  return files
}

export {
  untar,
}