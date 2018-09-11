const {assertRevert} = require('../helpers/assertRevert');
const {sendTransaction} = require('../helpers/sendTransaction');
const etherToWei = require('../helpers/etherToWei');
const {shouldSupportInterfaces} = require('./SupportsInterface.behavior');

const advanceBlock = require('../helpers/advanceToBlock');

const {shouldBehaveLikeERC721} = require('./ERC721.behavior');

const _ = require('lodash');

const BigNumber = web3.BigNumber;
const CryptoKaijus = artifacts.require('CryptoKaijus');
const ERC721Receiver = artifacts.require('ERC721ReceiverMock.sol');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('CryptoKaijus ERC721 Common', function (accounts) {
  const owner = accounts[0];
  const account1 = accounts[1];
  const account2 = accounts[2];
  const account3 = accounts[4];
  const account4 = accounts[5];
  const account5 = accounts[6];

  const firstTokenId = 1;
  const secondTokenId = 2;
  const unknownTokenId = 3;
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const RECEIVER_MAGIC_VALUE = '0x150b7a02';

  const name = 'CryptoKaijus';
  const symbol = 'KAIJUS';

  const TOKEN_URI = "123abcHash";
  const BASE_URI = "https://ipfs.infura.io/ipfs/";

  before(async function () {
    await advanceBlock();
  });

  beforeEach(async function () {
    this.token = await CryptoKaijus.new({from: owner});
  });

  let currentNfcId = 1;

  const genNfcId = () => {
    const nfcId = _.padStart(_.toString(currentNfcId), 32, '0');
    currentNfcId++;
    return nfcId;
  };

  const genBirthDate = () => {
    return new Date().getTime();
  };

  describe('custom logic', function () {
    beforeEach(async function () {
      await this.token.mintTo(account1, firstTokenId, genNfcId(), TOKEN_URI, genBirthDate(), {from: owner});
      await this.token.mintTo(account1, secondTokenId, genNfcId(), TOKEN_URI, genBirthDate(), {from: owner});
    });

  });

});
