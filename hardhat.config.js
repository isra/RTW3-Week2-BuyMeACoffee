require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

const {
  PRIVATE_KEY,
  ALCHEMY_URL
} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "goerli",
  networks: {
    hardhat: {},
    goerli: {
      url: ALCHEMY_URL,
      accounts: [PRIVATE_KEY]
    }
  }
};
