# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

```bash
# set 
# to open local blockchain using hardhat
npx hardhat node
# to deploy
npx hardhat run --network localhost scripts/deploy.js
# to run the application as dev env
npm run dev
```

```bash
mint token
# eth_sendRawTransaction
#   Contract call:       NFT#mintToken
#   Transaction:         0x26b910131fb76a6ac507801b825f33e81d5935edbaf1652e85793b39ae6bfbc6
#   From:                0x71be63f3384f5fb98995898a86b02fb2426c5788
#   To:                  0x5fc8d32690cc91d4c39d9d3abcbd16989f875707
#   Value:               0 ETH
#   Gas used:            208023 of 208023
#   Block #7:            0x6e3daa00669e4b5013fa16aaf96e36064649236b6b2084e6cd4492a8865b7887


getBalance

> const { ethers, waffle} = require("hardhat");
undefined
> const provider = waffle.provider;
undefined
> const bb = await provider.getBalance('0x5FC8d32690cc91D4c39d9d3abcBD16989F875707');
undefined
> console.log(bb);
BigNumber { _hex: '0x00', _isBigNumber: true }
undefined
> const bb = await provider.getBalance('0x5fc8d32690cc91d4c39d9d3abcbd16989f875707');
undefined
> console.log(bb);
BigNumber { _hex: '0x00', _isBigNumber: true }
undefined
> console.log(bb.toString());
0
```