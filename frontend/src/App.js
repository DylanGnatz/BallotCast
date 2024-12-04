import React, { useState } from "react";
import { connectWallet } from "./utils/web3";
import AddCandidate from "./components/AddCandidate";
import CheckVotes from "./components/CheckVotes";
import RegisterVoter from "./components/RegisterVoter";
import Vote from "./components/Vote";

export const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
    borderBottom: "2px solid #eee",
    paddingBottom: "1rem",
  },
  title: {
    fontSize: "2.5rem",
    color: "#1a1a1a",
    marginBottom: "1rem",
  },
  section: {
    background: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    border: "1px solid #eee",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    color: "#1a1a1a",
    marginBottom: "1.5rem",
    paddingBottom: "0.5rem",
    borderBottom: "1px solid #eee",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    marginBottom: "1rem",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  accountBadge: {
    display: "inline-block",
    padding: "0.5rem 1rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontFamily: "monospace",
    marginBottom: "1rem",
  },
  errorText: {
    color: "#dc2626",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
  successText: {
    color: "#059669",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
  warningBox: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "1rem",
    borderRadius: "8px",
    marginTop: "1rem",
  },
};

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contractAddress, setContractAddress] = useState("");

  const handleConnectWallet = async () => {
    try {
      const signer = await connectWallet();
      const address = await signer.getAddress();
      setCurrentAccount(address);
    } catch (error) {
      alert("Failed to connect wallet");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Decentralized Voting System</h1>
        {!currentAccount ? (
          <button 
            style={styles.button}
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <div style={styles.accountBadge}>
            Connected: {currentAccount.substring(0, 6)}...{currentAccount.substring(currentAccount.length - 4)}
          </div>
        )}
      </header>

      <div style={styles.section}>
        <input
          type="text"
          placeholder="Enter Contract Address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          style={styles.input}
        />
      </div>

      {contractAddress && (
        <>
          <AddCandidate contractAddress={contractAddress} styles={styles} />
          <CheckVotes contractAddress={contractAddress} styles={styles} />
          <RegisterVoter contractAddress={contractAddress} styles={styles} />
          <Vote contractAddress={contractAddress} styles={styles} />
        </>
      )}
    </div>
  );
};

export default App;