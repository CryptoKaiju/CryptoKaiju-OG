import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import Web3 from 'web3';
import * as actions from './actions';
import * as mutations from './mutation-types';
import createLogger from 'vuex/dist/logger';
import moment from 'moment';
import { getEtherscanAddress, getNetIdString } from '../utils';

import truffleContract from 'truffle-contract';
import CryptoKaijuABI from '../../build/contracts/CryptoKaiju.json';

const CryptoKaiju = truffleContract(CryptoKaijuABI);

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [createLogger()],
  state: {
    web3: null,
    contract: null,
    contractAddress: null,
    account: null,
    accountKaijus: [],
    currentNetwork: null,
    etherscanBase: null,
    totalSupply: null,
    uploadedKaijusHashs: null,
    searchResult: null,
    notFound: null,
  },
  getters: {},
  mutations: {
    [mutations.SET_ACCOUNT] (state, account) {
      state.account = account;
    },
    [mutations.SET_CURRENT_NETWORK] (state, currentNetwork) {
      state.currentNetwork = currentNetwork;
    },
    [mutations.SET_ETHERSCAN_NETWORK] (state, etherscanBase) {
      state.etherscanBase = etherscanBase;
    },
    [mutations.SET_WEB3]: async function (state, {web3, contract}) {
      state.web3 = web3;
      state.contract = contract;
      state.contractAddress = (await CryptoKaiju.deployed()).address;
    },
    [mutations.SET_KAIJUS_UPLOAD_HASH] (state, hash) {
      state.uploadedKaijusHashs = hash;
    },
    [mutations.SET_KAIJUS_TOTAL_SUPPLY] (state, totalSupply) {
      state.totalSupply = totalSupply;
    },
    [mutations.SET_KAIJUS_SEARCH] (state, searchResult) {
      state.searchResult = searchResult;
    },
    [mutations.SET_KAIJUS_SEARCH_NOT_FOUND] (state, notFound) {
      state.notFound = notFound;
    },
    [mutations.SET_ACCOUNT_KAIJUS] (state, accountKaijus) {
      state.accountKaijus = accountKaijus;
    },
  },
  actions: {
    [actions.GET_CURRENT_NETWORK]: function ({commit, dispatch, state}) {
      getNetIdString()
        .then((currentNetwork) => {
          commit(mutations.SET_CURRENT_NETWORK, currentNetwork);
        });

      getEtherscanAddress()
        .then((etherscanBase) => {
          commit(mutations.SET_ETHERSCAN_NETWORK, etherscanBase);
        });
    },
    [actions.INIT_APP]: async function ({commit, dispatch, state}, web3) {

      CryptoKaiju.setProvider(web3.currentProvider);

      //dirty hack for web3@1.0.0 support for localhost testrpc, see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
      if (typeof CryptoKaiju.currentProvider.sendAsync !== 'function') {
        CryptoKaiju.currentProvider.sendAsync = function () {
          return CryptoKaiju.currentProvider.send.apply(
            CryptoKaiju.currentProvider, arguments
          );
        };
      }

      // Set the web3 instance
      commit(mutations.SET_WEB3, {web3, contract: CryptoKaiju});

      dispatch(actions.GET_CURRENT_NETWORK);

      let accounts = await web3.eth.getAccounts();

      let account = accounts[0];

      const refreshHandler = async () => {
        let updatedAccounts = await web3.eth.getAccounts();
        let contract = await CryptoKaiju.deployed();

        let totalSupply = (await contract.totalSupply()).toString('10');
        commit(mutations.SET_KAIJUS_TOTAL_SUPPLY, totalSupply);

        if (updatedAccounts[0] !== account) {
          account = updatedAccounts[0];
          commit(mutations.SET_ACCOUNT, account);
        }
      };

      // Every second check if the main account has changed
      setInterval(refreshHandler, 5000);

      if (account) {
        commit(mutations.SET_ACCOUNT, account);
      }
    },
    [actions.BIRTH_KAIJUS]: async function ({commit, dispatch, state}, {ipfsData, tokenURI, nfcId, recipient}) {
      const contract = await state.contract.deployed();

      let {attributes} = ipfsData;
      let {dob} = attributes;

      console.log(recipient, nfcId, tokenURI, moment(dob).unix());

      const {tx} = await contract.mintTo(recipient, nfcId, tokenURI, moment(dob).unix(), {from: state.account});

      console.log(tx);

      commit(mutations.SET_KAIJUS_UPLOAD_HASH, tx);
    },
    [actions.FIND_KAIJUS_BY_NFC_ID]: async function ({commit, dispatch, state}, nfcId) {
      commit(mutations.SET_KAIJUS_SEARCH, null);
      commit(mutations.SET_KAIJUS_SEARCH_NOT_FOUND, null);

      const contract = await state.contract.deployed();

      let results = null;
      try {
        results = await contract.nfcDetails(nfcId);

        let tokenDetails = await mapTokenDetails(results);

        console.log(tokenDetails);
        commit(mutations.SET_KAIJUS_SEARCH, tokenDetails);
      } catch (e) {
        console.log(`NFC ${nfcId} not found`);

        commit(mutations.SET_KAIJUS_SEARCH, null);
        commit(mutations.SET_KAIJUS_SEARCH_NOT_FOUND, true);
      }
    },
    [actions.FIND_KAIJUS_BY_TOKEN_ID]: async function ({commit, dispatch, state}, tokenId) {
      commit(mutations.SET_KAIJUS_SEARCH, null);
      commit(mutations.SET_KAIJUS_SEARCH_NOT_FOUND, null);

      const contract = await state.contract.deployed();

      let results = null;
      try {
        results = await contract.tokenDetails(tokenId);

        let tokenDetails = await mapTokenDetails(results);

        console.log(tokenDetails);
        commit(mutations.SET_KAIJUS_SEARCH, tokenDetails);
      } catch (e) {
        console.log(`Token ${tokenId} not found`);

        commit(mutations.SET_KAIJUS_SEARCH, null);
        commit(mutations.SET_KAIJUS_SEARCH_NOT_FOUND, true);
      }
    },
    [actions.LOAD_ACCOUNT_KAIJUS]: async function ({commit, dispatch, state}, {account}) {

      const contract = await state.contract.deployed();
      let tokenIds = await contract.tokensOf(account);

      let accountKaijus = _.map(tokenIds, async (tokenId) => {
        let results = await contract.tokenDetails(tokenId);
        console.log(results);
        return await mapTokenDetails(results);
      });
      commit(mutations.SET_ACCOUNT_KAIJUS, await Promise.all(accountKaijus));
    },
  }
});

async function mapTokenDetails (results) {
  let data = {
    tokenId: results[0].toString('10'),
    nfcId: Web3.utils.toAscii(results[1]).replace(/\0/g, ''),
    tokenUri: results[2],
    dob: results[3].toString('10'),
  };

  data.ipfsData = (await axios.get(data.tokenUri)).data;
  return data;
}

export default store;
