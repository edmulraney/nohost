import { getDappId, createDappIdFromLocation } from "./dapp/utils/url.js"
import { download } from "./dapp/download.js"
import knownDapps from "./known-dapps.js"

navigator.serviceWorker.addEventListener("message", (e) => {
  if (e.data.event === "STORE_DAPP_SUCCEEDED") {
    console.log("App installed successfully.")
    setTimeout(() => {
      // Reload the page to render the locally installed dapp (from the new cache storage entry)
      window.location.href = window.location.origin
    }, 3000)
  }
})

document.getElementById("location-example").href =
  `${window.location.protocol}//uniswap.${window.location.host}`

document.getElementById("location-example").innerHTML =
  `${window.location.protocol}//uniswap.${window.location.host}`

const showDashboard = () => {
  document.getElementById("dashboard").style.display = "flex"
  document.getElementById("installation-progress").style.display = "none"
}

const showInstallationProgress = () => {
  document.getElementById("dashboard").style.display = "none"
  document.getElementById("installation-progress").style.display = "flex"
}

const handleSubdomain = async () => {
  const dappId = getDappId(window.location.hostname)
  if (dappId === undefined) {
    console.log("Not on a subdomain")
    showDashboard()
    return
  }

  showInstallationProgress()

  // Register dapp service worker on this subdomain
  const registration = await navigator.serviceWorker.register(
    "/dapp-service-worker.js",
    {
      type: "module",
      updateViaCache: "all",
    },
  )

  await navigator.serviceWorker.ready

  const knownDapp = knownDapps.find((knownDapp) => knownDapp.id === dappId)

  const urlParams = new URLSearchParams(window.location.search)
  const location = urlParams.get("location")

  const dapp = knownDapp
    ? await download(knownDapp.location, knownDapp.options) // use the known dapp id location
    : location
      ? await download(location) // use the specified source code location param
      : await download(`ens://${dappId}`) // assume user has entered subdomain of an ENS

  console.log("dapp", dapp)

  registration.active.postMessage({
    event: "STORE_DAPP_REQUESTED",
    payload: dapp,
  })
}

handleSubdomain()

document.getElementById("location-form").addEventListener("submit", (e) => {
  e.preventDefault()

  const sourceCodeLocation = document.getElementById("location").value
  const dappId = createDappIdFromLocation(sourceCodeLocation)
  const dappUrl = `${window.location.protocol}//${dappId}.${window.location.host}/?location=${sourceCodeLocation}`

  window.location.href = dappUrl
})

document.getElementById("location").addEventListener("input", async (e) => {
  e.preventDefault()

  const installationUrlElement = document.getElementById("installation-url")

  if (e.target.value === "") {
    installationUrlElement.innerHTML = ""
    return
  }

  const dappId = createDappIdFromLocation(e.target.value)
  const dappUrl = `${window.location.protocol}//${dappId}.${window.location.host}/?location=${e.target.value}`

  installationUrlElement.innerHTML = `Installation URL: <a href="${dappUrl}" target="_blank">${dappUrl}</a>`
})
