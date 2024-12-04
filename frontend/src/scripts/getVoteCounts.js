// scripts/getVoteCounts.js

require('dotenv').config();
const { ethers } = require("hardhat");
const fs = require('fs');

async function getVoteCounts() {
    try {
        // Load the ABI from the compiled contract
        const abiPath = "artifacts/contracts/BallotCast.sol/BallotCast.json";
        if (!fs.existsSync(abiPath)) {
            throw new Error(`ABI file not found at path: ${abiPath}`);
        }

        const contractABI = JSON.parse(fs.readFileSync(abiPath)).abi;

        const provider = new ethers.JsonRpcProvider(process.env.TESTNET_RPC_URL);
        const contractAddress = process.env.CONTRACT_ADDRESS;
        if (!contractAddress) {
            throw new Error("CONTRACT_ADDRESS is not defined in .env");
        }

        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        console.log("Contract instance created.");

        const candidateCount = await contract.getCandidatesCount();
        console.log(`Total Candidates: ${candidateCount}`);

        for (let i = 0; i < candidateCount; i++) {
            const [name, voteCount] = await contract.getCandidate(i);
            console.log(`Candidate ${i}: ${name} - ${voteCount} votes`);
        }
    } catch (error) {
        console.error("Error in getVoteCounts:", error.message);
        process.exit(1);
    }
}

// Ensure .env has CONTRACT_ADDRESS
if (!process.env.CONTRACT_ADDRESS) {
    console.error("Please set CONTRACT_ADDRESS in your .env file");
    process.exit(1);
}

getVoteCounts();
