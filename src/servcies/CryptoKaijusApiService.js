const axios = require('axios');

// const API_URL = `http://localhost:5000/cryptokaiju-39233/us-central1/api`;
const API_URL = `https://us-central1-cryptokaiju-39233.cloudfunctions.net/api`;

const AXIOS_CONFIG = {
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
};

class CryptoKaijusApiService {

  async getTokenDetails(network = 1, tokenId) {
    return axios.get(`${API_URL}/network/${network}/token/id/${tokenId}`, AXIOS_CONFIG)
      .then((payload) => payload.data);
  }

  async getOpenSeaDetials(network = 1, tokenId) {
    return axios.get(`${API_URL}/network/${network}/os/id/${tokenId}`, AXIOS_CONFIG)
      .then((payload) => payload.data);
  }

  async getNfcDetails(network = 1, nfcId) {
    return axios.get(`${API_URL}/network/${network}/token/nfc/${nfcId}`, AXIOS_CONFIG)
      .then((payload) => payload.data);
  }

  async getTokensForAddress(network = 1, address) {
    return axios.get(`${API_URL}/network/${network}/token/account/${address}`, AXIOS_CONFIG)
      .then((payload) => payload.data);
  }

  async getAllTokens(network = 1) {
    return axios.get(`${API_URL}/network/${network}/token/all`, AXIOS_CONFIG)
      .then((payload) => payload.data);
  }
}

export default new CryptoKaijusApiService();
