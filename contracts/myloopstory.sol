// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MLS is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public cost = 0.01 ether;
    bool public paused;

    mapping(uint256=>string[]) public loops;
    mapping(address=>address[]) public following;
    mapping(address=>address[]) public followers;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _innitBaseURI
    ) ERC721(_name, _symbol) {
        setBaseURI(_innitBaseURI);
    }

    // Main part

    function mint(address _minter) public payable {
        require(paused == false, "Contract Paused");
        require(msg.value >= cost, "Invalid Amount");
        require(balanceOf(address(_minter)) < 1, "You already minted");
        _mint(_minter, _tokenIdCounter.current());
        _setTokenURI(_tokenIdCounter.current(), string(abi.encodePacked(baseURI, uint2str(_tokenIdCounter.current()), baseExtension)));
        _tokenIdCounter.increment();
    }
    
    event loopAdded(address _from, uint256 _tokenId, string _hash, uint256 _length);

    function addLoop(uint256 _tokenId, string memory _hash) public {
        require(msg.sender == ownerOf(_tokenId), "You're not the owner of this loop");
        loops[_tokenId].push(_hash);
        emit loopAdded(msg.sender, _tokenId, _hash, loops[_tokenId].length);
    }

    function getLoop(uint256 _tokenId) external view returns(string[] memory) {
        return loops[_tokenId];
    }

    event followed(address _from, address _toFollow);

    function follow(address _toFollow) public {
        following[msg.sender].push(_toFollow);
        followers[_toFollow].push(msg.sender);
        emit followed(msg.sender, _toFollow);
    }

    // Soulbound part

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "You're not the owner");
        _burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256) pure override(ERC721, ERC721Enumerable) internal {
        require(from == address(0) || to == address(0), "Loopster are non-transferable");
    }

    // Admin part

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setCost(uint256 _newPrice) public onlyOwner {
        cost = _newPrice;
    }

    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
        baseExtension = _newBaseExtension;
    }

    function withdraw(uint256 withdrawAmount) public onlyOwner {
        require(withdrawAmount <= address(this).balance, "Invalid amount");
        payable(msg.sender).transfer(withdrawAmount);
    }

    // Solidity Overide

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    // Helpers

        function uint2str(uint256 _n) internal pure returns (string memory str)
    {
      if (_n == 0)
      {
        return "0";
      }
      uint256 j = _n;
      uint256 length;
      while (j != 0)
      {
        length++;
        j /= 10;
      }
      bytes memory cstr = new bytes(length);
      uint256 k = length;
      j = _n;
      while (j != 0)
      {
        cstr[--k] = bytes1(uint8(48 + j % 10));
        j /= 10;
      }
      str = string(cstr);
    }

    function walletOfOwner(address _owner) public view returns (uint256[] memory)
    {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}