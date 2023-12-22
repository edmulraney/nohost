const dbName = "dappDB"
const versionStoreName = "currentVersionStore"
const fileStoreName = 'filesStore'

const openDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      db.createObjectStore(versionStoreName, { keyPath: "id" })
      db.createObjectStore(fileStoreName, { keyPath: 'version' })
    }

    request.onsuccess = (event) => resolve(event.target.result)
    request.onerror = (event) => reject(event.target.error)
  })
}

const saveFiles = async (files, version) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([fileStoreName], 'readwrite')
    const store = transaction.objectStore(fileStoreName)
    const request = store.put({ files, version })

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

const getFiles = async (version) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([fileStoreName])
    const store = transaction.objectStore(fileStoreName)
    const request = store.get(version)

    request.onsuccess = (event) => resolve(event?.target?.result?.version || 0)
    request.onerror = (event) => reject(event.target.error)
  })
}


const setVersion = async (version) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([versionStoreName], "readwrite")
    const store = transaction.objectStore(versionStoreName)
    const request = store.put({ id: "currentVersion", version })

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

const getVersion = async () => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([versionStoreName])
    const store = transaction.objectStore(versionStoreName)
    const request = store.get("currentVersion")

    request.onsuccess = (event) => resolve(event?.target?.result?.version)
    request.onerror = (event) => reject(event.target.error)
  })
}

export {
  setVersion,
  getVersion,
  saveFiles,
  getFiles,
}