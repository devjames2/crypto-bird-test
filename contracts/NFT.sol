// //SPDX-License-Identifier: MIT
// pragma solidity ^0.8.4;

// // we will bring in the openzeppelin ERC721 NFT functionality
// import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradable.sol";
// import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

// contract NFT is ERC721Upgradeable, ERC721URIStorageUpgradeable, Initializable {
//     using CountersUpgradeable for CountersUpgradeable.Counter;
//     CountersUpgradeable.Counter private _tokenIds;
//     // counters allow us to keep track of tokenIds

//     // address of marketplace for NFTs to interact
//     address contractAddress;

//     // OBJ: give the NFT market the ability to transact with tokens or change ownership
//     // setApprovalForAll allows us to do that with contract address

//     // constructor set up our address
//     function initialize(address marketplaceAddress) public initializer {
//         __ERC721_init("KryptoBirdz", "KBIRDZ");
//         __ERC721URIStorage_init();
//         contractAddress = marketplaceAddress;
//     }

//     function mintToken(string memory tokenURI) public returns (uint256) {
//         _tokenIds.increment();
//         uint256 newItemId = _tokenIds.current();
//         _mint(msg.sender, newItemId);
//         // set the token URI: id and url
//         _setTokenURI(newItemId, tokenURI);
//         // give the marketplace the approval to transact between users
//         setApprovalForAll(contractAddress, true);
//         // mint the token and set it for sale - return the id to do so
//         return newItemId;
//     }

//     // The following functions are overrides required by Solidity.

//     function _beforeTokenTransfer(
//         address from,
//         address to,
//         uint256 tokenId
//     ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
//         super._beforeTokenTransfer(from, to, tokenId);
//     }

//     function _burn(uint256 tokenId)
//         internal
//         override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
//     {
//         super._burn(tokenId);
//     }

//     function tokenURI(uint256 tokenId)
//         public
//         view
//         override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
//         returns (string memory)
//     {
//         return super.tokenURI(tokenId);
//     }

//     function supportsInterface(bytes4 interfaceId)
//         public
//         view
//         override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
//         returns (bool)
//     {
//         return super.supportsInterface(interfaceId);
//     }
// }

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract NFT is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIds;

    address contractAddress;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(address marketplaceAddress) public initializer {
        __ERC721_init("MyToken", "MTK");
        __ERC721URIStorage_init();
        __Ownable_init();
        contractAddress = marketplaceAddress;
    }

    function mintToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        // set the token URI: id and url
        _setTokenURI(newItemId, tokenURI);
        // give the marketplace the approval to transact between users
        setApprovalForAll(contractAddress, true);
        // mint the token and set it for sale - return the id to do so
        return newItemId;
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIds.current();
        _tokenIds.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
