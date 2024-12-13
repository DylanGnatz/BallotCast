
# BallotCast Voting System

BallotCast is a decentralized voting system built on the Ethereum Sepolia testnet using a Solidity smart contract and a React frontend application. This README provides step-by-step instructions to set up the project, deploy the smart contract, and run the frontend app locally.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js and npm**: [Download Node.js](https://nodejs.org/)
- **Git**: [Download Git](https://git-scm.com/)
- **MetaMask Wallet**: [Download MetaMask](https://metamask.io/)
- **Hardhat**: Included in the project dependencies

You will also need to:

1. **Sign Up for Alchemy**:  
   - Visit [Alchemy](https://www.alchemy.com/) and create a free account.
   - Create a new app on Alchemy's dashboard using the Ethereum **Sepolia** network.
   - Copy the provided **HTTP RPC URL** from your Alchemy app.

2. **Sign Up for Etherscan**:  
   - Visit [Etherscan](https://etherscan.io/) and create a free account.
   - Navigate to **API Keys** in your Etherscan profile.
   - Create a new API key and copy it for later use.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YourUsername/BallotCast.git
cd BallotCast
```

### 2. Install Dependencies

Install both backend (Hardhat) and frontend dependencies:

```bash
# Install Hardhat and backend dependencies
npm install

# Navigate to the frontend directory and install dependencies
cd frontend
npm install
```

---

## Smart Contract Deployment

The BallotCast smart contract is deployed to the Ethereum Sepolia testnet.

### 1. Set Up Environment Variables

Create a `.env` file in the root directory of the project:

```bash
cd ..
touch .env
```

Add the following variables to the `.env` file:

```env
PRIVATE_KEY=your_private_key_here
ALCHEMY_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

- **PRIVATE_KEY**: Your MetaMask private key (for the account that will deploy the contract).
- **ALCHEMY_SEPOLIA_RPC_URL**: The HTTP RPC URL from your Alchemy dashboard.
- **ETHERSCAN_API_KEY**: The API key generated from your Etherscan account.

**Important**:  
- Never commit your private key or API keys to version control.
- Add `.env` to `.gitignore` to prevent accidental commits.

### 2. Compile the Smart Contract

Compile the BallotCast contract using Hardhat:

```bash
npx hardhat compile
```

### 3. Deploy the Smart Contract

Deploy the contract to the Sepolia testnet:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 4. Note the Deployed Contract Address

After deployment, the contract address will be displayed in the terminal. Copy this address for use in the frontend app.

Example:

```bash
BallotCast deployed to: 0xYourContractAddress
```

### 5. Verify the Smart Contract on Etherscan (Optional)

Verify the contract on Etherscan for transparency:

```bash
npx hardhat verify --network sepolia 0xYourContractAddress
```

Replace `0xYourContractAddress` with the actual deployed contract address.

---

## Frontend Setup

Navigate to the `frontend` directory:

```bash
cd frontend
```

### Start the Frontend App

Start the React app:

```bash
npm start
```

The app will open in your default browser at [http://localhost:3000](http://localhost:3000).

---

## Using the BallotCast App

### 1. Connect Your Wallet

- Open the app in your browser.
- Click on **"Connect Wallet"** to connect your MetaMask wallet.
- Ensure your MetaMask is configured to use the Sepolia testnet and has test ETH (obtainable from a [Sepolia faucet](https://sepoliafaucet.com/)).

### 2. Enter Your Smart Contract Address

After connecting your wallet, you will be prompted or able to input the deployed BallotCast smart contract address into the web application. Paste the **0xYourContractAddress** from the deployment step here. This will allow the frontend to interface with your specific deployed instance of the BallotCast contract.

### 3. Interact with the Voting System

- **Admin Actions**:
  - Register voters.
  - Add candidates.
  - Start the commit phase.
  - Start the reveal phase.
  - End the reveal phase.

- **Voter Actions**:
   Commit Phase:
   voter's commitment = keccak256(voterAddress + candidateIndex + nonce)
   └── Only the hash is stored on-chain. No one can determine the vote because:
       - The nonce adds randomness
       - keccak256 is a one-way function
   
   Reveal Phase:
   voter reveals: (candidateIndex, nonce)
   contract computes: keccak256(voterAddress + candidateIndex + nonce)
   └── Matches against stored commitment

---

## Project Structure

### Backend

- `contracts/`: Contains the Solidity smart contract (`BallotCast.sol`).
- `scripts/`: Deployment scripts for Hardhat.
- `hardhat.config.js`: Hardhat configuration file.

### Frontend

- `frontend/src/`: React frontend source code.

---

## Security Considerations

- **Private Key**: Never expose your private key in the code or commit it to a repository.
- **Environment Variables**: Use a `.env` file for sensitive information and ensure it is in `.gitignore`.
- **Smart Contract**: Audit the contract thoroughly before deploying to the mainnet.

---

## Additional Resources

- **Hardhat Documentation**: [https://hardhat.org/getting-started/](https://hardhat.org/getting-started/)
- **Ethers.js Documentation**: [https://docs.ethers.io/](https://docs.ethers.io/)
- **React Documentation**: [https://reactjs.org/](https://reactjs.org/)
- **Alchemy Documentation**: [https://docs.alchemy.com/](https://docs.alchemy.com/)
- **Etherscan Documentation**: [https://docs.etherscan.io/](https://docs.etherscan.io/)
- **Sepolia Faucet**: [https://sepoliafaucet.com/](https://sepoliafaucet.com/)

---
