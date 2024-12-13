// scripts/vote.js

require('dotenv').config();
const privateKey = process.env.PRIVATE_KEY;
const { ethers } = require("hardhat");
const fs = require('fs');

async function castVote(candidateIndex) {
    try {
        // Load the ABI from the compiled contract
        const abiPath = "artifacts/contracts/ballotcast.sol/BallotCast.json";
        if (!fs.existsSync(abiPath)) {
            throw new Error(`ABI file not found at path: ${abiPath}`);
        }

        const contractABI = JSON.parse(fs.readFileSync(abiPath)).abi;

        const provider = new ethers.JsonRpcProvider(process.env.TESTNET_RPC_URL);

        const wallet = new ethers.Wallet(privateKey, provider);

        const contractAddress = process.env.CONTRACT_ADDRESS;
        if (!contractAddress) {
            throw new Error("CONTRACT_ADDRESS is not defined in .env");
        }

        const contract = new ethers.Contract(contractAddress, contractABI, wallet);
        console.log("Contract instance created.");

        // Cast the vote
        const tx = await contract.vote(candidateIndex);
        console.log("Transaction submitted. Waiting for confirmation...");
        await tx.wait();
        console.log(`Vote cast successfully for candidate index ${candidateIndex}. Transaction Hash: ${tx.hash}`);
    } catch (error) {
        console.error("Error in castVote:", error.message);
        process.exit(1);
    }
}

// Ensure candidateIndex is provided as a command-line argument
const candidateIndexStr = process.argv[2];
if (!candidateIndexStr) {
    console.error("Please provide candidateIndex as an argument");
    console.error("Usage: node scripts/vote.js <candidateIndex>");
    process.exit(1);
}

const candidateIndex = parseInt(candidateIndexStr, 10);
if (isNaN(candidateIndex) || candidateIndex < 0) {
    console.error("Error: <candidateIndex> must be a non-negative integer.");
    console.error("Usage: node scripts/vote.js <candidateIndex>");
    process.exit(1);
}

castVote(candidateIndex);
