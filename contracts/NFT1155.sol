//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma abicoder v2; // required to accept structs as function parameters

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract NFT1155 is ERC1155PresetMinterPauser {
    string private constant SIGNING_DOMAIN = "KryptoBirdz-Voucher";
    string private constant SIGNATURE_VERSION = "1";

    // constructor set up our address
    constructor(string memory uri) ERC1155PresetMinterPauser(uri) {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
    }

    // EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION)

    /// @notice Represents an un-minted NFT, which has not yet been recorded into the blockchain. A signed voucher can be redeemed for a real NFT using the redeem function.
    struct NFTVoucher {
        /// @notice The id of the token to be redeemed. Must be unique - if another token with this ID already exists, the redeem function will revert.
        uint256 tokenId;
        /// @notice amount of the token to be redeemed
        uint256 amount;
        /// @notice The minimum price (in wei) that the NFT creator is willing to accept for the initial sale of this NFT.
        uint256 minPrice;
        /// @notice The metadata URI to associate with this token.
        bytes uri;
        /// @notice the EIP-712 signature of all other fields in the NFTVoucher struct. For a voucher to be valid, it must be signed by an account with the MINTER_ROLE.
        bytes signature;
        /// @notice Owner Wallet Address
        address owner;
        /// @notice Creator Wallet Addresses
        address[] creatorAddress;
        /// @notice royalty for creators
        // mapping(address => uint8) royalties;
        uint8[] royalties;
        /// @notice exchange fee
        uint256 fee;
        /// @notice whether owner is creator
        bool isCreator;
        /// @notice total amount of tokenId
        uint256 totalAmount;
    }

    // struct CreatorRoyaltyStruct {
    //     address[] creatorAddress;
    //     mapping(address => uint8) royalties;
    // }

    struct CreatorRoyaltyStruct {
        address creatorAddress;
        uint8 royalty;
    }

    /// @notice tokenId => totalAmount
    mapping(uint256 => uint256) totalAmountPerTokenId;
    /// @notice tokenId => CreatorRoyaltyStruct
    mapping(uint256 => CreatorRoyaltyStruct[]) royaltiesPerTokenId;

    event CreatorRoyaltyStructEvent(CreatorRoyaltyStruct[] x);
    event count(uint256 x);
    event addressEvent(address x);


    /// @notice Redeems an NFTVoucher for an actual NFT, creating it in the process.
    /// @param redeemer The address of the account which will receive the NFT upon success.
    /// @param voucher A signed NFTVoucher that describes the NFT to be redeemed.
    function redeem(address redeemer, NFTVoucher calldata voucher)
        public
        payable
        returns (uint256)
    {
        // make sure signature is valid and get the address of the signer
        // address signer = _verify(voucher);

        // make sure that the signer is authorized to mint NFTs
        // require(
        //     hasRole(MINTER_ROLE, signer),
        //     "Signature invalid or unauthorized"
        // );

        // make sure that the redeemer is paying enough to cover the buyer's cost
        // require(msg.value >= voucher.minPrice, "Insufficient funds to redeem");

        if (isExistCreatorRoyalty(voucher.tokenId)) {
            CreatorRoyaltyStruct[] memory creatorRoyaltyStructArray = new CreatorRoyaltyStruct[](voucher.creatorAddress.length);
            for (uint256 i = 0; i < voucher.creatorAddress.length; i++) {
                address creatorAddress = voucher.creatorAddress[i];
                CreatorRoyaltyStruct memory creatorRoyaltyStruct = CreatorRoyaltyStruct(
                        creatorAddress,
                        voucher.royalties[i]
                    );
                creatorRoyaltyStructArray[i] = creatorRoyaltyStruct;
                royaltiesPerTokenId[voucher.tokenId].push(creatorRoyaltyStruct);
            }
        }
        emit CreatorRoyaltyStructEvent(royaltiesPerTokenId[voucher.tokenId]);
        
        
        uint8 totalRoyalty = retrieveTotalRoyalty(voucher.tokenId);

        // eth transfer to owner
        address payable ownerReceiver = payable(voucher.owner);
        ownerReceiver.transfer((msg.value * (100 - totalRoyalty)) / 100);

        // eth transfer to creators
        for(uint256 i = 0; i < royaltiesPerTokenId[voucher.tokenId].length; i++){
            address payable creatorAddressReceiver = payable(royaltiesPerTokenId[voucher.tokenId][i].creatorAddress);
            uint8 royalty = royaltiesPerTokenId[voucher.tokenId][i].royalty;

            emit addressEvent(creatorAddressReceiver);
            emit count(royalty);
            // creatorAddressReceiver.transfer(msg.value * (royalty / 100));
            creatorAddressReceiver.transfer(msg.value * royalty/100);
        }

        // first assign the token to the signer, to establish provenance on-chain
        mint(voucher.owner, voucher.tokenId, voucher.amount, "");

        // transfer the token to the redeemer
        safeTransferFrom(
            voucher.owner,
            redeemer,
            voucher.tokenId,
            voucher.amount,
            ""
        );

        // record payment to signer's withdrawal balance
        // pendingWithdrawals[signer] += msg.value;

        return voucher.tokenId;
    }

    // /// @notice Returns a hash of the given NFTVoucher, prepared using EIP712 typed data hashing rules.
    // /// @param voucher An NFTVoucher to hash.
    // function _hash(NFTVoucher calldata voucher)
    //     internal
    //     view
    //     returns (bytes32)
    // {
    //     return
    //         _hashTypedDataV4(
    //             keccak256(
    //                 abi.encode(
    //                     keccak256(
    //                         "NFTVoucher(uint256 tokenId,uint256 minPrice,string uri, address owner, address creatorAddress, uint256 royalty, uint256 fee)"
    //                     ),
    //                     voucher.tokenId,
    //                     voucher.minPrice,
    //                     keccak256(bytes(voucher.uri)),
    //                     voucher.owner,
    //                     voucher.creatorAddress,
    //                     voucher.royalty,
    //                     voucher.fee
    //                 )
    //             )
    //         );
    // }

    /// @notice Returns the chain id of the current blockchain.
    /// @dev This is used to workaround an issue with ganache returning different values from the on-chain chainid() function and
    ///  the eth_chainId RPC method. See https://github.com/protocol/nft-website/issues/121 for context.
    function getChainID() external view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }

    function isExistCreatorRoyalty(uint256 tokenId)
        internal
        view
        returns (bool)
    {
        return royaltiesPerTokenId[tokenId].length == 0;
    }

    function retrieveTotalRoyalty(uint256 tokenId)
        internal
        view
        returns (uint8)
    {
        CreatorRoyaltyStruct[] memory creatorRoyaltyArray = royaltiesPerTokenId[
            tokenId
        ];

        uint8 totalRoyalty;
        
        for (uint256 i = 0; i < creatorRoyaltyArray.length; i++) {
            totalRoyalty += creatorRoyaltyArray[i].royalty;
        }

        return totalRoyalty;
    }

    // /// @notice Verifies the signature for a given NFTVoucher, returning the address of the signer.
    // /// @dev Will revert if the signature is invalid. Does not verify that the signer is authorized to mint NFTs.
    // /// @param voucher An NFTVoucher describing an unminted NFT.
    // function _verify(NFTVoucher calldata voucher)
    //     internal
    //     view
    //     returns (address)
    // {
    //     bytes32 digest = _hash(voucher);
    //     return ECDSA.recover(digest, voucher.signature);
    // }
}
