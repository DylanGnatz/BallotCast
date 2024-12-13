require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY, TESTNET_RPC_URL, ETHERSCAN_API_KEY } = process.env;

module.exports = {
    solidity: "0.8.27",
    networks: {
        sepolia: {
            url: TESTNET_RPC_URL || "",
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
};