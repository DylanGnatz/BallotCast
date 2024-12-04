import React, { useState } from "react";
import { ethers } from "ethers";
import { getSigner } from "../utils/web3";
import BallotCastABI from "../artifacts/contracts/ballotcast.sol/BallotCast.json";

const Vote = ({ contractAddress, styles }) => {
  const [candidateIndex, setCandidateIndex] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

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

  const handleVote = async () => {
    const index = parseInt(candidateIndex, 10);
    if (isNaN(index) || index < 0) {
      setError("Please enter a valid candidate index");
      return;
    }

    try {
      setStatus("Casting vote...");
      setError("");
      const signer = getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        BallotCastABI.abi,
        signer
      );

      const tx = await contract.vote(index);
      await tx.wait();
      setStatus("Vote cast successfully!");
      setCandidateIndex("");
    } catch (error) {
      console.error("Error casting vote:", error);
      const errorMessage = error.message || error.reason || '';
      
      if (errorMessage.includes("already voted")) {
        setError("already-voted");
      } else if (errorMessage.includes("not a registered")) {
        setError("not-registered");
      } else {
        setError(error.reason || "Failed to cast vote");
      }
      setStatus("");
    }
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Cast Vote</h2>
      <div>
        <input
          type="number"
          placeholder="Enter candidate index"
          value={candidateIndex}
          onChange={(e) => setCandidateIndex(e.target.value)}
          style={styles.input}
        />
        <button 
          onClick={handleVote} 
          style={styles.button}
        >
          Cast Vote
        </button>
      </div>

      {status && (
        <div style={messageBox('success')}>
          <p style={{ margin: 0 }}>{status}</p>
        </div>
      )}

      {error && (
        <div style={messageBox(
          error === 'already-voted' || error === 'not-registered' 
            ? 'warning' 
            : 'error'
        )}>
          <p style={{ margin: 0 }}>
            {error === 'already-voted' 
              ? "You have already cast your vote in this election."
              : error === 'not-registered'
              ? "You must register as a voter before casting a vote."
              : error}
          </p>
        </div>
      )}
    </div>
  );
};

export default Vote;