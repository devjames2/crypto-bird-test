
// we want to load the users nfts and display

import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { nftaddress, nftmarketaddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json'

export default function MyAssets() {
  // array of nfts
  const [nfts, setNFts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])

  // async function loadNFTs() {
  //   // what we want to load:
  //   // we want to get the msg.sender hook up to the signer to display the owner nfts
  //   const Moralis  = require('moralis/node');

  //   const web3Modal = new Web3Modal()
  //   const connection = await web3Modal.connect()
  //   const provider = new ethers.providers.Web3Provider(connection)
  //   const signer = provider.getSigner()

  //   const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
  //   const marketContract = new ethers.Contract(nftmarketaddress, KBMarket.abi, signer)
  //   const data = await marketContract.fetchMyNFTs()

  //   const items = await Promise.all(data.map(async i => {
  //     const tokenUri = await tokenContract.tokenURI(i.tokenId)
  //     // we want get the token metadata - json 
  //     const meta = await axios.get(tokenUri)
  //     let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
  //     let item = {
  //       price,
  //       tokenId: i.tokenId.toNumber(),
  //       seller: i.seller,
  //       owner: i.owner,
  //       image: meta.data.image,
  //       name: meta.data.name,
  //       description: meta.data.description
  //     }
  //     return item
  //   }))

  //   setNFts(items)
  //   setLoadingState('loaded')
  // }

  async function loadNFTs() {
    // what we want to load:
    // we want to get the msg.sender hook up to the signer to display the owner nfts

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, KBMarket.abi, signer)
    
    //Get metadata for one token
    const Moralis  = require('moralis');
    /* Moralis init code */
    const serverUrl = "https://0qqnq0d9awxf.usemoralis.com:2053/server";
    const appId = "5L7cFDBqMbvWsfqu8yGCi8Ijt5BT0SyMzOKo9Wy3";
    Moralis.start({ serverUrl, appId });
    
    // const options = { chain: "rinkeby", addresses: "0xBC7a2369Dd54BcF117533B6F194757b66Fb64827" };
    // const tokenMetadata = await Moralis.Web3API.token.getTokenMetadata(options);

    //Get metadata for one token
    // const options = { chain: "rinkeby", symbols: "KBIRDZ" };
    // const tokenMetadata = await Moralis.Web3API.token.getTokenMetadataBySymbol(options);

    //get all owners of specific NFTS
    // const options = { address: "0xBC7a2369Dd54BcF117533B6F194757b66Fb64827", chain: "rinkeby" };
    // const nftOwners = await Moralis.Web3API.token.getNFTOwners(options);
    // console.log(nftOwners)

    // const userEthNFTs = await Moralis.Web3API.account.getNFTs();
    // console.log(userEthNFTs)

    // get polygon NFTs for address
    const options = { chain: 'rinkeby', address: '0xcEA695c0F108833f347239bB2f05CEF06F6a7658' };
    const rinkebyNFTs = await Moralis.Web3API.account.getNFTs(options);
    console.log(rinkebyNFTs)

    // const options = { q: "krypto", chain: "rinkeby", filter: "global" };
    // const NFTs = await Moralis.Web3API.token.searchNFTs(options);

    // console.log(tokenMetadata);


    //Get metadata for an array of tokens
    // const options = { chain: "rinkeby", addresses: ["0xe...556", "0xe...742"] };
    // const tokenMetadata = await Moralis.Web3API.token.getTokenMetadata(options);
    
    // const data = await marketContract.fetchMyNFTs()


    //making contract object!

    const smallContractABI = ['event Transfer(address indexed from, address indexed to, uint256 value)'];
    const contractAddress = '0x9E05a5ebd357d34E4D515098182953eAa4B606bC';
    // const contract = new ethers.Contract(contractAddress, smallContractABI, provider);

    //here I can show you 2 ways.
    //First way:
    //Filtering

    let filter = tokenContract.filters.Transfer('0x0000000000000000000000000000000000000000', null, null);

    //Note that null is not necessary if you are just filtering first argument, but if you want
    //just filter second argument, you have to set first argument null.
    //For example when you want to specify transfer events when
    //a transfer has been reached a specific address. then you filter like this:
    //let filter = contract.filters.Transfer(null, ADDRESS, null) 

    //Listening to events
    console.log("IN MY MINTS")
    tokenContract.on(filter, (from, to, amount, event) => {
      console.log(from);
      console.log(to);
      console.log(amount);
      console.log(event);
    })



    // const items = await Promise.all(data.map(async i => {
    //   const tokenUri = await tokenContract.tokenURI(i.tokenId)
    //   // we want get the token metadata - json 
    //   const meta = await axios.get(tokenUri)
    //   let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    //   let item = {
    //     price,
    //     tokenId: i.tokenId.toNumber(),
    //     seller: i.seller,
    //     owner: i.owner,
    //     image: meta.data.image,
    //     name: meta.data.name,
    //     description: meta.data.description
    //   }
    //   return item
    // }))

    // setNFts(items)
    // setLoadingState('loaded')
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1
    className='px-20 py-7 text-4x1'>You do not own any NFTs currently :(</h1>)

  return (
    <div className='flex justify-center'>
      <div className='px-4' style={{ maxWidth: '1600px' }}>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
          {
            nfts.map((nft, i) => (
              <div key={i} className='border shadow rounded-x1 overflow-hidden'>
                <img src={nft.image} />
                <div className='p-4'>
                  <p style={{ height: '64px' }} className='text-3x1 font-semibold'>{
                    nft.name}</p>
                  <div style={{ height: '72px', overflow: 'hidden' }}>
                    <p className='text-gray-400'>{nft.description}</p>
                  </div>
                </div>
                <div className='p-4 bg-black'>
                  <p className='text-3x-1 mb-4 font-bold text-white'>{nft.price} ETH</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
