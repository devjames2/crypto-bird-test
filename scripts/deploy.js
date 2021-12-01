const {ethers, upgrades} = require("hardhat");
const fs = require("fs");

async function main() {
  // const NFTMarket = await ethers.getContractFactory("KBMarket");
  // const nftMarket = await upgrades.deployProxy(NFTMarket);
  // // const nftMarket = await NFTMarket.deploy();
  // await nftMarket.deployed();
  // console.log("nftMarket contract deployed to: ", nftMarket.address);

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await upgrades.deployProxy(
    NFT,
    ["0x19E7681628A559fBd80C5B162Bf77522527e7C29"],
  );
  // const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("NFT contract deployed to: ", nft.address);

  // let config = `export const nftmarketaddress = '${nftMarket.address}'
  // export const nftaddress = '${nft.address}'`;

  // let data = JSON.stringify(config);
  // fs.writeFileSync("config.js", JSON.parse(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// const hre = require("hardhat");
// const fs = require("fs");

// async function main() {
//   const NFTMarket = await hre.ethers.getContractFactory("KBMarket");
//   const nftMarket = await NFTMarket.deploy();
//   await nftMarket.deployed();
//   console.log("nftMarket contract deployed to: ", nftMarket.address);

//   const NFT = await hre.ethers.getContractFactory("NFT");
//   const nft = await NFT.deploy();
//   await nft.deployed();
//   console.log("NFT contract deployed to: ", nft.address);

//   let config = `export const nftmarketaddress = '${nftMarket.address}'
//   export const nftaddress = '${nft.address}'`;

//   let data = JSON.stringify(config);
//   fs.writeFileSync("config.js", JSON.parse(data));
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
