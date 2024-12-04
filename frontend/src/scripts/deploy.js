async function main() {
    const BallotCast = await ethers.getContractFactory("BallotCast");
    const ballotCast = await BallotCast.deploy();

    await ballotCast.waitForDeployment(); // Updated method for Ethers.js v6

    console.log("BallotCast deployed to:", ballotCast.target); // Use 'target' instead of 'address'
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });