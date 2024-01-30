import { cacheFiles, cacheName } from "./dapp/cache.js"
import { saveFiles, setVersion } from "./dapp/db.js"

self.addEventListener("message", async (event) => {
  if (event.data.event !== "STORE_DAPP_REQUESTED") return

  const { location, files, version } = event.data.payload

  event.waitUntil(
    (async () => {
      await cacheFiles(files)
      await saveFiles(files, version)
      await setVersion(version) // TODO: enable user to select which version they want to run

      const app = { location, files, version }
      event.source.postMessage({ event: "STORE_DAPP_SUCCEEDED", app })
    })(),
  )
})

self.addEventListener("fetch", async (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(cacheName)
      // TODO: handle recovery here, if user ever cleared cache, we can recover (recache) the latest version stored in indexedDB
      const response = await cache.match(event.request)

      return response || fetch(event.request)
    })(),
  )
})
