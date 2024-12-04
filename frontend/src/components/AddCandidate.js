import React, { useState } from "react";
import { ethers } from "ethers";
import { getSigner } from "../utils/web3";
import BallotCastABI from "../artifacts/contracts/ballotcast.sol/BallotCast.json";

const AddCandidate = ({ contractAddress, styles }) => {
  const [candidateName, setCandidateName] = useState("");
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

  const handleAddCandidate = async () => {
    if (!candidateName) {
      setError("Please enter a candidate name");
      return;
    }

    try {
      setStatus("Adding candidate...");
      setError("");
      const signer = getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        BallotCastABI.abi,
        signer
      );

      const tx = await contract.addCandidate(candidateName);
      await tx.wait();
      setStatus(`Candidate "${candidateName}" added successfully`);
      setCandidateName("");
    } catch (error) {
      console.error("Error adding candidate:", error);
      if (error.reason?.includes("Only admin")) {
        setError("not-admin");
      } else {
        setError(error.reason || "Failed to add candidate");
      }
      setStatus("");
    }
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Add Candidate</h2>
      <div>
        <input
          type="text"
          placeholder="Enter candidate name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          style={styles.input}
        />
        <button 
          onClick={handleAddCandidate} 
          style={styles.button}
        >
          Add Candidate
        </button>
      </div>

      {status && (
        <div style={messageBox('success')}>
          <p style={{ margin: 0 }}>{status}</p>
        </div>
      )}

      {error && (
        <div style={messageBox(error === 'not-admin' ? 'warning' : 'error')}>
          <p style={{ margin: 0 }}>
            {error === 'not-admin' 
              ? "Only the admin can add new candidates."
              : error}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddCandidate;