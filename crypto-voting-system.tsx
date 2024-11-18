'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

// ABI (Application Binary Interface) of your smart contract
const contractABI = [
  // Include your contract ABI here
  // You can get this from your compiled contract JSON file
]

const contractAddress = "YOUR_CONTRACT_ADDRESS" // Replace with your deployed contract address

export default function VotingSystem() {
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [candidates, setCandidates] = useState<string[]>([])
  const [newCandidate, setNewCandidate] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState('')
  const [voteCounts, setVoteCounts] = useState<{[key: string]: number}>({})

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          const address = await signer.getAddress()
          setAccount(address)

          const votingContract = new ethers.Contract(contractAddress, contractABI, signer)
          setContract(votingContract)

          // Load candidates
          const candidateCount = await votingContract.getCandidatesCount()
          const loadedCandidates = []
          for (let i = 0; i < candidateCount; i++) {
            const [name, voteCount] = await votingContract.getCandidate(i)
            loadedCandidates.push(name)
            setVoteCounts(prev => ({ ...prev, [name]: voteCount.toNumber() }))
          }
          setCandidates(loadedCandidates)
        } catch (error) {
          console.error("An error occurred", error)
        }
      } else {
        console.log("Please install MetaMask!")
      }
    }

    init()
  }, [])

  const registerVoter = async () => {
    if (contract) {
      try {
        const tx = await contract.registerVoter()
        await tx.wait()
        console.log("Voter registered successfully")
      } catch (error) {
        console.error("Error registering voter", error)
      }
    }
  }

  const addCandidate = async () => {
    if (contract && newCandidate) {
      try {
        const tx = await contract.addCandidate(newCandidate)
        await tx.wait()
        setCandidates([...candidates, newCandidate])
        setNewCandidate('')
      } catch (error) {
        console.error("Error adding candidate", error)
      }
    }
  }

  const vote = async () => {
    if (contract && selectedCandidate) {
      try {
        const candidateIndex = candidates.indexOf(selectedCandidate)
        const tx = await contract.vote(candidateIndex)
        await tx.wait()
        console.log("Vote cast successfully")
        // Update vote count
        const [, newVoteCount] = await contract.getCandidate(candidateIndex)
        setVoteCounts(prev => ({ ...prev, [selectedCandidate]: newVoteCount.toNumber() }))
      } catch (error) {
        console.error("Error casting vote", error)
      }
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Decentralized Voting System</h1>

      {account ? (
        <p className="text-center">Connected Account: {account}</p>
      ) : (
        <p className="text-center">Please connect your MetaMask wallet</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Register as Voter</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={registerVoter}>Register</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Candidate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter candidate name"
              value={newCandidate}
              onChange={(e) => setNewCandidate(e.target.value)}
            />
            <Button onClick={addCandidate}>Add</Button>
          </div>
          <div>Candidates: {candidates.join(', ')}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cast Vote</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Select a candidate:</Label>
          <select
            className="w-full p-2 border rounded"
            value={selectedCandidate}
            onChange={(e) => setSelectedCandidate(e.target.value)}
          >
            <option value="">Select a candidate</option>
            {candidates.map((candidate) => (
              <option key={candidate} value={candidate}>
                {candidate}
              </option>
            ))}
          </select>
          <Button onClick={vote} className="w-full">Cast Vote</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vote Counts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {Object.entries(voteCounts).map(([candidate, count]) => (
              <li key={candidate}>{candidate}: {count} votes</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}