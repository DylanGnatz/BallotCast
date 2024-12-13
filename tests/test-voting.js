require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
    
    try {
        console.log("Loading smart contract...");
        const contract = await ethers.getContractAt("BallotCast", process.env.CONTRACT_ADDRESS);
        console.log("Smart contract loaded");

        console.log("Adding candidate...");
        const ac = await contract.addCandidate("John Doe")
        await ac.wait()
        console.log("Candidate added");
        
        console.log("Registering voter...");
        const rv = await contract.registerVoter(process.env.VOTER_ADDRESS)
        await rv.wait()
        console.log("Voter registered");

        console.log("Waiting for commit phase...");
        const sc = await contract.startCommitPhase()
        await sc.wait()
        console.log("Commit phase started");

        // Used for commitment and reveal
        const candidateIndex = 0;
        const nonce = "random123";
        
        // Create commitment
        console.log("Creating commitment...");
        const voteCommitment = ethers.solidityPackedKeccak256(
            ['address', 'uint256', 'string'],
            [process.env.VOTER_ADDRESS, candidateIndex, nonce]
        );
        console.log("Commitment created");

        // Commit vote
        console.log("Committing vote...");
        const commitTx = await contract.commitVote(voteCommitment);
        await commitTx.wait();
        console.log("Vote committed successfully");
        
        // 2. Wait for reveal phase
        console.log("Waiting for reveal phase...");
        const sr = await contract.startRevealPhase()
        await sr.wait()
        console.log("Reveal phase started");
        
        // 3. Reveal vote
        console.log("Revealing vote...");
        const revealTx = await contract.revealVote(candidateIndex, nonce);
        await revealTx.wait();
        console.log("Vote revealed successfully");

        console.log("Getting vote counts...");
        const numCandidates = await contract.getCandidatesCount()
        console.log("Number of candidates:", numCandidates.toString());
        console.log("----------------------------------------");

        for (let i = 0; i < numCandidates; i++) {
            const [candidate, voteCount] = await contract.getCandidate(i)
            console.log(`${i}: ${candidate} - ${voteCount} votes`);
            console.log("----------------------------------------");
        }
        
    } catch (error) {
        console.error("Error:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    }); 