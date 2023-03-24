require('dotenv').config();

const {
  ALCHEMY_API_Polygon,
  PRIVATE_KEY,
  POLYGONSCAN_API,
  ALCHEMY_API_Goerli,
  ETHERSCAN_API
} = process.env;

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    polygonscan: POLYGONSCAN_API,
    etherscan: ETHERSCAN_API
  },

  networks: {
    development: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*",
    },

    polygonMumbai: {
      provider: () => new HDWalletProvider(
        PRIVATE_KEY,
        `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_Polygon}`
      ),
      network_id: 80001,
      skipDryRun: true
    },

    goerli: {
      provider: () => new HDWalletProvider(
        PRIVATE_KEY,
        `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_Goerli}`
      ),
      network_id: 5,
      skipDryRun: true
    }
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17" // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
};