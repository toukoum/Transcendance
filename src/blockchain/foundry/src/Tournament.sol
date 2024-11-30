// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Tournament {
	address[] public players;
	address public winner;

	mapping(uint8 => address[]) public rounds;
	mapping(uint8 => mapping(address => bool)) public hasWonInRound;
	uint8 public currentRound;

	event PlayerRegistered(address indexed player);
	event RoundUpdated(uint8 indexed round, address[] players);
	event WinnerDeclared(address indexed winner);

    function checkIfIsAlreadyInside(address player) external view returns(bool) {
        bool isValid = false;
		for (uint8 i = 0; i < players.length; i++) {
            if (players[i] == player)
            {
                isValid = true;
                break;
            }
		}
        return (isValid);
    }

	function register() external {
		require(players.length < 4, "Tournament is full");
		require(currentRound == 0, "Registration phase is over");

		for (uint8 i = 0; i < players.length; i++) {
			require(players[i] != msg.sender, "Player already registered");
		}

		players.push(msg.sender);
		emit PlayerRegistered(msg.sender);

		if (players.length == 4) {
			rounds[currentRound] = players;
			emit RoundUpdated(currentRound, players);
		}
	}

	function setWinner() external {
		require(currentRound >= 0 && currentRound <= 2, "Invalid round");
		require(rounds[currentRound].length > 0, "Current round has no players");
		require(!hasWonInRound[currentRound][msg.sender], "Player has already won in this round");

		bool isValidWinner = false;
		for (uint8 i = 0; i < rounds[currentRound].length; i++) {
			if (rounds[currentRound][i] == msg.sender) {
				isValidWinner = true;
				break;
			}
		}
		require(isValidWinner, "Invalid winner");

		rounds[currentRound + 1].push(msg.sender);
		hasWonInRound[currentRound][msg.sender] = true;

		uint8 maxWinners = uint8(rounds[currentRound].length / 2);
		if (rounds[currentRound + 1].length == maxWinners) {
			emit RoundUpdated(currentRound + 1, rounds[currentRound + 1]);
			currentRound++;
		}

		if (currentRound == 2 && rounds[currentRound].length == 1) {
			winner = rounds[currentRound][0];
			emit WinnerDeclared(winner);
		}
	}

	function getPlayersInRound(uint8 round) external view returns (address[] memory) {
		return rounds[round];
	}

	function getPlayers() external view returns (address[] memory) {
		return players;
	}
}
