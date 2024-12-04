import React, { useState } from "react";
import { ethers } from "ethers";
import { getProvider } from "../utils/web3";
import BallotCastABI from "../artifacts/contracts/ballotcast.sol/BallotCast.json";

const CheckVotes = ({ contractAddress, styles }) => {
  const [voteCounts, setVoteCounts] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleCheckVotes = async () => {
    try {
      setStatus("Fetching vote counts...");
      setError("");
      const provider = getProvider();
      const contract = new ethers.Contract(
        contractAddress,
        BallotCastABI.abi,
        provider
      );

      const candidateCount = await contract.getCandidatesCount();
      const counts = [];

      for (let i = 0; i < candidateCount; i++) {
        const [name, voteCount] = await contract.getCandidate(i);
        counts.push({ 
          name, 
          voteCount: Number(voteCount),
          index: i
        });
      }

      setVoteCounts(counts);
      setStatus("Vote counts fetched successfully");
    } catch (error) {
      console.error("Error fetching vote counts:", error);
      setError(error.reason || "Failed to fetch vote counts");
      setStatus("");
    }
  };

  const voteCountStyles = {
    list: {
      listStyle: "none",
      padding: 0,
      margin: "1rem 0",
    },
    item: {
      padding: "1rem",
      marginBottom: "0.5rem",
      backgroundColor: "#f9fafb",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    candidateInfo: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    index: {
      backgroundColor: "#e5e7eb",
      padding: "0.25rem 0.75rem",
      borderRadius: "4px",
      fontSize: "0.875rem",
    },
    name: {
      fontWeight: "500",
    },
    votes: {
      color: "#3b82f6",
      fontWeight: "500",
    },
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Check Vote Counts</h2>
      <button 
        onClick={handleCheckVotes} 
        style={styles.button}
      >
        Refresh Vote Counts
      </button>

      {status && <p style={styles.successText}>{status}</p>}
      {error && <p style={styles.errorText}>{error}</p>}

      {voteCounts.length > 0 && (
        <ul style={voteCountStyles.list}>
          {voteCounts.map((candidate) => (
            <li key={candidate.index} style={voteCountStyles.item}>
              <div style={voteCountStyles.candidateInfo}>
                <span style={voteCountStyles.index}>#{candidate.index}</span>
                <span style={voteCountStyles.name}>{candidate.name}</span>
              </div>
              <span style={voteCountStyles.votes}>
                {candidate.voteCount} {candidate.voteCount === 1 ? "vote" : "votes"}
              </span>
            </li>
          ))}
        </ul>
      )}

      {status === "Vote counts fetched successfully" && voteCounts.length === 0 && (
        <p style={{ textAlign: "center", color: "#6b7280", marginTop: "1rem" }}>
          No candidates or votes recorded yet
        </p>
      )}
    </div>
  );
};

export default CheckVotes;