// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BallotCast {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        bytes32 voteCommitment; // Commit hash of the vote
    }

    struct Candidate {
        string name;
        uint256 voteCount;
    }

    address public admin;
    bool public votingActive;
    bool public revealPhaseActive;
    mapping(address => Voter) public voters;
    Candidate[] public candidates;

    event VoterRegistered(address voter);
    event CandidateAdded(string name);
    event VoteCommitted(address voter);
    event VoteRevealed(address voter, uint256 candidateIndex);
    event VotingStatusChanged(bool active);
    event RevealPhaseStatusChanged(bool active);
    event TallyCompleted();

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyRegistered() {
        require(voters[msg.sender].isRegistered, "You are not registered");
        _;
    }

    modifier onlyDuringCommitPhase() {
        require(votingActive && !revealPhaseActive, "Commit phase is not active");
        _;
    }

    modifier onlyDuringRevealPhase() {
        require(!votingActive && revealPhaseActive, "Reveal phase is not active");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Admin-only function to register voters
    function registerVoter(address _voter) external onlyAdmin {
        require(!voters[_voter].isRegistered, "Voter is already registered");
        voters[_voter] = Voter(true, false, bytes32(0));
        emit VoterRegistered(_voter);
    }

    // Admin-only function to add candidates
    function addCandidate(string memory _name) external onlyAdmin {
        candidates.push(Candidate(_name, 0));
        emit CandidateAdded(_name);
    }

    // Start the commit phase
    function startCommitPhase() external onlyAdmin {
        require(!votingActive && !revealPhaseActive, "Voting already active");
        votingActive = true;
        emit VotingStatusChanged(true);
    }

    // End the commit phase and start the reveal phase
    function startRevealPhase() external onlyAdmin {
        require(votingActive, "Voting is not active");
        votingActive = false;
        revealPhaseActive = true;
        emit RevealPhaseStatusChanged(true);
    }

    // End the reveal phase
    function endRevealPhase() external onlyAdmin {
        require(revealPhaseActive, "Reveal phase is not active");
        revealPhaseActive = false;
        emit RevealPhaseStatusChanged(false);
        emit TallyCompleted();
    }

    // Voter commits their vote
    function commitVote(bytes32 _voteCommitment) external onlyRegistered onlyDuringCommitPhase {
        require(!voters[msg.sender].hasVoted, "You have already committed your vote");
        voters[msg.sender].voteCommitment = _voteCommitment;
        emit VoteCommitted(msg.sender);
    }

    // Voter reveals their vote
    function revealVote(uint256 _candidateIndex, string memory _nonce) external onlyRegistered onlyDuringRevealPhase {
        require(!voters[msg.sender].hasVoted, "You have already revealed your vote");
        require(_candidateIndex < candidates.length, "Invalid candidate index");

        // Verify the commitment
        bytes32 computedHash = keccak256(abi.encodePacked(_candidateIndex, _nonce));
        require(computedHash == voters[msg.sender].voteCommitment, "Vote commitment does not match");

        // Count the vote
        voters[msg.sender].hasVoted = true;
        candidates[_candidateIndex].voteCount++;
        emit VoteRevealed(msg.sender, _candidateIndex);
    }

    // Get candidate details
    function getCandidate(uint256 _index) external view returns (string memory, uint256) {
        require(_index < candidates.length, "Invalid candidate index");
        Candidate memory candidate = candidates[_index];
        return (candidate.name, candidate.voteCount);
    }

    // Get total candidates count
    function getCandidatesCount() external view returns (uint256) {
        return candidates.length;
    }
}
