const getNetIdString = () => {
  return window.web3.eth.net.getId()
    .then((id) => {
      switch (id) {
        case 1:
          return {id: 1, name: 'Main Ethereum Network'};
        case 3:
          return {id: 3, name: 'Ropsten Ethereum Test Network'};
        case 4:
          return {id: 4, name: 'Rinkeby Ethereum Test Network'};
        case 'loading':
          return 'loading..';
        // Will be some random number when connected locally
        default:
          return {id: 5777, name: 'Local Test Network'};
      }
    });
};

const getEtherscanAddress = () => {
  return window.web3.eth.net.getId()
    .then((id) => {
      switch (id) {
        case 1:
          return 'http://etherscan.io';
        case 3:
          return 'http://ropsten.etherscan.io';
        case 4:
          return 'http://rinkeby.etherscan.io';
        case 42:
          return 'http://kovan.etherscan.io';
        default:
          return 'http://localhost';
      }
    })
    .then((etherScanAddress) => {
      console.log(`Setting etherscan address as ${etherScanAddress}`);
      return etherScanAddress;
    });
};


module.exports = {
  getEtherscanAddress,
  getNetIdString
};
