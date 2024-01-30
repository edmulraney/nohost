import {
  HttpReader,
  ZipReader,
  BlobWriter,
} from "https://esm.sh/@zip.js/zip.js@2.7.32"
import * as mimeTypes from "https://cdn.jsdelivr.net/npm/mime-types@2.1.35/+esm"

// TODO implement this...
const unzip = async (url, options) => {
  const reader = new ZipReader(new HttpReader(url))
  const entries = await reader.getEntries()
  const files = []

  for (const entry of entries) {
    if (entry.directory) continue
    files.push({
      path: entry.filename,
      mime: mimeTypes.lookup(entry.filename),
      content: await entry.getData(new BlobWriter()),
    })
  }

  reader.close()
  return files
}

export { unzip }
