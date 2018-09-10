import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import * as actions from './actions'
import * as mutations from './mutation-types'
import createLogger from 'vuex/dist/logger'
import {getEtherscanAddress, getNetIdString} from '../utils';
import Web3 from 'web3'

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [createLogger()],
  state: {
    account: null,
    currentNetwork: null,
    currentUsdPrice: null,
    etherscanBase: null,
    web3: null,
  },
  getters: {},
  mutations: {
    [mutations.SET_ACCOUNT](state, account) {
      state.account = account
    },
    [mutations.SET_CURRENT_NETWORK](state, currentNetwork) {
      state.currentNetwork = currentNetwork
    },
    [mutations.SET_USD_PRICE](state, currentUsdPrice) {
      state.currentUsdPrice = currentUsdPrice;
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
    [actions.GET_USD_PRICE]: function ({commit, dispatch, state}) {
      axios.get('https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=USD')
        .then((response) => {
          let currentPriceInUSD = response.data[0].price_usd;
          commit(mutations.SET_USD_PRICE, currentPriceInUSD);
        }, (response) => {
          console.error(response);
        });
    },
    [actions.INIT_APP]: async function ({commit, dispatch, state}, web3) {

      // Set the web3 instance
      commit(mutations.SET_WEB3, web3);

      let accounts = await web3.eth.getAccounts();

      let account = accounts[0];

      const refreshHandler = async () => {
        let updatedAccounts = await web3.eth.getAccounts();
        if (updatedAccounts[0] !== account) {
          account = updatedAccounts[0];
          commit(mutations.SET_ACCOUNT, account);
        }
      };

      // Every second check if the main account has changed
      setInterval(refreshHandler, 1000);

      if (account) {
        commit(mutations.SET_ACCOUNT, account);
      }

      dispatch(actions.GET_USD_PRICE);
      dispatch(actions.GET_CURRENT_NETWORK);
    }
  }
});

export default store
