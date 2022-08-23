// ETHEREUM = 1
// GOERLI = 4
// OPTIMISM = 10
// POLYGON = 137
// FANTOM = 250
// FANTOM_TESTNET = 4002
// ARBITRUM = 42161
// AVALANCHE = 43114

export const buildPreset: {
  [platform: string]: {
    [chain: number]: string,
  },
} = {
  // Uniswap V3 Router02
  // https://docs.uniswap.org/protocol/reference/deployments
  Uniswap: {
    1: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    10: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    137: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    42161: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
  },
  // Uniswap V2 Router02
  // https://dev.sushi.com/docs/Developers/Deployment%20Addresses
  Sushi: { // SushiSwapRouter
    1: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
    137: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    250: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    42161: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506',
  },
  SushiMasterChef: {
    1: '0xef0881ec094552b2e128cf945ef17a6752b4ec5d',
  },
  // Aave V2
  // https://docs.aave.com/developers/deployed-contracts/deployed-contracts
  AaveV2: {
    1: '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9',
    137: '0x8dff5e27ea6b7ac08ebfdf9eb090f32ee9a30fcf',
    // 43114: '0x4F01AeD16D97E3aB5ab2B501154DC9bb0F1A5A2C',
  },
  // Aave V3
  // https://docs.aave.com/developers/deployed-contracts/v3-mainnet
  AaveV3: {
    10: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
    137: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
    250: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
    42161: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
  },
  // Geist
  // https://docs.geist.finance/useful-info/deployments-addresses
  Geist: {
    250: '0x9FAD24f572045c7869117160A571B2e50b10d068',
  },
  // Spooky
  // https://docs.spooky.fi/Resources/contracts
  Spooky: { // Router02
    250: '0xf491e7b69e4244ad4002bc14e878a34207e38c29',
  },
  SpookyFarmV2: { // MasterChefV2
    250: '0x18b4f774fdc7bf685daeef66c2990b1ddd9ea6ad',
  },
  SpookyFarmV3: { // MasterChefV2
    250: '0x9c9c920e51778c4abf727b8bb223e78132f00aa4',
  },
  // Actions (lower case)
  Actionsend: {
    1: 'action_send',
    10: 'action_send',
    137: 'action_send',
    250: 'action_send',
    4002: 'action_send',
    42161: 'action_send',
  },
}
