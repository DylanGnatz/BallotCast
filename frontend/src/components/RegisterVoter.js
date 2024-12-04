import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getSigner } from "../utils/web3";
import BallotCastABI from "../artifacts/contracts/ballotcast.sol/BallotCast.json";

const RegisterVoter = ({ contractAddress, styles }) => {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [connectedAccount, setConnectedAccount] = useState("");

  useEffect(() => {
    const getAccount = async () => {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        if (accounts.length > 0) {
          setConnectedAccount(accounts[0]);
        }
      } catch (err) {
        console.error("Error getting account:", err);
        setError("Failed to get connected account");
      }
    };

    getAccount();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setConnectedAccount(accounts[0]);
          setError("");
          setStatus("");
        } else {
          setConnectedAccount("");
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const handleRegisterVoter = async () => {
    if (!connectedAccount) {
      setError("Please connect your MetaMask wallet first");
      return;
    }

    try {
      setStatus("Registering voter...");
      setError("");
      const signer = getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        BallotCastABI.abi,
        signer
      );

      const tx = await contract.registerVoter(connectedAccount);
      await tx.wait();
      setStatus("Registration successful! You can now participate in voting.");
    } catch (error) {
      console.error("Error registering voter:", error);
      
      const errorMessage = error.message || error.reason || '';
      const isAlreadyRegistered = 
        errorMessage.includes("already registered") || 
        error.data?.message?.includes("already registered") ||
        error.error?.message?.includes("already registered");
      
      if (isAlreadyRegistered) {
        setError("already-registered");
      } else {
        setError(error.reason || "Failed to register voter");
      }
      setStatus("");
    }
  };

  const messageBox = (type, content) => ({
    success: {
      padding: "1rem",
      backgroundColor: "#d4edda",
      borderRadius: "8px",
      marginTop: "1rem",
      color: "#155724",
    },
    error: {
      padding: "1rem",
      backgroundColor: "#f8d7da",
      borderRadius: "8px",
      marginTop: "1rem",
      color: "#721c24",
    },
    warning: {
      padding: "1rem",
      backgroundColor: "#fff3cd",
      borderRadius: "8px",
      marginTop: "1rem",
      color: "#856404",
    }
  }[type]);

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Register Voter</h2>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={styles.accountBadge}>
          <strong>Connected Account: </strong>
          {connectedAccount || "No account connected"}
        </div>
        <button 
          onClick={handleRegisterVoter} 
          style={{
            ...styles.button,
            ...(connectedAccount ? {} : styles.disabledButton),
          }}
          disabled={!connectedAccount}
        >
          Register Current Account
        </button>
      </div>

      {status && (
        <div style={messageBox('success')}>
          <p style={{ margin: 0 }}>{status}</p>
        </div>
      )}
      
      {error && (
        <div style={messageBox(error === 'already-registered' ? 'warning' : 'error')}>
          <p style={{ margin: 0 }}>
            {error === 'already-registered' 
              ? "This account is already registered to vote! You can proceed to cast your vote."
              : error}
          </p>
        </div>
      )}
    </div>
  );
};

export default RegisterVoter;