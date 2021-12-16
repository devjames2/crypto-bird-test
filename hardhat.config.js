const { mnemonic, privateKey, infuraProjectId, etherscanApiKey } = require('./secrets.json');

require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');

// const infuraProjectId = "92433e74add243f2833a1634b04a9de7";
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "👩🕵👨🙋👷 Prints the list of accounts (only for localhost)", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
  console.log("👩🕵 👨🙋👷 these accounts only for localhost network.");
  console.log('To see their private keys🔑🗝 when you run "npx hardhat node."');
});

module.exports = {
  defaultNetwork: "ganache",
  networks: {
    hardhat: {},
    ganache: {
      chainId: 1337, // config standard
      url: 'http://127.0.0.1:7545',
      network_id: "*",
      // gasPrice: 2000000000000,
      accounts: ['cdb02fd697308c6b919dad9939fc9d62e1391fda1d2dd53a6017c620bf2ffae8']
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${infuraProjectId}`,
      accounts: [privateKey],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${infuraProjectId}`,
      accounts: [privateKey],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infuraProjectId}`,
      chainId: 4,
      gasPrice: 20000000000,
      accounts: [privateKey],
    },
    bsctestnet: {
      url: "https://data-seed-prebsc-2-s3.binance.org:8545/",
      chainId: 97,
      accounts: [privateKey]
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 1000000000,
      accounts: [privateKey]
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
};
