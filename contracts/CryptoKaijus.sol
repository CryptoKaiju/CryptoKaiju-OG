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

  // TODO anyone can mint
  function mint(address to, uint256 tokenId) public returns (bool) {
    _mint(to, tokenId);
    return true;
  }

  // TODO anyone can burn
  function burn(uint256 tokenId) public {
    require(isApprovedForAll(ownerOf(tokenId), msg.sender));
    _burn(ownerOf(tokenId), tokenId);
  }

  function setTokenURI(uint256 tokenId, string uri) public onlyIfWhitelisted(msg.sender) {
    _setTokenURI(tokenId, uri);
  }

  function setTokenBaseURI(string _newBaseURI) external onlyIfWhitelisted(msg.sender) {
    require(bytes(_newBaseURI).length != 0, "Base URI invalid");
    tokenBaseURI = _newBaseURI;
  }

}
