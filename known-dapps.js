export default [{
  "id": "aave",
  // "location": "ipns://app.aave.com", // you can install aave via ipns, or github directly.
  "location": "github://aave/interface",
  "options": {
    "ignorePaths": [
      "^/governance",
      "^/_next/data/.*/governance",
    ],
    "github": {
      "buildPath": "out",
    },
  }
}, {
  "id": "uniswap",
  "location": "github://uniswap/interface",
  "options": {
    "github": {
      "assetName": "web/",
      "ipfsScrape": true,
    },
  },
}, {
  "id": "spark",
  "location": "ipns://app.spark.fi",
}, {
  "id": "olympus",
  "location": "ipns://app.olympusdao.finance",
}]

// TODO: This could get messy/confusing if we allow locations to be specified. Review best approach.
// Potentially, instead of specifying specific locations, we could only allow ENS addresses, which themselves specify the location.
// e.g. we register aaveui.eth, and then specify that location in this file.
// The ENS can then specify the location of ipns/ipfs/github/etc. via contenthash or source_code_location records.

// e.g.
// export default [
//   {
//     "ens": "uniswapui.eth",    // <- let the ENS specify the location
//     "options": { ...
//   },
// ]