import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as mutations from './mutation-types';
import createLogger from 'vuex/dist/logger';
import moment from 'moment';
import {getEtherscanAddress, getNetIdString} from '../utils';
import _ from 'lodash';

import truffleContract from 'truffle-contract';
import CryptoKaijuABI from '../../build/contracts/CryptoKaiju.json';
import cryptoKaijusApiService from '../servcies/CryptoKaijusApiService';

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
    kaijus: [],
    currentNetwork: null,
    currentNetworkId: 1,
    etherscanBase: null,
    totalSupply: null,
    uploadedKaijusHashs: null,
    searchResult: null,
    notFound: null,
    transfers: []
  },
  getters: {
    findTx: (state) => (tokenId) => {
      return _.find(state.transfers, (ev) => ev.args._tokenId.toString(10) === `${tokenId}`);
    },
  },
  mutations: {
    [mutations.SET_ACCOUNT](state, account) {
      state.account = account;
    },
    [mutations.SET_CURRENT_NETWORK](state, {id, name}) {
      state.currentNetworkId = id;
      state.currentNetwork = name;
    },
    [mutations.SET_ETHERSCAN_NETWORK](state, etherscanBase) {
      state.etherscanBase = etherscanBase;
    },
    [mutations.SET_WEB3]: async function (state, {web3, contract}) {
      state.web3 = web3;
      state.contract = contract;
      state.contractAddress = (await CryptoKaiju.deployed()).address;
    },
    [mutations.SET_KAIJUS_UPLOAD_HASH](state, hash) {
      state.uploadedKaijusHashs = hash;
    },
    [mutations.SET_KAIJUS_TOTAL_SUPPLY](state, totalSupply) {
      state.totalSupply = totalSupply;
    },
    [mutations.SET_KAIJUS_SEARCH](state, searchResult) {
      state.searchResult = searchResult;
    },
    [mutations.SET_KAIJUS_SEARCH_NOT_FOUND](state, notFound) {
      state.notFound = notFound;
    },
    [mutations.SET_ACCOUNT_KAIJUS](state, accountKaijus) {
      state.accountKaijus = accountKaijus;
    },
    [mutations.SET_ALL_KAIJUS](state, kaijus) {
      state.kaijus = kaijus;
    },
    [mutations.SET_TRANSFER](state, transfer) {
      Vue.set(state, 'transfers', state.transfers.concat(transfer));
    },
  },
  actions: {
    [actions.GET_CURRENT_NETWORK]: function ({commit, dispatch, state}) {
      getNetIdString()
        .then(({id, name}) => {
          commit(mutations.SET_CURRENT_NETWORK, {id, name});
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
      // setInterval(refreshHandler, 5000); -- this was causing issues

      if (account) {
        commit(mutations.SET_ACCOUNT, account);
      }

      // dispatch(actions.WATCH_TRANSFERS);
      dispatch(actions.LOAD_ALL_KAIJUS);

      await refreshHandler();
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

      const tokenDetails = await cryptoKaijusApiService.getNfcDetails(state.currentNetworkId, nfcId);
      console.log(`By NFC ID ${nfcId}`, tokenDetails);
      commit(mutations.SET_KAIJUS_SEARCH, tokenDetails);
    },
    [actions.FIND_KAIJUS_BY_TOKEN_ID]: async function ({commit, dispatch, state}, tokenId) {
      commit(mutations.SET_KAIJUS_SEARCH, null);
      commit(mutations.SET_KAIJUS_SEARCH_NOT_FOUND, null);

      const tokenDetails = await cryptoKaijusApiService.getTokenDetails(state.currentNetworkId, tokenId);
      console.log(`By TOKEN ID ${tokenId}`, tokenDetails);
      commit(mutations.SET_KAIJUS_SEARCH, tokenDetails);
    },
    [actions.LOAD_ACCOUNT_KAIJUS]: async function ({commit, dispatch, state}, {account}) {
      const accountKaijus = await cryptoKaijusApiService.getTokensForAddress(state.currentNetworkId, account);
      console.log(`Account Kajius ${account}`, accountKaijus);
      commit(mutations.SET_ACCOUNT_KAIJUS, accountKaijus);
    },
    [actions.LOAD_ALL_KAIJUS]: async function ({commit, dispatch, state}) {
      const allKaijus = await cryptoKaijusApiService.getAllTokens(state.currentNetworkId);
      console.log(`All Kajius`, allKaijus);
      commit(mutations.SET_ALL_KAIJUS, allKaijus);
    },
  }
});

export default store;
