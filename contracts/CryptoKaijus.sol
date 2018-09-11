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

  // The NFC tag ID
  mapping(bytes32 => uint256) internal nfcIdToTokenId;
  mapping(uint256 => bytes32) internal tokenIdToNfcId;

  // Block when the Kaijus was born - will help with ordering by birth date which could differ from token ID
  mapping(uint256 => uint256) internal tokenIdToBirthDate;

  constructor () public ERC721Token("CryptoKaijus", "KAIJUS") {
    addAddressToWhitelist(msg.sender);
  }

  function mint(uint256 tokenId, bytes32 nfcId, string tokenURI, uint256 birthDate)
  public
  onlyIfWhitelisted(msg.sender)
  returns (bool) {
    _mint(msg.sender, tokenId, nfcId, tokenURI, birthDate);
    return true;
  }

  function mintTo(address to, uint256 tokenId, bytes32 nfcId, string tokenURI, uint256 birthDate)
  public
  onlyIfWhitelisted(msg.sender)
  returns (bool) {
    _mint(to, tokenId, nfcId, tokenURI, birthDate);
    return true;
  }

  function _mint(address to, uint256 tokenId, bytes32 nfcId, string tokenURI, uint256 birthDate) internal {
    require(nfcIdToTokenId[nfcId] == 0, "Unable to mint Kaijus with duplicate NFC ID");

    tokenIdToBirthDate[tokenId] = birthDate;
    tokenIdToNfcId[tokenId] = nfcId;
    nfcIdToTokenId[nfcId] = tokenId;

    _mint(to, tokenId);
    _setTokenURI(tokenId, tokenURI);
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
