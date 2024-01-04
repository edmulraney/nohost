export default [
  {
    "id": "aave",
    "location": "ipns://app.aave.com",
    // "location": "github://aave/interface",
    "options": {
      "ignorePaths": [
        "^/governance",
        "^/_next/data/.*/governance",
      ],
      "github": {
        "buildPath": "out",
      },
    }
  },
  {
    "id": "uniswap",
    "location": "github://uniswap/interface",
    // "location": "ens://app.uniswap.eth",
    "options": {
      "github": {
        "assetNameMatch": "web/",
        "ipfsScrape": true,
      },
    },
  },
]

//todo: this might get messy/confusing if we allow locations to be specified, instead the id should just default to 
// the ens that is registered to that dapp. e.g. we register aaveui.eth, and then no location is specified in this file
// replace "id" with "ens"

// e.g.
// export default [
//   {
//     "ens": "uniswapui.eth",    // <- no need to specify location
//     "options": { ...
//   },
// ]