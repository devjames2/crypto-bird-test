const ethers = require('ethers')

// These constants must match the ones used in the smart contract.
const SIGNING_DOMAIN_NAME = "KryptoBirdz-Voucher"
const SIGNING_DOMAIN_VERSION = "1"

/**
 * JSDoc typedefs.
 * 
 * @typedef {object} NFTVoucher
 * @property {ethers.BigNumber | number} tokenId the id of the un-minted NFT
 * @property {ethers.BigNumber | number} minPrice the minimum price (in wei) that the creator will accept to redeem this NFT
 * @property {string} uri the metadata URI to associate with this NFT
 * @property {ethers.BytesLike} signature an EIP-712 signature of all fields in the NFTVoucher, apart from signature itself.
 */

/**
 * LazyMinter is a helper class that creates NFTVoucher objects and signs them, to be redeemed later by the LazyNFT contract.
 */
class LazyMinter {

  /**
   * Create a new LazyMinter targeting a deployed instance of the LazyNFT contract.
   * 
   * @param {Object} options
   * @param {ethers.Contract} contract an ethers Contract that's wired up to the deployed contract
   * @param {ethers.Signer} signer a Signer whose account is authorized to mint NFTs on the deployed contract
   */
  constructor({ contract, signer }) {
    this.contract = contract
    this.signer = signer
  }

  /**
   * Creates a new NFTVoucher object and signs it using this LazyMinter's signing key.
   * 
   * @param {ethers.BigNumber | number} tokenId the id of the un-minted NFT
   * @param {string} uri the metadata URI to associate with this NFT
   * @param {ethers.BigNumber | number} minPrice the minimum price (in wei) that the creator will accept to redeem this NFT. defaults to zero
   * 
   * @returns {NFTVoucher}
   */
  // async createVoucher(voucher, name, tokenId, uri, minPrice = 0, creatorAddress, royalty=0, fee=0) {
  async createSellItem(voucher, tokenId, minPrice, royalty, fee) {
    // const voucher = { name: voucher['name'], symbol: "KRB", tokenAddress: this.contract.address, tokenId, tokenUri: uri, ownerOf: creatorAddress, amount:1, contractType: "ERC-721", metadata: "", isValid:1, frozen:0,  minPrice:1, creatorAddress, royalty, fee }
    console.log(voucher)
    const _voucher = { name: voucher['name'], 
                      symbol: voucher['symbol'], 
                      tokenAddress: voucher['tokenAddress'], 
                      tokenId,
                      tokenUri: voucher['tokenUri'], 
                      ownerOf: voucher['ownerOf'], 
                      amount: voucher['amount'],
                      contractType: voucher['contractType'],
                      metadata: voucher['metadata'], 
                      isValid: voucher['isValid'], 
                      frozen: voucher['frozen'],
                      minPrice,
                      creatorAddress: voucher['creatorAddress'], 
                      royalty,
                      fee}
    const domain = await this._signingDomain()
    const types = {
      NFTVoucher: [
        {name: "name", type: "string"},
        {name: "symbol", type: "string"},
        {name: "tokenAddress", type: "string"},
        {name: "tokenId", type: "string"},
        {name: "tokenUri", type: "string"},  
        {name: "ownerOf", type: "string"},  
        {name: "amount", type: "uint256"},
        {name: "contractType", type: "string"},  
        {name: "metadata", type: "string"},  
        {name: "isValid", type: "uint256"},
        {name: "frozen", type: "uint256"},
        {name: "minPrice", type: "uint256"},
        {name: "creatorAddress", type: "string"},  
        {name: "royalty", type: "uint256"},
        {name: "fee", type: "uint256"},
        
      ]
    }
    // console.log(creatorAddress);
    console.log(_voucher);
    const signature = await this.signer._signTypedData(domain, types, _voucher)
    return {
      ..._voucher,
      signature
    }
  }

  /**
   * @private
   * @returns {object} the EIP-721 signing domain, tied to the chainId of the signer
   */
  async _signingDomain() {
    if (this._domain != null) {
      return this._domain
    }
    // const chainId = await this.contract.getChainID()
    const chainId = "4"
    this._domain = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: this.contract.address,
      chainId,
    }
    return this._domain
  }
}

module.exports = {
  LazyMinter
}