import {ethers, BigNumber} from 'ethers'
import {useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { nftaddress, nftmarketaddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json'
import NftVoucherModel from '../db/NftVoucher.model'

export default function Home() {
  const [nfts, setNFTs] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(()=> {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    // what we want to load:
    // ***provider, tokenContract, marketContract, data for our marketItems***

    const polygonMumbaiURL = "https://polygon-mumbai.infura.io/v3/92433e74add243f2833a1634b04a9de7"
    const rinkebyURL = "https://rinkeby.infura.io/v3/92433e74add243f2833a1634b04a9de7"
    const bscTestnetURL = "https://data-seed-prebsc-2-s3.binance.org:8545"
    const hardhat = "http://127.0.0.1:8545"

    // const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.infura.io/v3/92433e74add243f2833a1634b04a9de7') // for mumbai
    const provider = new ethers.providers.JsonRpcProvider(
      rinkebyURL
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, KBMarket.abi, provider)

    const getMarketTokens = async () => {
      try{
        return axios.get('http://localhost:8080/items/sell');
      } catch (err) {
        console.error(err);
      }
    } 
    
    const marketTokens = await getMarketTokens();
    console.log(marketTokens)
    // console.log(typeof(marketTokens))
    
    const items = await Promise.all(marketTokens.data.map(async i => {
      // const tokenUri = await tokenContract.tokenURI(i.tokenId)
      // we want get the token metadata - json 
      // try {
        const meta = await axios.get(i.tokenUri)  
      // } catch (error) {
        // return
      // }
      
      console.log(meta)
      // let price = ethers.utils.formatUnits(i.minPrice.toString(), 'ether')
      let item = {
        price: i.minPrice,
        tokenId: i.tokenId,
        seller: i.seller,
        owner: i.ownerOf,
        image: meta.data.image, 
        name: meta.data.name,
        description: meta.data.description,
        signature: i.signature,
        uri: i.tokenUri,
        creatorAddress: i.creatorAddress,
        royalty: i.royalty,
        fee: i.fee
      }
      // console.log(item)
      return item
    }));
    console.log(items)

    setNFTs(items)
    setLoadingState('loaded')
  }

  // function to buy nfts for market 

  async function buyNFT(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    // const contract = new ethers.Contract(nftmarketaddress, KBMarket.abi, signer)
    const contract = new ethers.Contract(nftaddress, NFT.abi, signer)

    // const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    // const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
    //   value: price
    // })
    console.log(contract)
    
    // const signature_split = ethers.utils.splitSignature(nft.signature)
    // const signature = ethers.utils.toUtf8Bytes(nft.signature)
    console.log(ethers.utils.isBytesLike(nft.signature))

    // console.log(signature)
    const voucher = { tokenId: nft.tokenId, uri: nft.uri, minPrice:nft.price, signature:nft.signature, owner: nft.owner, creatorAddress:nft.creatorAddress, royalty:nft.royalty, fee:nft.fee }
    console.log(voucher)
    console.log(await signer.getAddress())
    // const options = {value: ethers.utils.parseEther(nft.price)}
    // const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const price = ethers.utils.parseUnits('0.01', 'ether')

    const transaction = await contract.redeem(await signer.getAddress(), voucher, {
      value: price
    })

    // const transaction = await contract.redeem(await signer.getAddress(), voucher)

    // const transaction = await contract.withdraw()

    await transaction.wait()
    loadNFTs()
  }
  if(loadingState === 'loaded' && !nfts.length) return (<h1
  className='px-20 py-7 text-4x1'>No NFts in marketplace</h1>)

  return (
    <div className='flex justify-center'>
          <div className='px-4' style={{maxWidth: '1600px'}}>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
            {
              nfts.map((nft, i)=>(
                <div key={i} className='border shadow rounded-x1 overflow-hidden'>
                  <img src={nft.image} />
                  <div className='p-4'>
                    <p style={{height:'64px'}} className='text-3x1 font-semibold'>{
                      nft.name}</p>
                      <div style={{height:'72px', overflow:'hidden'}}>
                        <p className='text-gray-400'>{nft.description}</p>
                        </div>
                    </div>
                    <div className='p-4 bg-black'>
                        <p className='text-3x-1 mb-4 font-bold text-white'>{nft.price} ETH</p>
                        <button className='w-full bg-purple-500 text-white font-bold py-3 px-12 rounded'
                        onClick={()=> buyNFT(nft)} >Buy
                        </button>
                      </div>
                </div>
              ))
            }
          </div>
          </div>
    </div>
  )
}
