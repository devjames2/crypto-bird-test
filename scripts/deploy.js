const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // const NFTMarket = await hre.ethers.getContractFactory("KBMarket");
  // const nftMarket = await NFTMarket.deploy();
  // await nftMarket.deployed();
  // console.log("nftMarket contract deployed to: ", nftMarket.address);

  const NFT = await hre.ethers.getContractFactory("NFT1155");
  // const nft = await NFT.deploy(nftMarket.address);
  const nft = await NFT.deploy("https://localhost/test/{id}");
  await nft.deployed();
  console.log("NFT contract deployed to: ", nft.address);

  // let config = `export const nftmarketaddress = '${nftMarket.address}'
  let config = `export const nftaddress = '${nft.address}'`;

  let data = JSON.stringify(config);
  fs.writeFileSync("config.js", JSON.parse(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
