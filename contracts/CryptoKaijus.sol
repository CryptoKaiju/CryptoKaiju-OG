pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/access/Whitelist.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";


/**
* @title CryptoKaijus
*/
contract CryptoKaijus is ERC721Token, Whitelist {
  using SafeMath for uint256;

  string public tokenBaseURI = "https://ipfs.infura.io/ipfs/";

  constructor () public payable ERC721Token("CryptoKaijus", "KAIJUS") {
  }

  // The NFC tag ID
  mapping(bytes32 => uint256) internal nfcIdToTokenId;

  // Block when the Kaijus was born - will help with ordering by birth date which could differ from token ID
  mapping(uint256 => uint256) internal tokenIdToBlockNumber;

  function mint(address to, uint256 tokenId, bytes32 nfcId, string tokenURI)
  public
  onlyIfWhitelisted
  returns (bool) {
    require(nfcIdToTokenId[nfcId] == 0, "Unable to mint Kaijus with duplicate NFC ID");

    tokenIdToBlockNumber[tokenId] = block.number;

    _mint(to, tokenId);
    _setTokenURI(tokenId, tokenURI);
    return true;
  }

  function burn(uint256 tokenId)
  public {
    require(isApprovedForAll(ownerOf(tokenId), msg.sender));
    _burn(ownerOf(tokenId), tokenId);
  }

  function setTokenURI(uint256 tokenId, string uri)
  public
  onlyIfWhitelisted(msg.sender) {
    _setTokenURI(tokenId, uri);
  }

  function setTokenBaseURI(string _newBaseURI)
  external
  onlyIfWhitelisted(msg.sender) {
    require(bytes(_newBaseURI).length != 0, "Base URI invalid");
    tokenBaseURI = _newBaseURI;
  }

}
