// scripts/addCandidate.js

require('dotenv').config();
const privateKey = process.env.PRIVATE_KEY;
const { ethers } = require("hardhat");
const fs = require('fs');

async function addCandidate(name) {
    try {
        // Load the ABI from the compiled contract
        const abiPath = "artifacts/contracts/BallotCast.sol/BallotCast.json";
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

        // Add the candidate
        const tx = await contract.addCandidate(name);
        console.log("Transaction submitted. Waiting for confirmation...");
        await tx.wait();
        console.log(`Candidate "${name}" added successfully. Transaction Hash: ${tx.hash}`);
    } catch (error) {
        console.error("Error in addCandidate:", error.message);
        process.exit(1);
    }
}

// Ensure the candidate name is provided as a command-line argument
const candidateName = process.argv[2];
if (!candidateName) {
    console.error("Please provide a candidate name as an argument");
    console.error("Usage: node scripts/addCandidate.js <candidateName>");
    process.exit(1);
}

addCandidate(candidateName);
