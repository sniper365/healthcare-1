const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const mnemonic = fs
  .readFileSync('.secret')
  .toString()
  .trim();
  
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "src/contracts"),
  networks: {
    local: {
      host: "127.0.0.1",
      port: 9545,
      network_id: '5777' // Match any network id
    },
    testnet: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          `https://speedy-nodes-nyc.moralis.io/f2da390bb20555ed7e5b0fe4/bsc/testnet`
        );
      },
      network_id: 97,
      // gas: 4500000,
      // gasPrice: 10000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.4"
    }
  }
};
