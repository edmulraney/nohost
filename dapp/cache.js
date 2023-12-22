const cacheName = "dappCache"

const cacheFiles = async (files) => {
  await caches.delete(cacheName)

  const cache = await caches.open(cacheName)

  return Promise.all(files.map(file =>
    cache.put(file.path, new Response(file.content, {
      headers: { "Content-Type": file.mime }
    }))
    // TODO: do this properly, there might not be an index.html
  ).join(cache.put("/", new Response(files.find(f => f.path === "/index.html").content, {
    headers: { "Content-Type": "text/html" }
  })))
  )
}

export {
  cacheFiles,
  cacheName,
}