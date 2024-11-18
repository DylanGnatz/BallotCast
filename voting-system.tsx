'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function VotingSystem() {
  const [voters, setVoters] = useState<string[]>([])
  const [candidates, setCandidates] = useState<string[]>([])
  const [votes, setVotes] = useState<{[key: string]: string}>({})
  const [revealedVotes, setRevealedVotes] = useState<{[key: string]: number}>({})
  const [newVoter, setNewVoter] = useState('')
  const [newCandidate, setNewCandidate] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState('')

  const registerVoter = () => {
    if (newVoter && !voters.includes(newVoter)) {
      setVoters([...voters, newVoter])
      setNewVoter('')
    }
  }

  const addCandidate = () => {
    if (newCandidate && !candidates.includes(newCandidate)) {
      setCandidates([...candidates, newCandidate])
      setNewCandidate('')
    }
  }

  const commitVote = () => {
    if (selectedCandidate) {
      // In a real system, this would be encrypted or hashed
      setVotes({...votes, [voters[voters.length - 1]]: selectedCandidate})
      setSelectedCandidate('')
    }
  }

  const revealVotes = () => {
    const revealed = candidates.reduce((acc, candidate) => {
      acc[candidate] = Object.values(votes).filter(vote => vote === candidate).length
      return acc
    }, {} as {[key: string]: number})
    setRevealedVotes(revealed)
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Decentralized Voting System</h1>

      <Card>
        <CardHeader>
          <CardTitle>Register Voter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter voter name"
              value={newVoter}
              onChange={(e) => setNewVoter(e.target.value)}
            />
            <Button onClick={registerVoter}>Register</Button>
          </div>
          <div>Registered Voters: {voters.join(', ')}</div>
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
          <CardTitle>Commit Vote</CardTitle>
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
          <Button onClick={commitVote} className="w-full">Commit Vote</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reveal Votes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={revealVotes} className="w-full">Reveal All Votes</Button>
          {Object.entries(revealedVotes).length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Vote Counts:</h3>
              <ul>
                {Object.entries(revealedVotes).map(([candidate, count]) => (
                  <li key={candidate}>{candidate}: {count} votes</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}