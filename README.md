# nohost

# Overview
nohost is a local-first browser-based dapp installer. It leverages static assets and service workers to enable trustless dapp installations directly onto users' devices.

# Background
- [Decentralizing DeFi frontends: protecting users and protocol authors](https://www.liquity.org/blog/decentralizing-defi-frontends-protecting-users-and-protocol-authors) by Edward Mulraney
- [The State of Dapps on IPFS: Trust vs. Verification](https://blog.ipfs.tech/dapps-ipfs/) by Daniel Norman
- [End-to-end app integrity verification using browser extension manifest v3](https://github.com/edmulraney/app-integrity-verifier-extension) by Edward Mulraney

# Key features
- Browser native: utilizes static files (HTML, CSS, JS) and a service worker - doesn't require third party applications such as IPFS Desktop
- Facilitates trustless dapp installations from decentralized storage networks like IPFS, or trusted web2 sources like Github
- Utilizes HTTP gateways for initial delivery of the installer, then shifts to local delivery for subsequent access
- Utilizes a subdomain URL convention for installing dapps

# Contents

```
├─ dapp/* 
├─ dapp-service-worker.js
├─ index.html
├─ known-dapps.js
```

- `dapp/*` - Contains logic for downloading source code from various locations (e.g. IPFS, Github, etc.)
- `dapp-service-worker.js` - Contains logic for intercepting requests to subdomains, saving, caching and returning source code from indexedDB
- `index.html` - The entry point for the installer, can be accessed via primary domain e.g. `https://nohost.eth.limo` or via a subdomain e.g. `https://vitalik.nohost.eth.limo`
- `known-dapps.js` - Contains a list of known dapps and their source code location - these names take priority over ENS names

# What is nohost?
- nohost is a frontend source code installer which can be used to install dapps
- Consists of static files (HTML, JS, CSS and a service worker)
- Should to be stored on a decentralized storage network (e.g. IPFS)
- Can be delivered to users via HTTP gateways (e.g. eth.limo, dweb.link, ipfs.io, etc.)
- Once delivered to a user's machine, the service worker ensures the HTTP gateway is no longer used for subsequent access, it's a one-time delivery mechanism
- Users install dapps by specifying an ENS name as the subdomain on the gateway URL
- The ENS name should contain either a `contenthash` or `sourcecode` record which points to the location of a dapp's frontend source code
- The dapp source code is downloaded and stored locally on the user's device via indexedDB in the browser
- The service worker then creates a fake local cache entry in the browser for the specified subdomain
- The next time a user visits the subdomain, the service worker will serve the dapp from the cache, rather than making a network request
- If the user ever clears their cache entry for the dapp, the service worker will reinstall the dapp from indexedDB without needing to download the source code again

# Lifecycle

### Delivery of nohost to the user's machine
- User requests nohost installer from a gateway e.g. https://nohost.eth.limo or any subdomain https://*.nohost.eth.limo
- If this is the first time they've ever accessed nohost, the installer is delivered to the user's machine via the HTTP gateway (security optimizors can optionally install an extension to ensure the installer hasn't been tampered with)
- If this is *not* the first time they've accessed nohost, the service worker will intercept the request and serve the installer from the local cache instead of the HTTP gateway

### Trustless dapp installation
- User enters or clicks a URL in their browser e.g. `https://vitalik.nohost.eth.limo` = vitalik.eth dapp
- The installer isolates `vitalik` from the subdomain and downloads the source code from the location referenced in the ENS record for `vitalik.eth` (contenthash record)
- The installer stores the source code in indexedDB and creates a fake local cache entry for `https://vitalik.nohost.eth.limo` so that the user's browser will intercept requests to that subdomain and serve the source code from the local cache instead of the HTTP gateway
- The installer redirects the user to the subdomain `https://vitalik.nohost.eth.limo` which is now served from the local cache

### Subdomain access technical flow
- If the subdomain is already an installed dapp, `dapp-service-worker.js` will return it from the local cache, preventing a network request to the gateway
- If the subdomain is not an installed dapp:
- `dapp-service-worker.js` will first check `known-dapps.js` to see if there's a matching known dapp for the subdomain name, and if so, will download the source code from the specified location in `known-dapps.js`
- Otherwise, it will query the ENS registry for the subdomain name and download the source code from the location referenced in its ENS records
- `index.html` sends an event to `dapp-service-worker.js` containing the source code
- `dapp-service-worker.js` stores the source code in indexedDB, versions it, and creates a fake local cache entry for the subdomain
- `index.html` redirects to the subdomain URL, which now returns the local cache entry

# Ethos
Delegating *work* to web2 services is acceptable, but delegating *trust* should be avoided

# Development
`npm start` - Starts a development server locally on http://localhost:9105

# Get involved
This repo is currently highly experimental, hence it's not yet typed, tested, or architected. This project will become a community-driven public good, owned by a neutral non-profit entity.

If you'd like to contribute or chat, please reach us in the following places:
- [IPFS dapps working group weekly call](https://lu.ma/ipfs-dapps)
- [The DeFi Collective Discord](https://discord.com/channels/1107676235808645232/1182039542572785735)
- [IPFS JS Slack](https://filecoinproject.slack.com/archives/C046HDAHA13)
