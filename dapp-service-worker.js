import { cacheFiles, cacheName } from "./dapp/cache.js"
import { saveFiles, setVersion } from "./dapp/db.js"

const id = "__dapp-service-worker__"

self.addEventListener("message", async (event) => {
  if (event.data.event !== "STORE_DAPP_REQUESTED") return;

  console.log(id, "message event", event)
  const { location, files, version } = event.data.payload

  event.waitUntil((async () => {
    await cacheFiles(files)
    // store all versions here and update cache to the correct version when user changes cache
    await saveFiles(files, version)
    await setVersion(version) // Persist the current app version being used

    const app = { location, files, version }
    event.source.postMessage({ event: "STORE_DAPP_SUCCEEDED", app });
  })())
})

self.addEventListener("fetch", async (event) => {
  event.respondWith((async () => {
    const cache = await caches.open(cacheName)
    // TODO: handle recovery here, if user ever cleared cache, we can recover (recache) the latest version stored in indexedDB
    const response = await cache.match(event.request)
    if (response) console.log(id, "already had response cached", event.request, response)

    return response || fetch(event.request)
  })())
})