require('dotenv').config();

const { ethers } = require("ethers");

async function registerVoter(contractAddress, voterAddress) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.TESTNET_RPC_URL);
    const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, BallotCastABI, wallet);

    const tx = await contract.registerVoter(voterAddress);
    await tx.wait();
    console.log(`Voter ${voterAddress} registered successfully.`);
}

// Replace with your contract's ABI
const BallotCastABI = [
    // ABI goes here
];

registerVoter(process.env.CONTRACT_ADDRESS, process.env.VOTER_ADDRESS);