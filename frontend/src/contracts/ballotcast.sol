pragma solidity ^0.8.0;

contract BallotCast {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedCandidate;
    }

    struct Candidate {
        string name;
        uint256 voteCount;
    }

    address public admin;
    mapping(address => Voter) public voters;
    Candidate[] public candidates;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function registerVoter(address _voter) external onlyAdmin {
        require(!voters[_voter].isRegistered, "Voter already registered");
        voters[_voter].isRegistered = true;
    }

    function addCandidate(string memory _name) external onlyAdmin {
        candidates.push(Candidate({name: _name, voteCount: 0}));
    }

    function vote(uint256 _candidateIndex) external {
        Voter storage sender = voters[msg.sender];
        require(sender.isRegistered, "You are not a registered voter");
        require(!sender.hasVoted, "You have already voted");
        require(_candidateIndex < candidates.length, "Invalid candidate index");

        sender.hasVoted = true;
        sender.votedCandidate = _candidateIndex;

        candidates[_candidateIndex].voteCount += 1;
    }

    function getCandidatesCount() external view returns (uint256) {
        return candidates.length;
    }

    function getCandidate(uint256 _index) external view returns (string memory, uint256) {
        require(_index < candidates.length, "Invalid candidate index");
        Candidate memory candidate = candidates[_index];
        return (candidate.name, candidate.voteCount);
    }

    // Optional: Function to get the total number of voters
    // This requires maintaining a separate counter or a list of voter addresses
}
