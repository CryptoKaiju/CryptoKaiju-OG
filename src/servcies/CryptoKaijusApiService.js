const axios = require('axios');

// const API_URL = `http://localhost:5000/cryptokaiju-39233/us-central1/api`;
const API_URL = `https://us-central1-cryptokaiju-39233.cloudfunctions.net/api`;

class CryptoKaijusApiService {

  async getTokenDetails(network = 1, tokenId) {
    return axios.get(`${API_URL}/network/${network}/token/id/${tokenId}`)
      .then((payload) => payload.data);
  }

  async getNfcDetails(network = 1, nfcId) {
    return axios.get(`${API_URL}/network/${network}/token/nfc/${nfcId}`)
      .then((payload) => payload.data);
  }

  async getTokensForAddress(network = 1, address) {
    return axios.get(`${API_URL}/network/${network}/token/account/${address}`)
      .then((payload) => payload.data);
  }

  async getAllTokens(network = 1) {
    return axios.get(`${API_URL}/network/${network}/token/all`)
      .then((payload) => payload.data);
  }
}

export default new CryptoKaijusApiService();
