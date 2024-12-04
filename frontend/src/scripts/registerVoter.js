// scripts/registerVoter.js

require('dotenv').config();
const privateKey = process.env.PRIVATE_KEY;
const { ethers } = require("hardhat");
const fs = require('fs');

async function registerVoter(contractAddress, voterAddress) {
    try {
        // Load the ABI from the compiled contract
        const abiPath = "artifacts/contracts/BallotCast.sol/BallotCast.json";
        if (!fs.existsSync(abiPath)) {
            throw new Error(`ABI file not found at path: ${abiPath}`);
        }

        const contractABI = JSON.parse(fs.readFileSync(abiPath)).abi;

        const provider = new ethers.JsonRpcProvider(process.env.TESTNET_RPC_URL);

        const wallet = new ethers.Wallet(privateKey, provider);

        const contract = new ethers.Contract(contractAddress, contractABI, wallet);
        console.log("Contract instance created.");

        // Register the voter
        const tx = await contract.registerVoter(voterAddress);
        console.log("Transaction submitted. Waiting for confirmation...");
        await tx.wait();
        console.log(`Voter ${voterAddress} registered successfully. Transaction Hash: ${tx.hash}`);
    } catch (error) {
        console.error("Error in registerVoter:", error.message);
        process.exit(1);
    }
}

// Ensure .env has CONTRACT_ADDRESS and VOTER_ADDRESS
if (!process.env.CONTRACT_ADDRESS || !process.env.VOTER_ADDRESS) {
    console.error("Please set CONTRACT_ADDRESS and VOTER_ADDRESS in your .env file");
    process.exit(1);
}

registerVoter(process.env.CONTRACT_ADDRESS, process.env.VOTER_ADDRESS);
