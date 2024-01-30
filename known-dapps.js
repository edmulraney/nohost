export default [
	{
		id: "aave",
		// "location": "ipns://app.aave.com", // you can install aave via ipns or github directly.
		location: "github://aave/interface",
		options: {
			ignorePaths: ["^/governance", "^/_next/data/.*/governance"],
			github: {
				buildPath: "out",
			},
		},
	},
	{
		id: "uniswap",
		location: "github://uniswap/interface",
		options: {
			github: {
				assetName: "web/",
				ipfsScrape: true, // scrape the IPFS hash from github releases
			},
		},
	},
	{
		id: "spark",
		location: "ipns://app.spark.fi",
	},
	{
		id: "olympus",
		location: "ipns://app.olympusdao.finance",
	},
]

// TODO: We could double down on ENS as the only entry-point/location for dapp source code, instead of allowing
// arbitrary location protocols.
// This would mean, if there isn't already an ENS registered for the dapp, someone would need to do it, and point
// it to the source code storage location.
// e.g. We register aaveui.eth, and then only specify "aaveui.eth" in this file.
// The ENS can then specify the location of ipns/ipfs/github/etc. via contenthash or source_code_location records.

// e.g.
// export default [
//   {
//     "ens": "uniswapui.eth",    // <- let the ENS specify the location
//     "options": { ...
//   },
// ]
