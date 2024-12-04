// frontend/src/utils/web3.js

import { ethers } from "ethers";

let provider;
let signer;

// Connect to MetaMask
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      // Request account access if needed
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Create a provider
      provider = new ethers.BrowserProvider(window.ethereum);

      // Get the signer
      signer = await provider.getSigner();

      return signer;
    } catch (error) {
      console.error("User denied wallet connection:", error);
      throw error;
    }
  } else {
    alert("MetaMask is not installed. Please install MetaMask and try again.");
    throw new Error("MetaMask not installed");
  }
};

export const getProvider = () => provider;
export const getSigner = () => signer;
